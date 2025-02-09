from authentication.models import User, Profile
from rest_framework import serializers
import re

# Login serializer to validate email and password
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    

# Register serializer to validate data and create a new user
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
    def create(self, validated_data):
        password = validated_data.pop('password', None) 
        if password is not None:
          user = User(**validated_data)
          user.set_password(password)
          user.save()
          return user
        raise serializers.ValidationError("Password is required.")
      
    def validate_email(self, value):
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, value):
            raise serializers.ValidationError("Enter a valid email address.")
        return value
      
    def validate_password(self, value):
        if len(value) < 8:
          raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value
    

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    class Meta:
        model = Profile
        fields = ['id', 'user', 'points', 'level', 'streak', 'highest_streak', 'updated_at' ]
        
        