import { useState } from 'react';
import { Save, Building2, MapPin, Globe, Linkedin, Twitter, Users, CheckCircle, Camera } from 'lucide-react';

export default function EmployerCompanyProfile() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    companyName: 'TechCorp',
    tagline: 'Building the future of digital experiences.',
    description: 'TechCorp is a leading technology company specializing in innovative software solutions. We believe in creating products that empower businesses to thrive in the digital age. Our team is passionate, diverse, and driven by excellence.',
    industry: 'Technology',
    companySize: '50-200 employees',
    foundedYear: '2015',
    website: 'https://techcorp.example.com',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/company/techcorp',
    twitter: 'https://twitter.com/techcorp',
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529' }}>Company Profile</h1>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>This is how your company appears to job seekers.</p>
        </div>
        <button onClick={handleSave} className="btn btn-primary">
          {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Profile</>}
        </button>
      </div>

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
                  <label className="form-label">Company Name *</label>
                  <input className="form-control" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tagline</label>
                  <input className="form-control" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Short, catchy description" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">About the Company *</label>
              <textarea className="form-control" rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} required />
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Company Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <select className="form-control" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
                  <option>Technology</option>
                  <option>Healthcare</option>
                  <option>Finance</option>
                  <option>Education</option>
                  <option>E-commerce</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Company Size</label>
                <select className="form-control" value={form.companySize} onChange={(e) => setForm({ ...form, companySize: e.target.value })}>
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
                  <option>50-200 employees</option>
                  <option>201-500 employees</option>
                  <option>500+ employees</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Founded Year</label>
                <input className="form-control" type="number" value={form.foundedYear} onChange={(e) => setForm({ ...form, foundedYear: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label"><MapPin size={13} style={{ marginRight: 4 }} />Headquarters</label>
                <input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">Links & Social</h3>
            <div className="form-group">
              <label className="form-label"><Globe size={13} style={{ marginRight: 4 }} />Website</label>
              <input className="form-control" type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label"><Linkedin size={13} style={{ marginRight: 4 }} />LinkedIn Profile</label>
              <input className="form-control" type="url" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label"><Twitter size={13} style={{ marginRight: 4 }} />Twitter Handle</label>
              <input className="form-control" type="url" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} />
            </div>
          </div>

          <div className="card" style={{ background: '#212529', border: 'none', color: '#fff' }}>
             <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#fff', marginBottom: '0.5rem', fontSize: '1rem' }}>Why Complete Your Profile?</h3>
             <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
               <li style={{ marginBottom: '0.5rem' }}>Candidates are 3x more likely to apply to completed company profiles.</li>
               <li style={{ marginBottom: '0.5rem' }}>Builds trust and employer brand.</li>
               <li>Helps our AI match you with candidates seeking your specific company culture.</li>
             </ul>
          </div>
        </div>
      </div>
      <style>{`
        .hover-overlay:hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
