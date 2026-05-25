# TeamTaskManager

Full-stack task and project management application built with React, Node.js, Express, MongoDB, and JWT authentication.

---

# Tech Stack

## Frontend
- React.js (Create React App)
- Axios
- React Router DOM

## Backend
- Node.js
- Express.js
- JWT Authentication

## Database
- MongoDB
- Mongoose ODM

---

# Features

## User Authentication
- User registration
- User login
- JWT-based authentication
- Fetch authenticated user profile

## Project Management
- Create projects
- Project creator automatically becomes Admin
- Add/remove project members
- View assigned projects

## Task Management
- Create tasks
- Assign tasks to project members
- Update task details
- Update task status
- Delete tasks
- Role-based permissions

## Dashboard Analytics
- Total tasks
- Tasks by status
- Overdue tasks
- Tasks per user

## Role-Based Access Control
### Admin
- Manage members
- Create tasks
- Update any task
- Delete tasks

### Member
- View assigned tasks only
- Update assigned tasks only

---

# Prerequisites

Make sure the following are installed:

- Node.js 18+ (LTS recommended)
- MongoDB

---

# Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/TeamTaskManager
JWT_SECRET=teamtaskmanagersecret
```

---

# Installation

## Backend Setup

```bash
cd backend
npm install
```

## Frontend Setup

```bash
cd frontend
npm install
```

---

# Run the Application

## Start Backend

```bash
cd backend
npm run dev
```

## Start Frontend

```bash
cd frontend
npm start
```

---

# API Base URL

```bash
http://localhost:5000/api
```

---

# API Endpoints

# Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register user |
| POST | /auth/login | Login user |
| GET | /auth/me | Get authenticated user |

---

# Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /projects | Create project |
| GET | /projects | Get user projects |
| PUT | /projects/:id/add-member | Add project member |
| PUT | /projects/:id/remove-member | Remove project member |

---

# Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /tasks | Create task |
| GET | /tasks/project/:projectId | Get project tasks |
| PUT | /tasks/:id | Update task |
| PUT | /tasks/:id/status | Update task status |
| DELETE | /tasks/:id | Delete task |

### Task Access Rules
- Admin sees all project tasks
- Members see only assigned tasks
- Only Admin can create/delete tasks

---

# Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /dashboard | Dashboard analytics |

---

# Members

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /members | Get members |
| POST | /members | Create member |
| GET | /members/:id | Get member |
| PUT | /members/:id | Update member |
| DELETE | /members/:id | Delete member |

---

# Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /notifications | Get notifications |
| POST | /notifications | Create notification |
| PUT | /notifications/read-all | Mark all as read |
| PUT | /notifications/:id/read | Mark one as read |
| DELETE | /notifications/:id | Delete notification |

---

# Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /profile/me | Get profile |
| POST | /profile | Create/update profile |

---

# Folder Structure

```bash
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/

frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   └── assets/
```

---

# Testing Role-Based Access

1. Register/Login as User A
2. User A creates a project
3. User A automatically becomes Admin
4. Register/Login as User B
5. User A adds User B to the project
6. User A assigns tasks to User B
7. Verify:
   - User B sees only assigned tasks
   - User B cannot create tasks
   - User B receives 403 Forbidden for unauthorized actions

---

# Notes

- Backend runs using `npm run dev`
- Frontend runs using `npm start`
- Ensure MongoDB is running before starting backend
- JWT token is required for protected APIs

---

# Future Improvements

- Centralized validation middleware
- Real-time notifications
- File uploads
- Team chat
- Activity logs
- Deployment setup
- Docker support

---

# License

This project is developed for learning, academic, and portfolio purposes.
