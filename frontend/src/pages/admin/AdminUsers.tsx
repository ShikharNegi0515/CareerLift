import { useState } from 'react';
import { Search, Shield, Ban, CheckCircle, MoreVertical } from 'lucide-react';
import { UserRole } from '@/types';

const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@careerlift.io', role: UserRole.ADMIN, status: 'Active', joinedAt: 'Jan 1, 2024' },
  { id: '2', name: 'John Doe', email: 'john@example.com', role: UserRole.JOB_SEEKER, status: 'Active', joinedAt: 'Oct 1, 2026' },
  { id: '3', name: 'Jane Smith', email: 'jane@techcorp.com', role: UserRole.EMPLOYER, status: 'Active', joinedAt: 'Sep 28, 2026' },
  { id: '4', name: 'Spam Bot', email: 'spam@bot.com', role: UserRole.JOB_SEEKER, status: 'Suspended', joinedAt: 'Oct 3, 2026' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filtered = users.filter((u) => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>User Management</h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>View, filter, and manage all users on the platform.</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input className="form-control" style={{ paddingLeft: 32 }} placeholder="Search users by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {['All', UserRole.JOB_SEEKER, UserRole.EMPLOYER, UserRole.ADMIN].map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)} style={{ padding: '0.375rem 0.75rem', borderRadius: 9999, border: '1.5px solid', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 500, borderColor: roleFilter === r ? '#0d6efd' : '#dee2e6', background: roleFilter === r ? '#e8f0fe' : '#fff', color: roleFilter === r ? '#0d6efd' : '#6c757d' }}>
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <p style={{ fontWeight: 600, color: '#212529', marginBottom: 2 }}>{u.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6c757d' }}>{u.email}</p>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span className="job-badge" style={{ background: u.role === UserRole.ADMIN ? '#6f42c1' : u.role === UserRole.EMPLOYER ? '#fd7e14' : '#0d6efd', color: '#fff' }}>{u.role.replace('_', ' ')}</span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: u.status === 'Active' ? '#198754' : '#dc3545', background: u.status === 'Active' ? '#d1e7dd' : '#f8d7da', padding: '3px 10px', borderRadius: 9999 }}>{u.status}</span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d', fontSize: '0.8125rem' }}>{u.joinedAt}</td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => toggleStatus(u.id)} className="btn btn-light btn-sm" title={u.status === 'Active' ? 'Suspend' : 'Activate'}>
                        {u.status === 'Active' ? <Ban size={14} style={{ color: '#dc3545' }} /> : <CheckCircle size={14} style={{ color: '#198754' }} />}
                      </button>
                      <button className="btn btn-light btn-sm"><MoreVertical size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
