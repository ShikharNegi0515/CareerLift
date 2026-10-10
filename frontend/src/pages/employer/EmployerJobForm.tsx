import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import api from '../../api/client';

const JOB_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'];
const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];
const EXP_LEVELS = ['Entry', 'Mid', 'Senior', 'Executive'];
const CATEGORIES = ['Technology', 'Design', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Engineering', 'Legal'];

const EMPTY_FORM = {
  title: '',
  company: '',
  description: '',
  responsibilities: '',
  requirements: '',
  benefits: '',
  location: '',
  type: '',
  mode: '',
  experience: '',
  salaryMin: '',
  salaryMax: '',
  category: '',
  isFeatured: false,
  skills: [] as string[],
};

export default function EmployerJobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(EMPTY_FORM);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Load existing job data when editing
  useEffect(() => {
    if (!isEdit) return;
    api.get(`/jobs/${id}`)
      .then(res => {
        const j = res.data;
        setForm({
          title: j.title || '',
          company: j.company || '',
          description: j.description || '',
          responsibilities: j.responsibilities || '',
          requirements: j.requirements || '',
          benefits: j.benefits || '',
          location: j.location || '',
          type: j.type || '',
          mode: j.mode || '',
          experience: j.experience || '',
          salaryMin: j.salaryMin ? String(j.salaryMin) : '',
          salaryMax: j.salaryMax ? String(j.salaryMax) : '',
          category: j.category || '',
          isFeatured: j.isFeatured || false,
          skills: j.skills || [],
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load job details.');
        setLoading(false);
      });
  }, [id, isEdit]);

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));
  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !form.skills.includes(s)) {
      set('skills', [...form.skills, s]);
      setNewSkill('');
    }
  };
  const removeSkill = (s: string) => set('skills', form.skills.filter(sk => sk !== s));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      salaryMin: form.salaryMin ? parseInt(form.salaryMin, 10) : 0,
      salaryMax: form.salaryMax ? parseInt(form.salaryMax, 10) : 0,
    };

    try {
      if (isEdit) {
        await api.put(`/jobs/${id}`, payload);
      } else {
        await api.post('/jobs', payload);
      }
      setSaved(true);
      setTimeout(() => navigate('/employer/jobs'), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10, color: '#6c757d' }}>
        <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} /> Loading job details...
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <Link to="/employer/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#6c757d', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Jobs
          </Link>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529' }}>
            {isEdit ? 'Edit Job Posting' : 'Post a New Job'}
          </h1>
        </div>
      </div>

      {/* Success / Error banners */}
      {saved && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#d1e7dd', color: '#0a3622', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontWeight: 600 }}>
          <CheckCircle size={18} /> Job {isEdit ? 'updated' : 'created'} successfully! Redirecting…
        </div>
      )}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8d7da', color: '#842029', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
          {/* ── Main form ── */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 className="card-title">Basic Information</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input className="form-control" required placeholder="e.g. Senior React Developer" value={form.title} onChange={e => set('title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input className="form-control" required placeholder="e.g. TechCorp" value={form.company} onChange={e => set('company', e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Job Type *</label>
                  <select className="form-control" required value={form.type} onChange={e => set('type', e.target.value)}>
                    <option value="">Select type</option>
                    {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Work Mode *</label>
                  <select className="form-control" required value={form.mode} onChange={e => set('mode', e.target.value)}>
                    <option value="">Select mode</option>
                    {WORK_MODES.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Experience Level *</label>
                  <select className="form-control" required value={form.experience} onChange={e => set('experience', e.target.value)}>
                    <option value="">Select level</option>
                    {EXP_LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input className="form-control" required placeholder="e.g. San Francisco, CA or Remote" value={form.location} onChange={e => set('location', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-control" required value={form.category} onChange={e => set('category', e.target.value)}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 className="card-title">Job Description</h3>
              <div className="form-group">
                <label className="form-label">Overview *</label>
                <textarea className="form-control" rows={5} required placeholder="Describe the role and what the candidate will do..." value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Key Responsibilities</label>
                <textarea className="form-control" rows={5} placeholder="List main responsibilities (one per line)..." value={form.responsibilities} onChange={e => set('responsibilities', e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Requirements</label>
                <textarea className="form-control" rows={5} placeholder="List requirements and qualifications..." value={form.requirements} onChange={e => set('requirements', e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Benefits & Perks</label>
                <textarea className="form-control" rows={4} placeholder="List benefits offered..." value={form.benefits} onChange={e => set('benefits', e.target.value)} style={{ resize: 'vertical' }} />
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Required Skills</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {form.skills.map(skill => (
                  <span key={skill} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#e8f0fe', color: '#0d6efd', padding: '4px 10px', borderRadius: 9999, fontSize: '0.875rem' }}>
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0d6efd', padding: 0, display: 'flex' }}><X size={12} /></button>
                  </span>
                ))}
                {form.skills.length === 0 && <p style={{ fontSize: '0.875rem', color: '#adb5bd' }}>No skills added yet.</p>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input className="form-control" placeholder="Add required skill (press Enter)..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                <button type="button" onClick={addSkill} className="btn btn-outline btn-sm"><Plus size={15} /></button>
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 className="card-title">Salary Range</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Min (USD)</label>
                  <input className="form-control" type="number" min={0} placeholder="80000" value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Max (USD)</label>
                  <input className="form-control" type="number" min={0} placeholder="120000" value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)} />
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#6c757d' }}>Leave blank to hide salary.</p>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 className="card-title">Visibility</h3>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '0.5rem', borderRadius: 6, border: `2px solid ${form.isFeatured ? '#0d6efd' : '#e9ecef'}`, background: form.isFeatured ? '#e8f0fe' : '#fff', transition: 'all 0.15s' }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} style={{ accentColor: '#0d6efd', width: 16, height: 16 }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: form.isFeatured ? '#0d6efd' : '#212529' }}>Featured Job</p>
                    <p style={{ fontSize: '0.75rem', color: '#6c757d' }}>Highlighted at the top of listings</p>
                  </div>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving || saved} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {saving
                  ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
                  : saved
                    ? <><CheckCircle size={15} /> Saved!</>
                    : <><Save size={15} /> {isEdit ? 'Update Job' : 'Publish Job'}</>
                }
              </button>
              <Link to="/employer/jobs" className="btn btn-light" style={{ textAlign: 'center' }}>Cancel</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
