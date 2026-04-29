import React from 'react';

// Reusable dashboard statistic card component
const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div
    className="bg-card rounded-2xl border border-border p-6 flex items-center gap-4 hover:border-accent/40 hover:-translate-y-0.5 transition-all"
    style={{ boxShadow: 'var(--shadow-card)' }}
  >
    <div className={`p-3.5 rounded-xl ${colorClass} flex-shrink-0`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  </div>
);

export default StatCard;
