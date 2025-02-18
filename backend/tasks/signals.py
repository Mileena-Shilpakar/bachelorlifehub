from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.db import transaction
from django.utils import timezone
from .models import Task
from authentication.models import User

@receiver(pre_save, sender=Task)
def update_user_points(sender, instance, **kwargs):
    try:
        previous_task = Task.objects.get(id=instance.id) 
    except Task.DoesNotExist:
        previous_task = None

    if previous_task and previous_task.status != instance.status:
        profile = getattr(instance.user, 'profile', None) 

        if profile:
            with transaction.atomic():
                if instance.status == 'completed':
                    profile.points += 20
                elif previous_task.status == 'completed' and instance.status != 'completed':
                    profile.points = max(0, profile.points - 20)  # Prevent negative points
                
                profile.save()


@receiver(pre_save, sender=Task)
def track_previous_status(sender, instance, **kwargs):
    if instance.pk: 
        previous_instance = Task.objects.get(pk=instance.pk)
        instance.previous_status = previous_instance.status
    else:
        instance.previous_status = None


@receiver(post_save, sender=Task)
def update_user_streak(sender, instance, created, **kwargs):
    if created:  
        return  

    profile = getattr(instance.user, 'profile', None)

    if profile:
        with transaction.atomic():
            if instance.status == 'completed' and instance.previous_status != 'completed':
                current_time = timezone.now()
                estimated_time_in_seconds = instance.estimated_time * 60
                
                # Check if the task was completed within the due date and estimated time
                task_completed_on_time = (
                    instance.due_date and
                    current_time.date() <= instance.due_date and
                    (instance.time_spent.total_seconds() <= estimated_time_in_seconds)
                )

                if task_completed_on_time:
                    profile.streak += 1
                    profile.highest_streak = max(profile.highest_streak, profile.streak)
                else:
                    profile.streak = 0  

            elif instance.previous_status == 'completed':
                profile.streak = max(0, profile.streak - 1)

            profile.save()