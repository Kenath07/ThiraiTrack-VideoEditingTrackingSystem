import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Folder, Users, Play, X } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Project Manager', 'Video Editing Head', 'Full-Time Video Editor', 'Video Editing Intern'] },
  { name: 'Projects', path: '/projects', icon: Folder, roles: ['Project Manager', 'Video Editing Head'] },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare, roles: ['Project Manager', 'Video Editing Head'] },
  { name: 'My Tasks', path: '/my-tasks', icon: CheckSquare, roles: ['Full-Time Video Editor', 'Video Editing Intern'] },
  { name: 'Team', path: '/team', icon: Users, roles: ['Project Manager', 'Video Editing Head'] },
];

const Sidebar = ({ role, isOpen = false, onClose = () => {} }) => {
  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/55 transition-opacity duration-200 md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col border-r border-slate-800 transition-transform duration-200 md:static md:min-h-screen md:w-64 md:max-w-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ backgroundColor: 'oklch(0.13 0.04 265)' }}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center justify-between p-5 pb-4 md:p-7 md:pb-4">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--gradient-hero)', boxShadow: '0 8px 20px -6px oklch(0.51 0.23 277 / 0.5)' }}
            >
              <Play size={18} className="text-white fill-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Thirai
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-accent)' }}>
                Track
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <p className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Menu</p>
          <nav className="space-y-1">
            {visibleItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive ? 'text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
                style={({ isActive }) =>
                  isActive ? { background: 'var(--gradient-hero)', boxShadow: '0 6px 16px -4px oklch(0.51 0.23 277 / 0.45)' } : {}
                }
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-800 p-5">
          <div className="rounded-2xl border border-slate-700 p-4" style={{ backgroundColor: 'oklch(0.18 0.04 265)' }}>
            <p className="mb-1 bg-clip-text text-[10px] font-bold uppercase tracking-wider text-transparent" style={{ backgroundImage: 'var(--gradient-accent)' }}>
              Role
            </p>
            <p className="break-words text-xs font-semibold text-slate-300">{role}</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
