from django.contrib import admin
from .models import Tag,  Task, TaskSession
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'status', 'priority', 'due_date', 'estimated_time', 'time_spent', 'created_at', 'updated_at')
    search_fields = ('title', 'description', 'user__first_name', 'status', 'priority')
    list_filter = ('status', 'priority', 'due_date', 'tags', 'user')
    ordering = ('-created_at',)
    fields = ('title', 'user', 'description', 'due_date', 'status', 'priority', 'estimated_time', 'time_spent', 'tags')
    
    
# Register the Task model with the customized admin view
admin.site.register(Task, TaskAdmin)

admin.site.register(Tag)
admin.site.register(TaskSession)
