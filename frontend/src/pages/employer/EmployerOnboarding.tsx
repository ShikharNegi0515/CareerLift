import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Globe, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '@/store/auth';

const INDUSTRIES = ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Other'];
const SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];

export default function EmployerOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    industry: '',
    size: '',
    website: '',
    description: '',
  });

  useEffect(() => {
    // Check if they already have a company
    api.get('/companies/my-company')
      .then(res => {
        if (res.data) {
          // Already onboarded
          navigate('/employer');
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.post('/companies/onboard', form);
      // Redirect to dashboard on success
      navigate('/employer');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to register company. Please try again.');
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#0d6efd' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
      {/* Simple Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e9ecef', padding: '1.25rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: '#0d6efd', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>
            C
          </div>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: '#212529', letterSpacing: '-0.03em' }}>CareerLift</span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card animate-fadeIn" style={{ maxWidth: 600, width: '100%', padding: '2.5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: 64, height: 64, background: '#e8f0fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#0d6efd' }}>
              <Building size={32} />
            </div>
            <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#212529', marginBottom: '0.5rem' }}>
              Welcome, {user?.firstName}!
            </h1>
            <p style={{ color: '#6c757d', fontSize: '0.95rem' }}>
              Before you can post jobs, we need to verify your company details. This helps candidates know who they are applying to.
            </p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8d7da', color: '#842029', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input name="name" className="form-control" required placeholder="e.g. Acme Corp" value={form.name} onChange={handleChange} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Industry *</label>
                <select name="industry" className="form-control" required value={form.industry} onChange={handleChange}>
                  <option value="">Select industry</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Company Size *</label>
                <select name="size" className="form-control" required value={form.size} onChange={handleChange}>
                  <option value="">Select size</option>
                  {SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Website *</label>
              <div style={{ position: 'relative' }}>
                <Globe size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input name="website" type="url" className="form-control" style={{ paddingLeft: 38 }} required placeholder="https://acmecorp.com" value={form.website} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Brief Description</label>
              <textarea name="description" className="form-control" rows={3} placeholder="What does your company do?" value={form.description} onChange={handleChange}></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} disabled={submitting}>
              {submitting ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={18} />}
              {submitting ? 'Registering Company...' : 'Complete Setup'}
            </button>
          </form>

        </div>
      </main>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
