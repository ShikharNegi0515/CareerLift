import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Eye, Users, Edit, Trash2, Search, Filter, MoreVertical } from 'lucide-react';

const mockJobs = [
  { id: '1', title: 'Senior React Developer', applicants: 24, views: 312, status: 'Published', type: 'Full Time', mode: 'Remote', deadline: 'Nov 30, 2026', postedAt: 'Oct 1, 2026' },
  { id: '2', title: 'Backend Engineer', applicants: 18, views: 248, status: 'Published', type: 'Full Time', mode: 'Hybrid', deadline: 'Dec 15, 2026', postedAt: 'Sep 28, 2026' },
  { id: '3', title: 'Product Designer', applicants: 9, views: 176, status: 'Published', type: 'Full Time', mode: 'On-site', deadline: 'Dec 1, 2026', postedAt: 'Sep 25, 2026' },
  { id: '4', title: 'DevOps Engineer', applicants: 0, views: 12, status: 'Draft', type: 'Contract', mode: 'Remote', deadline: '', postedAt: 'Not published' },
  { id: '5', title: 'Marketing Specialist', applicants: 31, views: 420, status: 'Closed', type: 'Full Time', mode: 'Hybrid', deadline: 'Oct 1, 2026', postedAt: 'Sep 5, 2026' },
];

const statusColors: Record<string, string> = { Published: '#198754', Draft: '#6c757d', Closed: '#dc3545', Expired: '#fd7e14' };
const statusBgs: Record<string, string> = { Published: '#d1e7dd', Draft: '#e9ecef', Closed: '#f8d7da', Expired: '#fff3cd' };

export default function EmployerJobs() {
  const [jobs, setJobs] = useState(mockJobs);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = jobs.filter((j) => {
    if (statusFilter !== 'All' && j.status !== statusFilter) return false;
    if (search && !j.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const deleteJob = (id: string) => { if (confirm('Are you sure?')) setJobs(jobs.filter((j) => j.id !== id)); };

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>Job Postings</h1>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Manage all your job postings and applicants.</p>
        </div>
        <Link to="/employer/jobs/new" className="btn btn-primary"><PlusCircle size={16} /> Post New Job</Link>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {['All', 'Published', 'Draft', 'Closed'].map((s) => {
          const count = s === 'All' ? jobs.length : jobs.filter((j) => j.status === s).length;
          return (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '1rem', border: `2px solid ${statusFilter === s ? '#0d6efd' : '#e9ecef'}`, borderRadius: 8, background: statusFilter === s ? '#e8f0fe' : '#fff', cursor: 'pointer', textAlign: 'center' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: statusFilter === s ? '#0d6efd' : '#212529', display: 'block' }}>{count}</span>
              <span style={{ fontSize: '0.8125rem', color: statusFilter === s ? '#0d6efd' : '#6c757d' }}>{s} Jobs</span>
            </button>
          );
        })}
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input className="form-control" style={{ paddingLeft: 32 }} placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                {['Job Title', 'Applicants', 'Views', 'Type', 'Deadline', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr key={job.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <p style={{ fontWeight: 600, color: '#212529' }}>{job.title}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6c757d' }}>Posted: {job.postedAt}</p>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <Link to={`/employer/jobs/${job.id}/applicants`} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#0d6efd', textDecoration: 'none', fontWeight: 600 }}>
                      <Users size={14} /> {job.applicants}
                    </Link>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={13} />{job.views}</span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span className="job-badge badge-primary">{job.type}</span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d', fontSize: '0.8125rem' }}>{job.deadline || '—'}</td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: statusColors[job.status], background: statusBgs[job.status], padding: '3px 10px', borderRadius: 9999 }}>{job.status}</span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <Link to={`/employer/jobs/${job.id}/edit`} className="btn btn-light btn-sm" style={{ padding: '0.3rem 0.5rem' }}><Edit size={13} /></Link>
                      <Link to={`/employer/jobs/${job.id}/applicants`} className="btn btn-light btn-sm" style={{ padding: '0.3rem 0.5rem' }}><Users size={13} /></Link>
                      <button onClick={() => deleteJob(job.id)} className="btn btn-light btn-sm" style={{ padding: '0.3rem 0.5rem', color: '#dc3545' }}><Trash2 size={13} /></button>
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
