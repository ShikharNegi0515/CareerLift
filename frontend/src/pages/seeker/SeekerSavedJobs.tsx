import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Building2, DollarSign, Clock, Trash2, ArrowRight, Search } from 'lucide-react';

const savedJobs = [
  { id: '1', title: 'Senior React Developer', company: 'TechCorp', initial: 'TC', location: 'San Francisco, CA', salary: '$120k–$160k', type: 'Full Time', mode: 'Remote', savedAt: '3 days ago', deadline: 'Nov 30, 2026' },
  { id: '2', title: 'Product Manager', company: 'InnovateCo', initial: 'IC', location: 'New York, NY', salary: '$100k–$140k', type: 'Full Time', mode: 'Hybrid', savedAt: '5 days ago', deadline: 'Dec 15, 2026' },
  { id: '3', title: 'Full Stack Developer', company: 'CloudFirst', initial: 'CF', location: 'Remote', salary: '$110k–$145k', type: 'Full Time', mode: 'Remote', savedAt: '1 week ago', deadline: 'Nov 20, 2026' },
  { id: '4', title: 'UX Designer', company: 'DesignStudio', initial: 'DS', location: 'Austin, TX', salary: '$85k–$110k', type: 'Full Time', mode: 'On-site', savedAt: '2 weeks ago', deadline: 'Dec 1, 2026' },
];

export default function SeekerSavedJobs() {
  const [jobs, setJobs] = useState(savedJobs);
  const [search, setSearch] = useState('');

  const filtered = jobs.filter((j) =>
    !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())
  );

  const remove = (id: string) => setJobs(jobs.filter((j) => j.id !== id));

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
          filtered.map((job) => (
            <div key={job.id} className="job-item">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div className="job-logo-placeholder" style={{ flexShrink: 0 }}>{job.initial}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/jobs/${job.id}`} className="job-title">{job.title}</Link>
                  <div className="job-meta" style={{ marginTop: 4 }}>
                    <span className="job-meta-item"><Building2 size={13} /> {job.company}</span>
                    <span className="job-meta-item"><MapPin size={13} /> {job.location}</span>
                    <span className="job-meta-item"><DollarSign size={13} /> {job.salary}</span>
                    <span className="job-meta-item"><Clock size={13} /> Saved {job.savedAt}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <span className="job-badge badge-primary">{job.type}</span>
                    <span className="job-badge badge-success">{job.mode}</span>
                    <span className="job-badge badge-warning">Deadline: {job.deadline}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm">
                    Apply <ArrowRight size={14} />
                  </Link>
                  <button onClick={() => remove(job.id)} className="btn btn-light btn-sm" style={{ color: '#dc3545' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
