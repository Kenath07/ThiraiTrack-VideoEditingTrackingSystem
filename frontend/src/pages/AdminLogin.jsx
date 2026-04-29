import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Play, Mail, Lock, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';

/* ── Privileged accounts (frontend gate) ── */
const PRIVILEGED_ACCOUNTS = [
  { email: 'manager@thiraiterra.com', label: 'Project Manager' },
  { email: 'head@thiraiterra.com',    label: 'Video Editing Head' },
];

function AdminLogo() {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Icon badge */}
      <div className="relative">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-glow)' }}
        >
          <Play className="w-7 h-7 text-white fill-white" />
        </div>
        {/* Admin shield overlay */}
        <div
          className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center border-2 border-card"
          style={{ background: 'var(--gradient-accent)' }}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      <div className="text-center">
        <span className="text-2xl font-extrabold tracking-tight text-foreground">
          Thirai
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-text)' }}>
            Track
          </span>
        </span>
        <div className="mt-1 inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-0.5">
          <ShieldCheck className="w-3 h-3 text-green-600" />
          <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Admin Portal</span>
        </div>
      </div>
    </div>
  );
}

const AdminLogin = () => {
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [error, setError]                     = useState('');
  const [loading, setLoading]                 = useState(false);
  const [emailTouched, setEmailTouched]       = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate  = useNavigate();

  const isPrivilegedEmail = PRIVILEGED_ACCOUNTS.some(a => a.email === email.toLowerCase().trim());
  const isEmailValid      = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid   = password.length >= 6;

  const getInputBorderClass = (touched, isValid) => {
    if (!touched) return 'border-border focus:border-primary bg-card';
    if (isValid)  return 'border-green-400 focus:border-green-500 bg-green-50/30';
    return 'border-destructive focus:border-destructive bg-destructive/5';
  };

  const getIconColor = (touched, isValid) => {
    if (!touched) return 'text-muted-foreground';
    if (isValid)  return 'text-green-500';
    return 'text-destructive';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailTouched(true);
    setPasswordTouched(true);

    const trimmedEmail    = email.toLowerCase().trim();
    const matchedAccount  = PRIVILEGED_ACCOUNTS.find(
      a => a.email === trimmedEmail
    );

    // Gate: only allow the two privileged accounts
    if (!matchedAccount) {
      setError(
        'Access denied. This portal is restricted to privileged accounts only.'
      );
      return;
    }

    setLoading(true);
    try {
      await login(trimmedEmail, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 70% 50% at 50% -10%, oklch(0.6 0.21 278 / 0.2), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 10%, oklch(0.51 0.23 277 / 0.12), transparent 60%)',
        backgroundColor: 'var(--background)',
      }}
    >
      <div className="max-w-md w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <AdminLogo />
          <h1 className="text-2xl font-bold text-foreground mt-6 mb-1">Privileged Access</h1>
          <p className="text-sm text-muted-foreground">
            Restricted to Project Managers &amp; Editing Heads only
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-card/80 backdrop-blur border border-border rounded-2xl p-8"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          {/* Warning banner */}
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <ShieldCheck className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-xs font-semibold text-red-700">
              This login is for privileged roles only. Unauthorized access is prohibited.
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-xl mb-5 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${getIconColor(emailTouched, isEmailValid && isPrivilegedEmail)}`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailTouched(true); }}
                  onBlur={() => setEmailTouched(true)}
                  className={`w-full rounded-xl pl-10 pr-10 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none transition-all border-2 ${getInputBorderClass(emailTouched, isEmailValid && isPrivilegedEmail)}`}
                  placeholder="Enter your privileged email"
                />
                {emailTouched && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isEmailValid && isPrivilegedEmail
                      ? <CheckCircle className="w-5 h-5 text-green-500" />
                      : <XCircle    className="w-5 h-5 text-destructive" />}
                  </div>
                )}
              </div>
              {emailTouched && isEmailValid && !isPrivilegedEmail && (
                <p className="text-destructive text-xs mt-1">This email is not a privileged account.</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${getIconColor(passwordTouched, isPasswordValid)}`} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordTouched(true); }}
                  onBlur={() => setPasswordTouched(true)}
                  className={`w-full rounded-xl pl-10 pr-10 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none transition-all border-2 ${getInputBorderClass(passwordTouched, isPasswordValid)}`}
                  placeholder="••••••••"
                />
                {passwordTouched && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isPasswordValid
                      ? <CheckCircle className="w-5 h-5 text-green-500" />
                      : <XCircle    className="w-5 h-5 text-destructive" />}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-primary-foreground font-bold py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? 'Authenticating…' : 'Access Dashboard'}
            </button>
          </form>

          {/* Test accounts */}
          <div className="mt-7 pt-6 border-t border-border">
            <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              Privileged Test Accounts
            </p>
            <div className="space-y-2">
              {PRIVILEGED_ACCOUNTS.map(({ email: e, label }) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => { setEmail(e); setEmailTouched(false); setPasswordTouched(false); setError(''); }}
                  className="w-full flex items-center justify-between bg-secondary/50 hover:bg-secondary rounded-xl px-3 py-2.5 transition-colors text-left group"
                >
                  <div>
                    <p className="text-xs font-bold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{e}</p>
                  </div>
                  <span className="text-xs font-semibold text-primary group-hover:text-accent transition-colors">Fill Email</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Click an account to auto-fill credentials
            </p>
          </div>

          {/* Back to regular login */}
          <div className="mt-5 text-center">
            <p className="text-xs text-muted-foreground">
              Regular team member?{' '}
              <Link to="/login" className="text-primary hover:text-accent font-semibold transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
