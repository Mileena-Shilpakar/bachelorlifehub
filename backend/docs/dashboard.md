## Base URL

`http://127.0.0.1:8000/api/`

---

## Endpoints

### Task Endpoints

| HTTP Method | Endpoint                                              | Description                                        | Request Body | Response Body                         |
|-------------|-------------------------------------------------------|----------------------------------------------------|--------------|---------------------------------------|
| **GET**     | `/dashboard/`                                         | Retrieve user dashboard statistics                 | None         | Dashboard stats (task count, points, level, streaks)| 



### Response
``` json 
{
    "total_task_count": 3,
    "completed_task_count": 2,
    "points": 40,
    "level": 1,
    "streak": 1,
    "highest_streak": 7,
    "next_milestone": {
        "id": 17,
        "name": "coding",
        "total_tasks": 1,
        "completed_tasks": 0,
        "remaining_tasks": 1
    }
}

```