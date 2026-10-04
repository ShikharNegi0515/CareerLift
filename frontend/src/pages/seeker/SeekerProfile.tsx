import { useState } from 'react';
import { useAuth } from '@/store/auth';
import { User, Plus, Trash2, Edit3, Save, X, MapPin, Phone, Globe, CheckCircle } from 'lucide-react';

export default function SeekerProfile() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    headline: 'Senior Frontend Developer | React & TypeScript Specialist',
    bio: 'Passionate frontend developer with 6+ years of experience building scalable web applications. I love crafting beautiful UIs and collaborating with cross-functional teams.',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Node.js', 'Tailwind CSS'],
    preferredTypes: ['Full Time', 'Contract'],
    preferredModes: ['Remote', 'Hybrid'],
  });
  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const addSkill = () => { if (newSkill.trim() && !form.skills.includes(newSkill.trim())) { setForm({ ...form, skills: [...form.skills, newSkill.trim()] }); setNewSkill(''); } };
  const removeSkill = (skill: string) => setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  const toggleType = (t: string) => setForm({ ...form, preferredTypes: form.preferredTypes.includes(t) ? form.preferredTypes.filter((x) => x !== t) : [...form.preferredTypes, t] });
  const toggleMode = (m: string) => setForm({ ...form, preferredModes: form.preferredModes.includes(m) ? form.preferredModes.filter((x) => x !== m) : [...form.preferredModes, m] });

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529' }}>My Profile</h1>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Keep your profile up to date to attract the best opportunities.</p>
        </div>
        <button onClick={handleSave} className="btn btn-primary">
          {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
        </button>
      </div>

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
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#212529' }}>{user?.firstName} {user?.lastName}</p>
                <p style={{ color: '#6c757d', fontSize: '0.875rem' }}>{user?.email}</p>
                <button className="btn btn-light btn-sm" style={{ marginTop: '0.5rem' }}>Change Photo</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Headline</label>
              <input className="form-control" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="e.g. Senior React Developer" />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-control" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label"><Phone size={13} style={{ marginRight: 4 }} />Phone</label>
                <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label"><MapPin size={13} style={{ marginRight: 4 }} />Location</label>
                <input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label"><Globe size={13} style={{ marginRight: 4 }} />Website</label>
                <input className="form-control" type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label"><Linkedin size={13} style={{ marginRight: 4 }} />LinkedIn</label>
                <input className="form-control" type="url" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">Skills</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {form.skills.map((skill) => (
                <span key={skill} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#e8f0fe', color: '#0d6efd', padding: '4px 10px', borderRadius: 9999, fontSize: '0.875rem', fontWeight: 500 }}>
                  {skill}
                  <button onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0d6efd', display: 'flex', padding: 0 }}><X size={12} /></button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input className="form-control" placeholder="Add a skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
              <button onClick={addSkill} className="btn btn-outline btn-sm"><Plus size={16} /> Add</button>
            </div>
          </div>

          {/* Job Preferences */}
          <div className="card">
            <h3 className="card-title">Job Preferences</h3>
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Preferred Job Types</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Full Time', 'Part Time', 'Contract', 'Internship'].map((t) => (
                  <button key={t} onClick={() => toggleType(t)} style={{ padding: '0.375rem 0.875rem', borderRadius: 9999, border: '2px solid', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500, borderColor: form.preferredTypes.includes(t) ? '#0d6efd' : '#dee2e6', background: form.preferredTypes.includes(t) ? '#e8f0fe' : '#fff', color: form.preferredTypes.includes(t) ? '#0d6efd' : '#6c757d' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="form-label">Preferred Work Mode</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Remote', 'Hybrid', 'On-site'].map((m) => (
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
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '2.5rem', color: '#0d6efd' }}>78%</span>
            </div>
            <div style={{ background: '#e9ecef', borderRadius: 4, height: 8, marginBottom: '1rem' }}>
              <div style={{ width: '78%', height: '100%', background: '#0d6efd', borderRadius: 4 }} />
            </div>
            {[
              { label: 'Basic info', done: true },
              { label: 'Profile photo', done: false },
              { label: 'Resume uploaded', done: false },
              { label: '5+ skills added', done: true },
              { label: 'Work experience', done: false },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem', fontSize: '0.875rem', color: item.done ? '#198754' : '#6c757d' }}>
                <CheckCircle size={14} style={{ color: item.done ? '#198754' : '#dee2e6', flexShrink: 0 }} />
                {item.label}
              </div>
            ))}
          </div>

          <div className="card" style={{ background: '#212529', border: 'none' }}>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#fff', marginBottom: '0.5rem', fontSize: '1rem' }}>Pro Tip</h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8125rem', lineHeight: 1.6 }}>
              Profiles with a professional photo receive <strong style={{ color: '#93c5fd' }}>21x more views</strong>. Add yours today!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
