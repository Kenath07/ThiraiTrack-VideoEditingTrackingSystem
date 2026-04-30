import React, { useState, useContext } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const fieldCls =
  'w-full rounded-xl border border-border bg-secondary/40 p-3 text-sm text-foreground placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none';

const ProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('Planning');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const [serverRole, setServerRole] = React.useState(null);

  React.useEffect(() => {
    if (isOpen) {
      console.log('[ProjectModal] opened. current user from context:', user);
    }
  }, [isOpen, user]);

  React.useEffect(() => {
    let cancelled = false;
    const fetchServerRole = async () => {
      if (!isOpen) return;
      try {
        const res = await api.get('/api/auth/me');
        if (!cancelled) setServerRole(res.data?.role || null);
      } catch (err) {
        console.error('[ProjectModal] failed to fetch server role:', err);
        if (!cancelled) setServerRole(null);
      }
    };
    fetchServerRole();
    return () => { cancelled = true; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const meRes = await api.get('/api/auth/me');
      const liveRole = meRes.data?.role;
      if (liveRole !== 'Project Manager') {
        setError(`You are not authorized to create projects. Your role: ${liveRole || 'unknown'}`);
        setLoading(false);
        return;
      }
    } catch (meErr) {
      console.error('[ProjectModal] failed to refresh current user:', meErr);
      if (user?.role !== 'Project Manager') {
        setError(`You are not authorized to create projects. Your role: ${user?.role || 'unknown'}`);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await api.post('/api/projects', { title, description, deadline, status });
      onProjectCreated(response.data);
      setTitle('');
      setDescription('');
      setDeadline('');
      setStatus('Planning');
      onClose();
    } catch (err) {
      if (err.response) {
        const statusCode = err.response.status;
        const serverMsg = err.response.data?.message || err.response.data?.error || JSON.stringify(err.response.data);
        if (statusCode === 403) {
          setError(`You do not have permission to create projects. Server: ${serverMsg}`);
        } else {
          setError(serverMsg || 'Error creating project');
        }
      } else {
        setError(err.message || 'Error creating project');
      }
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        style={{ boxShadow: 'var(--shadow-glow)' }}
      >
        <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-foreground">Create New Project</h2>
            {serverRole && <p className="mt-1 text-xs text-muted-foreground">Role: {serverRole}</p>}
          </div>
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
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-foreground">Project Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={fieldCls} placeholder="e.g. Summer Ad Campaign" />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-foreground">Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className={`${fieldCls} resize-none`} rows="3" placeholder="Brief project details..." />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-foreground">Deadline</label>
            <input type="date" required min={today} value={deadline} onChange={(e) => setDeadline(e.target.value)} className={fieldCls} />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-foreground">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${fieldCls} appearance-none cursor-pointer`}>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="w-full rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary sm:w-auto">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
