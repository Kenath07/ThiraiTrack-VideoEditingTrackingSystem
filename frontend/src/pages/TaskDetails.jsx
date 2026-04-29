import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { ArrowLeft, Send, Link as LinkIcon } from 'lucide-react';

// Task details page with workflow actions
const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [task, setTask]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [commentText, setCommentText] = useState('');
  const [driveLink, setDriveLink]   = useState('');
  const [error, setError]           = useState('');

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
        driveLink: driveLink,
      });
      setTask(response.data);
      setCommentText('');
      setDriveLink('');
    } catch (err) {
      alert('Error adding comment');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-muted-foreground text-sm animate-pulse">
      Loading task details…
    </div>
  );
  if (error) return <div className="text-destructive p-4">{error}</div>;
  if (!task)  return <div className="text-muted-foreground p-4">Task not found</div>;

  // Role-based status options — unchanged
  let availableStatuses = [];
  if      (user?.role === 'Video Editing Head')     availableStatuses = ['Pending','In Progress','Under Review','Completed','Rejected'];
  else if (user?.role === 'Full-Time Video Editor') availableStatuses = ['Pending','In Progress','Under Review'];
  else if (user?.role === 'Video Editing Intern')   availableStatuses = ['Pending','In Progress','Under Review'];

  const statusButtonCls = (status) => {
    if (task.status === status)
      return 'bg-secondary text-muted-foreground cursor-not-allowed border border-border opacity-60';
    const map = {
      'Pending':     'bg-secondary hover:bg-muted text-foreground border border-border',
      'In Progress': 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200',
      'Under Review':'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200',
      'Completed':   'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200',
      'Rejected':    'bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20',
    };
    return map[status] ?? 'bg-card border border-border';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Task info card */}
      <div className="bg-card border border-border rounded-2xl p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{task.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">Project: {task.project?.title}</p>
          </div>
          <StatusBadge status={task.status} />
        </div>

        <div className="grid grid-cols-2 gap-5 mb-6">
          {[
            { label: 'Assigned To', value: task.assignedTo?.name || 'Unassigned' },
            { label: 'Deadline',    value: new Date(task.deadline).toLocaleDateString() },
            { label: 'Priority',    value: task.priority },
            { label: 'Created By',  value: task.createdBy?.name },
          ].map(({ label, value }) => (
            <div key={label} className="bg-secondary/40 rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
              <p className="text-sm font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</p>
          <p className="text-sm text-foreground bg-secondary/40 p-4 rounded-xl leading-relaxed">{task.description}</p>
        </div>

        {task.driveLink && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Drive / Draft Link</p>
            <a
              href={task.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-accent text-sm font-medium transition-colors"
            >
              <LinkIcon size={14} />
              {task.driveLink}
            </a>
          </div>
        )}

        {availableStatuses.length > 0 && (
          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-3">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {availableStatuses.map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={task.status === status}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${statusButtonCls(status)}`}
                >
                  Set to {status}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comments card */}
      <div className="bg-card border border-border rounded-2xl p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
        <h3 className="text-lg font-bold text-foreground mb-5">Comments &amp; Updates</h3>

        <div className="space-y-3 mb-6">
          {task.comments?.length === 0 ? (
            <p className="text-muted-foreground text-sm">No comments yet.</p>
          ) : (
            task.comments?.map((comment, index) => (
              <div key={index} className="bg-secondary/40 p-4 rounded-xl">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-foreground">{comment.user?.name}</span>
                  <span className="text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-foreground">{comment.text}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleAddComment} className="space-y-4 border-t border-border pt-5">
          <div>
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wide mb-2">Add Comment</label>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-secondary/40 border border-border rounded-xl p-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              rows="3"
              placeholder="Type your message here…"
            />
          </div>

          {['Video Editing Intern', 'Full-Time Video Editor'].includes(user?.role) && (
            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                Google Drive / Draft Link (Optional)
              </label>
              <input
                type="url"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                className="w-full bg-secondary/40 border border-border rounded-xl p-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                placeholder="https://drive.google.com/…"
              />
            </div>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
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
