import { useState } from 'react';
import { useAuth } from '@/store/auth';
import { Settings, Shield, Bell, Save, CheckCircle } from 'lucide-react';

export default function AdminSettings() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>Platform Settings</h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Configure global system settings and administrative preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        <form onSubmit={handleSave}>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title"><Settings size={16} style={{ marginRight: 6 }} />General Configuration</h3>
            <div className="form-group">
              <label className="form-label">Platform Name</label>
              <input className="form-control" defaultValue="CareerLift" />
            </div>
            <div className="form-group">
              <label className="form-label">Support Email</label>
              <input className="form-control" defaultValue="support@careerlift.io" />
            </div>
            <div className="form-group">
              <label className="form-label">Maintenance Mode</label>
              <select className="form-control">
                <option value="off">Off (System Active)</option>
                <option value="on">On (Show maintenance page)</option>
              </select>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title"><Shield size={16} style={{ marginRight: 6 }} />Security & Moderation</h3>
            <div className="form-group">
              <label className="form-label">Auto-suspend threshold (reports)</label>
              <input className="form-control" type="number" defaultValue="15" />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />
                <span style={{ fontSize: '0.9rem', color: '#212529', fontWeight: 500 }}>Require email verification for new employers</span>
              </label>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />
                <span style={{ fontSize: '0.9rem', color: '#212529', fontWeight: 500 }}>Enable AI spam detection on job posts</span>
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            {saved ? <><CheckCircle size={16} /> Saved Successfully!</> : <><Save size={16} /> Save Configuration</>}
          </button>
        </form>

        <div className="card" style={{ background: '#f8f9fa', border: 'none' }}>
          <h3 className="card-title">My Admin Profile</h3>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.8125rem', color: '#6c757d', marginBottom: 2 }}>Name</p>
            <p style={{ fontWeight: 600, color: '#212529' }}>{user?.firstName} {user?.lastName}</p>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.8125rem', color: '#6c757d', marginBottom: 2 }}>Email</p>
            <p style={{ fontWeight: 600, color: '#212529' }}>{user?.email}</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.8125rem', color: '#6c757d', marginBottom: 2 }}>Access Level</p>
            <span className="job-badge" style={{ background: '#6f42c1', color: '#fff' }}>Super Admin</span>
          </div>
          <button className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Change Password</button>
        </div>
      </div>
    </div>
  );
}
