import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { UserRole } from '@/types';
import api from '@/api/client';

interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<UserItem[]>('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      setUpdatingId(id);
      await api.put(`/admin/users/${id}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole as UserRole } : u)));
    } catch (err) {
      console.error('Failed to update user role', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter((u) => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    if (search && !fullName.includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#0d6efd' }} />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>User Management</h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>View, filter, and manage user roles across CareerLift.</p>
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
                {['User', 'Role', 'Email Verified', 'Joined', 'Change Role'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <p style={{ fontWeight: 600, color: '#212529', marginBottom: 2 }}>{u.firstName} {u.lastName}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6c757d' }}>{u.email}</p>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span className="job-badge" style={{ background: u.role === UserRole.ADMIN ? '#6f42c1' : u.role === UserRole.EMPLOYER ? '#fd7e14' : '#0d6efd', color: '#fff' }}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: u.isEmailVerified ? '#198754' : '#6c757d', background: u.isEmailVerified ? '#d1e7dd' : '#e9ecef', padding: '3px 10px', borderRadius: 9999 }}>
                      {u.isEmailVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d', fontSize: '0.8125rem' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <select
                      className="form-control"
                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', width: 'auto' }}
                      value={u.role}
                      disabled={updatingId === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value={UserRole.JOB_SEEKER}>Job Seeker</option>
                      <option value={UserRole.EMPLOYER}>Employer</option>
                      <option value={UserRole.ADMIN}>Admin</option>
                    </select>
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
