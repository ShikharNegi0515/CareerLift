import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Briefcase, Mail, Lock, Eye, EyeOff, User, AlertCircle, Loader2, Briefcase as BriefcaseIcon, Search } from 'lucide-react';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole.JOB_SEEKER | UserRole.EMPLOYER>(UserRole.JOB_SEEKER);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({ email, password, firstName, lastName, role });
      navigate(role === UserRole.EMPLOYER ? '/employer' : '/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f0fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <Briefcase size={28} style={{ color: '#0d6efd' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.625rem', color: '#0d6efd' }}>CareerLift</span>
          </Link>
        </div>

        <div className="card" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.375rem', textAlign: 'center' }}>
            Create Your Account
          </h2>
          <p style={{ color: '#6c757d', textAlign: 'center', marginBottom: '1.75rem', fontSize: '0.9375rem' }}>
            Join 2.5M+ professionals on CareerLift
          </p>

          {/* Role selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.75rem' }}>
            {[
              { value: UserRole.JOB_SEEKER, label: 'Job Seeker', desc: 'Find jobs & advance your career', icon: Search },
              { value: UserRole.EMPLOYER, label: 'Employer', desc: 'Post jobs & hire talent', icon: BriefcaseIcon },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value as any)}
                style={{
                  padding: '1rem',
                  border: `2px solid ${role === opt.value ? '#0d6efd' : '#e9ecef'}`,
                  borderRadius: 8,
                  background: role === opt.value ? '#e8f0fe' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <opt.icon size={22} style={{ color: role === opt.value ? '#0d6efd' : '#6c757d', marginBottom: 6 }} />
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: role === opt.value ? '#0d6efd' : '#212529', marginBottom: 2 }}>{opt.label}</p>
                <p style={{ fontSize: '0.75rem', color: '#6c757d' }}>{opt.desc}</p>
              </button>
            ))}
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#f8d7da', border: '1px solid #f5c2c7', borderRadius: 6, padding: '0.75rem', marginBottom: '1.25rem' }}>
              <AlertCircle size={16} style={{ color: '#842029', flexShrink: 0, marginTop: 1 }} />
              <span style={{ color: '#842029', fontSize: '0.875rem' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                  <input className="form-control" style={{ paddingLeft: 34 }} placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                  <input className="form-control" style={{ paddingLeft: 34 }} placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input type="email" className="form-control" style={{ paddingLeft: 34 }} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input type={showPassword ? 'text' : 'password'} className="form-control" style={{ paddingLeft: 34, paddingRight: 36 }} placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#adb5bd' }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input type={showPassword ? 'text' : 'password'} className={`form-control ${confirmPassword && password !== confirmPassword ? 'error' : ''}`} style={{ paddingLeft: 34 }} placeholder="Repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="form-error">Passwords do not match</p>
              )}
            </div>

            <button
              id="register-submit"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e9ecef' }}>
            <p style={{ color: '#6c757d', fontSize: '0.9375rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#0d6efd', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#adb5bd', fontSize: '0.8125rem', marginTop: '1.5rem' }}>
          By creating an account, you agree to our{' '}
          <Link to="/about" style={{ color: '#6c757d' }}>Terms of Service</Link> and{' '}
          <Link to="/about" style={{ color: '#6c757d' }}>Privacy Policy</Link>
        </p>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
