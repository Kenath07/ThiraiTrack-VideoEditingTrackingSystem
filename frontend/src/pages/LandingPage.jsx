import React from 'react';
import { Link } from 'react-router-dom';
import {
  Film, Users, ClipboardCheck, BarChart3,
  ArrowRight, Play, Zap, Shield, CheckCircle2,
  Database, Server, Globe, Code2, Cpu,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

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
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: 'var(--gradient-text)' }}
        >
          Track
        </span>
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Static data
───────────────────────────────────────────── */

const features = [
  { icon: Users,          label: 'Role-Based Access', desc: '4 user roles'     },
  { icon: ClipboardCheck, label: 'Task Tracking',     desc: 'Full lifecycle'   },
  { icon: BarChart3,      label: 'Team Analytics',    desc: 'Performance stats'},
  { icon: Film,           label: 'Review Pipeline',   desc: 'Approve & reject' },
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
    desc: 'Editors, reviewers, managers, and admins — everyone has the right view.',
  },
];

/* ─────────────────────────────────────────────
   Main Page Component
───────────────────────────────────────────── */

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
      {/* ── Navbar ── */}
      <header
        className="px-8 py-5 sticky top-0 z-50 border-b border-border backdrop-blur"
        style={{ backgroundColor: 'oklch(0.99 0.003 270 / 0.8)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />

          {/* Anchor nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#why"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Why ThiraiTrack
            </a>
            <a
              href="#tech"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Tech
            </a>
          </nav>

          {/* Auth buttons — existing routes preserved */}
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-accent/10"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-primary-foreground px-5 py-2.5 rounded-full transition-all hover:opacity-90"
              style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* ── Hero ── */}
        <section className="pt-20 pb-16 flex flex-col items-center text-center">

          {/* Animated badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-accent/30 bg-accent/10 px-5 py-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-sm font-semibold text-foreground tracking-wide">
              Video Editing Team Tracking System
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-[1.05] tracking-tight max-w-4xl">
            Track. Collaborate.
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--gradient-text)' }}
            >
              Deliver Great Videos.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl leading-relaxed">
            A streamlined workflow management platform for video production teams.
            Assign tasks, review work, and monitor progress — all from one beautifully simple dashboard.
          </p>

          {/* CTA Buttons — existing routes preserved */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-5">
            <Link
              to="/login"
              className="group text-primary-foreground px-8 py-3.5 rounded-full text-base font-semibold transition-all flex items-center space-x-2 hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
            >
              <span>Login to Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="bg-card hover:bg-secondary text-foreground px-8 py-3.5 rounded-full text-base font-semibold transition-all border border-border hover:border-accent/40"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              Register as New Member
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            No credit card required · Free for small teams
          </p>
        </section>

        {/* ── Feature Cards ── */}
        <section id="features" className="grid grid-cols-2 lg:grid-cols-4 gap-5 pb-24">
          {features.map((item, i) => (
            <div
              key={i}
              className="group bg-card border border-border rounded-2xl px-5 py-6 hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 cursor-default"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="w-11 h-11 bg-accent/15 group-hover:bg-primary rounded-xl flex items-center justify-center mb-4 mx-auto transition-all duration-300">
                <item.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-0.5 text-center">{item.label}</p>
              <p className="text-xs text-muted-foreground font-medium text-center">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* ── Why ThiraiTrack ── */}
        <section id="why" className="pb-28">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
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
                className="rounded-2xl border border-border bg-card p-7 hover:border-accent/40 transition-all"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-primary-foreground mb-5"
                  style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tech Stack ── */}
        <section id="tech" className="pb-28">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Built on a Modern Stack
            </h2>
            <p className="mt-3 text-muted-foreground">
              ThiraiTrack is powered by industry-standard technologies for speed, reliability, and scale.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Database,  label: 'MongoDB',    desc: 'Database',     color: 'text-green-600',  bg: 'bg-green-50' },
              { icon: Server,    label: 'Express.js', desc: 'Backend API',  color: 'text-gray-700',   bg: 'bg-gray-100' },
              { icon: Globe,     label: 'React',      desc: 'Frontend UI',  color: 'text-blue-600',   bg: 'bg-blue-50'  },
              { icon: Cpu,       label: 'Node.js',    desc: 'Runtime',      color: 'text-lime-600',   bg: 'bg-lime-50'  },
              { icon: Code2,     label: 'Tailwind v4',desc: 'Styling',      color: 'text-cyan-600',   bg: 'bg-cyan-50'  },
            ].map(({ icon: Icon, label, desc, color, bg }) => (
              <div
                key={label}
                className="group flex flex-col items-center text-center rounded-2xl border border-border bg-card p-6 hover:border-accent/40 hover:-translate-y-1 transition-all duration-300"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <p className="text-sm font-bold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            ))}
          </div>

          {/* Architecture badge strip */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['REST API','JWT Auth','Role-Based Access','Real-time Updates','AI Chatbot'].map(tag => (
              <span
                key={tag}
                className="inline-flex items-center text-xs font-semibold px-4 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section id="cta" className="pb-28">
          <div
            className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center"
            style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-glow)' }}
          >
            {/* Decorative orbs */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 15% 20%, oklch(0.7 0.17 278), transparent 35%), radial-gradient(circle at 85% 80%, oklch(0.62 0.2 278), transparent 35%)',
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-1"
              style={{ background: 'var(--gradient-accent)' }}
            />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-3">
                Ready to ship your next video?
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto">
                Join production teams that use ThiraiTrack to stay organised, accountable, and on schedule.
              </p>
              {/* Existing /register route preserved */}
              <Link
                to="/register"
                className="inline-flex items-center gap-2 mt-8 bg-white/90 hover:bg-white text-primary font-semibold px-8 py-3.5 rounded-full transition-all shadow-lg hover:-translate-y-0.5 text-base"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-card/40 backdrop-blur">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 px-6 lg:px-10 py-8">
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