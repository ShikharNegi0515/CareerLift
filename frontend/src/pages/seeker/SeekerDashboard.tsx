import { Link } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Briefcase, FileText, Bookmark, Star, TrendingUp, Eye, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const recentApplications = [
  { id: '1', title: 'Senior React Developer', company: 'TechCorp', status: 'Under Review', statusColor: '#ffc107', date: '2 days ago' },
  { id: '2', title: 'Product Manager', company: 'InnovateCo', status: 'Shortlisted', statusColor: '#198754', date: '4 days ago' },
  { id: '3', title: 'UX Designer', company: 'DesignStudio', status: 'Applied', statusColor: '#0d6efd', date: '1 week ago' },
  { id: '4', title: 'Data Scientist', company: 'DataWave', status: 'Rejected', statusColor: '#dc3545', date: '2 weeks ago' },
];

const recommendedJobs = [
  { id: '1', title: 'Full Stack Developer', company: 'CloudFirst', location: 'Remote', salary: '$110k–$140k', type: 'Full Time', initial: 'CF', match: 92 },
  { id: '2', title: 'Senior Frontend Engineer', company: 'BuildIt', location: 'Seattle, WA', salary: '$120k–$155k', type: 'Full Time', initial: 'BI', match: 88 },
  { id: '3', title: 'React Native Developer', company: 'AppForge', location: 'Austin, TX', salary: '$100k–$130k', type: 'Contract', initial: 'AF', match: 85 },
];

export default function SeekerDashboard() {
  const { user } = useAuth();

  const stats = [
    { icon: FileText, label: 'Applications', value: '12', trend: '+3 this week', color: '#0d6efd' },
    { icon: Eye, label: 'Profile Views', value: '248', trend: '+18 this week', color: '#198754' },
    { icon: Bookmark, label: 'Saved Jobs', value: '7', trend: '2 new matches', color: '#fd7e14' },
    { icon: Star, label: 'Profile Score', value: '78%', trend: 'Add skills to improve', color: '#6f42c1' },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Welcome */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.625rem', color: '#212529', marginBottom: '0.25rem' }}>
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p style={{ color: '#6c757d' }}>Here's your job search overview.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map((stat) => (
          <div key={stat.label} className="card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <stat.icon size={20} style={{ color: stat.color }} />
              <span style={{ fontSize: '1.75rem', fontFamily: 'Inter, sans-serif', fontWeight: 800, color: '#212529' }}>{stat.value}</span>
            </div>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', marginBottom: '0.25rem' }}>{stat.label}</p>
            <p style={{ fontSize: '0.75rem', color: '#6c757d' }}>{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Profile completion */}
      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #e8f0fe 0%, #cfe2ff 100%)', border: '1px solid #b6d4fe' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#212529', marginBottom: '0.25rem' }}>Complete Your Profile</h3>
            <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>A complete profile gets 5x more recruiter attention.</p>
          </div>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#0d6efd' }}>78%</span>
        </div>
        <div style={{ background: '#dee2e6', borderRadius: 4, height: 8, marginBottom: '1rem' }}>
          <div style={{ width: '78%', height: '100%', background: '#0d6efd', borderRadius: 4, transition: 'width 0.5s' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {['Add headline', 'Upload resume', 'Add 3+ skills'].map((task) => (
            <span key={task} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', color: '#0d6efd', background: 'rgba(13,110,253,0.1)', padding: '4px 10px', borderRadius: 9999 }}>
              <TrendingUp size={12} /> {task}
            </span>
          ))}
        </div>
        <Link to="/dashboard/profile" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
          Complete Profile <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Applications */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>Recent Applications</h3>
            <Link to="/dashboard/applications" style={{ fontSize: '0.8125rem', color: '#0d6efd', textDecoration: 'none' }}>View all</Link>
          </div>
          {recentApplications.map((app) => (
            <div key={app.id} style={{ paddingBottom: '0.875rem', marginBottom: '0.875rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529' }}>{app.title}</p>
                <p style={{ fontSize: '0.8rem', color: '#6c757d' }}>{app.company} · {app.date}</p>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: app.statusColor, background: app.statusColor + '20', padding: '3px 8px', borderRadius: 9999 }}>
                {app.status}
              </span>
            </div>
          ))}
        </div>

        {/* Recommended Jobs */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>Recommended for You</h3>
            <Link to="/dashboard/recommendations" style={{ fontSize: '0.8125rem', color: '#0d6efd', textDecoration: 'none' }}>View all</Link>
          </div>
          {recommendedJobs.map((job) => (
            <div key={job.id} style={{ paddingBottom: '0.875rem', marginBottom: '0.875rem', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div className="job-logo-placeholder" style={{ width: 40, height: 40, fontSize: '0.75rem', flexShrink: 0 }}>{job.initial}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/jobs/${job.id}`} style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', textDecoration: 'none' }}>{job.title}</Link>
                  <p style={{ fontSize: '0.775rem', color: '#6c757d' }}>{job.company} · {job.location}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.775rem', color: '#0d6efd', fontWeight: 600 }}>{job.salary}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#198754' }}>{job.match}% match</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
