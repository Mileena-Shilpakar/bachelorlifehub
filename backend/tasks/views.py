from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Task, Tag, TaskSession
from .serializers import TaskSerializer, TagSerializer, DetailedTagSerializer
from rest_framework.decorators import action
from django.utils.timezone import now
from rest_framework import status
from rest_framework.views import APIView
from django.utils.timezone import now
from .serializers import TaskSerializer
from django.utils import timezone
from django.db.models import Case, When, Value, IntegerField
from utils import format_time_spent
from django.db.models import Count, Q, F
from datetime import timedelta
from django.shortcuts import get_object_or_404
from django.db import transaction

class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Tag.objects.filter(user=self.request.user).order_by('-id')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        priority_order = Case(
            When(priority='high', then=Value(1)),
            When(priority='medium', then=Value(2)),
            When(priority='low', then=Value(3)),
            default=Value(4),
            output_field=IntegerField()
        )

        return Task.objects.filter(user=self.request.user).order_by('due_date', priority_order)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

# to handle the user stats in dashboard
class DashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        task_count = Task.objects.filter(user=request.user).count()
        completed_task_count = Task.objects.filter(user=request.user, status='completed').count()
        points = getattr(request.user.profile, 'points', 0)  
        level = getattr(request.user.profile, 'level', 1)
        streak = getattr(request.user.profile, 'streak', 0)
        highest_streak = getattr(request.user.profile, 'highest_streak', 0)
        
        # Get Next Milestone
        next_milestone = Tag.objects.filter(user=request.user).annotate(
            total_tasks=Count('tasks'),
            completed_tasks=Count('tasks', filter=Q(tasks__status='completed'))
        ).filter(~Q(total_tasks=F('completed_tasks'))).order_by('-total_tasks').first()

        milestone_data = None
        if next_milestone:
            milestone_data = {
                "id": next_milestone.id,
                "name": next_milestone.name,
                "total_tasks": next_milestone.total_tasks,
                "completed_tasks": next_milestone.completed_tasks,
                "remaining_tasks": next_milestone.total_tasks - next_milestone.completed_tasks
            }

        context = {
            'total_task_count': task_count,
            'completed_task_count': completed_task_count, 
            'points': points, 
            'level': level,
            'streak': streak,
            'highest_streak': highest_streak,
            'next_milestone': milestone_data  
        }

        return Response(context, status=status.HTTP_200_OK)
      
# for the user milestones
class TagListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        """Fetch all tags with their total tasks and completed tasks."""
        tags = Tag.objects.filter(user = request.user).order_by('-id')
        serializer = DetailedTagSerializer(tags, many=True)
        return Response(serializer.data)
    
# to handle the task timer session
class StartTimerAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, task_id):
        task = Task.objects.get(id=task_id)
        user = request.user 
        
        if TaskSession.objects.filter(task=task, user=user, end_time__isnull=True).exists():
            return Response({"error": "A session is already running"}, status=status.HTTP_400_BAD_REQUEST)

        session = TaskSession(task=task, user=user, start_time=timezone.now())
        session.save()
        
        # Format the time_spent as HH:MM:SS
        formatted_total_time = format_time_spent(task.time_spent)

        return Response(
            {
                "message": "Timer started.",
                "session_id": session.id,
                "start_time": session.start_time,
                "total_time_spent": formatted_total_time,
            },
            status=status.HTTP_201_CREATED
        )
        

class StopTimerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, task_id):
        task = get_object_or_404(Task, id=task_id, user=request.user)

        try:
            with transaction.atomic():
                session = TaskSession.objects.select_for_update().get(task=task, user=request.user, end_time__isnull=True)
                session.end_time = timezone.now()
                session.save()

                return Response(
                    {
                        "message": "Timer stopped.",
                        "session_id": session.id,
                        "duration": format_time_spent(session.duration),
                        "total_time_spent": format_time_spent(session.task.time_spent),
                    },
                    status=status.HTTP_200_OK
                )
        except TaskSession.DoesNotExist:
            return Response({"error": "No active session found"}, status=status.HTTP_400_BAD_REQUEST)

class CancelTimerSessionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, task_id):
        task = get_object_or_404(Task, id=task_id, user=request.user)

        try:
            session = TaskSession.objects.get(task=task, user=request.user, end_time__isnull=True)
            session.delete()

            return Response({"detail": "Timer session canceled successfully."}, status=status.HTTP_204_NO_CONTENT)
        except TaskSession.DoesNotExist:
            return Response({"detail": "No active session found to cancel."}, status=status.HTTP_404_NOT_FOUND)
        
class TaskSpentTimeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        task_id = kwargs.get('task_id')
        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return Response({"detail": "Task doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        time_spent_str = request.data.get('time_spent')
        if not time_spent_str:
            return Response({"detail": "Time spent is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            h, m, s = map(int, time_spent_str.split(':'))
            new_spent_time = timedelta(hours=h, minutes=m, seconds=s)
        except ValueError:
            return Response({"detail": "Invalid time format. Use HH:MM:SS."}, status=status.HTTP_400_BAD_REQUEST)
        
        previous_spent_time = task.time_spent
        total_time_spent = previous_spent_time + new_spent_time
        
        # Save the updated time_spent to the task
        task.time_spent = total_time_spent
        task.save()
        
        context = {
            'detail':'Time duration saved.',
            'duration':format_time_spent(new_spent_time),
            'total_spent_time':format_time_spent(task.time_spent)
        }
        
        return Response(context, status=status.HTTP_200_OK)