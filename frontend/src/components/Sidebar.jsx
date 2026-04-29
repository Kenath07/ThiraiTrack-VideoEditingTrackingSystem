import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Folder, Users, Play } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Project Manager', 'Video Editing Head', 'Full-Time Video Editor', 'Video Editing Intern'] },
  { name: 'Projects',  path: '/projects',  icon: Folder,          roles: ['Project Manager', 'Video Editing Head'] },
  { name: 'Tasks',     path: '/tasks',     icon: CheckSquare,     roles: ['Project Manager', 'Video Editing Head'] },
  { name: 'My Tasks',  path: '/my-tasks',  icon: CheckSquare,     roles: ['Full-Time Video Editor', 'Video Editing Intern'] },
  { name: 'Team',      path: '/team',      icon: Users,           roles: ['Project Manager', 'Video Editing Head'] },
];

const Sidebar = ({ role }) => (
  <div className="w-64 min-h-screen flex flex-col border-r border-slate-800" style={{ backgroundColor: 'oklch(0.13 0.04 265)' }}>
    {/* Logo */}
    <div className="p-7 pb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-hero)', boxShadow: '0 8px 20px -6px oklch(0.51 0.23 277 / 0.5)' }}>
          <Play size={18} className="text-white fill-white" />
        </div>
        <span className="text-xl font-black tracking-tight text-white">
          Thirai<span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-accent)' }}>Track</span>
        </span>
      </div>
    </div>

    {/* Nav */}
    <div className="px-4 py-4 flex-1">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 px-4">Menu</p>
      <nav className="space-y-1">
        {navItems.filter(item => item.roles.includes(role)).map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${
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

    {/* Role badge */}
    <div className="p-5 border-t border-slate-800">
      <div className="rounded-2xl p-4 border border-slate-700" style={{ backgroundColor: 'oklch(0.18 0.04 265)' }}>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-1 bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-accent)' }}>Role</p>
        <p className="text-xs font-semibold text-slate-300">{role}</p>
      </div>
    </div>
  </div>
);

export default Sidebar;
