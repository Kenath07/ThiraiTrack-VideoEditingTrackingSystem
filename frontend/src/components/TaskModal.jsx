import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';

const fieldCls =
  'w-full rounded-xl border border-border bg-secondary/40 p-3 text-sm text-foreground placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none';

const TaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [project, setProject] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) fetchFormData();
  }, [isOpen]);

  const fetchFormData = async () => {
    try {
      const [teamRes, projRes] = await Promise.all([
        api.get('/api/users/team'),
        api.get('/api/projects'),
      ]);
      setTeam(teamRes.data);
      setProjects(projRes.data.filter((p) => p.status !== 'Completed'));
      if (teamRes.data.length > 0) setAssignedTo(teamRes.data[0]._id);
      if (projRes.data.length > 0) setProject(projRes.data[0]._id);
    } catch (err) {
      console.error('Error fetching form data', err);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/tasks', { title, description, assignedTo, project, deadline, priority });
      onTaskCreated(response.data);
      setTitle('');
      setDescription('');
      setDeadline('');
      setPriority('Medium');
      setAssignedTo('');
      setProject('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating task');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        style={{ boxShadow: 'var(--shadow-glow)' }}
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border bg-secondary/40 px-6 py-5">
          <h2 className="text-lg font-bold text-foreground">Assign New Task</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto p-4 sm:p-6">
          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-foreground">Task Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={fieldCls} placeholder="e.g. Cut B-Roll footage" />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-foreground">Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className={`${fieldCls} resize-none`} rows="3" placeholder="Detailed task instructions..." />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-foreground">Project</label>
              <select required value={project} onChange={(e) => setProject(e.target.value)} className={`${fieldCls} appearance-none cursor-pointer`}>
                {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-foreground">Assign To</label>
              <select required value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className={`${fieldCls} appearance-none cursor-pointer`}>
                {team.map((member) => {
                  const short = member.role === 'Video Editing Intern' ? 'Intern' :
                    member.role === 'Full-Time Video Editor' ? 'Editor' :
                    member.role === 'Video Editing Head' ? 'Head' : 'Manager';
                  return <option key={member._id} value={member._id}>{member.name} ({short})</option>;
                })}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-foreground">Deadline</label>
              <input type="date" required min={today} value={deadline} onChange={(e) => setDeadline(e.target.value)} className={fieldCls} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-foreground">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className={`${fieldCls} appearance-none cursor-pointer`}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="w-full rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary sm:w-auto">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || projects.length === 0 || team.length === 0}
              className="w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
            >
              {loading ? 'Assigning...' : 'Assign Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
