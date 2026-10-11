import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Building2, DollarSign, Clock, Trash2, ArrowRight, Search, Loader2 } from 'lucide-react';
import api from '@/api/client';
import type { Job } from '@/types';

interface SavedJobResponse {
  id: string;
  job: Job;
  createdAt: string;
}

export default function SeekerSavedJobs() {
  const [jobs, setJobs] = useState<SavedJobResponse[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get<SavedJobResponse[]>('/saved-jobs/me');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch saved jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string, jobId: string) => {
    try {
      await api.delete(`/saved-jobs/${jobId}`);
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (err) {
      console.error('Failed to remove saved job', err);
    }
  };

  const filtered = jobs.filter((j) =>
    !search || j.job?.title?.toLowerCase().includes(search.toLowerCase()) || j.job?.company?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatStatus = (status: string) => {
      return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (loading) {
     return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /></div>;
  }

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>Saved Jobs</h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>{jobs.length} jobs saved · Apply before they expire!</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input className="form-control" style={{ paddingLeft: 32 }} placeholder="Search saved jobs..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Link to="/jobs" className="btn btn-outline btn-sm">Browse More Jobs</Link>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
            <Bookmark size={48} style={{ color: '#dee2e6', margin: '0 auto 1rem' }} />
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No saved jobs found</p>
            <Link to="/jobs" className="btn btn-primary btn-sm">Browse Jobs</Link>
          </div>
        ) : (
          filtered.map((saved) => (
            <div key={saved.id} className="job-item">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div className="job-logo-placeholder" style={{ flexShrink: 0 }}>
                    {saved.job.company?.name ? saved.job.company.name.substring(0, 2).toUpperCase() : 'CO'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/jobs/${saved.job.id}`} className="job-title">{saved.job.title}</Link>
                  <div className="job-meta" style={{ marginTop: 4 }}>
                    <span className="job-meta-item"><Building2 size={13} /> {saved.job.company?.name || 'Company'}</span>
                    <span className="job-meta-item"><MapPin size={13} /> {saved.job.location}</span>
                    <span className="job-meta-item"><DollarSign size={13} /> {saved.job.salaryMin ? `$${saved.job.salaryMin/1000}k` : 'Not specified'}</span>
                    <span className="job-meta-item"><Clock size={13} /> Saved {new Date(saved.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <span className="job-badge badge-primary">{formatStatus(saved.job.jobType)}</span>
                    <span className="job-badge badge-success">{formatStatus(saved.job.workMode)}</span>
                    {saved.job.applicationDeadline && (
                        <span className="job-badge badge-warning">Deadline: {new Date(saved.job.applicationDeadline).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <Link to={`/jobs/${saved.job.id}`} className="btn btn-primary btn-sm">
                    Apply <ArrowRight size={14} />
                  </Link>
                  <button onClick={() => remove(saved.id, saved.job.id)} className="btn btn-light btn-sm" style={{ color: '#dc3545' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
