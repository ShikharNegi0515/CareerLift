import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, Lock, Eye, EyeOff, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import api from '@/api/client';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!token) { setError('Invalid or missing reset token. Please request a new link.'); return; }
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Reset link is invalid or has expired. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'];
  const strengthColor = ['', '#dc3545', '#ffc107', '#198754'];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f0fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <Briefcase size={28} style={{ color: '#0d6efd' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.625rem', color: '#0d6efd' }}>CareerLift</span>
          </Link>
        </div>

        <div className="card" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}>
          {!success ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Lock size={24} style={{ color: '#0d6efd' }} />
                </div>
                <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.375rem' }}>Reset Password</h2>
                <p style={{ color: '#6c757d', fontSize: '0.9375rem' }}>Enter your new password below.</p>
              </div>

              {error && (
                <div style={{ display: 'flex', gap: 8, background: '#f8d7da', border: '1px solid #f5c2c7', borderRadius: 6, padding: '0.75rem', marginBottom: '1.25rem' }}>
                  <AlertCircle size={16} style={{ color: '#842029', flexShrink: 0 }} />
                  <span style={{ color: '#842029', fontSize: '0.875rem' }}>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                    <input type={showPassword ? 'text' : 'password'} className="form-control" style={{ paddingLeft: 34, paddingRight: 36 }} placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#adb5bd' }}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {password && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                        {[1, 2, 3].map((i) => (
                          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColor[strength] : '#e9ecef', transition: 'background 0.2s' }} />
                        ))}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: strengthColor[strength] }}>{strengthLabel[strength]}</p>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                    <input type={showPassword ? 'text' : 'password'} className={`form-control ${confirmPassword && password !== confirmPassword ? 'error' : ''}`} style={{ paddingLeft: 34 }} placeholder="Repeat new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
                  </div>
                  {confirmPassword && password !== confirmPassword && <p className="form-error">Passwords don't match</p>}
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '0.75rem' }}>
                  {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Resetting...</> : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <CheckCircle size={56} style={{ color: '#198754', margin: '0 auto 1rem' }} />
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.375rem', color: '#212529', marginBottom: '0.5rem' }}>Password Reset!</h2>
              <p style={{ color: '#6c757d', lineHeight: 1.6 }}>Your password has been successfully reset. Redirecting to login...</p>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
