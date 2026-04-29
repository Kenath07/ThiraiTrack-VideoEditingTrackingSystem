import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { Eye } from 'lucide-react';

const TaskTable = ({ tasks }) => (
  <div className="bg-card rounded-2xl border border-border overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr className="bg-secondary/60">
            {['Task','Project','Assigned To','Deadline','Priority','Status','Actions'].map((h, i) => (
              <th
                key={h}
                className={`px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider ${i === 6 ? 'text-right' : 'text-left'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tasks.map((task) => (
            <tr key={task._id} className="hover:bg-accent/5 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">{task.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{task.project?.title || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-foreground">{task.assignedTo?.name || 'Unassigned'}</div>
                <div className="text-xs text-muted-foreground">{task.assignedTo?.role}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {new Date(task.deadline).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-xs font-semibold ${
                  task.priority === 'High'   ? 'text-red-600' :
                  task.priority === 'Medium' ? 'text-yellow-600' : 'text-primary'
                }`}>
                  {task.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={task.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  to={`/task/${task._id}`}
                  className="inline-flex items-center gap-1.5 text-primary hover:text-accent font-semibold transition-colors"
                >
                  <Eye size={15} />
                  View
                </Link>
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-10 text-center text-muted-foreground text-sm">
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default TaskTable;
