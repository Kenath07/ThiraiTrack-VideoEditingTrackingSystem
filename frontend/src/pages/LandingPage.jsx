import React from 'react';
import { Link } from 'react-router-dom';
import {
  Film, Users, ClipboardCheck, BarChart3,
  ArrowRight, Play, Zap, Shield, CheckCircle2,
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
   Static data (UI-only, no backend impact)
───────────────────────────────────────────── */

const features = [
  { icon: Users,         label: 'Role-Based Access', desc: '4 user roles'     },
  { icon: ClipboardCheck,label: 'Task Tracking',     desc: 'Full lifecycle'   },
  { icon: BarChart3,     label: 'Team Analytics',    desc: 'Performance stats'},
  { icon: Film,          label: 'Review Pipeline',   desc: 'Approve & reject' },
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
        background:
          'radial-gradient(ellipse 70% 50% at 50% -10%, oklch(0.51 0.23 277 / 0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 10%, oklch(0.6 0.21 278 / 0.08) 0%, transparent 60%), linear-gradient(135deg, oklch(0.99 0.003 270) 0%, oklch(1 0 0) 40%, oklch(0.965 0.01 270) 100%)',
      }}
    >
      {/* ── Navbar ── */}
      <header className="px-8 py-5 sticky top-0 z-50 bg-card/70 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#why"      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Why ThiraiTrack</a>
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
          <div className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/20 rounded-full px-5 py-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-sm font-semibold text-primary tracking-wide">Video Editing Team Tracking System</span>
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
              className="group text-primary-foreground px-8 py-3.5 rounded-full text-base font-semibold transition-all flex items-center space-x-2 hover:-translate-y-0.5"
              style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
            >
              <span>Login to Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="bg-card hover:bg-secondary text-foreground px-8 py-3.5 rounded-full text-base font-semibold transition-all border border-border hover:border-accent/30"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              Register as New Member
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">No credit card required · Free for small teams</p>
        </section>

        {/* ── Feature Cards ── */}
        <section id="features" className="grid grid-cols-2 lg:grid-cols-4 gap-5 pb-24">
          {features.map((item, i) => (
            <div
              key={i}
              className="group bg-card border border-border rounded-2xl px-5 py-6 hover:border-accent/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="w-11 h-11 bg-accent/10 group-hover:rounded-xl flex items-center justify-center mb-4 mx-auto transition-all duration-300" style={{ background: 'var(--gradient-hero)' }}>
                <item.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-0.5">{item.label}</p>
              <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
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
              <div key={title} className="rounded-2xl border border-border bg-card p-7 hover:shadow-md hover:border-accent/40 transition-all" style={{ boxShadow: 'var(--shadow-card)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5" style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="pb-28">
          <div className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center" style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-glow)' }}>
            {/* Decorative orbs */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.6), transparent 35%), radial-gradient(circle at 85% 80%, rgba(255,255,255,0.4), transparent 35%)',
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

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
                className="inline-flex items-center gap-2 mt-8 bg-card hover:bg-secondary text-primary font-semibold px-8 py-3.5 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-card/60 backdrop-blur">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-6 lg:px-10 py-8 text-sm text-muted-foreground">
          <Logo />
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs">
            <span>Video Editing Team Tracking System</span>
            <span className="text-primary">•</span>
            <span>Built with MERN Stack</span>
            <span className="text-primary">•</span>
            <span>Technical Assessment</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
