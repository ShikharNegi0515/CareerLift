import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, CheckCircle, XCircle, Eye, Trash2, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import api from '@/api/client';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/companies');
      setCompanies(res.data);
    } catch (err: any) {
      console.error('Failed to load companies', err);
      setError('Failed to load companies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleToggleVerification = async (id: string, currentStatus: boolean) => {
    try {
      setActionLoading(id);
      await api.put(`/admin/companies/${id}/verify`, { isVerified: !currentStatus });
      setCompanies(companies.map(c => c.id === id ? { ...c, isVerified: !currentStatus } : c));
    } catch (err) {
      console.error('Failed to update verification', err);
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.delete(`/admin/companies/${deleteTarget.id}`);
      setCompanies(companies.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete company', err);
    } finally {
      setIsDeleting(false);
      setActionLoading(null);
    }
  };

  const filtered = companies.filter((c) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.industry?.toLowerCase().includes(term) ||
      c.location?.toLowerCase().includes(term)
    );
  });

  const companyMeta = deleteTarget
    ? [deleteTarget.industry, deleteTarget.location, `${deleteTarget.jobs?.length || 0} active jobs`].filter(Boolean).join('  ·  ')
    : '';

  return (
    <div className="animate-fadeIn">
      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete this company?"
        itemName={deleteTarget?.name || ''}
        itemMeta={companyMeta}
        chips={['Company profile', 'All job listings', 'Employee accounts', 'Application history']}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => !isDeleting && setDeleteTarget(null)}
        accentFrom="#ef4444"
        accentTo="#f97316"
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>
            Registered Companies
          </h1>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
            Manage registered employers and verify their business profiles.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ background: '#f8d7da', color: '#842029', padding: '0.875rem 1rem', borderRadius: 8, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input
              className="form-control"
              style={{ paddingLeft: 34 }}
              placeholder="Search companies by name, industry, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
            Total: <strong>{filtered.length}</strong>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#0d6efd' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6c757d' }}>
            <Building2 size={40} style={{ color: '#ced4da', margin: '0 auto 0.75rem' }} />
            <p style={{ fontWeight: 600, color: '#495057' }}>No companies found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                  {['Company', 'Industry', 'Location', 'Jobs', 'Status', 'Registered', 'Actions'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const jobCount = c.jobs?.length || 0;
                  const isVerified = !!c.isVerified;
                  const isRowBusy = actionLoading === c.id;

                  return (
                    <tr
                      key={c.id}
                      style={{ borderBottom: '1px solid #f0f0f0', transition: 'background .12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fafbff')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '0.875rem 0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, background: '#f0f4ff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0d6efd', fontSize: '0.85rem', flexShrink: 0 }}>
                            {c.name ? c.name.slice(0, 2).toUpperCase() : 'CO'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#212529' }}>{c.name}</div>
                            {c.website && (
                              <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#0d6efd', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                                {c.website.replace(/^https?:\/\//, '')} <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.875rem 0.5rem', color: '#495057' }}>{c.industry || '—'}</td>
                      <td style={{ padding: '0.875rem 0.5rem', color: '#495057' }}>{c.location || '—'}</td>
                      <td style={{ padding: '0.875rem 0.5rem' }}>
                        <span style={{ fontWeight: 600, color: '#212529' }}>{jobCount}</span>
                      </td>
                      <td style={{ padding: '0.875rem 0.5rem' }}>
                        <button
                          onClick={() => handleToggleVerification(c.id, isVerified)}
                          disabled={isRowBusy}
                          style={{
                            border: 'none',
                            background: isVerified ? '#d1e7dd' : '#fff3cd',
                            color: isVerified ? '#198754' : '#664d03',
                            fontSize: '0.75rem', fontWeight: 600,
                            padding: '4px 10px', borderRadius: 9999, cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                          }}
                          title="Click to toggle verification"
                        >
                          {isVerified ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {isVerified ? 'Verified' : 'Pending'}
                        </button>
                      </td>
                      <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d', fontSize: '0.8125rem' }}>
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td style={{ padding: '0.875rem 0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link
                            to={`/companies/${c.slug || c.id}`}
                            className="btn btn-light btn-sm"
                            title="View Public Profile"
                            style={{ padding: '4px 8px' }}
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(c)}
                            disabled={isRowBusy}
                            style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: 32, height: 32, borderRadius: '0.5rem',
                              border: '1px solid #fcd1d1', background: '#fff5f5', color: '#dc3545',
                              cursor: isRowBusy ? 'not-allowed' : 'pointer',
                              transition: 'background .15s, border-color .15s, transform .12s, box-shadow .15s',
                              opacity: isRowBusy ? 0.5 : 1,
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = '#dc3545';
                              e.currentTarget.style.borderColor = '#dc3545';
                              e.currentTarget.style.color = '#fff';
                              e.currentTarget.style.transform = 'scale(1.1)';
                              e.currentTarget.style.boxShadow = '0 4px 14px rgba(220,53,69,0.35)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = '#fff5f5';
                              e.currentTarget.style.borderColor = '#fcd1d1';
                              e.currentTarget.style.color = '#dc3545';
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                            title="Delete Company"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
