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

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                {['Job Title', 'Applicants', 'Views', 'Type', 'Deadline', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="py-3 px-4 font-bold text-[11px] text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <Link
                      to={`/employer/jobs/${job.id}/applicants`}
                      className="font-bold text-slate-900 hover:text-blue-600 transition-colors block text-sm"
                    >
                      {job.title}
                    </Link>
                    <p className="text-xs text-slate-400 mt-0.5">Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <Link
                      to={`/employer/jobs/${job.id}/applicants`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-bold"
                      title="View Kanban Board for this job"
                    >
                      <Users size={13} /> {job.applicationCount || 0}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                      <Eye size={13} className="text-slate-400" /> {job.viewCount || 0}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      {formatStatus(job.jobType)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">
                    {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      style={{
                        color: statusColors[job.status] || '#6c757d',
                        background: statusBgs[job.status] || '#e9ecef',
                      }}
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold"
                    >
                      {formatStatus(job.status)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/employer/jobs/${job.id}/edit`}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                        title="Edit Job"
                      >
                        <Edit size={14} />
                      </Link>
                      <Link
                        to={`/employer/jobs/${job.id}/applicants`}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                        title="View Candidates"
                      >
                        <Users size={14} />
                      </Link>
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-all"
                        title="Delete Job"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 px-4">
                    <div className="max-w-sm mx-auto text-center">
                      <p className="text-sm font-bold text-slate-700 mb-1">No jobs found</p>
                      <p className="text-xs text-slate-400 mb-4">You have not published any job openings matching this filter.</p>
                      <Link to="/employer/jobs/new" className="btn btn-primary btn-sm inline-flex items-center gap-1.5">
                        <PlusCircle size={14} /> Post Your First Job
                      </Link>
                    </div>
                  </td>
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
