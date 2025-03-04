from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (TaskViewSet, 
                    TagViewSet, 
                    StartTimerAPIView, 
                    StopTimerAPIView, 
                    CancelTimerSessionAPIView,  
                    TagListView, 
                    TaskSpentTimeAPIView)

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'tags', TagViewSet, basename='tags')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:task_id>/start-timer-session/', StartTimerAPIView.as_view(), name='start-task-timer'),
    path('save-timer-session/<int:task_id>/', StopTimerAPIView.as_view(), name='stop-task-timer'),
    path('milestones/', TagListView.as_view(), name='tag-list'),
    path('cancel-timer-session/<int:task_id>/', CancelTimerSessionAPIView.as_view(), name='cancel-timer'),
    
    path('<int:task_id>/spent-time/', TaskSpentTimeAPIView.as_view(), name='task-spent-time'),
]
