# ThiraiTrack - Video Editing Team Tracking System

A production-ready MERN stack application for managing video editing teams, tasks, and projects with role-based access control.

## 📋 Project Description

// Role credentials and workflow overview

ThiraiTrack is a comprehensive task and project management system designed specifically for video editing teams. It enables seamless collaboration between interns, full-time editors, team heads, and project managers through role-based dashboards and workflows.

## ✨ Features

### Role-Based Access Control
- **Video Editing Intern**: View assigned tasks, update status, submit for review, add comments and Google Drive links
- **Full-Time Video Editor**: Review intern submissions, provide feedback, approve or reject tasks
- **Video Editing Head**: Create and assign tasks, view all team tasks, approve/reject under review tasks
- **Project Manager**: Create projects, view all projects and progress, access dashboard statistics and team performance metrics

### AI-Powered Chatbot
- **Intelligent Task Assistant**: Groq AI integration for natural language queries
- **Role-Aware Responses**: Context-aware answers based on user role
- **Chat History**: Persistent conversation history per user
- **Real-Time Data**: Fetches live data from tasks, projects, and team members
- **Fallback System**: Smart responses even when AI API is unavailable

### Task Management
- Create tasks with title, description, deadline, and priority
- Assign tasks to team members
- Track task status: Pending → In Progress → Under Review → Completed/Rejected
- Add comments and feedback to tasks
- Attach Google Drive/video draft links
- Color-coded status badges

### Project Management
- Create projects with title, description, and deadline
- Track project status: Planning → Active → Completed
- View project progress and associated tasks

### Dashboard Analytics
- Role-specific dashboards with relevant statistics
- Task counts by status
- Team performance overview
- Workflow progress tracking

### Authentication & Security
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes with middleware
- Role-based endpoint guards

## 🛠 Tech Stack

### Frontend
- **React 19.2.5** - UI library
- **Vite 8.0.10** - Build tool and dev server
- **Tailwind CSS 4.2.4** - Styling
- **React Router DOM 7.14.2** - Client-side routing
- **Axios 1.15.2** - HTTP client
- **Lucide React 1.11.0** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express 5.2.1** - Web framework
- **MongoDB** - Database
- **Mongoose 9.5.0** - ODM
- **JWT 9.0.3** - Authentication
- **bcryptjs 3.0.3** - Password hashing
- **CORS 2.8.6** - Cross-origin resource sharing
- **dotenv 17.4.2** - Environment variables
- **groq-sdk 0.3.1** - AI integration
- **openai 4.24.0** - AI integration

## 👥 Role Credentials

Use the following credentials to test different roles:

| Role | Email | Password |
|------|-------|----------|
| Project Manager | manager@thiraiterra.com | Manager@123 |
| Video Editing Head | head@thiraiterra.com | Head@123 |
| Full-Time Video Editor | editor@thiraiterra.com | password123 |
| Video Editing Intern | intern@thiraiterra.com | password123 |

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local instance or MongoDB Atlas account)
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VideoEditingTeam_TrackingSystem
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Create backend `.env` file**
   Create a `.env` file in the `backend` directory with the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Seed the database**
   ```bash
   node seed.js
   ```

5. **Start the backend server**
   ```bash
   node server.js
   ```

6. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   ```

7. **Create frontend `.env` file**
   Create a `.env` file in the `frontend` directory with the following:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

8. **Start the frontend development server**
   ```bash
   npm run dev
   ```

9. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/thiraitrack
JWT_SECRET=your_super_secret_jwt_key
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 📁 Project Structure

```
VideoEditingTeam_TrackingSystem/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   ├── userController.js
│   │   └── chatController.js  # AI chatbot logic
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── roleMiddleware.js  # Role-based access
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── Chat.js              # Chat history model
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── userRoutes.js
│   │   └── chatRoutes.js       # AI chatbot endpoints
│   ├── seed.js                # Database seeding
│   ├── server.js              # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js       # Axios configuration
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── TaskTable.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   ├── ProjectModal.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── Chatbot.jsx          # AI chatbot UI
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── InternDashboard.jsx
│   │   │   ├── EditorDashboard.jsx
│   │   │   ├── HeadDashboard.jsx
│   │   │   ├── ManagerDashboard.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── TaskDetails.jsx
│   │   │   └── Users.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🌐 API Endpoints

// RESTful API documentation
### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/team` - Get team members

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/my-tasks` - Get current user's tasks
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `PUT /api/tasks/:id/status` - Update task status
- `POST /api/tasks/:id/comments` - Add comment to task
- `DELETE /api/tasks/:id` - Delete task

### Chatbot (AI)
- `POST /api/chat` - Send message to AI chatbot
- `GET /api/chat/history` - Get chat history for current user
- `DELETE /api/chat` - Clear chat history for current user

## � Workflow Overview

The system follows a real-world video editing department workflow:

1. **Project Manager** creates projects and sets overall goals
2. **Video Editing Head** assigns tasks to team members (Interns and Editors)
3. **Video Editing Intern** works on assigned tasks:
   - Updates status from "Pending" → "In Progress"
   - Submits work by setting status to "Under Review"
   - Adds Google Drive links and comments
4. **Full-Time Video Editor** reviews intern submissions:
   - Provides feedback via comments
   - Can approve or request changes
5. **Video Editing Head** makes final approval:
   - Sets status to "Completed" or "Rejected"
   - Monitors all team tasks
6. **Project Manager** monitors overall progress:
   - Views team performance metrics
   - Tracks project completion rates

## �� Deployment

### Frontend (Netlify)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variable: `VITE_API_URL` to your backend URL

### Backend (Railway)
1. Push backend code to GitHub
2. Connect Railway to your GitHub repository
3. Set environment variables in Railway:
   - `PORT`
   - `MONGO_URI`
   - `JWT_SECRET`
   - `AI_PROVIDER` (groq or openai)
   - `GROQ_API_KEY` (if using Groq)
   - `OPENAI_API_KEY` (if using OpenAI)
4. Railway will automatically deploy

## 📸 Screenshots

*Add screenshots of the application here*

## 🚀 Demo Coming Soon
## 🎥 Demo Video

*Add demo video link here*

## 📝 License

This project is created for technical internship assessment purposes.

## 👨‍💻 Author

Built as part of a technical internship assessment.
