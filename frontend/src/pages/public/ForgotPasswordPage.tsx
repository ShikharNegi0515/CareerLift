import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, ArrowLeft, Send, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import api from '@/api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          {!sent ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Mail size={24} style={{ color: '#0d6efd' }} />
                </div>
                <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.375rem' }}>Forgot Password?</h2>
                <p style={{ color: '#6c757d', fontSize: '0.9375rem' }}>
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div style={{ display: 'flex', gap: 8, background: '#f8d7da', border: '1px solid #f5c2c7', borderRadius: 6, padding: '0.75rem', marginBottom: '1.25rem' }}>
                  <AlertCircle size={16} style={{ color: '#842029', flexShrink: 0 }} />
                  <span style={{ color: '#842029', fontSize: '0.875rem' }}>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                    <input
                      type="email"
                      className="form-control"
                      style={{ paddingLeft: 36 }}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '0.75rem' }}>
                  {loading
                    ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite', display: 'inline' }} /> Sending...</>
                    : <><Send size={16} /> Send Reset Link</>}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#d1e7dd', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle size={32} style={{ color: '#198754' }} />
              </div>
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.375rem', color: '#212529', marginBottom: '0.5rem' }}>Check Your Email</h2>
              <p style={{ color: '#6c757d', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                We sent a password reset link to <strong>{email}</strong>. Check your inbox and click the link to reset your password.
              </p>
              <p style={{ fontSize: '0.875rem', color: '#adb5bd' }}>
                Didn't receive it?{' '}
                <button onClick={() => setSent(false)} style={{ background: 'none', border: 'none', color: '#0d6efd', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>Resend</button>
              </p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e9ecef' }}>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0d6efd', textDecoration: 'none', fontSize: '0.9375rem', fontWeight: 500 }}>
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
