# Bachelor's Life Hub


## Prerequisites

- Python 3.8 or higher
- MySQL 8.0 or higher
- Redis server (for Celery)
- Git

## Project Structure

```
bachelor-s_life_hub/
├── _pycache_/
├── .git/
├── authentication/      # Custom user authentication (django app)
├── core/                # Django project configurations (settings.py)
├── docs/                # Documentation
├── media/               # User uploaded files
├── tasks/               # tasks (django app)
├── venv/                # Virtual environment
├── .env                 # Environment variables
├── .gitignore           # Git ignore rules
├── manage.py            # Django management script
├── README.md            # Project documentation
├── requirements.txt     # Project dependencies
└── utils.py             # Utility functions
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/romanhumagain/bachelor-s_life_hub.git
cd bachelor-s_life_hub
```

### 2. Set up virtual environment

#### On Windows:
```bash
python -m venv venv
venv\Scripts\activate
```

#### On macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up environment variables

Create a `.env` file in the project root directory with the following content:


### 5. Database Setup

Create a MySQL database:

```bash
mysql -u root -p
```

In the MySQL shell:

```sql
CREATE DATABASE bachelors_life_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

### 6. Run migrations

Since the project uses a custom user model, we need to run migrations for the authentication app first:

```bash
python manage.py makemigrations authentication
python manage.py migrate authentication
```

Then migrate the rest of the applications:

```bash
python manage.py makemigrations
python manage.py migrate
```


### 7. Start the development server

```bash
python manage.py runserver
```

The application should now be running at `http://127.0.0.1:8000/`.

## Creating a Superuser

To access the Django admin interface, create a superuser:

```bash
python manage.py createsuperuser
```
To access admin site - `http://127.0.0.1:8000/admin`




### 8. Start Redis server (for Celery)

```bash
redis-server
```

### 9. Run Celery worker (in a separate terminal)

```bash
celery -A core worker --loglevel=info
```

```bash
celery -A core beat --loglevel=info
```

## Deployment

For production deployment:

1. Set `DEBUG=False` in your `.env` file
2. Configure a production-ready web server
3. Set up a production database
4. Configure HTTPS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



Project Link: [https://github.com/romanhumagain/bachelor-s_life_hub](https://github.com/romanhumagain/bachelor-s_life_hub)