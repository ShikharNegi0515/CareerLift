import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, Trash2, Loader2, ExternalLink, MapPin, Clock } from 'lucide-react';
import api from '@/api/client';
import type { Job } from '@/types';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [actionId, setActionId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get<Job[]>('/admin/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to load admin jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setActionId(id);
      await api.put(`/admin/jobs/${id}/status`, { status: newStatus });
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: newStatus as any } : j)));
    } catch (err) {
      console.error('Failed to update job status', err);
    } finally {
      setActionId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.delete(`/admin/jobs/${deleteTarget.id}`);
      setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete job', err);
    } finally {
      setIsDeleting(false);
      setActionId(null);
    }
  };

  const filtered = jobs.filter((j) => {
    if (filter !== 'All' && j.status !== filter) return false;
    const title = (j.title || '').toLowerCase();
    const company = (j.company?.name || '').toLowerCase();
    if (search && !title.includes(search.toLowerCase()) && !company.includes(search.toLowerCase())) return false;
    return true;
  });

  const statusColor: Record<string, string> = { published: '#10b981', draft: '#f59e0b', closed: '#6b7280' };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#0d6efd' }} />
      </div>
    );
  }

  const jobMeta = deleteTarget
    ? [
        deleteTarget.company?.name,
        (deleteTarget as any).location,
        new Date(deleteTarget.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        deleteTarget.status,
      ].filter(Boolean).join('  ·  ')
    : '';

  return (
    <div className="animate-fadeIn">
      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete this job posting?"
        itemName={deleteTarget?.title || ''}
        itemMeta={jobMeta}
        chips={['Job posting', 'All applications', 'View analytics', 'Candidate saves']}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => !isDeleting && setDeleteTarget(null)}
      />

      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>
          Job Moderation &amp; Management
        </h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
          Review all job postings across CareerLift, update their status or remove them.
        </p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input
              className="form-control"
              style={{ paddingLeft: 32 }}
              placeholder="Search jobs by title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {['All', 'published', 'draft', 'closed'].map((f) => (
              <button
                key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '0.375rem 0.75rem', borderRadius: 9999, border: '1.5px solid',
                  fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 500, textTransform: 'capitalize',
                  borderColor: filter === f ? '#0d6efd' : '#dee2e6',
                  background: filter === f ? '#e8f0fe' : '#fff',
                  color: filter === f ? '#0d6efd' : '#6c757d',
                  transition: 'all .15s',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                {['Job Title', 'Company', 'Views', 'Status', 'Posted', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((j) => (
                <tr
                  key={j.id}
                  style={{ borderBottom: '1px solid #f0f0f0', transition: 'background .12s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafbff')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600, color: '#212529' }}>
                    <Link to={`/jobs/${j.slug || j.id}`} style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {j.title} <ExternalLink size={12} style={{ color: '#0d6efd' }} />
                    </Link>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Building2 size={13} /> {j.company?.name || 'Company'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d' }}>
                    {j.viewCount || (j as any).viewsCount || 0}
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize',
                      padding: '3px 10px', borderRadius: 999,
                      background: `${statusColor[j.status] || '#6b7280'}18`,
                      color: statusColor[j.status] || '#6b7280',
                      border: `1px solid ${statusColor[j.status] || '#6b7280'}40`,
                    }}>
                      {j.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d', fontSize: '0.8125rem' }}>
                    {new Date(j.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <select
                        className="form-control"
                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', width: 'auto' }}
                        value={j.status}
                        disabled={actionId === j.id}
                        onChange={(e) => handleStatusChange(j.id, e.target.value)}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button
                        disabled={actionId === j.id}
                        onClick={() => setDeleteTarget(j)}
                        title="Delete job"
                        style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 34, height: 34, borderRadius: '0.5rem', flexShrink: 0,
                          border: '1px solid #fcd1d1', background: '#fff5f5', color: '#dc3545',
                          cursor: actionId === j.id ? 'not-allowed' : 'pointer',
                          transition: 'background .15s, border-color .15s, transform .12s, box-shadow .15s',
                          opacity: actionId === j.id ? 0.5 : 1,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#dc3545';
                          e.currentTarget.style.borderColor = '#dc3545';
                          e.currentTarget.style.color = '#fff';
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.boxShadow = '0 4px 14px rgba(220,53,69,0.38)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = '#fff5f5';
                          e.currentTarget.style.borderColor = '#fcd1d1';
                          e.currentTarget.style.color = '#dc3545';
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#adb5bd', fontSize: '0.9rem' }}>
                    No jobs found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
