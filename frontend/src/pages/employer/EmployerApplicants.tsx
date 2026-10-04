import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Download, Star, StarOff, MoreVertical, MapPin, Briefcase, Clock, FileText, CheckCircle, XCircle } from 'lucide-react';

const mockApplicants = [
  { id: '1', name: 'Sarah Johnson', role: 'Senior React Developer', location: 'San Francisco, CA', experience: '6 years', status: 'Under Review', appliedAt: '2 hours ago', match: 95, initial: 'SJ', rated: true },
  { id: '2', name: 'Michael Chen', role: 'Senior Frontend Engineer', location: 'Remote', experience: '5 years', status: 'Applied', appliedAt: '4 hours ago', match: 88, initial: 'MC', rated: false },
  { id: '3', name: 'Emily Rodriguez', role: 'Lead UI Developer', location: 'New York, NY', experience: '8 years', status: 'Shortlisted', appliedAt: '1 day ago', match: 92, initial: 'ER', rated: true },
  { id: '4', name: 'David Kim', role: 'React Developer', location: 'Austin, TX', experience: '3 years', status: 'Rejected', appliedAt: '2 days ago', match: 65, initial: 'DK', rated: false },
];

const statusOptions = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'];

export default function EmployerApplicants() {
  const { id } = useParams();
  const [applicants, setApplicants] = useState(mockApplicants);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = applicants.filter((a) => {
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleRate = (applicantId: string) => {
    setApplicants(applicants.map(a => a.id === applicantId ? { ...a, rated: !a.rated } : a));
  };

  const updateStatus = (applicantId: string, newStatus: string) => {
    setApplicants(applicants.map(a => a.id === applicantId ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <Link to="/employer/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#6c757d', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Jobs
          </Link>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529' }}>
            Applicants for "Senior React Developer"
          </h1>
          <p style={{ color: '#6c757d', fontSize: '0.9rem', marginTop: 2 }}>{applicants.length} total applicants</p>
        </div>
        <button className="btn btn-outline">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="card">
        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input className="form-control" style={{ paddingLeft: 32 }} placeholder="Search applicants by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {statusOptions.map((s) => {
              const count = s === 'All' ? applicants.length : applicants.filter(a => a.status === s).length;
              return (
                <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '0.375rem 0.75rem', borderRadius: 9999, border: '1.5px solid', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 500, borderColor: statusFilter === s ? '#0d6efd' : '#dee2e6', background: statusFilter === s ? '#e8f0fe' : '#fff', color: statusFilter === s ? '#0d6efd' : '#6c757d' }}>
                  {s} {count > 0 && <span style={{ marginLeft: 4, background: statusFilter === s ? '#0d6efd' : '#e9ecef', color: statusFilter === s ? '#fff' : '#6c757d', padding: '0 6px', borderRadius: 9999, fontSize: '0.7rem' }}>{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
             <Filter size={40} style={{ color: '#dee2e6', margin: '0 auto 1rem' }} />
             <p>No applicants found matching your filters.</p>
           </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map((a) => (
              <div key={a.id} style={{ display: 'flex', gap: '1rem', padding: '1.25rem', border: '1px solid #e9ecef', borderRadius: 8, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#0d6efd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                  {a.initial}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#212529', margin: 0 }}>{a.name}</h3>
                    {a.match >= 90 && <span className="job-badge badge-success" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>Great Match</span>}
                  </div>
                  <p style={{ color: '#495057', fontSize: '0.9rem', marginBottom: 6 }}>{a.role}</p>
                  <div style={{ display: 'flex', gap: '1rem', color: '#6c757d', fontSize: '0.8125rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {a.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={13} /> {a.experience}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> Applied {a.appliedAt}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <select className="form-control" style={{ width: 140, padding: '0.4rem 0.5rem', fontSize: '0.8125rem' }} value={a.status} onChange={(e) => updateStatus(a.id, e.target.value)}>
                    {statusOptions.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" title="View Resume"><FileText size={14} /> Resume</button>
                    <button onClick={() => toggleRate(a.id)} className="btn btn-light btn-sm" title={a.rated ? 'Unstar' : 'Star'}>
                      {a.rated ? <Star size={16} fill="#ffc107" color="#ffc107" /> : <StarOff size={16} color="#adb5bd" />}
                    </button>
                    <button className="btn btn-light btn-sm" title="More Options"><MoreVertical size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
