import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Briefcase, Building2, ChevronLeft, ChevronRight,
  SlidersHorizontal, Clock, DollarSign, Bookmark, Sparkles, Zap, Flame, X
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '@/store/auth';

const PAGE_SIZE = 8;

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [experienceText, setExperienceText] = useState(searchParams.get('experienceText') || '');
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedMode, setSelectedMode] = useState<string[]>([]);
  const [selectedExp, setSelectedExp] = useState<string[]>([]);
  const [minSalary, setMinSalary] = useState<number>(0);
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const normalizeJob = (j: any) => ({
    ...j,
    companyName: j.company?.name || j.companyName || 'Company',
    companyInitial: (j.company?.name || j.companyName || 'CO').slice(0, 2).toUpperCase(),
    jobTypeLabel: j.jobType ? j.jobType.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'Full Time',
    workModeLabel: j.workMode ? j.workMode.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'On-site',
    expLabel: j.experienceLevel ? j.experienceLevel.charAt(0).toUpperCase() + j.experienceLevel.slice(1) : 'Mid',
    postedLabel: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : 'Recently',
    jobTypeKey: j.jobType || '',
    workModeKey: j.workMode || '',
    expKey: j.experienceLevel || '',
  });

  const fetchJobs = useCallback(() => {
    const params: any = {};
    if (keyword) params.keyword = keyword;
    if (location) params.location = location;
    if (experienceText) params.experienceText = experienceText;
    setSearchParams(params, { replace: true });

    api.get('/jobs', { params })
      .then(res => setAllJobs(res.data.map(normalizeJob)))
      .catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, location, experienceText]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Load saved job IDs for the current seeker
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'job_seeker') return;
    api.get('/saved-jobs/me')
      .then(res => {
        if (Array.isArray(res.data)) {
          setSavedIds(new Set(res.data.map((s: any) => s.job?.id).filter(Boolean)));
        }
      })
      .catch(() => {});
  }, [isAuthenticated, user]);

  const handleToggleSave = async (e: React.MouseEvent, jobId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.role !== 'job_seeker') return;
    setTogglingId(jobId);
    try {
      if (savedIds.has(jobId)) {
        await api.delete(`/saved-jobs/${jobId}`);
        setSavedIds(prev => { const n = new Set(prev); n.delete(jobId); return n; });
      } else {
        await api.post(`/saved-jobs/${jobId}`);
        setSavedIds(prev => new Set(prev).add(jobId));
      }
    } catch (err) {
      console.error('Save toggle failed', err);
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = allJobs.filter((j) => {
    // Quick filter chips
    if (quickFilter === 'remote' && j.workModeKey !== 'remote') return false;
    if (quickFilter === 'featured' && !j.isFeatured) return false;
    if (quickFilter === 'high_salary' && (j.salaryMax || j.salaryMin || 0) < 100000) return false;
    if (quickFilter === 'full_time' && j.jobTypeKey !== 'full_time') return false;

    // Sidebar checkboxes
    if (selectedType.length) {
      const match = selectedType.some(t => t.toLowerCase().replace(/\s+/g, '_') === j.jobTypeKey.toLowerCase());
      if (!match) return false;
    }
    if (selectedMode.length) {
      const match = selectedMode.some(m => m.toLowerCase().replace(/[- ]/g, '_') === j.workModeKey.toLowerCase() || (m === 'On-site' && j.workModeKey === 'on_site'));
      if (!match) return false;
    }
    if (selectedExp.length) {
      const match = selectedExp.some(e => e.toLowerCase() === j.expKey.toLowerCase());
      if (!match) return false;
    }

    // Salary slider filter
    if (minSalary > 0) {
      const jobMax = j.salaryMax || j.salaryMin || 0;
      if (jobMax < minSalary) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleFilter = (arr: string[], setArr: (a: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
    setPage(1);
  };

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div className="container">
          <h1>Browse Jobs</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item active">Jobs</li>
          </ol>
        </div>
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <div className="container">
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchJobs(); }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}
          >
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
              <input className="search-input" placeholder="Job title or keyword..." style={{ paddingLeft: 40 }} value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1); }} />
            </div>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
              <input className="search-input" placeholder="Location..." style={{ paddingLeft: 40 }} value={location} onChange={(e) => { setLocation(e.target.value); setPage(1); }} />
            </div>
            <div style={{ position: 'relative' }}>
              <Briefcase size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
              <input className="search-input" placeholder="Experience..." style={{ paddingLeft: 40 }} value={experienceText} onChange={(e) => { setExperienceText(e.target.value); setPage(1); }} />
            </div>
            <button type="submit" className="btn btn-secondary">Search</button>
          </form>
        </div>
      </div>

      {/* Main content */}
      <section className="section-py" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
            {/* Sidebar Filters */}
            <aside className="card" style={{ position: 'sticky', top: 80 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#212529' }}>
                  <SlidersHorizontal size={16} style={{ display: 'inline', marginRight: 6 }} />Filters
                </h3>
                <button
                  onClick={() => { setSelectedType([]); setSelectedMode([]); setSelectedExp([]); setPage(1); }}
                  style={{ fontSize: '0.8rem', color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Clear all
                </button>
              </div>

              {/* Job Type */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', marginBottom: '0.75rem' }}>Job Type</h4>
                {['Full Time', 'Part Time', 'Contract', 'Internship'].map((t) => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#495057' }}>
                    <input
                      type="checkbox" checked={selectedType.includes(t)}
                      onChange={() => toggleFilter(selectedType, setSelectedType, t)}
                      style={{ accentColor: '#0d6efd' }}
                    />
                    {t}
                  </label>
                ))}
              </div>

              {/* Work Mode */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', marginBottom: '0.75rem' }}>Work Mode</h4>
                {['Remote', 'Hybrid', 'On-site'].map((m) => (
                  <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#495057' }}>
                    <input
                      type="checkbox" checked={selectedMode.includes(m)}
                      onChange={() => toggleFilter(selectedMode, setSelectedMode, m)}
                      style={{ accentColor: '#0d6efd' }}
                    />
                    {m}
                  </label>
                ))}
              </div>

              {/* Experience */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', marginBottom: '0.75rem' }}>Experience Level</h4>
                {['Entry', 'Mid', 'Senior', 'Executive'].map((e) => (
                  <label key={e} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#495057' }}>
                    <input
                      type="checkbox" checked={selectedExp.includes(e)}
                      onChange={() => toggleFilter(selectedExp, setSelectedExp, e)}
                      style={{ accentColor: '#0d6efd' }}
                    />
                    {e}
                  </label>
                ))}
              </div>

              {/* Salary Range Slider */}
              <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', margin: 0 }}>Min Salary</h4>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0d6efd' }}>
                    {minSalary === 0 ? 'Any' : `$${(minSalary / 1000).toFixed(0)}k+`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="10000"
                  value={minSalary}
                  onChange={(e) => {
                    setMinSalary(Number(e.target.value));
                    setPage(1);
                  }}
                  style={{ width: '100%', accentColor: '#0d6efd', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>
                  <span>$0</span>
                  <span>$100k</span>
                  <span>$200k+</span>
                </div>
              </div>
            </aside>

            {/* Job listings */}
            <div>
              {/* Quick Filter Chips */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748b' }}>Quick Filters:</span>
                {[
                  { key: 'remote', label: 'Remote Only', icon: Zap },
                  { key: 'featured', label: 'Featured', icon: Flame },
                  { key: 'high_salary', label: 'Salary > $100k', icon: DollarSign },
                  { key: 'full_time', label: 'Full Time', icon: Briefcase },
                ].map((chip) => {
                  const isActive = quickFilter === chip.key;
                  const Icon = chip.icon;
                  return (
                    <button
                      key={chip.key}
                      onClick={() => {
                        setQuickFilter(isActive ? null : chip.key);
                        setPage(1);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '0.35rem 0.85rem',
                        borderRadius: 9999,
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: `1.5px solid ${isActive ? '#0d6efd' : '#e2e8f0'}`,
                        background: isActive ? '#eff6ff' : '#fff',
                        color: isActive ? '#0d6efd' : '#475569',
                        boxShadow: isActive ? '0 2px 4px rgba(13,110,253,0.15)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon size={13} color={isActive ? '#0d6efd' : '#64748b'} />
                      <span>{chip.label}</span>
                      {isActive && <X size={12} style={{ marginLeft: 2 }} />}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.9375rem', color: '#6c757d', margin: 0 }}>
                  Showing <strong>{paginated.length}</strong> of <strong>{filtered.length}</strong> jobs
                </p>
                <select className="form-control" style={{ width: 'auto' }}>
                  <option>Newest First</option>
                  <option>Most Relevant</option>
                </select>
              </div>

              {paginated.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <Search size={48} style={{ color: '#dee2e6', margin: '0 auto 1rem' }} />
                  <h4 style={{ color: '#6c757d' }}>No jobs found</h4>
                  <p style={{ color: '#adb5bd', fontSize: '0.9rem' }}>Try adjusting your search or filters</p>
                </div>
              ) : (
                paginated.map((job) => (
                  <div key={job.id} className="job-item">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      {job.isFeatured && (
                        <span className="job-badge badge-warning" style={{ position: 'absolute', right: 16, top: 16, fontSize: '0.75rem' }}>Featured</span>
                      )}
                      <div className="job-logo-placeholder">{job.companyInitial}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link to={`/jobs/${job.id}`} className="job-title">{job.title}</Link>
                        <div className="job-meta" style={{ marginTop: 4 }}>
                          <span className="job-meta-item"><Building2 size={14} /> {job.companyName}</span>
                          <span className="job-meta-item"><MapPin size={14} /> {job.location}</span>
                          {job.salaryMin > 0 && (
                            <span className="job-meta-item"><DollarSign size={14} /> ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k</span>
                          )}
                          <span className="job-meta-item"><Clock size={14} /> {job.postedLabel}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                          <span className="job-badge badge-primary">{job.jobTypeLabel}</span>
                          <span className="job-badge badge-success">{job.workModeLabel}</span>
                          <span className="job-badge badge-secondary">{job.expLabel}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                        <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">Apply Now</Link>
                        {isAuthenticated && user?.role === 'job_seeker' && (
                          <button
                            onClick={(e) => handleToggleSave(e, job.id)}
                            disabled={togglingId === job.id}
                            title={savedIds.has(job.id) ? 'Unsave job' : 'Save job'}
                            className={`btn btn-sm ${savedIds.has(job.id) ? 'btn-primary' : 'btn-light'}`}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                          >
                            <Bookmark size={14} fill={savedIds.has(job.id) ? '#fff' : 'none'} />
                            {savedIds.has(job.id) ? 'Saved' : 'Save'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                  <button
                    onClick={() => setPage(page - 1)} disabled={page === 1}
                    className="btn btn-light btn-sm" style={{ padding: '0.5rem 0.75rem' }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p} onClick={() => setPage(p)}
                      className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-light'}`}
                      style={{ minWidth: 36 }}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(page + 1)} disabled={page === totalPages}
                    className="btn btn-light btn-sm" style={{ padding: '0.5rem 0.75rem' }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
