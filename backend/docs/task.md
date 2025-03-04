# API Documentation

## Base URL

`http://127.0.0.1:8000/api/`

---

## Endpoints

# Task Endpoints

| HTTP Method | Endpoint                                              | Description                                        | Request Body | Response Body                         |
|-------------|-------------------------------------------------------|----------------------------------------------------|--------------|---------------------------------------|
| **GET**     | `/task/tasks/`                                        | Retrieve a list of tasks                          | None         | List of tasks                         |
| **POST**    | `/task/tasks/`                                        | Create a new task                                 | Task data    | Created task                          |
| **GET**     | `/task/tasks/{id}/`                                   | Retrieve a specific task                          | None         | Task data                             |
| **PUT**     | `/task/tasks/{id}/`                                   | Update a specific task                            | Updated task data | Updated task data                  |
| **DELETE**  | `/task/tasks/{id}/`                                   | Delete a specific task                            | None         | Success message                       |


#### Task request body (for adding task)
``` json 
{
    "title": "Test Title",
    "description": "Description for this task.",
    "due_date": "2025-03-20",
    "status": "todo",
    "priority": "medium",
    "estimated_time": 120,
    "tags": [
        {"name":"project"}, 
        {"name":"academic"}
    ]
}

```

### Tag Endpoints

| HTTP Method | Endpoint                                              | Description                                        | Request Body | Response Body                         |
|-------------|-------------------------------------------------------|----------------------------------------------------|--------------|---------------------------------------|
| **GET**     | `/task/tags/`                                         | Retrieve a list of tags                           | None         | List of tags                          |
| **POST**    | `/task/tags/`                                         | Create a new tag                                  | Tag data     | Created tags                           |

### Notes
- **Tag Creation**: 
  - You do **not** need to create tags separately. When adding a task, tags will be created automatically based on the tags provided during task creation.
  
- **Tag Retrieval**: 
  - The `GET /task/tags/` endpoint will return all the tags that were previously created by the user.
    #### Response

    ```json
    [
        {
            "id": 17,
            "name": "coding"
        },
        {
            "id": 16,
            "name": "academic"
        },
        {
            "id": 15,
            "name": "project"
        }
    ]
    ```

# Timer Endpoints

| HTTP Method | Endpoint                                              | Description                                          | Request Body                                                | Response Body                                  |
|-------------|-------------------------------------------------------|------------------------------------------------------|-------------------------------------------------------------|------------------------------------------------|
| **POST**    | `/task/{task_id}/spent-time/`                          | Update the time spent on a specific task.            | ```json { "time_spent": "00:20:10" } ```                     | ```json { "detail": "Time duration saved.", "duration": "00:20:10", "total_spent_time": "01:41:10" } ``` |
| **POST**    | `/task/{task_id}/start-timer-session/`                 | Start a timer session for a task (Returns session_id)| None                                                        | ```json { "message": "Timer started.", "session_id": 31, "start_time": "2025-03-15T07:31:34.138334Z", "total_time_spent": "00:07:51" } ``` |
| **POST**    | `/task/save-timer-session/{task_id}/`               | Save a timer session for a task                      | None                                                        | ```json { "message": "Timer stopped.", "session_id": 31, "duration": "00:00:28", "total_time_spent": "00:08:19" } ``` |
| **DELETE**  | `/task/cancel-timer-session/{task_id}/`             | Cancel a timer session                               | None                                                        | ```json { "message": "Timer session canceled successfully." } ``` |

---

### Option (1): Using Timer Sessions

1. **Starting a Timer Session**:  
   - To start a timer for a task, use the endpoint:  
     `/task/{task_id}/start-timer-session/`.  
     This will return a `session_id` that uniquely identifies the timer session.

2. **Saving the Timer Session**:  
   - Once you are done with the task and want to save the time spent, use the endpoint:  
     `/task/save-timer-session/{session_id}/`.  
     The duration between the start and stop of the session will be calculated and saved.

3. **Canceling the Timer Session**:  
   - If you want to cancel a session before saving it, use the endpoint:  
     `/task/cancel-timer-session/{session_id}/`.  
     You cannot cancel a session that has already been saved.

---

### Option (2): Directly Updating Time Spent

- You can directly update the time spent on a task using the endpoint:  
  `/task/{task_id}/spent-time/`.

- The request body should contain the time spent in the following format:  
  ```json
  { "time_spent": "00:20:10" }

                       |

### Tag List Endpoints

| HTTP Method | Endpoint                                              | Description                                        | Request Body | Response Body                         |
|-------------|-------------------------------------------------------|----------------------------------------------------|--------------|---------------------------------------|
| **GET**     | `/task/milestones/`                                    | Get a list of tags with total and completed task counts and tags rewards | None         | Tags data with task completion info   |



