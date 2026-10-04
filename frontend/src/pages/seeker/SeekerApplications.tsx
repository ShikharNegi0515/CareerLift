import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, Clock, Search, Filter, ExternalLink } from 'lucide-react';

const mockApplications = [
  { id: '1', title: 'Senior React Developer', company: 'TechCorp', initial: 'TC', location: 'San Francisco, CA', type: 'Full Time', mode: 'Remote', status: 'Under Review', statusColor: '#ffc107', appliedAt: 'Oct 2, 2026', coverLetter: true },
  { id: '2', title: 'Product Manager', company: 'InnovateCo', initial: 'IC', location: 'New York, NY', type: 'Full Time', mode: 'Hybrid', status: 'Shortlisted', statusColor: '#198754', appliedAt: 'Sep 28, 2026', coverLetter: true },
  { id: '3', title: 'UX Designer', company: 'DesignStudio', initial: 'DS', location: 'Austin, TX', type: 'Full Time', mode: 'On-site', status: 'Applied', statusColor: '#0d6efd', appliedAt: 'Sep 25, 2026', coverLetter: false },
  { id: '4', title: 'Data Scientist', company: 'DataWave', initial: 'DW', location: 'Seattle, WA', type: 'Full Time', mode: 'Remote', status: 'Rejected', statusColor: '#dc3545', appliedAt: 'Sep 15, 2026', coverLetter: true },
  { id: '5', title: 'DevOps Engineer', company: 'CloudFirst', initial: 'CF', location: 'Chicago, IL', type: 'Contract', mode: 'Remote', status: 'Hired', statusColor: '#0dcaf0', appliedAt: 'Sep 10, 2026', coverLetter: true },
];

const statusOptions = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'];

export default function SeekerApplications() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = mockApplications.filter((a) => {
    if (filter !== 'All' && a.status !== filter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusCount = (s: string) => s === 'All' ? mockApplications.length : mockApplications.filter((a) => a.status === s).length;

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>My Applications</h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Track all your job applications in one place.</p>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Applied', count: mockApplications.filter(a => a.status === 'Applied').length, color: '#0d6efd' },
          { label: 'Under Review', count: mockApplications.filter(a => a.status === 'Under Review').length, color: '#ffc107' },
          { label: 'Shortlisted', count: mockApplications.filter(a => a.status === 'Shortlisted').length, color: '#198754' },
          { label: 'Rejected', count: mockApplications.filter(a => a.status === 'Rejected').length, color: '#dc3545' },
          { label: 'Hired', count: mockApplications.filter(a => a.status === 'Hired').length, color: '#0dcaf0' },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ textAlign: 'center', borderTop: `3px solid ${stat.color}` }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: stat.color }}>{stat.count}</span>
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
                {s} {statusCount(s) > 0 && <span style={{ marginLeft: 4, background: filter === s ? '#0d6efd' : '#e9ecef', color: filter === s ? '#fff' : '#6c757d', padding: '0 6px', borderRadius: 9999, fontSize: '0.7rem' }}>{statusCount(s)}</span>}
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
                      <Link to={`/jobs/${app.id}`} style={{ fontWeight: 600, color: '#212529', textDecoration: 'none' }}>{app.title}</Link>
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="job-logo-placeholder" style={{ width: 28, height: 28, fontSize: '0.625rem', flexShrink: 0 }}>{app.initial}</div>
                        {app.company}
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d', fontSize: '0.8125rem' }}>{app.location}</td>
                    <td style={{ padding: '0.875rem 0.5rem' }}>
                      <span className="job-badge badge-primary" style={{ fontSize: '0.75rem' }}>{app.type}</span>
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>{app.appliedAt}</td>
                    <td style={{ padding: '0.875rem 0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: app.statusColor, background: app.statusColor + '20', padding: '3px 10px', borderRadius: 9999, whiteSpace: 'nowrap' }}>{app.status}</span>
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem' }}>
                      <Link to={`/jobs/${app.id}`} className="btn btn-light btn-sm" style={{ padding: '0.3rem 0.5rem' }}>
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
    </div>
  );
}
