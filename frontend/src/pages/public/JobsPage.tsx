import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Briefcase, Building2, ChevronLeft, ChevronRight,
  SlidersHorizontal, Clock, DollarSign, Bookmark, Sparkles, Zap, Flame, X,
  CheckCircle, AlertCircle, Loader2, FileText, Upload
} from 'lucide-react';
import type { Resume } from '@/types';
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

  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Apply modal states
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submittingApply, setSubmittingApply] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  // Load user applications
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'job_seeker') return;
    api.get('/applications/me')
      .then(res => {
        if (Array.isArray(res.data)) {
          setAppliedJobIds(new Set(res.data.map((a: any) => a.job?.id).filter(Boolean)));
        }
      })
      .catch(() => {});
  }, [isAuthenticated, user]);

  const handleOpenApply = async (jobToApply: any) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'job_seeker') {
      alert('Only job seekers can apply for jobs.');
      return;
    }
    setSelectedJob(jobToApply);
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

  const handleQuickUpload = async (file: File) => {
    setUploadingResume(true);
    setApplyError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('syncSkills', 'true');
      const res = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newResume = res.data.resume || res.data;
      setResumes((prev) => [newResume, ...prev]);
      setSelectedResumeId(newResume.id);
    } catch (err: any) {
      console.error('Failed to upload resume', err);
      setApplyError(err?.response?.data?.message || 'Failed to upload resume file.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!selectedResumeId) {
      setApplyError('Please select a resume to attach to your application.');
      return;
    }
    if (!selectedJob) return;

    setSubmittingApply(true);
    setApplyError(null);

    try {
      await api.post(`/applications/${selectedJob.id}`, {
        coverLetter: coverLetter.trim() || undefined,
        resumeId: selectedResumeId,
      });

      setAppliedJobIds(prev => new Set(prev).add(selectedJob.id));
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

  const fetchJobs = useCallback(() => {
    setLoading(true);
    const params: any = {};
    if (keyword) params.keyword = keyword;
    if (location) params.location = location;
    if (experienceText) params.experienceText = experienceText;
    setSearchParams(params, { replace: true });

    api.get('/jobs', { params })
      .then(res => {
        const norm = res.data.map(normalizeJob);
        setAllJobs(norm);
        if (norm.length > 0 && !selectedJob) {
          setSelectedJob(norm[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
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

  // Keep selectedJob synchronized when list changes
  useEffect(() => {
    if (!selectedJob && filtered.length > 0) {
      setSelectedJob(filtered[0]);
    }
  }, [filtered, selectedJob]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleFilter = (arr: string[], setArr: (a: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
    setPage(1);
  };

  return (
    <>
      {/* Modern Search Hero Bar */}
      <div className="bg-slate-900 border-b border-slate-800 py-8 px-4 text-white">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="inline-block text-xs font-mono font-bold tracking-wider text-blue-400 uppercase mb-1">
                Explore Opportunities
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Find Your Next Dream Role
              </h1>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-blue-400" /> AI Matched</span>
              <span>•</span>
              <span>{allJobs.length} Live Openings</span>
            </div>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setPage(1); fetchJobs(); }}
            className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-2.5 rounded-2xl shadow-xl shadow-black/20"
          >
            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="search-input text-slate-900 text-sm font-medium w-full pl-10 pr-3 py-2.5 border-0 focus:ring-0"
                placeholder="Role, skill, or keyword..."
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
              />
            </div>
            <div className="relative md:border-l border-slate-200">
              <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="search-input text-slate-900 text-sm font-medium w-full pl-10 pr-3 py-2.5 border-0 focus:ring-0"
                placeholder="Location or 'Remote'..."
                value={location}
                onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              />
            </div>
            <div className="relative md:border-l border-slate-200">
              <Briefcase size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="search-input text-slate-900 text-sm font-medium w-full pl-10 pr-3 py-2.5 border-0 focus:ring-0"
                placeholder="Experience (e.g. Senior)..."
                value={experienceText}
                onChange={(e) => { setExperienceText(e.target.value); setPage(1); }}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full font-bold shadow-md shadow-blue-500/20">
              Search Openings
            </button>
          </form>

          {/* Quick Filter Chips */}
          <div className="flex gap-2 mt-4 flex-wrap items-center">
            <span className="text-xs font-semibold text-slate-400">Quick Filters:</span>
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
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <Icon size={12} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{chip.label}</span>
                  {isActive && <X size={12} className="ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Split Discovery Section */}
      <section className="py-8 bg-slate-50 min-h-screen">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Filter Sidebar (3 cols) */}
            <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm sticky top-24">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal size={15} className="text-blue-600" /> Filters
                </h3>
                {(selectedType.length > 0 || selectedMode.length > 0 || selectedExp.length > 0 || minSalary > 0) && (
                  <button
                    onClick={() => { setSelectedType([]); setSelectedMode([]); setSelectedExp([]); setMinSalary(0); setPage(1); }}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Job Type */}
              <div className="mb-5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2.5">Job Type</h4>
                {['Full Time', 'Part Time', 'Contract', 'Internship'].map((t) => (
                  <label key={t} className="flex items-center gap-2.5 py-1 cursor-pointer text-xs font-medium text-slate-700 hover:text-blue-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedType.includes(t)}
                      onChange={() => toggleFilter(selectedType, setSelectedType, t)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>

              {/* Work Mode */}
              <div className="mb-5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2.5">Work Mode</h4>
                {['Remote', 'Hybrid', 'On-site'].map((m) => (
                  <label key={m} className="flex items-center gap-2.5 py-1 cursor-pointer text-xs font-medium text-slate-700 hover:text-blue-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedMode.includes(m)}
                      onChange={() => toggleFilter(selectedMode, setSelectedMode, m)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{m}</span>
                  </label>
                ))}
              </div>

              {/* Experience */}
              <div className="mb-5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2.5">Experience Level</h4>
                {['Entry', 'Mid', 'Senior', 'Executive'].map((e) => (
                  <label key={e} className="flex items-center gap-2.5 py-1 cursor-pointer text-xs font-medium text-slate-700 hover:text-blue-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedExp.includes(e)}
                      onChange={() => toggleFilter(selectedExp, setSelectedExp, e)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{e}</span>
                  </label>
                ))}
              </div>

              {/* Salary Slider */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Min Salary</h4>
                  <span className="text-xs font-bold text-blue-600 font-mono">
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
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>$0</span>
                  <span>$100k</span>
                  <span>$200k+</span>
                </div>
              </div>
            </aside>

            {/* Middle: Job Cards List (5 cols in 2-column mode) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-xs font-bold text-slate-500">
                  Showing <strong className="text-slate-900">{filtered.length}</strong> matching roles
                </span>
                <span className="text-[11px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/50">
                  LinkedIn Split View
                </span>
              </div>

              {loading ? (
                // Shimmer Skeletons
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl skeleton flex-shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-3/4 skeleton" />
                        <div className="h-3 w-1/2 skeleton" />
                      </div>
                    </div>
                    <div className="h-3 w-full skeleton" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 w-16 skeleton rounded-full" />
                      <div className="h-6 w-20 skeleton rounded-full" />
                    </div>
                  </div>
                ))
              ) : paginated.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300">
                  <Search size={40} className="text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-800 text-sm">No jobs match your criteria</h4>
                  <p className="text-xs text-slate-500 mt-1">Try resetting your filters or adjusting your search term.</p>
                </div>
              ) : (
                paginated.map((job) => {
                  const isSelected = selectedJob?.id === job.id;
                  const isSaved = savedIds.has(job.id);

                  return (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`job-card-lift bg-white rounded-2xl p-4 md:p-5 border cursor-pointer relative transition-all ${
                        isSelected
                          ? 'border-blue-600 shadow-md shadow-blue-500/10 ring-1 ring-blue-600'
                          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      {job.isFeatured && (
                        <span className="absolute top-4 right-4 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Flame size={11} className="text-amber-500 fill-amber-500" /> Featured
                        </span>
                      )}

                      <div className="flex gap-3.5 items-start">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200/60 flex items-center justify-center font-bold text-sm text-blue-700 flex-shrink-0 shadow-sm">
                          {job.companyInitial}
                        </div>
                        <div className="flex-1 min-w-0 pr-12">
                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {job.title}
                          </h3>
                          <p className="text-xs font-semibold text-slate-600 mt-0.5 truncate">
                            {job.companyName}
                          </p>

                          <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} className="text-slate-400" /> {job.location}
                            </span>
                            {job.salaryMin > 0 && (
                              <span className="flex items-center gap-1 font-mono font-semibold text-slate-700">
                                <DollarSign size={12} className="text-emerald-600" /> ${(job.salaryMin / 1000).toFixed(0)}k–${(job.salaryMax / 1000).toFixed(0)}k
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-slate-400">
                              <Clock size={12} /> {job.postedLabel}
                            </span>
                          </div>

                          <div className="flex gap-1.5 mt-3 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200/50">
                              {job.jobTypeLabel}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/50">
                              {job.workModeLabel}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              {job.expLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom action trigger for mobile */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 lg:hidden">
                        <Link to={`/jobs/${job.id}`} className="text-xs font-bold text-blue-600 flex items-center gap-1">
                          View Full Details <ChevronRight size={13} />
                        </Link>
                        {isAuthenticated && user?.role === 'job_seeker' && (
                          <button
                            onClick={(e) => handleToggleSave(e, job.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-50"
                          >
                            <Bookmark size={15} fill={isSaved ? '#2563eb' : 'none'} className={isSaved ? 'text-blue-600' : ''} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1.5 pt-4">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-white"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        p === page
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-white"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Right: Sticky LinkedIn-Style Live Detail Pane (4 cols) */}
            <div className="hidden lg:block lg:col-span-4 sticky top-24">
              {selectedJob ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm max-h-[82vh] overflow-y-auto">
                  {/* Top company & job header */}
                  <div className="flex items-start justify-between gap-3 pb-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-base flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
                        {selectedJob.companyInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{selectedJob.companyName}</p>
                        <h2 className="text-base font-extrabold text-slate-900 leading-tight mt-0.5">{selectedJob.title}</h2>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-2 gap-2 my-4">
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Compensation</span>
                      <span className="text-xs font-bold text-slate-800 font-mono mt-0.5 block">
                        {selectedJob.salaryMin > 0 ? `$${(selectedJob.salaryMin / 1000).toFixed(0)}k–$${(selectedJob.salaryMax / 1000).toFixed(0)}k /yr` : 'Competitive'}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Workplace</span>
                      <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                        {selectedJob.workModeLabel} ({selectedJob.location})
                      </span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex items-center gap-2 mb-5">
                    {appliedJobIds.has(selectedJob.id) ? (
                      <span className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle size={15} /> Applied!
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenApply(selectedJob)}
                        className="btn btn-primary flex-1 text-xs font-bold py-2.5 shadow-sm shadow-blue-500/20 justify-center"
                      >
                        <Zap size={14} /> Easy Apply
                      </button>
                    )}
                    <Link
                      to={`/jobs/${selectedJob.id}`}
                      className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                      title="View Full Spec Page"
                    >
                      <ChevronRight size={16} />
                    </Link>
                    {isAuthenticated && user?.role === 'job_seeker' && (
                      <button
                        onClick={(e) => handleToggleSave(e, selectedJob.id)}
                        className={`p-2.5 rounded-xl border transition-colors ${
                          savedIds.has(selectedJob.id)
                            ? 'bg-blue-50 border-blue-300 text-blue-600'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                        title={savedIds.has(selectedJob.id) ? 'Unsave' : 'Save for later'}
                      >
                        <Bookmark size={16} fill={savedIds.has(selectedJob.id) ? '#2563eb' : 'none'} />
                      </button>
                    )}
                  </div>

                  {/* Skills Snapshot */}
                  {Array.isArray(selectedJob.skills) && selectedJob.skills.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.skills.slice(0, 6).map((sk: string) => (
                          <span key={sk} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/50">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Job Overview Excerpt */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Role Overview</h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-6 whitespace-pre-line">
                      {selectedJob.description || 'Join our high performing team to drive impactful digital solutions. We offer competitive packages, flexible work environments, and career advancement.'}
                    </p>
                  </div>

                  {/* View Full Page Link */}
                  <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                    <Link
                      to={`/jobs/${selectedJob.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      Open comprehensive job page <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400">
                  <Briefcase size={36} className="mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-medium">Select a job from the list to preview details here.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Easy Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeInUp">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Quick Application</span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">Apply for {selectedJob.title}</h3>
                <p className="text-xs text-slate-500">{selectedJob.companyName} • {selectedJob.location}</p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {applySuccess ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-emerald-500 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900 text-base">Application Submitted!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Your application and resume have been delivered directly to the hiring manager at {selectedJob.companyName}.
                </p>
              </div>
            ) : (
              <>
                {applyError && (
                  <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 rounded-xl text-xs mb-4 border border-rose-200">
                    <AlertCircle size={15} />
                    <span>{applyError}</span>
                  </div>
                )}

                {/* Resume Selector */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Select Resume <span className="text-rose-500">*</span></label>
                    <Link to="/dashboard/resumes" target="_blank" className="text-[11px] font-semibold text-blue-600 hover:underline">
                      Manage Resumes →
                    </Link>
                  </div>

                  {resumes.length === 0 ? (
                    <div className="border-2 border-dashed border-blue-200 rounded-xl p-4 text-center bg-blue-50/30">
                      <FileText size={28} className="text-blue-500 mx-auto mb-1.5" />
                      <p className="text-xs text-slate-600 font-medium mb-2">Upload your resume to continue:</p>
                      <label className="btn btn-primary btn-sm inline-flex items-center gap-1.5 cursor-pointer">
                        <Upload size={13} /> {uploadingResume ? 'Uploading...' : 'Choose File (PDF/DOCX)'}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          className="hidden"
                          disabled={uploadingResume}
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleQuickUpload(e.target.files[0]);
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {resumes.map((r) => (
                        <label
                          key={r.id}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                            selectedResumeId === r.id
                              ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="selectedResume"
                              value={r.id}
                              checked={selectedResumeId === r.id}
                              onChange={() => setSelectedResumeId(r.id)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="truncate max-w-xs">{r.title || r.fileName || 'Resume'}</span>
                          </div>
                          {r.isDefault && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                              Default
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cover letter */}
                <div className="mb-5">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Cover Note <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    className="w-full text-xs rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 p-3"
                    placeholder="Briefly highlight why you're a great fit for this position..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="btn btn-light btn-sm text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitApplication}
                    disabled={submittingApply || !selectedResumeId}
                    className="btn btn-primary btn-sm text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {submittingApply ? (
                      <>
                        <Loader2 size={13} className="animate-spin" /> Submitting...
                      </>
                    ) : (
                      'Send Application'
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
