import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Chatbot from './Chatbot';
import { AuthContext } from '../context/AuthContext';

// Reusable dashboard layout with sidebar, navbar, and chatbot
const DashboardLayout = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={user?.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <Chatbot />
    </div>
  );
};

export default DashboardLayout;
