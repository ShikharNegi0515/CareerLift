import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Eye, Users, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import api from '../../api/client';
import type { Job } from '@/types';

const statusColors: Record<string, string> = { published: '#198754', draft: '#6c757d', closed: '#dc3545', expired: '#fd7e14' };
const statusBgs: Record<string, string> = { published: '#d1e7dd', draft: '#e9ecef', closed: '#f8d7da', expired: '#fff3cd' };

const formatStatus = (status: string) => {
  return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export default function EmployerJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get<Job[]>('/jobs/employer/me');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id: string) => { 
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/jobs/${id}`);
        setJobs(jobs.filter((j) => j.id !== id));
      } catch (err) {
        console.error('Failed to delete job', err);
      }
    }
  };

  const filtered = jobs.filter((j) => {
    if (statusFilter !== 'All' && j.status !== statusFilter.toLowerCase()) return false;
    if (search && !j.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /></div>;
  }

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
          const count = s === 'All' ? jobs.length : jobs.filter((j) => j.status === s.toLowerCase()).length;
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
                    <p style={{ fontSize: '0.75rem', color: '#6c757d' }}>Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <Link to={`/employer/jobs/${job.id}/applicants`} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#0d6efd', textDecoration: 'none', fontWeight: 600 }}>
                      <Users size={14} /> {job.applicationCount || 0}
                    </Link>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={13} />{job.viewCount || 0}</span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span className="job-badge badge-primary">{formatStatus(job.jobType)}</span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d', fontSize: '0.8125rem' }}>{job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : '—'}</td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: statusColors[job.status] || '#6c757d', background: statusBgs[job.status] || '#e9ecef', padding: '3px 10px', borderRadius: 9999 }}>{formatStatus(job.status)}</span>
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>No jobs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
