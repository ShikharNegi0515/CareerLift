import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, DollarSign, Zap, RefreshCw, Bookmark, ArrowRight, Loader2, Check } from 'lucide-react';
import api from '@/api/client';
import type { Job } from '@/types';

interface ScoredJob extends Job {
  matchScore: number;
  matchReason: string;
}

const matchColor = (match: number) => (match >= 85 ? '#198754' : match >= 70 ? '#0d6efd' : '#ffc107');

export default function SeekerRecommendations() {
  const [jobs, setJobs] = useState<ScoredJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

  const loadData = async () => {
    try {
      const [jobsRes, profileRes, savedRes] = await Promise.allSettled([
        api.get<Job[]>('/jobs'),
        api.get<any>('/users/profile'),
        api.get<any[]>('/saved-jobs'),
      ]);

      let savedIds = new Set<string>();
      if (savedRes.status === 'fulfilled' && Array.isArray(savedRes.value.data)) {
        savedIds = new Set(savedRes.value.data.map((item: any) => item.job?.id || item.jobId));
        setSavedJobIds(savedIds);
      }

      const userProfile = profileRes.status === 'fulfilled' ? profileRes.value.data : null;
      const rawJobs = jobsRes.status === 'fulfilled' && Array.isArray(jobsRes.value.data) ? jobsRes.value.data : [];

      const userSkills: string[] = userProfile?.skills
        ? Array.isArray(userProfile.skills)
          ? userProfile.skills.map((s: string) => s.toLowerCase().trim())
          : userProfile.skills.split(',').map((s: string) => s.toLowerCase().trim())
        : [];

      const scored: ScoredJob[] = rawJobs.map((job) => {
        let score = 70;
        const reasons: string[] = [];

        // Check skill match
        const extraSkills = (job as any).skillsRequired || (job as any).skills || [];
        const jobDesc = `${job.title} ${job.description || ''} ${Array.isArray(extraSkills) ? extraSkills.join(' ') : extraSkills}`.toLowerCase();
        const matchedSkills = userSkills.filter((skill) => jobDesc.includes(skill));

        if (matchedSkills.length > 0) {
          score += Math.min(25, matchedSkills.length * 8);
          reasons.push(`Matches your skills: ${matchedSkills.slice(0, 3).join(', ')}`);
        } else {
          reasons.push('Relevant to current tech industry vacancies');
        }

        if (userProfile?.preferredLocation && job.location?.toLowerCase().includes(userProfile.preferredLocation.toLowerCase())) {
          score += 5;
        }

        return {
          ...job,
          matchScore: Math.min(99, score),
          matchReason: reasons[0],
        };
      });

      scored.sort((a, b) => b.matchScore - a.matchScore);
      setJobs(scored);
    } catch (err) {
      console.error('Failed to load recommendations', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const toggleBookmark = async (jobId: string) => {
    const isSaved = savedJobIds.has(jobId);
    try {
      if (isSaved) {
        await api.delete(`/saved-jobs/${jobId}`);
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      } else {
        await api.post(`/saved-jobs/${jobId}`);
        setSavedJobIds((prev) => new Set(prev).add(jobId));
      }
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#0d6efd' }} />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>
            <Zap size={22} style={{ color: '#ffc107', marginRight: 6, verticalAlign: 'middle' }} />
            AI-Matched Jobs
          </h1>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Jobs dynamically matched to your profile skills and preferences.</p>
        </div>
        <button className="btn btn-light btn-sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} /> {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Match score legend */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { range: '85–100%', label: 'Excellent match', color: '#198754' },
          { range: '75–84%', label: 'Great match', color: '#0d6efd' },
          { range: '60–74%', label: 'Good match', color: '#ffc107' },
        ].map((item) => (
          <div key={item.range} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.color }} />
            <span style={{ fontSize: '0.875rem', color: '#495057' }}>
              <strong>{item.range}</strong> — {item.label}
            </span>
          </div>
        ))}
      </div>

      {jobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6c757d' }}>
          <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>No job listings available right now to compute matches.</p>
          <Link to="/jobs" className="btn btn-primary btn-sm">Explore All Jobs</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {jobs.map((job) => {
            const isBookmarked = savedJobIds.has(job.id);
            const initial = job.company?.name ? job.company.name.slice(0, 2).toUpperCase() : 'CO';
            const salary = job.salaryMin && job.salaryMax ? `$${(job.salaryMin/1000).toFixed(0)}k–$${(job.salaryMax/1000).toFixed(0)}k` : 'Competitive';

            return (
              <div key={job.id} className="card" style={{ position: 'relative', borderTop: `3px solid ${matchColor(job.matchScore)}` }}>
                {/* Match badge */}
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: matchColor(job.matchScore), color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '0.95rem', width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', lineHeight: 1 }}>
                  <span>{job.matchScore}%</span>
                  <span style={{ fontSize: '0.5rem', fontWeight: 500 }}>match</span>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: '0.75rem', paddingRight: 60 }}>
                  <div className="job-logo-placeholder" style={{ width: 44, height: 44, fontSize: '0.8rem', flexShrink: 0 }}>
                    {initial}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#212529', marginBottom: '0.25rem' }}>{job.title}</h3>
                    <div style={{ fontSize: '0.8rem', color: '#6c757d', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Building2 size={11} />{job.company?.name || 'Company'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={11} />{job.location || 'Remote'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <span className="job-badge badge-primary" style={{ textTransform: 'capitalize' }}>{job.jobType?.replace('_', ' ') || 'Full Time'}</span>
                  <span className="job-badge badge-success" style={{ textTransform: 'capitalize' }}>{job.workMode || 'Remote'}</span>
                  <span className="job-badge badge-secondary" style={{ display: 'flex', alignItems: 'center', gap: 3 }}><DollarSign size={10} />{salary}</span>
                </div>

                <div style={{ background: matchColor(job.matchScore) + '15', borderRadius: 6, padding: '0.5rem 0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Zap size={13} style={{ color: matchColor(job.matchScore), flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', color: '#495057' }}>{job.matchReason}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/jobs/${job.slug || job.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                    View & Apply <ArrowRight size={13} />
                  </Link>
                  <button
                    className="btn btn-light btn-sm"
                    onClick={() => toggleBookmark(job.id)}
                    title={isBookmarked ? 'Remove bookmark' : 'Save job'}
                    style={{ color: isBookmarked ? '#0d6efd' : '#6c757d' }}
                  >
                    <Bookmark size={15} fill={isBookmarked ? '#0d6efd' : 'none'} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/jobs" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          Browse All Jobs <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
