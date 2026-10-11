import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Briefcase, Users, Eye, TrendingUp, PlusCircle, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import api from '@/api/client';
import type { Job, Application } from '@/types';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);

  useEffect(() => {
    async function loadEmployerData() {
      try {
        setChecking(true);
        // First check onboarding
        const compRes = await api.get('/companies/my-company').catch(() => null);
        if (!compRes?.data) {
          navigate('/employer/onboarding', { replace: true });
          return;
        }

        const [jobsRes, appsRes] = await Promise.allSettled([
          api.get<Job[]>('/jobs/employer/me'),
          api.get<any[]>('/applications/employer'),
        ]);

        if (jobsRes.status === 'fulfilled' && Array.isArray(jobsRes.value.data)) {
          setJobs(jobsRes.value.data);
        }

        if (appsRes.status === 'fulfilled' && Array.isArray(appsRes.value.data)) {
          setApplicants(appsRes.value.data);
        }
      } catch (err) {
        console.error('Failed to load employer dashboard data', err);
      } finally {
        setChecking(false);
      }
    }

    loadEmployerData();
  }, [navigate]);

  const activeJobsCount = jobs.filter((j) => j.status === 'published').length;
  const totalApplicantsCount = applicants.length;
  const shortlistedCount = applicants.filter((a) => a.status === 'shortlisted' || a.status === 'hired').length;
  const totalViews = jobs.reduce((acc, curr) => acc + (curr.viewCount || (curr as any).viewsCount || 0), 0);

  const stats = [
    { icon: Briefcase, label: 'Active Jobs', value: activeJobsCount.toString(), color: '#0d6efd' },
    { icon: Users, label: 'Total Applicants', value: totalApplicantsCount.toString(), color: '#198754' },
    { icon: Eye, label: 'Total Job Views', value: totalViews.toString(), color: '#fd7e14' },
    { icon: TrendingUp, label: 'Shortlisted / Hired', value: shortlistedCount.toString(), color: '#6f42c1' },
  ];

  if (checking) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#0d6efd' }} />
        <style>{`@keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  const recentJobs = jobs.slice(0, 5);
  const recentApplicants = applicants.slice(0, 5);

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.625rem', color: '#212529', marginBottom: '0.25rem' }}>
            Employer Dashboard 🏢
          </h1>
          <p style={{ color: '#6c757d' }}>Welcome back, {user?.firstName}. Here's your hiring overview.</p>
        </div>
        <Link to="/employer/jobs/new" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
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
          {recentJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6c757d' }}>
              <Briefcase size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>No job listings created yet.</p>
              <Link to="/employer/jobs/new" className="btn btn-primary btn-sm">Create First Job</Link>
            </div>
          ) : (
            recentJobs.map((job) => (
              <div key={job.id} style={{ paddingBottom: '0.875rem', marginBottom: '0.875rem', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <Link to={`/jobs/${job.slug || job.id}`} style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', textDecoration: 'none', display: 'block', marginBottom: 2 }}>
                      {job.title}
                    </Link>
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.775rem', color: '#6c757d' }}>
                      <span><Users size={11} style={{ marginRight: 3, verticalAlign: 'middle' }} />{job.applicationCount || (job as any).applicantsCount || 0} applicants</span>
                      <span><Eye size={11} style={{ marginRight: 3, verticalAlign: 'middle' }} />{job.viewCount || (job as any).viewsCount || 0} views</span>
                      <span><Clock size={11} style={{ marginRight: 3, verticalAlign: 'middle' }} />{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: job.status === 'published' ? '#198754' : '#6c757d', background: job.status === 'published' ? '#d1e7dd' : '#e9ecef', padding: '2px 8px', borderRadius: 9999, textTransform: 'capitalize' }}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))
          )}
          <Link to="/employer/jobs/new" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            <PlusCircle size={14} /> Post New Job
          </Link>
        </div>

        {/* Recent Applicants */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>Recent Candidates</h3>
            <Link to="/employer/applicants" style={{ fontSize: '0.8125rem', color: '#0d6efd', textDecoration: 'none' }}>View all</Link>
          </div>
          {recentApplicants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6c757d' }}>
              <Users size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No applicants received yet.</p>
            </div>
          ) : (
            recentApplicants.map((a) => {
              const name = `${a.applicant?.firstName || ''} ${a.applicant?.lastName || ''}`.trim() || 'Applicant';
              const initial = (a.applicant?.firstName?.[0] || 'A') + (a.applicant?.lastName?.[0] || '');
              return (
                <div key={a.id} style={{ display: 'flex', gap: 10, alignItems: 'center', paddingBottom: '0.875rem', marginBottom: '0.875rem', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#0d6efd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                    {initial.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', marginBottom: 2 }}>{name}</p>
                    <p style={{ fontSize: '0.775rem', color: '#6c757d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Applied for: <strong>{a.job?.title || 'Job'}</strong>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0d6efd', background: '#e8f0fe', padding: '2px 8px', borderRadius: 9999, display: 'inline-block', marginBottom: 2, textTransform: 'capitalize' }}>
                      {a.status?.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#adb5bd', display: 'block' }}>
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
