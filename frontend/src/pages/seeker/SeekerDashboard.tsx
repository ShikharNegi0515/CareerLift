import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Briefcase, FileText, Bookmark, Star, TrendingUp, Eye, Clock, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/api/client';
import type { Application, Job } from '@/types';

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(60);
  const [missingItems, setMissingItems] = useState<string[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        const [appsRes, savedRes, profileRes, jobsRes] = await Promise.allSettled([
          api.get<Application[]>('/applications/me'),
          api.get<any[]>('/saved-jobs'),
          api.get<any>('/users/profile'),
          api.get<Job[]>('/jobs'),
        ]);

        if (appsRes.status === 'fulfilled' && Array.isArray(appsRes.value.data)) {
          setApplications(appsRes.value.data);
        }

        if (savedRes.status === 'fulfilled' && Array.isArray(savedRes.value.data)) {
          setSavedJobsCount(savedRes.value.data.length);
        }

        if (profileRes.status === 'fulfilled' && profileRes.value.data) {
          const p = profileRes.value.data;
          let score = 20; // Base registered user
          const missing: string[] = [];

          if (p.headline && p.headline.trim().length > 0) score += 20;
          else missing.push('Add headline');

          if (p.skills && (Array.isArray(p.skills) ? p.skills.length > 0 : p.skills.trim().length > 0)) score += 20;
          else missing.push('Add 3+ skills');

          if (p.bio && p.bio.trim().length > 0) score += 15;
          else missing.push('Add summary bio');

          if (p.location && p.location.trim().length > 0) score += 15;
          else missing.push('Add location');

          if (p.experienceYears !== undefined && p.experienceYears !== null) score += 10;
          else missing.push('Add experience');

          setProfileCompletion(Math.min(100, score));
          setMissingItems(missing.slice(0, 3));
        }

        if (jobsRes.status === 'fulfilled' && Array.isArray(jobsRes.value.data)) {
          setRecommendedJobs(jobsRes.value.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load seeker dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const stats = [
    { icon: FileText, label: 'Applications', value: applications.length.toString(), trend: `${applications.filter(a => a.status === 'under_review' || a.status === 'shortlisted').length} in active review`, color: '#0d6efd' },
    { icon: Bookmark, label: 'Saved Jobs', value: savedJobsCount.toString(), trend: 'Bookmarks saved', color: '#fd7e14' },
    { icon: Star, label: 'Profile Score', value: `${profileCompletion}%`, trend: profileCompletion >= 80 ? 'Profile looks strong!' : 'Add details to improve', color: '#6f42c1' },
    { icon: TrendingUp, label: 'Available Jobs', value: recommendedJobs.length.toString(), trend: 'Open vacancies now', color: '#198754' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return '#0d6efd';
      case 'under_review': return '#ffc107';
      case 'shortlisted': return '#198754';
      case 'rejected': return '#dc3545';
      case 'hired': return '#0dcaf0';
      default: return '#6c757d';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#0d6efd' }} />
      </div>
    );
  }

  const recentApps = applications.slice(0, 5);

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
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#0d6efd' }}>{profileCompletion}%</span>
        </div>
        <div style={{ background: '#dee2e6', borderRadius: 4, height: 8, marginBottom: '1rem' }}>
          <div style={{ width: `${profileCompletion}%`, height: '100%', background: '#0d6efd', borderRadius: 4, transition: 'width 0.5s' }} />
        </div>
        {missingItems.length > 0 ? (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {missingItems.map((task) => (
              <span key={task} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', color: '#0d6efd', background: 'rgba(13,110,253,0.1)', padding: '4px 10px', borderRadius: 9999 }}>
                <TrendingUp size={12} /> {task}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: '#198754', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle size={16} /> Great job! Your profile details are well maintained.
          </p>
        )}
        <Link to="/dashboard/profile" className="btn btn-primary btn-sm" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          Update Profile <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Applications */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>Recent Applications</h3>
            <Link to="/dashboard/applications" style={{ fontSize: '0.8125rem', color: '#0d6efd', textDecoration: 'none' }}>View all</Link>
          </div>
          {recentApps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6c757d' }}>
              <FileText size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>You haven't submitted any applications yet.</p>
              <Link to="/jobs" className="btn btn-primary btn-sm">Explore Open Jobs</Link>
            </div>
          ) : (
            recentApps.map((app) => (
              <div key={app.id} style={{ paddingBottom: '0.875rem', marginBottom: '0.875rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Link to={`/jobs/${app.job?.slug || app.job?.id || ''}`} style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', textDecoration: 'none' }}>
                    {app.job?.title || 'Job Listing'}
                  </Link>
                  <p style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                    {app.job?.company?.name || 'Company'} · {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: getStatusColor(app.status), background: getStatusColor(app.status) + '20', padding: '3px 8px', borderRadius: 9999 }}>
                  {formatStatus(app.status)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Recommended Jobs */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>Recommended for You</h3>
            <Link to="/dashboard/recommendations" style={{ fontSize: '0.8125rem', color: '#0d6efd', textDecoration: 'none' }}>View all</Link>
          </div>
          {recommendedJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6c757d' }}>
              <Briefcase size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No recommendations right now.</p>
            </div>
          ) : (
            recommendedJobs.map((job) => (
              <div key={job.id} style={{ paddingBottom: '0.875rem', marginBottom: '0.875rem', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div className="job-logo-placeholder" style={{ width: 40, height: 40, fontSize: '0.75rem', flexShrink: 0 }}>
                    {job.company?.name ? job.company.name.slice(0, 2).toUpperCase() : 'CO'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/jobs/${job.slug || job.id}`} style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', textDecoration: 'none' }}>
                      {job.title}
                    </Link>
                    <p style={{ fontSize: '0.775rem', color: '#6c757d' }}>
                      {job.company?.name || 'Company'} · {job.location || 'Remote'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '0.775rem', color: '#0d6efd', fontWeight: 600 }}>
                        {job.salaryMin && job.salaryMax ? `$${(job.salaryMin/1000).toFixed(0)}k–$${(job.salaryMax/1000).toFixed(0)}k` : 'Competitive'}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#198754' }}>
                        Match
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
