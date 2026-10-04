import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, X, AlertCircle } from 'lucide-react';

const JOB_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'];
const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];
const EXP_LEVELS = ['Entry', 'Mid', 'Senior', 'Executive'];

export default function EmployerJobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const [form, setForm] = useState({
    title: isEdit ? 'Senior React Developer' : '',
    description: isEdit ? 'We are looking for an experienced React developer...' : '',
    responsibilities: isEdit ? '- Lead frontend development\n- Mentor junior devs\n- Collaborate with design' : '',
    requirements: isEdit ? '- 5+ years React experience\n- TypeScript proficiency\n- Strong CS fundamentals' : '',
    benefits: isEdit ? '- Competitive salary\n- Remote work\n- Health insurance' : '',
    location: isEdit ? 'San Francisco, CA' : '',
    jobType: isEdit ? 'Full Time' : '',
    workMode: isEdit ? 'Remote' : '',
    experienceLevel: isEdit ? 'Senior' : '',
    salaryMin: isEdit ? '120000' : '',
    salaryMax: isEdit ? '160000' : '',
    salaryCurrency: 'USD',
    applicationDeadline: isEdit ? '2026-11-30' : '',
    externalUrl: '',
    skills: isEdit ? ['React', 'TypeScript', 'GraphQL', 'Node.js'] : [] as string[],
    status: isEdit ? 'Published' : 'Draft',
  });

  const set = (key: string, val: any) => setForm({ ...form, [key]: val });
  const addSkill = () => { if (newSkill.trim() && !form.skills.includes(newSkill.trim())) { set('skills', [...form.skills, newSkill.trim()]); setNewSkill(''); } };
  const removeSkill = (s: string) => set('skills', form.skills.filter((sk) => sk !== s));

  const handleSubmit = async (e: React.FormEvent, draft = false) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaved(true);
    setSaving(false);
    setTimeout(() => navigate('/employer/jobs'), 1500);
  };

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

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Main form */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 className="card-title">Basic Information</h3>
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input className="form-control" required placeholder="e.g. Senior React Developer" value={form.title} onChange={(e) => set('title', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Job Type *</label>
                  <select className="form-control" required value={form.jobType} onChange={(e) => set('jobType', e.target.value)}>
                    <option value="">Select type</option>
                    {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Work Mode *</label>
                  <select className="form-control" required value={form.workMode} onChange={(e) => set('workMode', e.target.value)}>
                    <option value="">Select mode</option>
                    {WORK_MODES.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Experience Level *</label>
                  <select className="form-control" required value={form.experienceLevel} onChange={(e) => set('experienceLevel', e.target.value)}>
                    <option value="">Select level</option>
                    {EXP_LEVELS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input className="form-control" required placeholder="e.g. San Francisco, CA or Remote" value={form.location} onChange={(e) => set('location', e.target.value)} />
              </div>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 className="card-title">Job Description</h3>
              <div className="form-group">
                <label className="form-label">Overview *</label>
                <textarea className="form-control" rows={5} required placeholder="Describe the role and what the candidate will do..." value={form.description} onChange={(e) => set('description', e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Key Responsibilities</label>
                <textarea className="form-control" rows={5} placeholder="List main responsibilities (one per line)..." value={form.responsibilities} onChange={(e) => set('responsibilities', e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Requirements</label>
                <textarea className="form-control" rows={5} placeholder="List requirements and qualifications..." value={form.requirements} onChange={(e) => set('requirements', e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Benefits & Perks</label>
                <textarea className="form-control" rows={4} placeholder="List benefits offered..." value={form.benefits} onChange={(e) => set('benefits', e.target.value)} style={{ resize: 'vertical' }} />
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Required Skills</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {form.skills.map((skill) => (
                  <span key={skill} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#e8f0fe', color: '#0d6efd', padding: '4px 10px', borderRadius: 9999, fontSize: '0.875rem' }}>
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0d6efd', padding: 0, display: 'flex' }}><X size={12} /></button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input className="form-control" placeholder="Add required skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                <button type="button" onClick={addSkill} className="btn btn-outline btn-sm"><Plus size={15} /></button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 className="card-title">Salary Range</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Min (USD)</label>
                  <input className="form-control" type="number" placeholder="80000" value={form.salaryMin} onChange={(e) => set('salaryMin', e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Max (USD)</label>
                  <input className="form-control" type="number" placeholder="120000" value={form.salaryMax} onChange={(e) => set('salaryMax', e.target.value)} />
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#6c757d' }}>Leave blank to hide salary.</p>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 className="card-title">Application Settings</h3>
              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input className="form-control" type="date" value={form.applicationDeadline} onChange={(e) => set('applicationDeadline', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">External Application URL</label>
                <input className="form-control" type="url" placeholder="https://apply.yourcompany.com/..." value={form.externalUrl} onChange={(e) => set('externalUrl', e.target.value)} />
                <p style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: 4 }}>Leave blank to accept applications on CareerLift.</p>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 className="card-title">Publish Settings</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {['Draft', 'Published'].map((s) => (
                  <button key={s} type="button" onClick={() => set('status', s)} style={{ flex: 1, padding: '0.5rem', border: '2px solid', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', borderColor: form.status === s ? '#0d6efd' : '#e9ecef', background: form.status === s ? '#e8f0fe' : '#fff', color: form.status === s ? '#0d6efd' : '#6c757d' }}>
                    {s}
                  </button>
                ))}
              </div>
              {form.status === 'Published' && (
                <div style={{ display: 'flex', gap: 6, padding: '0.75rem', background: '#d1e7dd', borderRadius: 6, fontSize: '0.8125rem', color: '#0a3622' }}>
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                  Job will be visible to all candidates immediately upon saving.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : saved ? '✓ Saved!' : <><Save size={15} /> {isEdit ? 'Update Job' : 'Publish Job'}</>}
              </button>
              <Link to="/employer/jobs" className="btn btn-light" style={{ textAlign: 'center' }}>Cancel</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
