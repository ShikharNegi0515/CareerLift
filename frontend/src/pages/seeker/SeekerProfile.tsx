import { useState, useEffect } from 'react';
import { useAuth } from '@/store/auth';
import { User, Plus, Trash2, Save, X, MapPin, Phone, Globe, CheckCircle, Link2, Loader2, AlertCircle } from 'lucide-react';
import api from '@/api/client';

const JOB_TYPE_MAP: Record<string, string> = {
  'Full Time': 'full_time',
  'Part Time': 'part_time',
  'Contract': 'freelance',
  'Internship': 'internship',
};
const JOB_TYPE_REVERSE: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  freelance: 'Contract',
  internship: 'Internship',
};
const WORK_MODE_MAP: Record<string, string> = {
  Remote: 'remote',
  Hybrid: 'hybrid',
  'On-site': 'on_site',
};
const WORK_MODE_REVERSE: Record<string, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  on_site: 'On-site',
};

const defaultForm = {
  headline: '',
  bio: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  github: '',
  skills: [] as string[],
  preferredTypes: [] as string[],
  preferredModes: [] as string[],
};

export default function SeekerProfile() {
  const { user } = useAuth();

  const [form, setForm] = useState(defaultForm);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile completeness
  const completenessItems = [
    { label: 'Professional headline', done: !!form.headline },
    { label: 'Bio filled', done: !!form.bio },
    { label: '3+ skills added', done: form.skills.length >= 3 },
    { label: 'Location set', done: !!form.location },
    { label: 'LinkedIn URL added', done: !!form.linkedin },
  ];
  const completenessScore = Math.round((completenessItems.filter(i => i.done).length / completenessItems.length) * 100);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        const profile = res.data.profile;
        if (profile) {
          setForm({
            headline: profile.headline || '',
            bio: profile.bio || '',
            phone: profile.phone || '',
            location: profile.location || '',
            website: profile.website || '',
            linkedin: profile.linkedinUrl || '',
            github: profile.githubUrl || '',
            skills: Array.isArray(profile.skills) ? profile.skills : [],
            preferredTypes: Array.isArray(profile.preferredJobTypes)
              ? profile.preferredJobTypes.map((t: string) => JOB_TYPE_REVERSE[t] || t)
              : [],
            preferredModes: Array.isArray(profile.preferredWorkModes)
              ? profile.preferredWorkModes.map((m: string) => WORK_MODE_REVERSE[m] || m)
              : [],
          });
        }
      } catch (err) {
        console.error('Failed to load profile', err);
        setError('Could not load your profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedOk(false);
    setError(null);

    try {
      await api.put('/users/profile', {
        headline: form.headline,
        bio: form.bio,
        phone: form.phone,
        location: form.location,
        website: form.website,
        linkedinUrl: form.linkedin,
        githubUrl: form.github,
        skills: form.skills,
        preferredJobTypes: form.preferredTypes.map(t => JOB_TYPE_MAP[t] || t),
        preferredWorkModes: form.preferredModes.map(m => WORK_MODE_MAP[m] || m),
      });
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm({ ...form, skills: [...form.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) =>
    setForm({ ...form, skills: form.skills.filter(s => s !== skill) });

  const toggleType = (t: string) =>
    setForm({
      ...form,
      preferredTypes: form.preferredTypes.includes(t)
        ? form.preferredTypes.filter(x => x !== t)
        : [...form.preferredTypes, t],
    });

  const toggleMode = (m: string) =>
    setForm({
      ...form,
      preferredModes: form.preferredModes.includes(m)
        ? form.preferredModes.filter(x => x !== m)
        : [...form.preferredModes, m],
    });

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
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529' }}>My Profile</h1>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Keep your profile up to date to attract the best opportunities.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          {saving ? (
            <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
          ) : savedOk ? (
            <><CheckCircle size={16} /> Saved!</>
          ) : (
            <><Save size={16} /> Save Changes</>
          )}
        </button>
      </div>

      {error && (
        <div style={{ background: '#f8d7da', color: '#842029', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          {/* Basic info */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">Basic Information</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#0d6efd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.5rem', flexShrink: 0 }}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#212529' }}>
                  {user?.firstName} {user?.lastName}
                </p>
                <p style={{ color: '#6c757d', fontSize: '0.875rem' }}>{user?.email}</p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><User size={13} style={{ marginRight: 4 }} />Professional Headline</label>
              <input className="form-control" value={form.headline} onChange={e => setForm({ ...form, headline: e.target.value })} placeholder="e.g. Senior React Developer" />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-control" rows={4} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} style={{ resize: 'vertical' }} placeholder="Tell employers a bit about yourself..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label"><Phone size={13} style={{ marginRight: 4 }} />Phone</label>
                <input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
              </div>
              <div className="form-group">
                <label className="form-label"><MapPin size={13} style={{ marginRight: 4 }} />Location</label>
                <input className="form-control" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="City, Country" />
              </div>
              <div className="form-group">
                <label className="form-label"><Globe size={13} style={{ marginRight: 4 }} />Website</label>
                <input className="form-control" type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://yoursite.com" />
              </div>
              <div className="form-group">
                <label className="form-label"><Link2 size={13} style={{ marginRight: 4 }} />LinkedIn</label>
                <input className="form-control" type="url" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/you" />
              </div>
              <div className="form-group">
                <label className="form-label"><Link2 size={13} style={{ marginRight: 4 }} />GitHub</label>
                <input className="form-control" type="url" value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/you" />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">Skills</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {form.skills.length === 0 && (
                <p style={{ color: '#adb5bd', fontSize: '0.875rem' }}>No skills added yet. Add your first skill below.</p>
              )}
              {form.skills.map(skill => (
                <span key={skill} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#e8f0fe', color: '#0d6efd', padding: '4px 10px', borderRadius: 9999, fontSize: '0.875rem', fontWeight: 500 }}>
                  {skill}
                  <button onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0d6efd', display: 'flex', padding: 0 }}><X size={12} /></button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input className="form-control" placeholder="Add a skill (e.g. React, Python)..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
              <button onClick={addSkill} className="btn btn-outline btn-sm"><Plus size={16} /> Add</button>
            </div>
          </div>

          {/* Job Preferences */}
          <div className="card">
            <h3 className="card-title">Job Preferences</h3>
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Preferred Job Types</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Full Time', 'Part Time', 'Contract', 'Internship'].map(t => (
                  <button key={t} onClick={() => toggleType(t)} style={{ padding: '0.375rem 0.875rem', borderRadius: 9999, border: '2px solid', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500, borderColor: form.preferredTypes.includes(t) ? '#0d6efd' : '#dee2e6', background: form.preferredTypes.includes(t) ? '#e8f0fe' : '#fff', color: form.preferredTypes.includes(t) ? '#0d6efd' : '#6c757d' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="form-label">Preferred Work Mode</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Remote', 'Hybrid', 'On-site'].map(m => (
                  <button key={m} onClick={() => toggleMode(m)} style={{ padding: '0.375rem 0.875rem', borderRadius: 9999, border: '2px solid', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500, borderColor: form.preferredModes.includes(m) ? '#0d6efd' : '#dee2e6', background: form.preferredModes.includes(m) ? '#e8f0fe' : '#fff', color: form.preferredModes.includes(m) ? '#0d6efd' : '#6c757d' }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">Profile Completeness</h3>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '2.5rem', color: completenessScore >= 80 ? '#198754' : completenessScore >= 50 ? '#0d6efd' : '#dc3545' }}>
                {completenessScore}%
              </span>
            </div>
            <div style={{ background: '#e9ecef', borderRadius: 4, height: 8, marginBottom: '1rem' }}>
              <div style={{ width: `${completenessScore}%`, height: '100%', background: completenessScore >= 80 ? '#198754' : completenessScore >= 50 ? '#0d6efd' : '#dc3545', borderRadius: 4, transition: 'width 0.4s ease' }} />
            </div>
            {completenessItems.map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem', fontSize: '0.875rem', color: item.done ? '#198754' : '#6c757d' }}>
                <CheckCircle size={14} style={{ color: item.done ? '#198754' : '#dee2e6', flexShrink: 0 }} />
                {item.label}
              </div>
            ))}
          </div>

          <div className="card" style={{ background: '#212529', border: 'none' }}>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#fff', marginBottom: '0.5rem', fontSize: '1rem' }}>Pro Tip</h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8125rem', lineHeight: 1.6 }}>
              Profiles with detailed bios and 5+ skills receive <strong style={{ color: '#93c5fd' }}>3x more employer views</strong>. Fill yours in today!
            </p>
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
              💡 Don't forget to upload a resume too.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
