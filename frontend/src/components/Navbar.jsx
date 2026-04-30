import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Menu, Play } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const roleShort = {
  'Project Manager': 'Manager',
  'Video Editing Head': 'Head',
  'Full-Time Video Editor': 'Editor',
  'Video Editing Intern': 'Intern',
};

const Navbar = ({ onMenuToggle = () => {} }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-6 lg:px-8"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="inline-flex rounded-xl border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>

        <Link to="/dashboard" className="flex min-w-0 items-center space-x-2.5 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-opacity group-hover:opacity-90"
            style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
          >
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <div className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="text-base font-extrabold tracking-tight text-foreground">
              Thirai
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-text)' }}>
                Track
              </span>
            </span>
            <span className="truncate text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {roleShort[user?.role] || user?.role}
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
          >
            <span className="text-white text-xs font-bold">{getInitials(user?.name)}</span>
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-bold leading-tight text-foreground">{user?.name || 'User'}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="hidden h-8 w-px bg-border sm:block" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition-all hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
