import React from 'react';
import { Link } from 'react-router-dom';
import {
  Film, Users, ClipboardCheck, BarChart3,
  ArrowRight, Play, Zap, Shield, CheckCircle2,
  Database, Server, Globe, Code2, Cpu,
} from 'lucide-react';

function Logo() {
  return (
    <div className="flex items-center space-x-2.5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
      >
        <Play className="w-4 h-4 text-white fill-white" />
      </div>
      <span className="text-xl font-extrabold tracking-tight text-foreground">
        Thirai
        <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-text)' }}>
          Track
        </span>
      </span>
    </div>
  );
}

const features = [
  { icon: Users, label: 'Role-Based Access', desc: '4 user roles' },
  { icon: ClipboardCheck, label: 'Task Tracking', desc: 'Full lifecycle' },
  { icon: BarChart3, label: 'Team Analytics', desc: 'Performance stats' },
  { icon: Film, label: 'Review Pipeline', desc: 'Approve & reject' },
];

const highlights = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Built on a modern MERN stack for snappy performance across every screen.',
  },
  {
    icon: Shield,
    title: 'Secure by Design',
    desc: 'JWT-based auth and granular role permissions keep your projects safe.',
  },
  {
    icon: CheckCircle2,
    title: 'Built for Teams',
    desc: 'Editors, reviewers, managers, and admins - everyone has the right view.',
  },
];

const LandingPage = () => {
  return (
    <div
      className="min-h-screen text-foreground"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 70% 50% at 50% -10%, oklch(0.6 0.21 278 / 0.18), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 10%, oklch(0.51 0.23 277 / 0.1), transparent 60%)',
        backgroundColor: 'var(--background)',
      }}
    >
      <header
        className="sticky top-0 z-50 border-b border-border px-4 py-4 backdrop-blur sm:px-6 lg:px-8"
        style={{ backgroundColor: 'oklch(0.99 0.003 270 / 0.8)' }}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#why" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Why ThiraiTrack</a>
            <a href="#tech" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Tech</a>
          </nav>

          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-primary"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-full px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
              style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <section className="flex flex-col items-center pb-16 pt-20 text-center">
          <div className="mb-8 inline-flex items-center space-x-2 rounded-full border border-accent/30 bg-accent/10 px-5 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-sm font-semibold tracking-wide text-foreground">
              Video Editing Team Tracking System
            </span>
          </div>

          <h1 className="mb-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Track. Collaborate.
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-text)' }}>
              Deliver Great Videos.
            </span>
          </h1>

          <p className="mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            A streamlined workflow management platform for video production teams.
            Assign tasks, review work, and monitor progress - all from one beautifully simple dashboard.
          </p>

          <div className="mb-5 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
            <Link
              to="/login"
              className="group flex w-full items-center justify-center space-x-2 rounded-full px-8 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90 sm:w-auto"
              style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
            >
              <span>Login to Dashboard</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/register"
              className="w-full rounded-full border border-border bg-card px-8 py-3.5 text-center text-base font-semibold text-foreground transition-all hover:border-accent/40 hover:bg-secondary sm:w-auto"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              Register as New Member
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            No credit card required - Free for small teams
          </p>
        </section>

        <section id="features" className="grid grid-cols-1 gap-5 pb-24 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, i) => (
            <div
              key={i}
              className="group cursor-default rounded-2xl border border-border bg-card px-5 py-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 transition-all duration-300 group-hover:bg-primary">
                <item.icon className="h-5 w-5 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
              </div>
              <p className="mb-0.5 text-center text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-center text-xs font-medium text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </section>

        <section id="why" className="pb-28">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything your editing team needs
            </h2>
            <p className="mt-3 text-muted-foreground">
              Replace scattered spreadsheets, chats, and email threads with a single source of truth.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-7 transition-all hover:border-accent/40"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div
                  className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground"
                  style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="tech" className="pb-28">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built on a Modern Stack
            </h2>
            <p className="mt-3 text-muted-foreground">
              ThiraiTrack is powered by industry-standard technologies for speed, reliability, and scale.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {[
              { icon: Database, label: 'MongoDB', desc: 'Database', color: 'text-green-600', bg: 'bg-green-50' },
              { icon: Server, label: 'Express.js', desc: 'Backend API', color: 'text-gray-700', bg: 'bg-gray-100' },
              { icon: Globe, label: 'React', desc: 'Frontend UI', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: Cpu, label: 'Node.js', desc: 'Runtime', color: 'text-lime-600', bg: 'bg-lime-50' },
              { icon: Code2, label: 'Tailwind v4', desc: 'Styling', color: 'text-cyan-600', bg: 'bg-cyan-50' },
            ].map(({ icon: Icon, label, desc, color, bg }) => (
              <div
                key={label}
                className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${bg} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <p className="text-sm font-bold text-foreground">{label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['REST API', 'JWT Auth', 'Role-Based Access', 'Real-time Updates', 'AI Chatbot'].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section id="cta" className="pb-28">
          <div
            className="relative overflow-hidden rounded-3xl p-8 text-center sm:p-16"
            style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-glow)' }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 15% 20%, oklch(0.7 0.17 278), transparent 35%), radial-gradient(circle at 85% 80%, oklch(0.62 0.2 278), transparent 35%)',
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: 'var(--gradient-accent)' }} />

            <div className="relative">
              <h2 className="mb-3 text-3xl font-bold text-primary-foreground sm:text-4xl">
                Ready to ship your next video?
              </h2>
              <p className="mx-auto max-w-xl text-primary-foreground/80">
                Join production teams that use ThiraiTrack to stay organised, accountable, and on schedule.
              </p>
              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/90 px-8 py-3.5 text-base font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-8 lg:px-10">
          <Logo />
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span>Video Editing Team Tracking System</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
