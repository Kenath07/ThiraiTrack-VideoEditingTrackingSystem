import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import TaskTable from '../components/TaskTable';
import TaskModal from '../components/TaskModal';
import { Plus } from 'lucide-react';

// Tasks page with role-based actions
const Tasks = () => {
  const [tasks, setTasks]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const isMyTasks = location.pathname === '/my-tasks';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const endpoint = isMyTasks ? '/api/tasks/my-tasks' : '/api/tasks';
        const response = await api.get(endpoint);
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };
    fetchTasks();
  }, [isMyTasks]);

  const handleTaskCreated = (newTask) => setTasks([newTask, ...tasks]);

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-muted-foreground text-sm animate-pulse">
      Loading tasks…
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isMyTasks ? 'My Assigned Tasks' : 'All Tasks'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage tasks</p>
        </div>
        {user?.role === 'Video Editing Head' && !isMyTasks && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90 sm:w-auto"
            style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
          >
            <Plus size={16} />
            Assign Task
          </button>
        )}
      </div>

      <TaskTable tasks={tasks} />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default Tasks;
