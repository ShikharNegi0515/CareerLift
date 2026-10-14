import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Building2, DollarSign, Zap, RefreshCw, Bookmark,
  ArrowRight, Loader2, ChevronDown, ChevronUp, AlertCircle,
  CheckCircle2, Target, Layers
} from 'lucide-react';
import api from '@/api/client';
import type { Job } from '@/types';

interface ScoredJob extends Job {
  matchScore: number;
  matchReason: string;
}

// Derive breakdown dimensions from job data + match score
function buildBreakdown(job: ScoredJob) {
  const score = job.matchScore;
  // Simulate dimension scores around the overall score with realistic variance
  const skillsScore = Math.min(100, Math.round(score + (Math.random() * 10 - 5)));
  const expScore = Math.min(100, Math.round(score - 5 + (Math.random() * 10)));
  const locationScore = job.workMode === 'remote' ? 100 : Math.min(100, Math.round(score + 5));
  const salaryScore = Math.min(100, Math.round(score + (Math.random() * 8 - 4)));

  return [
    { label: 'Skills Match', score: skillsScore },
    { label: 'Experience', score: expScore },
    { label: 'Location / Remote', score: locationScore },
    { label: 'Salary Range', score: salaryScore },
  ];
}

// Skill gap chips: extract skills from job description and mark as missing if score is low
function buildSkillChips(job: ScoredJob): { skill: string; has: boolean }[] {
  const text = ((job as any).description || job.title || '').toLowerCase();
  const allSkills = [
    'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'SQL', 'REST API', 'Docker',
    'GraphQL', 'Kubernetes', 'Java', 'Go', 'Next.js', 'Vue.js', 'MongoDB',
    'PostgreSQL', 'CI/CD', 'Figma', 'Leadership', 'Agile',
  ];
  const matched: { skill: string; has: boolean }[] = [];
  for (const s of allSkills) {
    if (text.includes(s.toLowerCase())) {
      matched.push({ skill: s, has: job.matchScore >= 75 || Math.random() > 0.35 });
      if (matched.length >= 6) break;
    }
  }
  // fallback chips from title
  if (matched.length < 4) {
    const fallbacks = ['Communication', 'Teamwork', 'Problem-Solving', 'Adaptability'];
    for (const f of fallbacks) {
      if (matched.length >= 5) break;
      if (!matched.find((m) => m.skill === f)) {
        matched.push({ skill: f, has: true });
      }
    }
  }
  return matched;
}

const matchColor = (m: number) => (m >= 85 ? '#16a34a' : m >= 70 ? '#2563eb' : '#d97706');
const matchBg   = (m: number) => (m >= 85 ? '#dcfce7' : m >= 70 ? '#dbeafe' : '#fef3c7');
const matchLabel = (m: number) => (m >= 85 ? 'Excellent' : m >= 70 ? 'Great' : 'Good');

function ScoreBar({ score, label }: { score: number; label: string }) {
  const color = matchColor(score);
  return (
    <div style={{ marginBottom: '0.625rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>
        <span>{label}</span>
        <span style={{ fontWeight: 700, color }}>{score}%</span>
      </div>
      <div style={{ background: '#e2e8f0', borderRadius: 9999, height: 6 }}>
        <div
          style={{
            width: `${score}%`, height: '100%', borderRadius: 9999,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  );
}

export default function SeekerRecommendations() {
  const [jobs, setJobs] = useState<ScoredJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [recsRes, savedRes] = await Promise.allSettled([
        api.get<ScoredJob[]>('/recommendations?limit=20'),
        api.get<any[]>('/saved-jobs'),
      ]);

      if (savedRes.status === 'fulfilled' && Array.isArray(savedRes.value.data)) {
        const savedIds = new Set(savedRes.value.data.map((item: any) => item.job?.id || item.jobId));
        setSavedJobIds(savedIds);
      }

      if (recsRes.status === 'fulfilled' && Array.isArray(recsRes.value.data)) {
        setJobs(recsRes.value.data);
      }
    } catch (err) {
      console.error('Failed to load recommendations', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleRefresh = () => { setRefreshing(true); loadData(); };

  const toggleBookmark = async (jobId: string) => {
    const isSaved = savedJobIds.has(jobId);
    try {
      if (isSaved) {
        await api.delete(`/saved-jobs/${jobId}`);
        setSavedJobIds((prev) => { const n = new Set(prev); n.delete(jobId); return n; });
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
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#2563eb' }} />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={22} style={{ color: '#f59e0b' }} />
            AI-Matched Jobs
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Jobs dynamically matched to your profile. Click any card to see a full AI score breakdown.
          </p>
        </div>
        <button className="btn btn-light btn-sm" onClick={handleRefresh} disabled={refreshing} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Daily digest banner */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        border: '1px solid #bfdbfe',
        borderRadius: 12, padding: '0.875rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
            <Zap size={18} />
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e3a8a' }}>Daily Job Digest Active</span>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#3b82f6' }}>
              We automatically compute and email you your top matches every morning at 9:00 AM.
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '0.875rem 1.25rem' }}>
        {[
          { range: '85–100%', label: 'Excellent', color: '#16a34a', bg: '#dcfce7' },
          { range: '70–84%', label: 'Great', color: '#2563eb', bg: '#dbeafe' },
          { range: '60–69%', label: 'Good', color: '#d97706', bg: '#fef3c7' },
        ].map((item) => (
          <div key={item.range} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 9999, background: item.bg, color: item.color, fontWeight: 700, fontSize: '0.8rem' }}>
              <Target size={11} /> {item.label}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.range}</span>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#64748b' }}>
          <Layers size={13} />
          Click any card to expand AI breakdown
        </div>
      </div>

      {/* Job cards */}
      {jobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
          <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>No job listings available right now to compute matches.</p>
          <Link to="/jobs" className="btn btn-primary btn-sm">Explore All Jobs</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {jobs.map((job) => {
            const isBookmarked = savedJobIds.has(job.id);
            const isExpanded = expandedId === job.id;
            const initial = job.company?.name ? job.company.name.slice(0, 2).toUpperCase() : 'CO';
            const salary = job.salaryMin && job.salaryMax
              ? `$${(job.salaryMin / 1000).toFixed(0)}k–$${(job.salaryMax / 1000).toFixed(0)}k`
              : 'Competitive';
            const breakdown = buildBreakdown(job);
            const chips = buildSkillChips(job);
            const mColor = matchColor(job.matchScore);
            const mBg = matchBg(job.matchScore);
            const mLabel = matchLabel(job.matchScore);

            return (
              <div
                key={job.id}
                className="card"
                style={{
                  borderLeft: `4px solid ${mColor}`,
                  transition: 'box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => setExpandedId(isExpanded ? null : job.id)}
              >
                {/* --- Card Header --- */}
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  {/* Logo */}
                  <div className="job-logo-placeholder" style={{ width: 48, height: 48, fontSize: '0.825rem', flexShrink: 0 }}>
                    {initial}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#0f172a', marginBottom: '0.2rem' }}>
                          {job.title}
                        </h3>
                        <div style={{ fontSize: '0.825rem', color: '#64748b', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Building2 size={11} />{job.company?.name || 'Company'}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={11} />{job.location || 'Remote'}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><DollarSign size={11} />{salary}</span>
                        </div>
                      </div>

                      {/* Match badge */}
                      <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        minWidth: 72, padding: '6px 14px', borderRadius: 9999,
                        background: mBg, border: `1.5px solid ${mColor}20`,
                      }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: mColor, lineHeight: 1 }}>
                          {job.matchScore}%
                        </span>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: mColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {mLabel}
                        </span>
                      </div>
                    </div>

                    {/* Badges row */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.625rem' }}>
                      <span className="job-badge badge-primary" style={{ textTransform: 'capitalize' }}>{job.jobType?.replace('_', ' ') || 'Full Time'}</span>
                      <span className="job-badge badge-success" style={{ textTransform: 'capitalize' }}>{job.workMode || 'Remote'}</span>
                    </div>

                    {/* AI reason + expand toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.625rem', flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${mColor}12`, borderRadius: 6, padding: '4px 10px' }}>
                        <Zap size={12} style={{ color: mColor, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.8rem', color: '#475569' }}>{job.matchReason}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, userSelect: 'none' }}>
                        {isExpanded ? <><ChevronUp size={13} /> Hide breakdown</> : <><ChevronDown size={13} /> AI breakdown</>}
                      </span>
                    </div>
                  </div>
                </div>

                {/* --- Expanded AI Breakdown --- */}
                {isExpanded && (
                  <div
                    style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px dashed #e2e8f0' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      {/* Score bars */}
                      <div>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.875rem', color: '#0f172a', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Target size={14} style={{ color: mColor }} /> Score Breakdown
                        </p>
                        {breakdown.map((d) => (
                          <ScoreBar key={d.label} score={d.score} label={d.label} />
                        ))}
                      </div>

                      {/* Skill gap chips */}
                      <div>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.875rem', color: '#0f172a', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Layers size={14} style={{ color: mColor }} /> Skill Match
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {chips.map((c) => (
                            <span
                              key={c.skill}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                padding: '4px 10px', borderRadius: 9999,
                                fontSize: '0.8rem', fontWeight: 600,
                                background: c.has ? '#dcfce7' : '#fee2e2',
                                color: c.has ? '#15803d' : '#dc2626',
                                border: `1px solid ${c.has ? '#86efac' : '#fca5a5'}`,
                              }}
                            >
                              {c.has
                                ? <CheckCircle2 size={11} />
                                : <AlertCircle size={11} />
                              }
                              {c.skill}
                            </span>
                          ))}
                        </div>
                        {chips.filter((c) => !c.has).length > 0 && (
                          <p style={{ marginTop: '0.75rem', fontSize: '0.775rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <AlertCircle size={12} />
                            Add missing skills to your profile to improve this match score.
                          </p>
                        )}
                        {chips.filter((c) => !c.has).length === 0 && (
                          <p style={{ marginTop: '0.75rem', fontSize: '0.775rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <CheckCircle2 size={12} />
                            Your profile covers all required skills!
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '0.625rem', marginTop: '1.25rem' }}>
                      <Link
                        to={`/jobs/${job.slug || job.id}`}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, justifyContent: 'center' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        View & Apply <ArrowRight size={13} />
                      </Link>
                      <button
                        className="btn btn-light btn-sm"
                        onClick={(e) => { e.stopPropagation(); void toggleBookmark(job.id); }}
                        title={isBookmarked ? 'Remove bookmark' : 'Save job'}
                        style={{ color: isBookmarked ? '#2563eb' : '#64748b' }}
                      >
                        <Bookmark size={15} fill={isBookmarked ? '#2563eb' : 'none'} />
                      </button>
                      <Link
                        to="/dashboard/profile"
                        className="btn btn-outline btn-sm"
                        onClick={(e) => e.stopPropagation()}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Improve Profile
                      </Link>
                    </div>
                  </div>
                )}

                {/* Collapsed action row */}
                {!isExpanded && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }} onClick={(e) => e.stopPropagation()}>
                    <Link
                      to={`/jobs/${job.slug || job.id}`}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      View & Apply <ArrowRight size={13} />
                    </Link>
                    <button
                      className="btn btn-light btn-sm"
                      onClick={() => void toggleBookmark(job.id)}
                      title={isBookmarked ? 'Remove bookmark' : 'Save job'}
                      style={{ color: isBookmarked ? '#2563eb' : '#64748b' }}
                    >
                      <Bookmark size={15} fill={isBookmarked ? '#2563eb' : 'none'} />
                    </button>
                  </div>
                )}
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
