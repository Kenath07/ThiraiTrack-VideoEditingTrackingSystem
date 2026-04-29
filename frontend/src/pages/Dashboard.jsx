import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import TaskTable from '../components/TaskTable';
import { CheckSquare, Clock, AlertCircle, Folder, CheckCircle } from 'lucide-react';

/* ── Shared section heading ── */
// Main dashboard route handler
const SectionHeading = ({ children }) => (
  <h2 className="text-base font-bold text-foreground uppercase tracking-wide mb-4">{children}</h2>
);

/* ── Loading spinner ── */
const Loading = () => (
  <div className="flex items-center justify-center h-40 text-muted-foreground text-sm animate-pulse">
    Loading dashboard…
  </div>
);

const Dashboard = () => {
  const { user }    = useContext(AuthContext);
  const navigate    = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks]     = useState([]);
  const [projects, setProjects] = useState([]);
  const [team, setTeam]       = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user.role === 'Project Manager') {
          const [projRes, taskRes, teamRes] = await Promise.all([
            api.get('/api/projects'),
            api.get('/api/tasks'),
            api.get('/api/users/team'),
          ]);
          setProjects(projRes.data);
          setTasks(taskRes.data);
          setTeam(teamRes.data);
        } else if (user.role === 'Video Editing Head') {
          const [projRes, taskRes] = await Promise.all([
            api.get('/api/projects'),
            api.get('/api/tasks'),
          ]);
          setProjects(projRes.data);
          setTasks(taskRes.data);
        } else if (user.role === 'Full-Time Video Editor') {
          const res = await api.get('/api/tasks');
          setTasks(res.data);
        } else {
          const res = await api.get('/api/tasks/my-tasks');
          setTasks(res.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    if (user) fetchDashboardData();
  }, [user]);

  if (loading) return <Loading />;

  /* ────────────────── INTERN ────────────────── */
  if (user.role === 'Video Editing Intern') {
    const pending    = tasks.filter(t => t.status === 'Pending').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const underReview= tasks.filter(t => t.status === 'Under Review').length;

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Intern Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, {user.name}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard title="Pending Tasks"  value={pending}     icon={Clock}       colorClass="bg-muted-foreground/80" />
          <StatCard title="In Progress"    value={inProgress}  icon={AlertCircle} colorClass="bg-blue-500"           />
          <StatCard title="Under Review"   value={underReview} icon={CheckSquare} colorClass="bg-yellow-500"         />
        </div>
        <div>
          <SectionHeading>My Assigned Tasks</SectionHeading>
          <TaskTable tasks={tasks} />
        </div>
      </div>
    );
  }

  /* ────────────────── EDITOR ────────────────── */
  if (user.role === 'Full-Time Video Editor') {
    const myTasks          = tasks.filter(t => t.assignedTo?._id === user._id);
    const internSubmissions = tasks.filter(t =>
      t.status === 'Under Review' && t.assignedTo?.role === 'Video Editing Intern'
    );

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Editor Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, {user.name}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <StatCard title="My Active Tasks"                value={myTasks.length}          icon={CheckSquare} colorClass="bg-blue-500"   />
          <StatCard title="Intern Submissions to Review"  value={internSubmissions.length} icon={AlertCircle} colorClass="bg-yellow-500" />
        </div>
        <div>
          <SectionHeading>Intern Submissions (Needs Review)</SectionHeading>
          <TaskTable tasks={internSubmissions} />
        </div>
        <div>
          <SectionHeading>My Tasks</SectionHeading>
          <TaskTable tasks={myTasks} />
        </div>
      </div>
    );
  }

  /* ────────────────── HEAD ────────────────── */
  if (user.role === 'Video Editing Head') {
    const approvalQueue = tasks.filter(t => t.status === 'Under Review');

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Head Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Welcome back, {user.name}</p>
          </div>
          <button
            onClick={() => navigate('/tasks')}
            className="inline-flex items-center gap-2 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
          >
            Manage All Tasks
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <StatCard title="Active Projects"  value={projects.length}                               icon={Folder}      colorClass="bg-primary"      />
          <StatCard title="Total Team Tasks" value={tasks.length}                                  icon={CheckSquare} colorClass="bg-accent"        />
          <StatCard title="Approval Queue"   value={approvalQueue.length}                          icon={AlertCircle} colorClass="bg-yellow-500"    />
          <StatCard title="Completed"        value={tasks.filter(t => t.status === 'Completed').length} icon={CheckCircle} colorClass="bg-green-500" />
        </div>

        {/* Projects overview */}
        <div>
          <SectionHeading>Projects Overview</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => {
              const projectTasks    = tasks.filter(t => t.project?._id === project._id);
              const completedCount  = projectTasks.filter(t => t.status === 'Completed').length;
              const progress        = projectTasks.length ? Math.round((completedCount / projectTasks.length) * 100) : 0;
              const isOverdue       = new Date(project.deadline) < new Date();

              return (
                <div
                  key={project._id}
                  className="bg-card border border-border rounded-2xl p-5 hover:border-accent/40 hover:-translate-y-0.5 transition-all"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-foreground text-sm pr-2">{project.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      project.status === 'Active'    ? 'bg-green-100 text-green-700' :
                      project.status === 'Completed' ? 'bg-blue-100 text-blue-700'  :
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>Deadline: <span className={isOverdue ? 'text-destructive font-semibold' : 'text-foreground font-semibold'}>{new Date(project.deadline).toLocaleDateString()}</span></span>
                    <span>{projectTasks.length} tasks</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${progress}%`, background: 'var(--gradient-hero)' }}
                    />
                  </div>
                  <p className="text-xs text-right text-muted-foreground mt-1">{progress}% complete</p>
                </div>
              );
            })}
            {projects.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground text-sm">
                No projects yet. Waiting for the Project Manager to create projects.
              </div>
            )}
          </div>
        </div>

        <div>
          <SectionHeading>Approval Queue (Under Review)</SectionHeading>
          <TaskTable tasks={approvalQueue} />
        </div>
        <div>
          <SectionHeading>Recent Team Tasks</SectionHeading>
          <TaskTable tasks={tasks.slice(0, 5)} />
        </div>
      </div>
    );
  }

  /* ────────────────── MANAGER ────────────────── */
  if (user.role === 'Project Manager') {
    const activeTasks    = tasks.filter(t => t.status === 'In Progress' || t.status === 'Pending').length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;

    const teamPerformance = team.map(member => {
      const memberTasks    = tasks.filter(t => t.assignedTo?._id === member._id);
      const completed      = memberTasks.filter(t => t.status === 'Completed').length;
      const completionRate = memberTasks.length ? Math.round((completed / memberTasks.length) * 100) : 0;
      return { ...member, totalTasks: memberTasks.length, completedTasks: completed, completionRate };
    });

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manager Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard title="Total Projects"  value={projects.length} icon={Folder}      colorClass="bg-primary"    />
          <StatCard title="Active Tasks"    value={activeTasks}     icon={Clock}       colorClass="bg-blue-500"   />
          <StatCard title="Completed Tasks" value={completedTasks}  icon={CheckCircle} colorClass="bg-green-500"  />
        </div>

        <div>
          <SectionHeading>Team Performance Overview</SectionHeading>
          <div className="bg-card rounded-2xl border border-border overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-secondary/60">
                  {['Member','Role','Total Tasks','Completed','Completion Rate'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider ${i >= 2 ? 'text-center' : 'text-left'} ${i === 4 ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {teamPerformance.map(member => (
                  <tr key={member._id} className="hover:bg-accent/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{member.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-foreground">{member.totalTasks}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-semibold">{member.completedTasks}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className="font-semibold text-foreground">{member.completionRate}%</span>
                        <div className="w-20 bg-secondary rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ width: `${member.completionRate}%`, background: 'var(--gradient-hero)' }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;
