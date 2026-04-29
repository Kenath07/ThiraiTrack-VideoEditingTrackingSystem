import React from 'react';

// Color-coded task status badge component
const StatusBadge = ({ status }) => {
  const map = {
    'Pending':     'bg-secondary text-secondary-foreground border-border',
    'Planning':    'bg-secondary text-secondary-foreground border-border',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    'Active':      'bg-blue-100 text-blue-700 border-blue-200',
    'Under Review':'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Completed':   'bg-green-100 text-green-700 border-green-200',
    'Rejected':    'bg-destructive/10 text-destructive border-destructive/20',
  };
  const cls = map[status] ?? 'bg-secondary text-secondary-foreground border-border';
  return (
    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${cls}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
