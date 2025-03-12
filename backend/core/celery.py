from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('core')

app.conf.enable_utc = False
app.conf.update(
                CELERY_WORKER_POOL='solo',
                timezone='Asia/Kathmandu'
                )

app.config_from_object(settings, namespace='CELERY')

app.conf.beat_schedule = {
    
    # Production schedule
    'send-task-reminder-emails-daily': {
        'task': 'tasks.tasks.send_task_reminder_emails', 
        'schedule': crontab(minute=0, hour=0),   # Run at 12:00 AM (midnight) Nepal time
    },
    
    # Test schedules
    'test-task-reminder-every-5-minutes': {
        'task': 'tasks.tasks.send_task_reminder_emails',
        'schedule': crontab(minute='*/5'),  # Run every 5 minutes
    },
    
    'test-task-reminder-at-930pm': {
        'task': 'tasks.tasks.send_task_reminder_emails',
        'schedule': crontab(minute=30, hour=21),  # Run at 9:30 PM
    },
}


app.conf.broker_connection_retry_on_startup = True

app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')