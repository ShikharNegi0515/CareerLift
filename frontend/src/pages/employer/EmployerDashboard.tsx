import { Link } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Briefcase, Users, Eye, TrendingUp, PlusCircle, ArrowRight, Clock } from 'lucide-react';

const recentJobs = [
  { id: '1', title: 'Senior React Developer', applicants: 24, views: 312, status: 'Published', postedAt: '3 days ago' },
  { id: '2', title: 'Backend Engineer', applicants: 18, views: 248, status: 'Published', postedAt: '5 days ago' },
  { id: '3', title: 'Product Designer', applicants: 9, views: 176, status: 'Published', postedAt: '1 week ago' },
  { id: '4', title: 'DevOps Engineer', applicants: 0, views: 12, status: 'Draft', postedAt: 'Not published' },
];

const recentApplicants = [
  { id: '1', name: 'Sarah Johnson', role: 'Senior React Developer', status: 'Shortlisted', time: '2 hours ago', initial: 'SJ' },
  { id: '2', name: 'Michael Chen', role: 'Backend Engineer', status: 'Under Review', time: '4 hours ago', initial: 'MC' },
  { id: '3', name: 'Emily Rodriguez', role: 'Product Designer', status: 'Applied', time: '1 day ago', initial: 'ER' },
];

export default function EmployerDashboard() {
  const { user } = useAuth();

  const stats = [
    { icon: Briefcase, label: 'Active Jobs', value: '8', color: '#0d6efd' },
    { icon: Users, label: 'Total Applicants', value: '147', color: '#198754' },
    { icon: Eye, label: 'Job Views', value: '3,248', color: '#fd7e14' },
    { icon: TrendingUp, label: 'Hired This Month', value: '3', color: '#6f42c1' },
  ];

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.625rem', color: '#212529', marginBottom: '0.25rem' }}>
            Employer Dashboard 🏢
          </h1>
          <p style={{ color: '#6c757d' }}>Welcome back, {user?.firstName}. Here's your hiring overview.</p>
        </div>
        <Link to="/employer/jobs/new" className="btn btn-primary">
          <PlusCircle size={16} /> Post a Job
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map((stat) => (
          <div key={stat.label} className="card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <stat.icon size={20} style={{ color: stat.color }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#212529' }}>{stat.value}</span>
            </div>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Jobs */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>Recent Job Postings</h3>
            <Link to="/employer/jobs" style={{ fontSize: '0.8125rem', color: '#0d6efd', textDecoration: 'none' }}>Manage all</Link>
          </div>
          {recentJobs.map((job) => (
            <div key={job.id} style={{ paddingBottom: '0.875rem', marginBottom: '0.875rem', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', marginBottom: 2 }}>{job.title}</p>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.775rem', color: '#6c757d' }}>
                    <span><Users size={11} style={{ marginRight: 3 }} />{job.applicants} applicants</span>
                    <span><Eye size={11} style={{ marginRight: 3 }} />{job.views} views</span>
                    <span><Clock size={11} style={{ marginRight: 3 }} />{job.postedAt}</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: job.status === 'Published' ? '#198754' : '#6c757d', background: job.status === 'Published' ? '#d1e7dd' : '#e9ecef', padding: '2px 8px', borderRadius: 9999 }}>{job.status}</span>
              </div>
            </div>
          ))}
          <Link to="/employer/jobs/new" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            <PlusCircle size={14} /> Post New Job
          </Link>
        </div>

        {/* Recent Applicants */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>Recent Applicants</h3>
            <Link to="/employer/jobs/1/applicants" style={{ fontSize: '0.8125rem', color: '#0d6efd', textDecoration: 'none' }}>View all</Link>
          </div>
          {recentApplicants.map((applicant) => (
            <div key={applicant.id} style={{ display: 'flex', gap: 10, alignItems: 'center', paddingBottom: '0.875rem', marginBottom: '0.875rem', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#0d6efd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                {applicant.initial}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529' }}>{applicant.name}</p>
                <p style={{ fontSize: '0.775rem', color: '#6c757d' }}>Applied for: {applicant.role}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0d6efd', background: '#e8f0fe', padding: '2px 8px', borderRadius: 9999, display: 'block', marginBottom: 2 }}>{applicant.status}</span>
                <span style={{ fontSize: '0.7rem', color: '#adb5bd' }}>{applicant.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
