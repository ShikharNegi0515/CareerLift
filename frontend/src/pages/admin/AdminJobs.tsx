import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, Trash2, Loader2, ExternalLink } from 'lucide-react';
import api from '@/api/client';
import type { Job } from '@/types';

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this job?')) return;
    try {
      setActionId(id);
      await api.delete(`/admin/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error('Failed to delete job', err);
    } finally {
      setActionId(null);
    }
  };

  const filtered = jobs.filter((j) => {
    if (filter !== 'All' && j.status !== filter) return false;
    const title = (j.title || '').toLowerCase();
    const company = (j.company?.name || '').toLowerCase();
    if (search && !title.includes(search.toLowerCase()) && !company.includes(search.toLowerCase())) {
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
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>Job Moderation & Management</h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Review all job postings across CareerLift, update their status or remove them.</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input className="form-control" style={{ paddingLeft: 32 }} placeholder="Search jobs by title or company..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {['All', 'published', 'draft', 'closed'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.375rem 0.75rem', borderRadius: 9999, border: '1.5px solid', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 500, borderColor: filter === f ? '#0d6efd' : '#dee2e6', background: filter === f ? '#e8f0fe' : '#fff', color: filter === f ? '#0d6efd' : '#6c757d', textTransform: 'capitalize' }}>
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
                <tr key={j.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600, color: '#212529' }}>
                    <Link to={`/jobs/${j.slug || j.id}`} style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {j.title} <ExternalLink size={12} style={{ color: '#0d6efd' }} />
                    </Link>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={13} /> {j.company?.name || 'Company'}</span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d' }}>
                    {j.viewCount || (j as any).viewsCount || 0}
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
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
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d', fontSize: '0.8125rem' }}>
                    {new Date(j.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <button
                      className="btn btn-light btn-sm"
                      style={{ color: '#dc3545', borderColor: '#f8d7da' }}
                      disabled={actionId === j.id}
                      onClick={() => handleDelete(j.id)}
                      title="Delete job"
                    >
                      <Trash2 size={14} />
                    </button>
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
