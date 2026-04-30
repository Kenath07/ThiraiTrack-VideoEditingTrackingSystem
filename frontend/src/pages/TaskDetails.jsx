import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { ArrowLeft, Send, Link as LinkIcon } from 'lucide-react';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchTaskDetails(); }, [id]);

  const fetchTaskDetails = async () => {
    try {
      const response = await api.get(`/api/tasks/${id}`);
      setTask(response.data);
      setDriveLink(response.data.driveLink || '');
      setLoading(false);
    } catch (err) {
      setError('Error loading task details');
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await api.put(`/api/tasks/${id}/status`, { status: newStatus });
      setTask(response.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() && !driveLink.trim()) return;
    try {
      const response = await api.post(`/api/tasks/${id}/comments`, {
        text: commentText,
        driveLink,
      });
      setTask(response.data);
      setCommentText('');
      setDriveLink('');
    } catch (err) {
      alert('Error adding comment');
    }
  };

  if (loading) {
    return <div className="flex h-40 items-center justify-center text-sm text-muted-foreground animate-pulse">Loading task details...</div>;
  }
  if (error) return <div className="p-4 text-destructive">{error}</div>;
  if (!task) return <div className="p-4 text-muted-foreground">Task not found</div>;

  let availableStatuses = [];
  if (user?.role === 'Video Editing Head') {
    availableStatuses = ['Pending', 'In Progress', 'Under Review', 'Completed', 'Rejected'];
  } else if (user?.role === 'Full-Time Video Editor' || user?.role === 'Video Editing Intern') {
    availableStatuses = ['Pending', 'In Progress', 'Under Review'];
  }

  const statusButtonCls = (status) => {
    if (task.status === status) {
      return 'cursor-not-allowed border border-border bg-secondary text-muted-foreground opacity-60';
    }
    const map = {
      Pending: 'border border-border bg-secondary text-foreground hover:bg-muted',
      'In Progress': 'border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
      'Under Review': 'border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
      Completed: 'border border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
      Rejected: 'border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20',
    };
    return map[status] ?? 'border border-border bg-card';
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="break-words text-2xl font-bold text-foreground">{task.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Project: {task.project?.title}</p>
          </div>
          <StatusBadge status={task.status} />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {[
            { label: 'Assigned To', value: task.assignedTo?.name || 'Unassigned' },
            { label: 'Deadline', value: new Date(task.deadline).toLocaleDateString() },
            { label: 'Priority', value: task.priority },
            { label: 'Created By', value: task.createdBy?.name },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-secondary/40 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="break-words text-sm font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</p>
          <p className="rounded-xl bg-secondary/40 p-4 text-sm leading-relaxed text-foreground">{task.description}</p>
        </div>

        {task.driveLink && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Drive / Draft Link</p>
            <a
              href={task.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2 break-all text-sm font-medium text-primary transition-colors hover:text-accent"
            >
              <LinkIcon size={14} className="mt-0.5 flex-shrink-0" />
              <span className="break-all">{task.driveLink}</span>
            </a>
          </div>
        )}

        {availableStatuses.length > 0 && (
          <div className="border-t border-border pt-6">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-foreground">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {availableStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={task.status === status}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${statusButtonCls(status)}`}
                >
                  Set to {status}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
        <h3 className="mb-5 text-lg font-bold text-foreground">Comments &amp; Updates</h3>

        <div className="mb-6 space-y-3">
          {task.comments?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          ) : (
            task.comments?.map((comment, index) => (
              <div key={index} className="rounded-xl bg-secondary/40 p-4">
                <div className="mb-1 flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-bold text-foreground">{comment.user?.name}</span>
                  <span className="text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p className="break-words text-sm text-foreground">{comment.text}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleAddComment} className="space-y-4 border-t border-border pt-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-foreground">Add Comment</label>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full rounded-xl border border-border bg-secondary/40 p-3 text-sm text-foreground placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none resize-none"
              rows="3"
              placeholder="Type your message here..."
            />
          </div>

          {['Video Editing Intern', 'Full-Time Video Editor'].includes(user?.role) && (
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-foreground">
                Google Drive / Draft Link (Optional)
              </label>
              <input
                type="url"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/40 p-3 text-sm text-foreground placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none"
                placeholder="https://drive.google.com/..."
              />
            </div>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90"
            style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
          >
            <Send size={14} />
            Submit Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskDetails;
