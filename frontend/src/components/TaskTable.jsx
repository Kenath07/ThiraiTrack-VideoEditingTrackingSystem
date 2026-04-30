import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { Calendar, Eye, FolderKanban, UserRound } from 'lucide-react';

const TaskTable = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground" style={{ boxShadow: 'var(--shadow-card)' }}>
        No tasks found.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 md:hidden">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="rounded-2xl border border-border bg-card p-4"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-foreground">{task.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{task.project?.title || 'No project'}</p>
              </div>
              <StatusBadge status={task.status} />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserRound size={14} />
                <span className="truncate">{task.assignedTo?.name || 'Unassigned'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FolderKanban size={14} />
                <span className="truncate">{task.assignedTo?.role || 'No role'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={14} />
                <span>{new Date(task.deadline).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className={`text-xs font-semibold ${
                task.priority === 'High' ? 'text-red-600' :
                task.priority === 'Medium' ? 'text-yellow-600' : 'text-primary'
              }`}>
                {task.priority} Priority
              </span>
              <Link
                to={`/task/${task._id}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
              >
                <Eye size={15} />
                View
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card md:block" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full divide-y divide-border">
            <thead>
              <tr className="bg-secondary/60">
                {['Task', 'Project', 'Assigned To', 'Deadline', 'Priority', 'Status', 'Actions'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground ${i === 6 ? 'text-right' : 'text-left'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tasks.map((task) => (
                <tr key={task._id} className="transition-colors hover:bg-accent/5">
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
                      task.priority === 'High' ? 'text-red-600' :
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
                      className="inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-accent"
                    >
                      <Eye size={15} />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TaskTable;
