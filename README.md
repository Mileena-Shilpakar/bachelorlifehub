# Bachelors Life Hub

Bachelors Life Hub is a task management and procrastination management web application designed to help users organize their tasks, track progress, and stay on top of deadlines. The application includes features such as a playful login system, a Kanban board for task management, a streak system, a growing tree based on user progress, a built-in task timer, level progression, email reminders, a visual calendar, a rewards system, and a task selection game. It is built with a *Next.js* frontend and a *Django* backend, using *Celery* and *Redis* for task management and email notifications.

---

## Technologies Used

- *Frontend:* Next.js, React
- *Backend:* Django, Celery, Redis, MySQL

---

## Installation Guide

### Clone the Repository

```bash
git clone https://github.com/Mileena-Shilpakar/bachelorlifehub.git
cd bachelors-life-hub
```

---

## Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

For detailed frontend setup instructions, refer to `frontend/README.md`.

---

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

For Linux/macOS:

```bash
source venv/bin/activate
```

For Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the database:
Ensure MySQL is set up and configured in Django settings.

Run migrations:

```bash
python manage.py migrate
```

Run the development server:

```bash
python manage.py runserver
```

The backend will be available at [http://localhost:8000](http://localhost:8000).

For detailed backend setup instructions, refer to `backend/README.md`.

---

## Features

### Playful Login System
An interactive login interface with stickers and animations to enhance user experience.

### Dashboard Overview
A central dashboard displaying task statistics, upcoming tasks, and progress milestones.

### Kanban Board
- Drag-and-drop task management with *To-Do, In Progress, and Completed* columns.
- A “Spin the Wheel” game to randomly select a task.
- A growing tree visualization based on user progress.

### Streak System
A reward-based streak system that resets if tasks are missed.

### Calendar View
A visual calendar displaying tasks by due date.

### Rewards System
Unlockable achievements, badges, and other incentives for task completion.

### Task Timer
A built-in timer with progress visualization to enhance focus.

### Email Reminders
Automatic email notifications for upcoming task deadlines using Django Celery and Redis.


---

## Contributing

We welcome contributions! If you want to improve or add features to the project, feel free to fork the repository and submit a pull request. Please ensure you follow the coding standards and write tests for new features.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

