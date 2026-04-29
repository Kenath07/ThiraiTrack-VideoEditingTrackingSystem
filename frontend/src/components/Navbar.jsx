import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Play } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

// Role abbreviations for display
const roleShort = {
  'Project Manager':       'Manager',
  'Video Editing Head':    'Head',
  'Full-Time Video Editor':'Editor',
  'Video Editing Intern':  'Intern',
};

const PRIVILEGED_ROLES = ['Project Manager', 'Video Editing Head'];

// Dashboard navbar with user actions
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    const isPrivileged = PRIVILEGED_ROLES.includes(user?.role);
    logout();
    navigate(isPrivileged ? '/admin/login' : '/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header
      className="bg-card border-b border-border px-8 py-3.5 flex justify-between items-center sticky top-0 z-10"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      {/* ── Logo ── */}
      <Link to="/dashboard" className="flex items-center space-x-2.5 group">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-opacity group-hover:opacity-90"
          style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
        >
          <Play className="w-4 h-4 text-white fill-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-base font-extrabold tracking-tight text-foreground">
            Thirai
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--gradient-text)' }}
            >
              Track
            </span>
          </span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {roleShort[user?.role] || user?.role}
          </span>
        </div>
      </Link>

      {/* ── Right side: user info + logout ── */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
          >
            <span className="text-white text-xs font-bold">{getInitials(user?.name)}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-muted-foreground hover:text-destructive px-3 py-2 rounded-lg hover:bg-destructive/10 transition-all text-sm font-semibold border border-border hover:border-destructive/30"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
