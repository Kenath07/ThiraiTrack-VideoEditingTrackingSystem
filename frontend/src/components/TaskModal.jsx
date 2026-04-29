import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';

/* Shared input/select class */
const fieldCls =
  'w-full bg-secondary/40 border border-border rounded-xl p-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors';

// Task create and edit modal component
const TaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [project, setProject]       = useState('');
  const [deadline, setDeadline]     = useState('');
  const [priority, setPriority]     = useState('Medium');
  const [team, setTeam]             = useState([]);
  const [projects, setProjects]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

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
      setProjects(projRes.data.filter(p => p.status !== 'Completed'));
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
      setTitle(''); setDescription(''); setDeadline(''); setPriority('Medium'); setAssignedTo(''); setProject('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating task');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col" style={{ boxShadow: 'var(--shadow-glow)' }}>

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-border bg-secondary/40 flex-shrink-0">
          <h2 className="text-lg font-bold text-foreground">Assign New Task</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-destructive transition-colors rounded-lg p-1 hover:bg-destructive/10">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-2">Task Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className={fieldCls} placeholder="e.g. Cut B-Roll footage" />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-2">Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} className={`${fieldCls} resize-none`} rows="3" placeholder="Detailed task instructions…" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-2">Project</label>
              <select required value={project} onChange={e => setProject(e.target.value)} className={`${fieldCls} appearance-none cursor-pointer`}>
                {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-2">Assign To</label>
              <select required value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className={`${fieldCls} appearance-none cursor-pointer`}>
                {team.map(member => {
                  const short = member.role === 'Video Editing Intern' ? 'Intern' :
                                member.role === 'Full-Time Video Editor' ? 'Editor' :
                                member.role === 'Video Editing Head' ? 'Head' : 'Manager';
                  return <option key={member._id} value={member._id}>{member.name} ({short})</option>;
                })}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-2">Deadline</label>
              <input type="date" required min={today} value={deadline} onChange={e => setDeadline(e.target.value)} className={fieldCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-2">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className={`${fieldCls} appearance-none cursor-pointer`}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || projects.length === 0 || team.length === 0}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
            >
              {loading ? 'Assigning…' : 'Assign Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
