import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, Loader2 } from 'lucide-react';
import api from '@/api/client';
import type { Application } from '@/types';

const statusOptions = ['All', 'applied', 'under_review', 'shortlisted', 'rejected', 'hired'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'applied': return '#0d6efd';
    case 'under_review': return '#ffc107';
    case 'shortlisted': return '#198754';
    case 'rejected': return '#dc3545';
    case 'hired': return '#0dcaf0';
    default: return '#6c757d';
  }
};

const formatStatus = (status: string) => {
  return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export default function SeekerApplications() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get<Application[]>('/applications/me');
        setApplications(res.data);
      } catch (err) {
        console.error('Failed to fetch applications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filtered = applications.filter((a) => {
    if (filter !== 'All' && a.status !== filter) return false;
    if (search && !a.job?.title?.toLowerCase().includes(search.toLowerCase()) && !a.job?.company?.name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusCount = (s: string) => s === 'All' ? applications.length : applications.filter((a) => a.status === s).length;

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /></div>;
  }

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>My Applications</h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Track all your job applications in one place.</p>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Applied', status: 'applied', color: '#0d6efd' },
          { label: 'Under Review', status: 'under_review', color: '#ffc107' },
          { label: 'Shortlisted', status: 'shortlisted', color: '#198754' },
          { label: 'Rejected', status: 'rejected', color: '#dc3545' },
          { label: 'Hired', status: 'hired', color: '#0dcaf0' },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ textAlign: 'center', borderTop: `3px solid ${stat.color}` }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: stat.color }}>
              {applications.filter(a => a.status === stat.status).length}
            </span>
            <p style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: 2 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input className="form-control" style={{ paddingLeft: 32 }} placeholder="Search applications..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {statusOptions.map((s) => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: '0.375rem 0.75rem', borderRadius: 9999, border: '1.5px solid', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 500, borderColor: filter === s ? '#0d6efd' : '#dee2e6', background: filter === s ? '#e8f0fe' : '#fff', color: filter === s ? '#0d6efd' : '#6c757d' }}>
                {formatStatus(s)} {statusCount(s) > 0 && <span style={{ marginLeft: 4, background: filter === s ? '#0d6efd' : '#e9ecef', color: filter === s ? '#fff' : '#6c757d', padding: '0 6px', borderRadius: 9999, fontSize: '0.7rem' }}>{statusCount(s)}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
            <Search size={40} style={{ color: '#dee2e6', margin: '0 auto 1rem' }} />
            <p>No applications found matching your filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                  {['Job', 'Company', 'Location', 'Type', 'Applied', 'Status', 'Action'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.8rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.875rem 0.5rem' }}>
                      <Link to={`/jobs/${app.job.id}`} style={{ fontWeight: 600, color: '#212529', textDecoration: 'none' }}>{app.job.title}</Link>
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="job-logo-placeholder" style={{ width: 28, height: 28, fontSize: '0.625rem', flexShrink: 0 }}>
                           {app.job.company?.name ? app.job.company.name.substring(0, 2).toUpperCase() : 'CO'}
                        </div>
                        {app.job.company?.name || 'Company Name'}
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d', fontSize: '0.8125rem' }}>{app.job.location}</td>
                    <td style={{ padding: '0.875rem 0.5rem' }}>
                      <span className="job-badge badge-primary" style={{ fontSize: '0.75rem' }}>{formatStatus(app.job.jobType)}</span>
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                       {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: getStatusColor(app.status), background: getStatusColor(app.status) + '20', padding: '3px 10px', borderRadius: 9999, whiteSpace: 'nowrap' }}>
                         {formatStatus(app.status)}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem' }}>
                      <Link to={`/jobs/${app.job.id}`} className="btn btn-light btn-sm" style={{ padding: '0.3rem 0.5rem' }}>
                        <ExternalLink size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
