import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';

// Configure application routing

import Tasks from './pages/Tasks';
import TaskDetails from './pages/TaskDetails';
import Projects from './pages/Projects';
import Team from './pages/Team';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/my-tasks" element={<Tasks />} />
              <Route path="/task/:id" element={<TaskDetails />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/team" element={<Team />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
