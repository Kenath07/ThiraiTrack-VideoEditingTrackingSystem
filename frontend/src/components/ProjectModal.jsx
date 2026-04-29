import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';

const fieldCls =
  'w-full bg-secondary/40 border border-border rounded-xl p-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors';

const ProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline]     = useState('');
  const [status, setStatus]         = useState('Planning');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/projects', { title, description, deadline, status });
      onProjectCreated(response.data);
      setTitle(''); setDescription(''); setDeadline(''); setStatus('Planning');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating project');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ boxShadow: 'var(--shadow-glow)' }}>

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-border bg-secondary/40">
          <h2 className="text-lg font-bold text-foreground">Create New Project</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-destructive transition-colors rounded-lg p-1 hover:bg-destructive/10">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-2">Project Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className={fieldCls} placeholder="e.g. Summer Ad Campaign" />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-2">Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} className={`${fieldCls} resize-none`} rows="3" placeholder="Brief project details…" />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-2">Deadline</label>
            <input type="date" required min={today} value={deadline} onChange={e => setDeadline(e.target.value)} className={fieldCls} />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-2">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className={`${fieldCls} appearance-none cursor-pointer`}>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Footer buttons */}
          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
            >
              {loading ? 'Creating…' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
