import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Briefcase, Clock, DollarSign, Building2, Globe, Users,
  Share2, Bookmark, CheckCircle, ChevronRight, Monitor, ExternalLink,
  AlertCircle, Loader2, FileText, Upload
} from 'lucide-react';
import api from '@/api/client';
import { useAuth } from '@/store/auth';
import type { Resume } from '@/types';

// Fallback mock job data if the job isn't found in the database
const defaultMockJob = {
  id: '1',
  title: 'Senior React Developer',
  company: {
    name: 'TechCorp',
    initial: 'TC',
    location: 'San Francisco, CA',
    website: 'https://techcorp.com',
    size: '500–1000 employees',
    industry: 'Technology',
  },
  location: 'San Francisco, CA',
  jobType: 'Full Time',
  workMode: 'Remote',
  experienceLevel: 'Senior',
  salaryMin: 120000,
  salaryMax: 160000,
  postedAt: '2 days ago',
  deadline: 'November 30, 2026',
  category: 'Technology',
  description: `We're looking for a Senior React Developer to join our growing engineering team. You'll be building cutting-edge web applications that serve millions of users worldwide.\n\nAs a Senior React Developer, you'll lead technical decisions, mentor junior developers, and collaborate closely with product and design teams to deliver exceptional user experiences.`,
  responsibilities: [
    'Lead development of new features using React, TypeScript, and modern frontend tooling',
    'Collaborate with UX/UI designers to implement pixel-perfect designs',
    'Write clean, maintainable, and well-tested code',
    'Mentor junior developers and conduct code reviews',
    'Participate in architecture discussions and technical planning',
    'Optimize application performance and ensure scalability',
  ],
  requirements: [
    '5+ years of experience with React.js and TypeScript',
    'Strong understanding of state management (Redux, Zustand, or similar)',
    'Experience with testing frameworks (Jest, React Testing Library)',
    'Familiarity with REST APIs and GraphQL',
    'Experience with CI/CD pipelines and modern DevOps practices',
    'Excellent communication skills and team-first mindset',
  ],
  benefits: [
    'Competitive salary ($120k–$160k DOE)',
    'Comprehensive health, dental, and vision insurance',
    'Flexible remote work policy',
    '401(k) with 4% company match',
    '$2,000 annual learning & development budget',
    'Unlimited PTO with minimum 2 weeks encouraged',
  ],
  skills: ['React', 'TypeScript', 'Redux', 'GraphQL', 'Jest', 'Node.js'],
};

export default function JobDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState<any>(defaultMockJob);
  const [loading, setLoading] = useState(true);
  const [relatedJobs, setRelatedJobs] = useState<any[]>([]);

  // Apply & Save states
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Apply Modal form
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submittingApply, setSubmittingApply] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  // Fetch Job details and related jobs
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchJob = async () => {
      try {
        if (!slug) return;
        const res = await api.get(`/jobs/${slug}`);
        if (res.data && isMounted) {
          const raw = res.data;
          // Parse helper lists
          const parseList = (val: any) => {
            if (!val) return [];
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') {
              try {
                const parsed = JSON.parse(val);
                if (Array.isArray(parsed)) return parsed;
              } catch {
                return val.split('\n').filter((l: string) => l.trim().length > 0);
              }
            }
            return [];
          };

          const formattedJob = {
            id: raw.id,
            title: raw.title,
            company: {
              name: raw.company?.name || raw.companyName || 'Top Company',
              initial: (raw.company?.name || 'TC').slice(0, 2).toUpperCase(),
              location: raw.company?.location || raw.location || 'Remote',
              website: raw.company?.website || 'https://careerlift.com',
              size: raw.company?.companySize || '50–200 employees',
              industry: raw.company?.industry || raw.category?.name || 'Technology',
            },
            location: raw.location || 'Remote',
            jobType: raw.jobType ? raw.jobType.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'Full Time',
            workMode: raw.workMode ? raw.workMode.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'Remote',
            experienceLevel: raw.experienceLevel ? raw.experienceLevel.charAt(0).toUpperCase() + raw.experienceLevel.slice(1) : 'Mid',
            salaryMin: raw.salaryMin || 100000,
            salaryMax: raw.salaryMax || 140000,
            postedAt: raw.createdAt ? new Date(raw.createdAt).toLocaleDateString() : 'Recently',
            deadline: raw.applicationDeadline ? new Date(raw.applicationDeadline).toLocaleDateString() : 'Open until filled',
            category: raw.category?.name || 'Technology',
            description: raw.description || defaultMockJob.description,
            responsibilities: parseList(raw.responsibilities).length > 0 ? parseList(raw.responsibilities) : defaultMockJob.responsibilities,
            requirements: parseList(raw.requirements).length > 0 ? parseList(raw.requirements) : defaultMockJob.requirements,
            benefits: parseList(raw.benefits).length > 0 ? parseList(raw.benefits) : defaultMockJob.benefits,
            skills: Array.isArray(raw.skills) && raw.skills.length > 0 ? raw.skills : defaultMockJob.skills,
          };
          setJob(formattedJob);
        }
      } catch (err) {
        console.warn('Could not fetch real job, falling back to sample:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const fetchRelated = async () => {
      try {
        const res = await api.get('/jobs');
        if (Array.isArray(res.data) && isMounted) {
          const list = res.data
            .filter((j: any) => j.id !== slug && j.slug !== slug)
            .slice(0, 3)
            .map((j: any) => ({
              id: j.id,
              title: j.title,
              company: j.company?.name || 'Company',
              location: j.location || 'Remote',
              type: j.jobType ? j.jobType.replace('_', ' ') : 'Full Time',
              initial: (j.company?.name || 'CO').slice(0, 2).toUpperCase(),
            }));
          setRelatedJobs(list);
        }
      } catch (err) {
        console.error('Failed to fetch related jobs', err);
      }
    };

    fetchJob();
    fetchRelated();

    return () => { isMounted = false; };
  }, [slug]);

  // Check saved & applied status if user is logged in
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'job_seeker' || !job.id) return;

    const checkStatuses = async () => {
      try {
        const [appRes, saveRes] = await Promise.allSettled([
          api.get('/applications/me'),
          api.get('/saved-jobs/me'),
        ]);

        if (appRes.status === 'fulfilled' && Array.isArray(appRes.value.data)) {
          const hasApplied = appRes.value.data.some((a: any) => a.job?.id === job.id || a.job?.slug === slug);
          setApplied(hasApplied);
        }

        if (saveRes.status === 'fulfilled' && Array.isArray(saveRes.value.data)) {
          const hasSaved = saveRes.value.data.some((s: any) => s.job?.id === job.id || s.job?.slug === slug);
          setSaved(hasSaved);
        }
      } catch (e) {
        console.error('Error checking user job status', e);
      }
    };

    checkStatuses();
  }, [isAuthenticated, user, job.id, slug]);

  // Handle open apply modal
  const handleOpenApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'job_seeker') {
      alert('Only job seekers can apply for jobs.');
      return;
    }

    setApplyError(null);
    setApplySuccess(false);

    try {
      const res = await api.get<Resume[]>('/resumes');
      setResumes(res.data);
      const defaultRes = res.data.find((r) => r.isDefault) || res.data[0];
      if (defaultRes) {
        setSelectedResumeId(defaultRes.id);
      }
    } catch (e) {
      console.error('Failed to load resumes', e);
    }

    setShowApplyModal(true);
  };

  // Submit Application
  const handleSubmitApplication = async () => {
    if (!selectedResumeId) {
      setApplyError('Please select a resume to attach to your application.');
      return;
    }

    setSubmittingApply(true);
    setApplyError(null);

    try {
      await api.post(`/applications/${job.id}`, {
        coverLetter: coverLetter.trim() || undefined,
        resumeId: selectedResumeId,
      });

      setApplied(true);
      setApplySuccess(true);
      setTimeout(() => {
        setShowApplyModal(false);
      }, 1500);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to submit application. Please try again.';
      setApplyError(message);
    } finally {
      setSubmittingApply(false);
    }
  };

  // Toggle Save / Bookmark
  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'job_seeker') {
      alert('Only job seekers can save jobs.');
      return;
    }

    setSaveLoading(true);
    try {
      if (saved) {
        await api.delete(`/saved-jobs/${job.id}`);
        setSaved(false);
      } else {
        await api.post(`/saved-jobs/${job.id}`);
        setSaved(true);
      }
    } catch (err) {
      console.error('Failed to toggle save job', err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#0d6efd' }} />
      </div>
    );
  }

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div className="container">
          <h1>{job.title}</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item"><Link to="/jobs">Jobs</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item active">{job.title}</li>
          </ol>
        </div>
      </div>

      <section className="section-py" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
            {/* Main content */}
            <div>
              {/* Job card header */}
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div className="job-logo-placeholder" style={{ width: 80, height: 80, fontSize: '1.5rem' }}>
                    {job.company.initial}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.5rem' }}>
                      {job.title}
                    </h2>
                    <div className="job-meta">
                      <span className="job-meta-item"><Building2 size={14} /> {job.company.name}</span>
                      <span className="job-meta-item"><MapPin size={14} /> {job.location}</span>
                      <span className="job-meta-item"><Clock size={14} /> {job.postedAt}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                      <span className="job-badge badge-primary">{job.jobType}</span>
                      <span className="job-badge badge-success">{job.workMode}</span>
                      <span className="job-badge badge-secondary">{job.experienceLevel}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {!applied ? (
                    <button
                      onClick={handleOpenApply}
                      className="btn btn-primary btn-lg"
                    >
                      <Briefcase size={18} /> Apply Now
                    </button>
                  ) : (
                    <span className="btn btn-lg" style={{ background: '#d1e7dd', color: '#0a3622', borderColor: '#badbcc', fontWeight: 600 }}>
                      <CheckCircle size={18} style={{ marginRight: 6 }} /> Application Submitted!
                    </span>
                  )}
                  <button
                    onClick={handleToggleSave}
                    disabled={saveLoading}
                    className={`btn btn-lg ${saved ? 'btn-primary' : 'btn-light'}`}
                  >
                    {saveLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : (
                      <Bookmark size={18} fill={saved ? '#fff' : 'none'} />
                    )}
                    {saved ? 'Saved' : 'Save Job'}
                  </button>
                  <button onClick={handleShare} className="btn btn-light btn-lg">
                    <Share2 size={18} /> {copied ? 'Link Copied!' : 'Share'}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="card-title">Job Description</h3>
                <p style={{ color: '#495057', lineHeight: 1.8, whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
                  {job.description}
                </p>

                {job.responsibilities && job.responsibilities.length > 0 && (
                  <>
                    <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#212529', marginBottom: '0.75rem' }}>Responsibilities</h4>
                    <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
                      {job.responsibilities.map((r: string, i: number) => (
                        <li key={i} style={{ color: '#495057', marginBottom: '0.5rem', lineHeight: 1.6 }}>{r}</li>
                      ))}
                    </ul>
                  </>
                )}

                {job.requirements && job.requirements.length > 0 && (
                  <>
                    <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#212529', marginBottom: '0.75rem' }}>Requirements</h4>
                    <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
                      {job.requirements.map((r: string, i: number) => (
                        <li key={i} style={{ color: '#495057', marginBottom: '0.5rem', lineHeight: 1.6 }}>{r}</li>
                      ))}
                    </ul>
                  </>
                )}

                {job.benefits && job.benefits.length > 0 && (
                  <>
                    <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#212529', marginBottom: '0.75rem' }}>Benefits</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {job.benefits.map((b: string, i: number) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#495057', marginBottom: '0.5rem' }}>
                          <CheckCircle size={16} style={{ color: '#198754', marginTop: 2, flexShrink: 0 }} />{b}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="card">
                  <h3 className="card-title">Required Skills</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {job.skills.map((s: string) => (
                      <span key={s} className="job-badge badge-primary" style={{ fontSize: '0.875rem' }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              {/* Job overview */}
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="card-title">Job Overview</h3>
                {[
                  { icon: DollarSign, label: 'Salary', value: `$${(job.salaryMin / 1000).toFixed(0)}k – $${(job.salaryMax / 1000).toFixed(0)}k` },
                  { icon: Briefcase, label: 'Job Type', value: job.jobType },
                  { icon: Monitor, label: 'Work Mode', value: job.workMode },
                  { icon: MapPin, label: 'Location', value: job.location },
                  { icon: Clock, label: 'Deadline', value: job.deadline },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <item.icon size={16} style={{ color: '#0d6efd' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: 2 }}>{item.label}</p>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#212529' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Company info */}
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="card-title">About {job.company.name}</h3>
                <div className="job-logo-placeholder" style={{ margin: '0 auto 1rem', width: 64, height: 64 }}>
                  {job.company.initial}
                </div>
                <h4 style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 700, marginBottom: '1rem' }}>
                  {job.company.name}
                </h4>
                {[
                  { icon: Globe, label: job.company.website, href: job.company.website },
                  { icon: MapPin, label: job.company.location },
                  { icon: Users, label: job.company.size },
                  { icon: Building2, label: job.company.industry },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6c757d' }}>
                    <item.icon size={14} style={{ color: '#0d6efd', flexShrink: 0 }} />
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ color: '#0d6efd', textDecoration: 'none' }}>
                        {item.label} <ExternalLink size={11} />
                      </a>
                    ) : item.label}
                  </div>
                ))}
                <Link to={`/companies`} className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                  View Companies
                </Link>
              </div>

              {/* Related jobs */}
              {relatedJobs.length > 0 && (
                <div className="card">
                  <h3 className="card-title">Similar Jobs</h3>
                  {relatedJobs.map((rj) => (
                    <div key={rj.id} style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #e9ecef' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div className="job-logo-placeholder" style={{ width: 44, height: 44, fontSize: '0.875rem' }}>{rj.initial}</div>
                        <div>
                          <Link to={`/jobs/${rj.id}`} style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', textDecoration: 'none', display: 'block' }}>{rj.title}</Link>
                          <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>{rj.company} · {rj.location}</span>
                        </div>
                      </div>
                      <span className="job-badge badge-primary" style={{ marginTop: '0.5rem' }}>{rj.type}</span>
                    </div>
                  ))}
                  <Link to="/jobs" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    View All Jobs <ChevronRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      {showApplyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: 540, width: '100%', animation: 'fadeInUp 0.3s ease' }}>
            <h3 className="card-title" style={{ marginBottom: '0.25rem' }}>Apply for {job.title}</h3>
            <p style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: '1.25rem' }}>at {job.company.name}</p>

            {applySuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={48} style={{ color: '#198754', margin: '0 auto 1rem' }} />
                <h4 style={{ color: '#212529', fontWeight: 700, marginBottom: '0.5rem' }}>Application Submitted!</h4>
                <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                  Your application has been received by the hiring team at {job.company.name}. You can track its status in your dashboard.
                </p>
              </div>
            ) : (
              <>
                {applyError && (
                  <div style={{ background: '#f8d7da', color: '#842029', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle size={16} /> {applyError}
                  </div>
                )}

                {/* Resume Selection */}
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Select Resume <span style={{ color: '#dc3545' }}>*</span></span>
                    <Link to="/seeker/resumes" target="_blank" style={{ fontSize: '0.8rem', color: '#0d6efd', textDecoration: 'none' }}>
                      + Upload New Resume
                    </Link>
                  </label>

                  {resumes.length === 0 ? (
                    <div style={{ border: '2px dashed #dee2e6', borderRadius: 8, padding: '1.25rem', textAlign: 'center', background: '#f8f9fa' }}>
                      <FileText size={32} style={{ color: '#adb5bd', margin: '0 auto 0.5rem' }} />
                      <p style={{ color: '#495057', fontSize: '0.9rem', marginBottom: '0.75rem' }}>You don't have any uploaded resumes yet.</p>
                      <Link to="/seeker/resumes" className="btn btn-outline btn-sm">
                        <Upload size={14} /> Go to Resumes Page to Upload
                      </Link>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 180, overflowY: 'auto' }}>
                      {resumes.map((r) => (
                        <label
                          key={r.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: 8,
                            border: `1.5px solid ${selectedResumeId === r.id ? '#0d6efd' : '#dee2e6'}`,
                            background: selectedResumeId === r.id ? '#f0f7ff' : '#fff',
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="radio"
                            name="resume"
                            value={r.id}
                            checked={selectedResumeId === r.id}
                            onChange={() => setSelectedResumeId(r.id)}
                            style={{ accentColor: '#0d6efd' }}
                          />
                          <FileText size={18} style={{ color: selectedResumeId === r.id ? '#0d6efd' : '#6c757d', flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {r.fileName}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                              {(r.fileSize / 1024).toFixed(0)} KB · Uploaded {new Date(r.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {r.isDefault && (
                            <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Default</span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cover Letter */}
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Cover Letter (Optional)</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Introduce yourself and explain why you're a great fit for this position..."
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowApplyModal(false)}
                    disabled={submittingApply}
                    className="btn btn-light"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitApplication}
                    disabled={submittingApply || resumes.length === 0}
                    className="btn btn-primary"
                  >
                    {submittingApply ? (
                      <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
