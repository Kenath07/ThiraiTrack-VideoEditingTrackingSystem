import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { User as UserIcon } from 'lucide-react';

const roleColors = {
  'Project Manager':       'bg-primary/15 text-primary',
  'Video Editing Head':    'bg-accent/15 text-accent',
  'Full-Time Video Editor':'bg-blue-100 text-blue-700',
  'Video Editing Intern':  'bg-secondary text-secondary-foreground',
};

const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const Team = () => {
  const [team, setTeam]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/users')
      .then(res => { setTeam(res.data); setLoading(false); })
      .catch(err => { console.error('Error fetching team:', err); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-muted-foreground text-sm animate-pulse">
      Loading team…
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Team Directory</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of all registered users</p>
      </div>

      <div className="space-y-4 md:hidden">
        {team.map((member) => (
          <div key={member._id} className="rounded-2xl border border-border bg-card p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-start gap-3">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0"
                style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
              >
                {getInitials(member.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="break-words text-sm font-semibold text-foreground">{member.name}</div>
                <div className="break-all text-xs text-muted-foreground">{member.email}</div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${roleColors[member.role] ?? 'bg-secondary text-secondary-foreground'}`}>
                    {member.role}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Joined {new Date(member.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card md:block" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="overflow-x-auto">
          <table className="min-w-[680px] w-full divide-y divide-border">
            <thead>
              <tr className="bg-secondary/60">
                {['Member', 'Role', 'Joined'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {team.map((member) => (
                <tr key={member._id} className="hover:bg-accent/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0"
                        style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
                      >
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${roleColors[member.role] ?? 'bg-secondary text-secondary-foreground'}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Team;
