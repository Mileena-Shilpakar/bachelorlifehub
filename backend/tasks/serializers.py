from rest_framework import serializers
from .models import Task, Tag
from datetime import timedelta
from utils import format_time_spent

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']
        
        
class TaskSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'due_date', 'status',
            'priority', 'estimated_time', 'time_spent', 'tags', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'user': {'read_only': True}
        }

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])

        # Create the task instance
        task = Task.objects.create(**validated_data)

        # Handle tags
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(user=task.user, name=tag_data['name'])
            task.tags.add(tag)

        return task

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', None)

        # Update the task fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if tags_data is not None:
            instance.tags.clear()
            for tag_data in tags_data:
                tag, created = Tag.objects.get_or_create(user=instance.user, name=tag_data['name'])
                instance.tags.add(tag)

        instance.save()
        return instance

    def to_representation(self, instance):
        """Override the to_representation method to format the time_spent field."""
        representation = super().to_representation(instance)

        # Format the time_spent to HH:MM:SS
        time_spent = instance.time_spent
        if isinstance(time_spent, timedelta):
            representation['time_spent'] = format_time_spent(time_spent=time_spent)

        return representation


class DetailedTagSerializer(serializers.ModelSerializer):
    total_tasks = serializers.SerializerMethodField()
    completed_tasks = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()
    reward_points = serializers.SerializerMethodField() 

    class Meta:
        model = Tag
        fields = ['id', 'name', 'total_tasks', 'completed_tasks', 'is_completed', 'reward_points']

    def get_total_tasks(self, obj):
        return obj.tasks.count()

    def get_completed_tasks(self, obj):
        return obj.tasks.filter(status='completed').count()
    
    def get_is_completed(self, obj):
        return  obj.tasks.count() == obj.tasks.filter(status='completed').count()
    
    def get_reward_points(self, obj):
        completed_task_count = obj.tasks.filter(status='completed').count()
        return completed_task_count * 20
    
    