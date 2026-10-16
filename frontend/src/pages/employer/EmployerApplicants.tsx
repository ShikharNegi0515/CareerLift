import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, Filter, Download, Star, StarOff, MapPin,
  Clock, FileText, Loader2, AlertCircle, Mail, X, Eye, MessageSquare,
  Kanban, LayoutList, CheckCircle2, User, ChevronRight, Calendar
} from 'lucide-react';
import api from '@/api/client';
import { ApplicationStatus } from '@/types';
import type { Job, Resume } from '@/types';

interface ApplicantData {
  id: string;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeId?: string;
  createdAt: string;
  applicant: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    seekerProfile?: {
      headline?: string;
      location?: string;
      bio?: string;
      phone?: string;
    };
  };
  job?: Job;
  resume?: Resume;
}

const statusFilters = ['All', 'applied', 'under_review', 'shortlisted', 'rejected', 'hired'];

const statusLabels: Record<string, string> = {
  applied: 'Applied',
  under_review: 'Under Review',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
  hired: 'Hired',
};

const statusColors: Record<string, { bg: string; text: string }> = {
  applied: { bg: '#e8f0fe', text: '#0d6efd' },
  under_review: { bg: '#fff3cd', text: '#856404' },
  shortlisted: { bg: '#d1e7dd', text: '#0f5132' },
  rejected: { bg: '#f8d7da', text: '#842029' },
  hired: { bg: '#cff4fc', text: '#055160' },
};

export default function EmployerApplicants() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<ApplicantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantData | null>(null);
  const [previewResume, setPreviewResume] = useState<Resume | null>(null);
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const [employerJobs, setEmployerJobs] = useState<Job[]>([]);

  const getResumeUrl = (url?: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://localhost:3000${url}`;
  };

  const openConversation = async (applicationId: string) => {
    try {
      const res = await api.post(`/conversations/application/${applicationId}`);
      navigate(`/employer/messages?c=${res.data.id}`);
    } catch (err) {
      console.error('Failed to open conversation', err);
      navigate('/employer/messages');
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Always fetch employer jobs list for the switcher
      const jobsRes = await api.get<Job[]>('/jobs/employer/me');
      setEmployerJobs(jobsRes.data);

      if (id) {
        // Fetch job details and applicants for this job
        const [jobRes, appsRes] = await Promise.all([
          api.get<Job>(`/jobs/${id}`),
          api.get<ApplicantData[]>(`/applications/job/${id}`),
        ]);
        setJob(jobRes.data);
        setApplicants(appsRes.data);
      } else {
        // Fetch all applicants for this employer
        const res = await api.get<ApplicantData[]>('/applications/employer');
        setJob(null);
        setApplicants(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load applicants', err);
      setError('Failed to load applicant information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
      );
      if (selectedApplicant && selectedApplicant.id === applicationId) {
        setSelectedApplicant({ ...selectedApplicant, status: newStatus });
      }
    } catch (err: any) {
      console.error('Failed to update status', err);
      alert('Failed to update status. Please try again.');
    }
  };

  const toggleRate = (applicantId: string) => {
    setRatedIds((prev) => {
      const next = new Set(prev);
      if (next.has(applicantId)) next.delete(applicantId);
      else next.add(applicantId);
      return next;
    });
  };

  const exportCSV = () => {
    if (applicants.length === 0) return;
    const headers = ['Applicant Name', 'Email', 'Job Title', 'Status', 'Applied Date', 'Phone', 'Has Resume'];
    const rows = applicants.map((a) => [
      `"${a.applicant?.firstName || ''} ${a.applicant?.lastName || ''}"`,
      `"${a.applicant?.email || ''}"`,
      `"${a.job?.title || job?.title || ''}"`,
      `"${statusLabels[a.status] || a.status}"`,
      `"${new Date(a.createdAt).toLocaleDateString()}"`,
      `"${a.applicant?.seekerProfile?.phone || ''}"`,
      `"${a.resume ? 'Yes' : 'No'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `applicants_${id || 'all'}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = applicants.filter((a) => {
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    const name = `${a.applicant?.firstName || ''} ${a.applicant?.lastName || ''}`.toLowerCase();
    const jobTitle = (a.job?.title || job?.title || '').toLowerCase();
    const email = (a.applicant?.email || '').toLowerCase();
    const q = search.toLowerCase();
    if (search && !name.includes(q) && !jobTitle.includes(q) && !email.includes(q)) return false;
    return true;
  });

  const getInitials = (first = '', last = '') => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || 'U';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          {id && (
            <Link to="/employer/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#6c757d', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <ArrowLeft size={14} /> Back to Jobs
            </Link>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', margin: 0 }}>
              {job ? `Applicants for "${job.title}"` : 'All Applicants'}
            </h1>
            {/* Quick Job Switcher */}
            {employerJobs.length > 0 && (
              <select
                value={id || 'all'}
                onChange={(e) => {
                  const targetJobId = e.target.value;
                  if (targetJobId === 'all') {
                    navigate('/employer/applicants');
                  } else {
                    navigate(`/employer/jobs/${targetJobId}/applicants`);
                  }
                }}
                style={{
                  padding: '5px 12px',
                  borderRadius: 8,
                  border: '1.5px solid #cbd5e1',
                  background: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}
              >
                <option value="all">📁 All Jobs ({employerJobs.reduce((acc, j) => acc + (j.applicationCount || 0), 0)} applicants)</option>
                {employerJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    💼 {j.title} ({j.applicationCount || 0} applicants)
                  </option>
                ))}
              </select>
            )}
          </div>
          <p style={{ color: '#6c757d', fontSize: '0.9rem', marginTop: 4 }}>
            {applicants.length} total applicant{applicants.length === 1 ? '' : 's'} in pipeline
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* View mode toggle */}
          <div style={{ display: 'flex', background: '#e9ecef', padding: 3, borderRadius: 8 }}>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '0.35rem 0.75rem',
                border: 'none',
                borderRadius: 6,
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: viewMode === 'kanban' ? '#fff' : 'transparent',
                color: viewMode === 'kanban' ? '#0d6efd' : '#6c757d',
                boxShadow: viewMode === 'kanban' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Kanban size={14} /> Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '0.35rem 0.75rem',
                border: 'none',
                borderRadius: 6,
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: viewMode === 'list' ? '#fff' : 'transparent',
                color: viewMode === 'list' ? '#0d6efd' : '#6c757d',
                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <LayoutList size={14} /> List
            </button>
          </div>

          <button onClick={exportCSV} className="btn btn-outline btn-sm" disabled={applicants.length === 0}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.75rem 1rem', background: '#f8d7da', color: '#842029', borderRadius: 8, marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span style={{ fontSize: '0.875rem' }}>{error}</span>
        </div>
      )}

      {/* Main card */}
      <div className="card">
        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input
              className="form-control"
              style={{ paddingLeft: 36 }}
              placeholder="Search by name, email, or job..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {statusFilters.map((s) => {
              const count = s === 'All' ? applicants.length : applicants.filter((a) => a.status === s).length;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '0.375rem 0.75rem',
                    borderRadius: 9999,
                    border: '1.5px solid',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    fontWeight: 500,
                    borderColor: statusFilter === s ? '#0d6efd' : '#dee2e6',
                    background: statusFilter === s ? '#e8f0fe' : '#fff',
                    color: statusFilter === s ? '#0d6efd' : '#6c757d',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {statusLabels[s] || s}
                  {count > 0 && (
                    <span
                      style={{
                        background: statusFilter === s ? '#0d6efd' : '#e9ecef',
                        color: statusFilter === s ? '#fff' : '#6c757d',
                        padding: '1px 6px',
                        borderRadius: 9999,
                        fontSize: '0.7rem',
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* View content: Board or List */}
        {viewMode === 'kanban' ? (
          /* ──────── Jira-Style Kanban Pipeline Board ──────── */
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 overflow-x-auto pb-4 min-h-[580px] bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200/80">
            {[
              { key: ApplicationStatus.APPLIED, label: 'TO DO / APPLIED', tag: 'APP', badgeBg: 'bg-slate-200 text-slate-700', headerBorder: 'border-blue-500' },
              { key: ApplicationStatus.UNDER_REVIEW, label: 'IN REVIEW', tag: 'REV', badgeBg: 'bg-amber-100 text-amber-800', headerBorder: 'border-amber-500' },
              { key: ApplicationStatus.SHORTLISTED, label: 'SHORTLISTED', tag: 'SHL', badgeBg: 'bg-purple-100 text-purple-800', headerBorder: 'border-purple-500' },
              { key: ApplicationStatus.HIRED, label: 'OFFER / HIRED', tag: 'HIR', badgeBg: 'bg-emerald-100 text-emerald-800', headerBorder: 'border-emerald-500' },
              { key: ApplicationStatus.REJECTED, label: 'ARCHIVED', tag: 'ARC', badgeBg: 'bg-rose-100 text-rose-800', headerBorder: 'border-rose-400' },
            ].map((col) => {
              const colApps = filtered.filter((a) => a.status === col.key);
              const isOver = dragOverColumn === col.key;

              return (
                <div
                  key={col.key}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (dragOverColumn !== col.key) setDragOverColumn(col.key);
                  }}
                  onDragLeave={() => {
                    if (dragOverColumn === col.key) setDragOverColumn(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverColumn(null);
                    if (draggedAppId) {
                      updateStatus(draggedAppId, col.key);
                      setDraggedAppId(null);
                    }
                  }}
                  className={`flex flex-col rounded-xl bg-slate-200/50 p-2.5 transition-all border ${
                    isOver ? 'border-dashed border-blue-500 bg-blue-50/70 shadow-sm' : 'border-slate-300/40'
                  }`}
                >
                  {/* Jira Column header */}
                  <div className="flex items-center justify-between px-1.5 py-1.5 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.headerBorder.replace('border-', 'bg-')}`}></span>
                      <span className="font-bold text-[11px] tracking-wider text-slate-600 uppercase font-mono">
                        {col.label}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 px-1.5 py-0.5 rounded-full bg-slate-300/60 min-w-5 text-center">
                      {colApps.length}
                    </span>
                  </div>

                  {/* Jira Ticket List */}
                  <div className="flex flex-col gap-2 flex-1 min-h-[140px]">
                    {colApps.length === 0 ? (
                      <div className="border border-dashed border-slate-300 rounded-lg flex-1 min-h-[100px] flex items-center justify-center text-[11px] text-slate-400 font-medium">
                        Drop candidate here
                      </div>
                    ) : (
                      colApps.map((a, idx) => {
                        const fullName = `${a.applicant?.firstName || ''} ${a.applicant?.lastName || ''}`.trim() || 'Candidate';
                        const isRated = ratedIds.has(a.id);
                        const isBeingDragged = draggedAppId === a.id;
                        const ticketKey = `${col.tag}-${a.id.slice(0, 4).toUpperCase()}`;

                        return (
                          <div
                            key={a.id}
                            draggable
                            onDragStart={() => setDraggedAppId(a.id)}
                            onDragEnd={() => {
                              setDraggedAppId(null);
                              setDragOverColumn(null);
                            }}
                            className={`group bg-white rounded-lg p-3 border border-slate-200/80 shadow-[0_1px_2px_rgba(9,30,66,0.1)] hover:border-blue-400 hover:shadow-[0_4px_8px_-2px_rgba(9,30,66,0.15)] transition-all cursor-grab active:cursor-grabbing ${
                              isBeingDragged ? 'opacity-40 scale-95' : 'opacity-100'
                            }`}
                          >
                            {/* Top Jira Key & Action row */}
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                {ticketKey}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => toggleRate(a.id)}
                                  className="text-slate-300 hover:text-amber-400 transition-colors"
                                  title="Star Candidate"
                                >
                                  {isRated ? (
                                    <Star size={13} className="fill-amber-400 text-amber-400" />
                                  ) : (
                                    <StarOff size={13} />
                                  )}
                                </button>
                                <button
                                  onClick={() => setSelectedApplicant(a)}
                                  className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded"
                                  title="Open Ticket"
                                >
                                  <Eye size={13} />
                                </button>
                              </div>
                            </div>

                            {/* Candidate Title & Role */}
                            <h4
                              onClick={() => setSelectedApplicant(a)}
                              className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1 mb-1"
                            >
                              {fullName}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mb-2">
                              {a.job?.title || job?.title || 'Applicant'}
                            </p>

                            {/* Headline / snippet if present */}
                            {a.applicant?.seekerProfile?.headline && (
                              <p className="text-[10px] text-slate-600 line-clamp-2 bg-slate-50 rounded p-1.5 border border-slate-100 mb-2 leading-relaxed">
                                {a.applicant.seekerProfile.headline}
                              </p>
                            )}

                            {/* Bottom row: Resume Badge, Date, Assignee Avatar */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                              <div className="flex items-center gap-2">
                                {a.resume ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/50">
                                    <FileText size={10} /> CV
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">No CV</span>
                                )}
                                <span>{formatDate(a.createdAt)}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={(e) => { e.stopPropagation(); openConversation(a.id); }}
                                  className="p-1 rounded hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                                  title="Direct Message"
                                >
                                  <MessageSquare size={12} />
                                </button>
                                <div
                                  className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[9px] shadow-sm"
                                  title={fullName}
                                >
                                  {getInitials(a.applicant?.firstName, a.applicant?.lastName)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <Filter size={36} className="text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700 mb-1">No applicants found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">There are no candidates matching your current filter criteria.</p>
          </div>
        ) : (
          /* ──────── Classic List View ──────── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map((a) => {
              const fullName = `${a.applicant?.firstName || ''} ${a.applicant?.lastName || ''}`.trim() || 'Candidate';
              const isRated = ratedIds.has(a.id);
              const colorInfo = statusColors[a.status] || { bg: '#e9ecef', text: '#6c757d' };

              return (
                <div
                  key={a.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1.25rem',
                    border: '1px solid #e9ecef',
                    borderRadius: 8,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: '#0d6efd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(a.applicant?.firstName, a.applicant?.lastName)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                      <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#212529', margin: 0 }}>
                        {fullName}
                      </h3>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 9999,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: colorInfo.bg,
                          color: colorInfo.text,
                        }}
                      >
                        {statusLabels[a.status] || a.status}
                      </span>
                    </div>

                    <p style={{ color: '#495057', fontSize: '0.875rem', marginBottom: 6 }}>
                      {a.applicant?.seekerProfile?.headline || (a.job?.title ? `Applied for ${a.job.title}` : 'Job Seeker')}
                    </p>

                    <div style={{ display: 'flex', gap: '1.25rem', color: '#6c757d', fontSize: '0.8125rem', flexWrap: 'wrap' }}>
                      {a.applicant?.seekerProfile?.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={13} /> {a.applicant.seekerProfile.location}
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Mail size={13} /> {a.applicant?.email}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} /> Applied {formatDate(a.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <select
                      className="form-control"
                      style={{ width: 140, padding: '0.4rem 0.5rem', fontSize: '0.8125rem' }}
                      value={a.status}
                      onChange={(e) => updateStatus(a.id, e.target.value as ApplicationStatus)}
                    >
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>

                    {/* View Details / Cover Letter */}
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedApplicant(a)}
                      title="View Application Details"
                    >
                      <Eye size={14} /> Details
                    </button>

                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => openConversation(a.id)}
                      title="Message / Interview candidate"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      <MessageSquare size={14} /> Message
                    </button>

                    {/* Resume download or open */}
                    {a.resume?.fileUrl ? (
                      <button
                        onClick={() => setPreviewResume(a.resume || null)}
                        className="btn btn-light btn-sm"
                        title={`View Resume: ${a.resume.fileName}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <FileText size={14} color="#0d6efd" /> Resume
                      </button>
                    ) : (
                      <button className="btn btn-light btn-sm" disabled title="No resume attached" style={{ opacity: 0.5 }}>
                        <FileText size={14} /> No Resume
                      </button>
                    )}

                    {/* Star / Bookmark candidate */}
                    <button
                      onClick={() => toggleRate(a.id)}
                      className="btn btn-light btn-sm"
                      title={isRated ? 'Unstar' : 'Star'}
                    >
                      {isRated ? <Star size={16} fill="#ffc107" color="#ffc107" /> : <StarOff size={16} color="#adb5bd" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Jira-Style Ticket Details Modal */}
      {selectedApplicant && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setSelectedApplicant(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Jira Top Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500">
                <span className="text-blue-600">CAREERLIFT</span>
                <span>/</span>
                <span className="text-slate-800">CAND-{selectedApplicant.id.slice(0, 4).toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openConversation(selectedApplicant.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <MessageSquare size={13} /> Message Candidate
                </button>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Candidate Main Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm shadow-blue-500/20 shrink-0">
                  {getInitials(selectedApplicant.applicant?.firstName, selectedApplicant.applicant?.lastName)}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {selectedApplicant.applicant?.firstName} {selectedApplicant.applicant?.lastName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedApplicant.applicant?.email}</p>
                </div>
              </div>

              {/* Jira Issue Properties Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                  <div className="mt-1">
                    <select
                      className="w-full text-xs font-bold rounded-lg border border-slate-200 bg-white py-1 px-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedApplicant.status}
                      onChange={(e) => updateStatus(selectedApplicant.id, e.target.value as ApplicationStatus)}
                    >
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applied Role</span>
                  <p className="text-xs font-semibold text-slate-900 mt-1.5 truncate">
                    {selectedApplicant.job?.title || job?.title || 'Role'}
                  </p>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submitted</span>
                  <p className="text-xs font-semibold text-slate-900 mt-1.5">
                    {formatDate(selectedApplicant.createdAt)}
                  </p>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resume / CV</span>
                  <div className="mt-1">
                    {selectedApplicant.resume?.fileUrl ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewResume(selectedApplicant.resume || null)}
                          className="px-2 py-1 rounded bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
                        >
                          <Eye size={12} /> View CV
                        </button>
                        <a
                          href={getResumeUrl(selectedApplicant.resume.fileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={selectedApplicant.resume.fileName}
                          className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 transition-colors"
                          title="Download PDF"
                        >
                          <Download size={13} />
                        </a>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">None</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Candidate Headline/Bio */}
              {selectedApplicant.applicant?.seekerProfile?.headline && (
                <div className="mb-5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Headline</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                    {selectedApplicant.applicant.seekerProfile.headline}
                  </p>
                </div>
              )}

              {/* Cover Letter / Notes */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Cover Letter</h4>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                  {selectedApplicant.coverLetter || 'No cover letter was submitted with this application.'}
                </div>
              </div>

              {/* Footer action buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Close Ticket
                </button>
                <button
                  onClick={() => openConversation(selectedApplicant.id)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Interview / Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Resume Preview Modal for Employer */}
      {previewResume && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1.5rem' }}>
          <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 900, height: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={20} style={{ color: '#0d6efd' }} />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                    {previewResume.fileName}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Uploaded resume</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <a
                  href={getResumeUrl(previewResume.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
                >
                  <Eye size={14} /> Open in New Tab
                </a>
                <a
                  href={getResumeUrl(previewResume.fileUrl)}
                  download={previewResume.fileName}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
                >
                  <Download size={14} /> Download
                </a>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => setPreviewResume(null)}
                  style={{ marginLeft: 6 }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Extracted Skills Bar */}
            {previewResume.parsedSkills && previewResume.parsedSkills.length > 0 && (
              <div style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Candidate Skills ({previewResume.parsedSkills.length}):
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 60, overflowY: 'auto' }}>
                  {previewResume.parsedSkills.map((s) => (
                    <span key={s} style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 600 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Document Iframe View */}
            <div style={{ flex: 1, position: 'relative', background: '#525659' }}>
              <iframe
                src={getResumeUrl(previewResume.fileUrl)}
                title={`Resume ${previewResume.fileName}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
