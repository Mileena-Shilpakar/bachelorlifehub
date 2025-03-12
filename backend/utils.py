from datetime import timedelta

def format_time_spent(time_spent: timedelta) -> str:
  
    """Utility function to format a timedelta object into HH:MM:SS format."""
    hours, remainder = divmod(time_spent.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{hours:02}:{minutes:02}:{seconds:02}"
