from celery import shared_task
from django.core.mail import send_mail
from django.utils import timezone
from django.conf import settings
from datetime import timedelta
from .models import Task
import html

@shared_task
def send_task_reminder_emails():
    try:
        # Calculate tomorrow's date
        tomorrow = timezone.now().date() + timedelta(days=1)

        # Get all tasks due tomorrow
        due_tasks = Task.objects.filter(due_date=tomorrow).exclude(status="completed")

        # Group tasks by user
        user_tasks = {}
        for task in due_tasks:
            if task.user.email not in user_tasks:
                user_tasks[task.user.email] = {
                    'name': f"{task.user.first_name} {task.user.last_name}".strip() or task.user.email,
                    'tasks': []
                }
            user_tasks[task.user.email]['tasks'].append(task)

        # Send emails to each user
        for user_email, user_data in user_tasks.items():
            try:
                user_name = user_data['name']
                tasks = user_data['tasks']
                
                task_list_html = ""
                task_list_text = ""
                
                for task in tasks:
                    priority_color = {
                        'high': '#d9534f',
                        'medium': '#f0ad4e',
                        'low': '#5bc0de'
                    }.get(task.priority, '#333')
                    
                    # Format task for HTML email
                    task_list_html += f"""
                    <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                        <h3 style="margin-bottom: 5px;">{html.escape(task.title)}</h3>
                        {'<p>' + html.escape(task.description or '') + '</p>' if task.description else ''}
                        <p>
                            <strong>Status:</strong> {dict(Task.STATUS_CHOICES).get(task.status)}<br>
                            <strong>Priority:</strong> <span style="color: {priority_color};">{dict(Task.PRIORITY_CHOICES).get(task.priority)}</span>
                            {f'<br><strong>Estimated time:</strong> {task.estimated_time} minutes' if task.estimated_time else ''}
                        </p>
                    </div>
                    """
                    
                    # Format task for plain text email
                    task_list_text += f"- {task.title} (Priority: {dict(Task.PRIORITY_CHOICES).get(task.priority)})\n"
                    if task.description:
                        task_list_text += f"  Description: {task.description}\n"
                    if task.estimated_time:
                        task_list_text += f"  Estimated time: {task.estimated_time} minutes\n"
                    task_list_text += "\n"
                
                # Create the HTML email
                html_message = f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                </head>
                
                    <div style="background-color: #4a76a8; color: white; padding: 20px; text-align: center;">
                        <h1>Task Reminder</h1>
                    </div>
                    <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
                        <p>Hello {html.escape(user_name)},</p>
                        
                        <p>This is a friendly reminder that you have <strong>{len(tasks)}</strong> task(s) due tomorrow:</p>
                        
                        {task_list_html}
                        
                        <p>Please don't forget to update your tasks as you complete them.</p>
                        
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #777;">
                        <p>This email was sent from Bachelor's Life Hub.</p>
                    </div>
            
                </html>
                """
                
                # Create plain text message
                plain_message = f"""Hello {user_name},

                                This is a friendly reminder that you have {len(tasks)} task(s) due tomorrow:

                                {task_list_text}

                                Please log in to your account to manage these tasks.

                                Best regards,
                                Bachelor's Life Hub
                                """
                
                # Send email
                subject = f"Reminder: Complete Your Pending Tasks by Tomorrow"
                
                send_mail(
                    subject=subject,
                    message=plain_message,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[user_email],
                    html_message=html_message,
                    fail_silently=False,
                )
                
            except Exception as e:
                print(f"Failed to send email to {user_email}: {str(e)}")

        return f"Sent reminders for {len(due_tasks)} tasks to {len(user_tasks)} users"

    except Exception as e:
        print(f"Error in send_task_reminder_emails task: {str(e)}")
        return f"Failed to send task reminders due to an error: {str(e)}"