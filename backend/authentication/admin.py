from django.contrib import admin
from .models import User, Profile

class UserAdmin(admin.ModelAdmin):
  list_display = ("email", 'first_name', 'last_name', 'is_active')
  list_filter = ("is_superuser", "is_active")
  search_fields = ("first_name","last_name", "email")
  readonly_fields = ("password",)
  
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'points', 'level', 'streak', 'highest_streak', 'updated_at')
    list_filter = ('level', 'streak')
    search_fields = ('user__first_name', 'user__last_name')
    ordering = ('-points',)
  
admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
