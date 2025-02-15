## Base URL
The base URL for the API is:
```
http://127.0.0.1:8000/api
```

---

## Endpoints

| Method | Endpoint      | Description                      | Authentication | Request Body | Response |
|--------|-------------|----------------------------------|---------------|--------------|----------|
| POST   | `/user/login/`   | Authenticate user and obtain tokens | No | `{ "email": "user@example.com", "password": "yourpassword" }` | `{ "detail": "User logged in successfully.", "refresh_token": "...", "access_token": "...", "user": { "first_name": "John", "last_name": "Doe", "email": "user@example.com" } }` |
| POST   | `/user/register/` | Register a new user | No | `{ "first_name": "John", "last_name": "Doe", "email": "user@example.com", "password": "yourpassword" }` | `{ "detail": "User registered successfully.", "refresh_token": "...", "access_token": "...", "user": { "first_name": "John", "last_name": "Doe", "email": "user@example.com" } }` |
| GET    | `/user/profile/` | Retrieve user profile | Yes (Bearer Token) | None | `{ "id": 1, "user": { "first_name": "John", "last_name": "Doe", "email": "user@example.com" }, "points": 20, "level": 1, "streak": 2, "highest_streak": 5, "updated_at": "2024-06-27T12:00:00Z" }` |

---

## Endpoint
- GET /api/user/profile/

### Response 
``` json
{
    "id": 6,
    "user": {
        "first_name": "Roman",
        "last_name": "Humagain",
        "email": "romanhumagain@gmail.com"
    },
    "points": 60,
    "level": 1,
    "streak": 1,
    "highest_streak": 7,
    "updated_at": "2025-03-14T18:10:52.009828Z"
}
```


