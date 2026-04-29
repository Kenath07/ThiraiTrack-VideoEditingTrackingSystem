import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, User, Mail, Lock, Phone, Briefcase, Award, FileText, ArrowLeft } from 'lucide-react';

/* ── Shared Logo ── */
// Registration page UI component
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

/* Shared input class */
const inputCls =
  'w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Video Editing Intern',
    phone: '',
    experienceLevel: 'Beginner',
    primarySkill: 'Video Editing',
    bio: '',
    // Role-specific fields
    department: '',
    yearsOfExperience: '',
    managedProjectsCount: '',
    specialization: '',
    teamSizeManaged: '',
  });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const trimmed = {
      fullName:        formData.fullName.trim(),
      email:           formData.email.trim(),
      password:        formData.password,
      confirmPassword: formData.confirmPassword,
      role:            formData.role,
      phone:           formData.phone.trim(),
      experienceLevel: formData.experienceLevel,
      primarySkill:    formData.primarySkill,
      bio:             formData.bio.trim(),
      // Role-specific fields
      department:           formData.department.trim(),
      yearsOfExperience:    formData.yearsOfExperience.trim(),
      managedProjectsCount: formData.managedProjectsCount.trim(),
      specialization:       formData.specialization.trim(),
      teamSizeManaged:      formData.teamSizeManaged.trim(),
    };

    if (!trimmed.fullName)        { setError('Full Name is required');            setLoading(false); return; }
    if (!trimmed.email)           { setError('Email is required');                setLoading(false); return; }
    if (!trimmed.password)        { setError('Password is required');             setLoading(false); return; }
    if (!trimmed.confirmPassword) { setError('Confirm Password is required');     setLoading(false); return; }
    if (trimmed.password !== trimmed.confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
    if (trimmed.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
    if (!trimmed.phone)           { setError('Phone Number is required');         setLoading(false); return; }
    if (!trimmed.bio)             { setError('Short Bio is required');            setLoading(false); return; }

    // Role-specific validation
    if (trimmed.role === 'Project Manager') {
      if (!trimmed.department) { setError('Department/Team Name is required for Project Manager'); setLoading(false); return; }
      if (!trimmed.yearsOfExperience) { setError('Years of Experience is required for Project Manager'); setLoading(false); return; }
      if (!trimmed.managedProjectsCount) { setError('Managed Projects Count is required for Project Manager'); setLoading(false); return; }
    }
    if (trimmed.role === 'Video Editing Head') {
      if (!trimmed.specialization) { setError('Specialization is required for Video Editing Head'); setLoading(false); return; }
      if (!trimmed.yearsOfExperience) { setError('Years of Experience is required for Video Editing Head'); setLoading(false); return; }
      if (!trimmed.teamSizeManaged) { setError('Team Size Managed is required for Video Editing Head'); setLoading(false); return; }
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trimmed),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Server error. Please try again.');
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
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Register as a team member</p>
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
          {success && (
            <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name <span className="text-destructive">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="John Doe" className={inputCls} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email <span className="text-destructive">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className={inputCls} />
              </div>
            </div>

            {/* Password row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password <span className="text-destructive">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" placeholder="••••••••" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password <span className="text-destructive">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength="6" placeholder="••••••••" className={inputCls} />
                </div>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Role <span className="text-destructive">*</span></label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select name="role" value={formData.role} onChange={handleChange} required className={`${inputCls} appearance-none cursor-pointer`}>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Video Editing Head">Video Editing Head</option>
                  <option value="Full-Time Video Editor">Full-Time Video Editor</option>
                  <option value="Video Editing Intern">Video Editing Intern</option>
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone Number <span className="text-destructive">*</span></label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="0771234567" className={inputCls} />
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Experience Level <span className="text-destructive">*</span></label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} required className={`${inputCls} appearance-none cursor-pointer`}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>
            </div>

            {/* Primary Skill */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Primary Skill <span className="text-destructive">*</span></label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select name="primarySkill" value={formData.primarySkill} onChange={handleChange} required className={`${inputCls} appearance-none cursor-pointer`}>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Color Grading">Color Grading</option>
                  <option value="Motion Graphics">Motion Graphics</option>
                  <option value="Sound Editing">Sound Editing</option>
                  <option value="Thumbnail Design">Thumbnail Design</option>
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Short Bio (if you have portfolio add that) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Tell us about yourself…"
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            {/* Role-Specific Fields */}
            {formData.role === 'Project Manager' && (
              <>
                <div className="border-t border-border pt-5 mt-2">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Project Manager Details</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Department / Team Name *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="text" name="department" value={formData.department} onChange={handleChange} required placeholder="e.g., Creative Production Team" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Years of Experience *</label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} required placeholder="e.g., 5" min="0" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Managed Projects Count *</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="number" name="managedProjectsCount" value={formData.managedProjectsCount} onChange={handleChange} required placeholder="e.g., 25" min="0" className={inputCls} />
                  </div>
                </div>
              </>
            )}

            {formData.role === 'Video Editing Head' && (
              <>
                <div className="border-t border-border pt-5 mt-2">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Video Editing Head Details</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Specialization *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <select name="specialization" value={formData.specialization} onChange={handleChange} required className={`${inputCls} appearance-none cursor-pointer`}>
                      <option value="">Select Specialization</option>
                      <option value="Video Editing">Video Editing</option>
                      <option value="Color Grading">Color Grading</option>
                      <option value="Motion Graphics">Motion Graphics</option>
                      <option value="Sound Design">Sound Design</option>
                      <option value="All-Around">All-Around</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Years of Experience *</label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} required placeholder="e.g., 8" min="0" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Team Size Managed *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="number" name="teamSizeManaged" value={formData.teamSizeManaged} onChange={handleChange} required placeholder="e.g., 10" min="1" className={inputCls} />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-primary-foreground font-semibold py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-button)' }}
            >
              {loading ? 'Creating Account…' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-accent font-semibold transition-colors">
                Login
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

export default Register;
