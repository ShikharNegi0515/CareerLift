import { useState, useEffect } from 'react';
import { Save, Building2, MapPin, Globe, CheckCircle, Camera, Loader2, AlertCircle } from 'lucide-react';
import api from '@/api/client';

const defaultForm = {
  companyName: '',
  description: '',
  industry: 'Technology',
  size: '50-200 employees',
  foundedYear: '',
  website: '',
  location: '',
  email: '',
  phone: '',
};

export default function EmployerCompanyProfile() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get('/companies/my-company');
        if (res.data) {
          const c = res.data;
          setForm({
            companyName: c.name || '',
            description: c.description || '',
            industry: c.industry || 'Technology',
            size: c.size || '50-200 employees',
            foundedYear: c.foundedYear ? String(c.foundedYear) : '',
            website: c.website || '',
            location: c.location || '',
            email: c.email || '',
            phone: c.phone || '',
          });
        } else {
          setIsNew(true);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setIsNew(true);
        } else {
          setError('Failed to load company profile.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  const handleSave = async () => {
    if (!form.companyName.trim()) {
      setError('Company name is required.');
      return;
    }

    setSaving(true);
    setSavedOk(false);
    setError(null);

    try {
      const payload: any = {
        name: form.companyName.trim(),
        description: form.description,
        industry: form.industry,
        size: form.size,
        website: form.website,
        location: form.location,
        email: form.email,
        phone: form.phone,
      };
      if (form.foundedYear) {
        payload.foundedYear = parseInt(form.foundedYear, 10);
      }

      await api.put('/companies/my-company', payload);
      setSavedOk(true);
      setIsNew(false);
      setTimeout(() => setSavedOk(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save company profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#0d6efd' }} />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529' }}>Company Profile</h1>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
            {isNew ? 'Create your company profile to start posting jobs.' : 'This is how your company appears to job seekers.'}
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          {saving ? (
            <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
          ) : savedOk ? (
            <><CheckCircle size={16} /> Saved!</>
          ) : (
            <><Save size={16} /> {isNew ? 'Create Profile' : 'Save Profile'}</>
          )}
        </button>
      </div>

      {isNew && (
        <div style={{ background: '#fff3cd', color: '#664d03', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.875rem', border: '1px solid #ffecb5' }}>
          🏢 You haven't set up a company profile yet. Fill in the details below and save to get started.
        </div>
      )}

      {error && (
        <div style={{ background: '#f8d7da', color: '#842029', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">Basic Information</h3>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', width: 100, height: 100, borderRadius: 12, background: '#f8f9fa', border: '2px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
                <div style={{ textAlign: 'center', color: '#adb5bd' }}>
                  <Building2 size={32} style={{ margin: '0 auto 4px' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Logo</span>
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s' }} className="hover-overlay">
                  <Camera size={24} color="#fff" />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Company Name <span style={{ color: '#dc3545' }}>*</span></label>
                  <input className="form-control" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="e.g. Acme Corp" required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">About the Company <span style={{ color: '#dc3545' }}>*</span></label>
              <textarea className="form-control" rows={6} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} placeholder="Tell job seekers about your culture, mission, and what makes you unique..." />
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Company Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <select className="form-control" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })}>
                  <option>Technology</option>
                  <option>Healthcare</option>
                  <option>Finance</option>
                  <option>Education</option>
                  <option>E-commerce</option>
                  <option>Marketing</option>
                  <option>Manufacturing</option>
                  <option>Consulting</option>
                  <option>Real Estate</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Company Size</label>
                <select className="form-control" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })}>
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
                  <option>50-200 employees</option>
                  <option>201-500 employees</option>
                  <option>500+ employees</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Founded Year</label>
                <input className="form-control" type="number" min="1900" max={new Date().getFullYear()} value={form.foundedYear} onChange={e => setForm({ ...form, foundedYear: e.target.value })} placeholder="e.g. 2015" />
              </div>
              <div className="form-group">
                <label className="form-label"><MapPin size={13} style={{ marginRight: 4 }} />Headquarters</label>
                <input className="form-control" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="City, Country" />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jobs@company.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input className="form-control" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">Links &amp; Social</h3>
            <div className="form-group">
              <label className="form-label"><Globe size={13} style={{ marginRight: 4 }} />Company Website</label>
              <input className="form-control" type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://yourcompany.com" />
            </div>
          </div>

          <div className="card" style={{ background: '#212529', border: 'none', color: '#fff' }}>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#fff', marginBottom: '0.5rem', fontSize: '1rem' }}>Why Complete Your Profile?</h3>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>Candidates are <strong style={{ color: '#93c5fd' }}>3x more likely</strong> to apply to completed company profiles.</li>
              <li style={{ marginBottom: '0.5rem' }}>Builds trust and employer brand.</li>
              <li>Helps our AI match you with candidates seeking your company culture.</li>
            </ul>
          </div>
        </div>
      </div>
      <style>{`.hover-overlay:hover { opacity: 1 !important; }`}</style>
    </div>
  );
}
