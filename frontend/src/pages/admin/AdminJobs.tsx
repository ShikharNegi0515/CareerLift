import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, Ban, CheckCircle, MoreVertical, Eye, Flag } from 'lucide-react';

const mockJobs = [
  { id: '1', title: 'Senior React Developer', company: 'TechCorp', status: 'Active', reports: 0, postedAt: 'Oct 1, 2026' },
  { id: '2', title: 'Marketing Manager', company: 'ScamCo', status: 'Active', reports: 12, postedAt: 'Oct 3, 2026' },
  { id: '3', title: 'Product Designer', company: 'DesignStudio', status: 'Active', reports: 1, postedAt: 'Sep 28, 2026' },
  { id: '4', title: 'Data Entry (Work from Home!) $$$', company: 'Unknown', status: 'Suspended', reports: 45, postedAt: 'Oct 4, 2026' },
];

export default function AdminJobs() {
  const [jobs, setJobs] = useState(mockJobs);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = jobs.filter((j) => {
    if (filter === 'Reported' && j.reports === 0) return false;
    if (filter === 'Suspended' && j.status !== 'Suspended') return false;
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleStatus = (id: string) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: j.status === 'Active' ? 'Suspended' : 'Active' } : j));
  };

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>Job Moderation</h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Review reported jobs and manage active listings.</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input className="form-control" style={{ paddingLeft: 32 }} placeholder="Search jobs by title or company..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {['All', 'Reported', 'Suspended'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.375rem 0.75rem', borderRadius: 9999, border: '1.5px solid', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 500, borderColor: filter === f ? '#0d6efd' : '#dee2e6', background: filter === f ? '#e8f0fe' : '#fff', color: filter === f ? '#0d6efd' : '#6c757d' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                {['Job Title', 'Company', 'Reports', 'Status', 'Posted', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((j) => (
                <tr key={j.id} style={{ borderBottom: '1px solid #f0f0f0', background: j.reports > 10 ? '#fff3cd' : 'transparent' }}>
                  <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600, color: '#212529' }}>
                    <Link to={`/jobs/${j.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{j.title}</Link>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={13} /> {j.company}</span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    {j.reports > 0 ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: j.reports > 10 ? '#dc3545' : '#fd7e14', fontWeight: 600 }}>
                        <Flag size={13} /> {j.reports}
                      </span>
                    ) : <span style={{ color: '#6c757d' }}>0</span>}
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: j.status === 'Active' ? '#198754' : '#dc3545', background: j.status === 'Active' ? '#d1e7dd' : '#f8d7da', padding: '3px 10px', borderRadius: 9999 }}>{j.status}</span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d', fontSize: '0.8125rem' }}>{j.postedAt}</td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/jobs/${j.id}`} className="btn btn-light btn-sm" title="View"><Eye size={14} /></Link>
                      <button onClick={() => toggleStatus(j.id)} className="btn btn-light btn-sm" title={j.status === 'Active' ? 'Suspend' : 'Activate'}>
                        {j.status === 'Active' ? <Ban size={14} style={{ color: '#dc3545' }} /> : <CheckCircle size={14} style={{ color: '#198754' }} />}
                      </button>
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
