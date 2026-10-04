import { useState } from 'react';
import { useAuth } from '@/store/auth';
import { Bell, Lock, Shield, Trash2, Save, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export default function SeekerSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'privacy' | 'danger'>('account');
  const [saved, setSaved] = useState(false);
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [notifications, setNotifications] = useState({
    newJobMatch: true, applicationUpdate: true, savedJobExpiry: true,
    weeklyDigest: false, marketingEmails: false, pushNotifications: true,
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'danger', label: 'Danger Zone' },
  ];

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>Settings</h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Manage your account preferences and security.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Sidebar tabs */}
        <div className="card" style={{ padding: '0.5rem 0' }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              style={{ display: 'block', width: '100%', padding: '0.75rem 1.25rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: activeTab === tab.id ? 600 : 400, color: activeTab === tab.id ? (tab.id === 'danger' ? '#dc3545' : '#0d6efd') : (tab.id === 'danger' ? '#dc3545' : '#6c757d'), borderLeft: `3px solid ${activeTab === tab.id ? (tab.id === 'danger' ? '#dc3545' : '#0d6efd') : 'transparent'}`, background: activeTab === tab.id ? (tab.id === 'danger' ? '#f8d7da' : '#e8f0fe') : 'transparent', }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'account' && (
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="card-title">Account Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group"><label className="form-label">First Name</label><input className="form-control" defaultValue={user?.firstName} /></div>
                  <div className="form-group"><label className="form-label">Last Name</label><input className="form-control" defaultValue={user?.lastName} /></div>
                </div>
                <div className="form-group"><label className="form-label">Email Address</label><input type="email" className="form-control" defaultValue={user?.email} /></div>
                <button onClick={handleSave} className="btn btn-primary">
                  {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
                </button>
              </div>

              <div className="card">
                <h3 className="card-title"><Lock size={16} style={{ marginRight: 6 }} />Change Password</h3>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showOldPw ? 'text' : 'password'} className="form-control" style={{ paddingRight: 36 }} placeholder="Enter current password" />
                    <button type="button" onClick={() => setShowOldPw(!showOldPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#adb5bd' }}>
                      {showOldPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showNewPw ? 'text' : 'password'} className="form-control" style={{ paddingRight: 36 }} placeholder="Min. 8 characters" />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#adb5bd' }}>
                      {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm">Update Password</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <h3 className="card-title"><Bell size={16} style={{ marginRight: 6 }} />Notification Preferences</h3>
              {[
                { key: 'newJobMatch', label: 'New Job Matches', desc: 'Get notified when new jobs match your profile.' },
                { key: 'applicationUpdate', label: 'Application Updates', desc: 'Status changes on your job applications.' },
                { key: 'savedJobExpiry', label: 'Saved Job Expiry', desc: 'Alerts when saved jobs are about to expire.' },
                { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'A weekly summary of top job opportunities.' },
                { key: 'marketingEmails', label: 'Marketing Emails', desc: 'News, tips, and product updates.' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications.' },
              ].map((item) => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#212529' }}>{item.label}</p>
                    <p style={{ fontSize: '0.8125rem', color: '#6c757d' }}>{item.desc}</p>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, flexShrink: 0 }}>
                    <input type="checkbox" checked={notifications[item.key as keyof typeof notifications]} onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, background: notifications[item.key as keyof typeof notifications] ? '#0d6efd' : '#dee2e6', borderRadius: 12, transition: '0.2s' }}>
                      <span style={{ position: 'absolute', content: '', height: 18, width: 18, left: notifications[item.key as keyof typeof notifications] ? 22 : 3, bottom: 3, background: '#fff', borderRadius: '50%', transition: '0.2s' }} />
                    </span>
                  </label>
                </div>
              ))}
              <button onClick={handleSave} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Preferences</>}
              </button>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="card">
              <h3 className="card-title"><Shield size={16} style={{ marginRight: 6 }} />Privacy Settings</h3>
              {[
                { label: 'Profile Visibility', desc: 'Make your profile visible to employers searching for candidates.', options: ['Public', 'Recruiters Only', 'Private'], default: 'Recruiters Only' },
                { label: 'Show Resume to Employers', desc: 'Allow employers to download your resume when viewing your profile.', options: ['Yes', 'No'], default: 'Yes' },
                { label: 'Show Contact Info', desc: 'Display phone and email on your public profile.', options: ['Yes', 'No'], default: 'No' },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f0f0f0' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#212529', marginBottom: '0.25rem' }}>{item.label}</p>
                  <p style={{ fontSize: '0.8125rem', color: '#6c757d', marginBottom: '0.75rem' }}>{item.desc}</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {item.options.map((opt) => (
                      <button key={opt} style={{ padding: '0.375rem 0.875rem', borderRadius: 9999, border: '1.5px solid', fontSize: '0.8125rem', cursor: 'pointer', borderColor: opt === item.default ? '#0d6efd' : '#dee2e6', background: opt === item.default ? '#e8f0fe' : '#fff', color: opt === item.default ? '#0d6efd' : '#6c757d', fontWeight: opt === item.default ? 600 : 400 }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={handleSave} className="btn btn-primary">
                {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Privacy Settings</>}
              </button>
            </div>
          )}

          {activeTab === 'danger' && (
            <div>
              <div className="card" style={{ border: '1px solid #f5c2c7', background: '#fff5f5' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: '1rem' }}>
                  <AlertCircle size={20} style={{ color: '#dc3545', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#842029', marginBottom: '0.5rem' }}>Danger Zone</h3>
                    <p style={{ color: '#842029', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      These actions are irreversible. Please proceed with caution.
                    </p>
                  </div>
                </div>
                <hr style={{ borderColor: '#f5c2c7', margin: '1rem 0' }} />
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#212529', marginBottom: '0.25rem' }}>Deactivate Account</h4>
                  <p style={{ color: '#6c757d', fontSize: '0.875rem', marginBottom: '0.75rem' }}>Temporarily disable your account. You can reactivate it at any time by signing in.</p>
                  <button className="btn btn-light btn-sm" style={{ color: '#dc3545', borderColor: '#f5c2c7' }}>Deactivate Account</button>
                </div>
                <hr style={{ borderColor: '#f5c2c7', margin: '1rem 0' }} />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#dc3545', marginBottom: '0.25rem' }}>Delete Account Permanently</h4>
                  <p style={{ color: '#6c757d', fontSize: '0.875rem', marginBottom: '0.75rem' }}>This will permanently delete your account, profile, applications, and all data. This cannot be undone.</p>
                  <button className="btn btn-sm" style={{ background: '#dc3545', color: '#fff', borderColor: '#dc3545', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Trash2 size={14} /> Delete My Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
