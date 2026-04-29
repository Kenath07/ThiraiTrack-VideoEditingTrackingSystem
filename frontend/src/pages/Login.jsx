import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Play, Mail, Lock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

/* ── Shared Logo (matches LandingPage) ── */
// Login page UI component
function Logo() {
  return (
    <Link to="/" className="inline-flex items-center space-x-2.5 mb-4">
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
    </Link>
  );
}

const Login = () => {
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const [emailTouched, setEmailTouched]     = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const { login }  = useContext(AuthContext);
  const navigate   = useNavigate();

  const isEmailValid    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;

  const getInputBorderClass = (touched, isValid) => {
    if (!touched) return 'border-border focus:border-primary bg-card';
    if (isValid)  return 'border-green-400 focus:border-green-500 bg-green-50';
    return 'border-destructive focus:border-destructive bg-red-50';
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

    if (!isEmailValid || !isPasswordValid) {
      setError('Please enter a valid email and password (min 6 characters)');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 70% 50% at 50% -10%, oklch(0.6 0.21 278 / 0.15), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 10%, oklch(0.51 0.23 277 / 0.08), transparent 60%)',
        backgroundColor: 'var(--background)',
      }}
    >
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {/* Card */}
        <div
          className="bg-card/80 backdrop-blur border border-border rounded-2xl p-8"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${getIconColor(emailTouched, isEmailValid)}`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailTouched(true); }}
                  onBlur={() => setEmailTouched(true)}
                  className={`w-full rounded-lg pl-10 pr-10 py-3 text-foreground placeholder-muted-foreground focus:outline-none transition-all border-2 ${getInputBorderClass(emailTouched, isEmailValid)}`}
                  placeholder="Enter your email address"
                />
                {emailTouched && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isEmailValid
                      ? <CheckCircle className="w-5 h-5 text-green-500" />
                      : <XCircle className="w-5 h-5 text-destructive" />}
                  </div>
                )}
              </div>
              {emailTouched && !isEmailValid && email.length > 0 && (
                <p className="text-destructive text-xs mt-1">Please enter a valid email address</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${getIconColor(passwordTouched, isPasswordValid)}`} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordTouched(true); }}
                  onBlur={() => setPasswordTouched(true)}
                  className={`w-full rounded-lg pl-10 pr-10 py-3 text-foreground placeholder-muted-foreground focus:outline-none transition-all border-2 ${getInputBorderClass(passwordTouched, isPasswordValid)}`}
                  placeholder="Enter your password"
                />
                {passwordTouched && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isPasswordValid
                      ? <CheckCircle className="w-5 h-5 text-green-500" />
                      : <XCircle className="w-5 h-5 text-destructive" />}
                  </div>
                )}
              </div>
              {passwordTouched && !isPasswordValid && password.length > 0 && (
                <p className="text-destructive text-xs mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-primary-foreground font-semibold py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
            >
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-accent font-semibold transition-colors">
                Register
              </Link>
            </p>
          </div>

          {/* Back Button */}
          <div className="mt-4 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
