import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import ProjectModal from '../components/ProjectModal';
import { Plus, Calendar, User } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/api/projects')
      .then(res => { setProjects(res.data); setLoading(false); })
      .catch(err => { console.error('Error fetching projects:', err); setLoading(false); });
  }, []);

  const handleProjectCreated = (newProject) => {
    setProjects([{ ...newProject, createdBy: { fullName: user.name } }, ...projects]);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-muted-foreground text-sm animate-pulse">
      Loading projects…
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all video projects</p>
        </div>
        {['Project Manager', 'Video Editing Head'].includes(user?.role) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
          >
            <Plus size={16} />
            New Project
          </button>
        )}
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => {
          const isOverdue = new Date(project.deadline) < new Date();
          return (
            <div
              key={project._id}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col hover:border-accent/40 hover:-translate-y-0.5 transition-all"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-bold text-foreground line-clamp-1 pr-2">{project.title}</h3>
                <StatusBadge status={project.status} />
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{project.description}</p>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar size={12} />
                    Deadline
                  </span>
                  <span className={`font-semibold ${isOverdue ? 'text-destructive' : 'text-foreground'}`}>
                    {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <User size={12} />
                    Created by
                  </span>
                  <span className="font-semibold text-foreground">{project.createdBy?.fullName || 'N/A'}</span>
                </div>
              </div>
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="col-span-full text-center py-12 bg-card rounded-2xl border border-border text-muted-foreground text-sm" style={{ boxShadow: 'var(--shadow-card)' }}>
            No projects found.
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Projects;
