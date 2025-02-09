from django.contrib.auth.models import BaseUserManager
from django.core.validators import validate_email
from django.core.exceptions import ValidationError


class UserManager(BaseUserManager):
  def email_validator(self, email):
    try:
      validate_email(email)
    except ValidationError:
      raise ValidationError("Please enter a valid email address.")
    
  def create_user(self, email, password, **extra_fields):
    if not email:
      raise ValueError("Email address is required.")
    email = self.normalize_email(email)
    self.email_validator(email = email)
    
    user = self.model(email = email, ** extra_fields)
    user.set_password(password)
    user.save(using = self._db)
    return user
  
  
  # handle createsuperuser 
  def create_superuser(self, email, password=None, **extra_fields):
    extra_fields.setdefault('is_staff', True)
    extra_fields.setdefault('is_superuser', True)
    extra_fields.setdefault('is_active', True)
      
    if extra_fields.get('is_active') is not True:
      raise ValueError("Superuser must have is_active = True")
    if extra_fields.get('is_staff') is not True:
      raise ValueError("Superuser must have is_staff = True")
    if extra_fields.get('is_superuser') is not True:
      raise ValueError("Superuser must have is_superuser = True")
    
    return self.create_user(email, password, **extra_fields)
  