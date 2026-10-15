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
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529' }}>
            {job ? `Applicants for "${job.title}"` : 'All Applicants'}
          </h1>
          <p style={{ color: '#6c757d', fontSize: '0.9rem', marginTop: 2 }}>
            {applicants.length} total applicant{applicants.length === 1 ? '' : 's'}
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
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
            <Filter size={40} style={{ color: '#dee2e6', margin: '0 auto 1rem' }} />
            <p>No applicants found matching your filters.</p>
          </div>
        ) : viewMode === 'kanban' ? (
          /* ──────── Kanban Pipeline Board ──────── */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(250px, 1fr))',
            gap: '1rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            minHeight: 520,
          }}>
            {[
              { key: ApplicationStatus.APPLIED, label: 'Applied', color: '#0d6efd', bg: '#eff6ff', border: '#bfdbfe' },
              { key: ApplicationStatus.UNDER_REVIEW, label: 'Under Review', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
              { key: ApplicationStatus.SHORTLISTED, label: 'Shortlisted', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
              { key: ApplicationStatus.HIRED, label: 'Hired / Offer', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
              { key: ApplicationStatus.REJECTED, label: 'Archived / Rejected', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
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
                  style={{
                    background: isOver ? '#e0f2fe' : col.bg,
                    border: `1.5px ${isOver ? 'dashed #0284c7' : 'solid ' + col.border}`,
                    borderRadius: 12,
                    padding: '0.875rem',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Column header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${col.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>{col.label}</span>
                    </div>
                    <span style={{
                      background: '#fff',
                      color: col.color,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '1px 8px',
                      borderRadius: 9999,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}>
                      {colApps.length}
                    </span>
                  </div>

                  {/* Column cards container */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: 120 }}>
                    {colApps.length === 0 ? (
                      <div style={{
                        border: '1px dashed rgba(0,0,0,0.1)',
                        borderRadius: 8,
                        height: 90,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                        fontSize: '0.75rem',
                      }}>
                        Drag candidates here
                      </div>
                    ) : (
                      colApps.map((a) => {
                        const fullName = `${a.applicant?.firstName || ''} ${a.applicant?.lastName || ''}`.trim() || 'Candidate';
                        const isRated = ratedIds.has(a.id);
                        const isBeingDragged = draggedAppId === a.id;

                        return (
                          <div
                            key={a.id}
                            draggable
                            onDragStart={() => setDraggedAppId(a.id)}
                            onDragEnd={() => {
                              setDraggedAppId(null);
                              setDragOverColumn(null);
                            }}
                            style={{
                              background: '#fff',
                              borderRadius: 10,
                              padding: '0.875rem',
                              boxShadow: isBeingDragged ? '0 12px 20px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
                              border: '1px solid #e2e8f0',
                              cursor: 'grab',
                              opacity: isBeingDragged ? 0.4 : 1,
                              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  background: col.color,
                                  color: '#fff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                }}>
                                  {getInitials(a.applicant?.firstName, a.applicant?.lastName)}
                                </div>
                                <div>
                                  <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' }}>
                                    {fullName}
                                  </h4>
                                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                    {a.job?.title || job?.title || 'Applicant'}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => toggleRate(a.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                              >
                                {isRated ? <Star size={14} fill="#ffc107" color="#ffc107" /> : <StarOff size={14} color="#cbd5e1" />}
                              </button>
                            </div>

                            {a.applicant?.seekerProfile?.headline && (
                              <p style={{ margin: '0 0 8px 0', fontSize: '0.75rem', color: '#475569', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {a.applicant.seekerProfile.headline}
                              </p>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px solid #f1f5f9', fontSize: '0.7rem', color: '#94a3b8' }}>
                              <span>{formatDate(a.createdAt)}</span>
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button
                                  onClick={() => openConversation(a.id)}
                                  className="btn btn-light btn-sm"
                                  style={{ padding: '2px 6px', fontSize: '0.7rem' }}
                                  title="Chat"
                                >
                                  <MessageSquare size={12} color="#2563eb" />
                                </button>
                                <button
                                  onClick={() => setSelectedApplicant(a)}
                                  className="btn btn-light btn-sm"
                                  style={{ padding: '2px 6px', fontSize: '0.7rem' }}
                                  title="Details"
                                >
                                  <Eye size={12} />
                                </button>
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

      {/* Application Details Modal */}
      {selectedApplicant && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            padding: '1rem',
          }}
          onClick={() => setSelectedApplicant(null)}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>
                  {selectedApplicant.applicant?.firstName} {selectedApplicant.applicant?.lastName}
                </h3>
                <p style={{ color: '#6c757d', fontSize: '0.875rem', marginTop: 2 }}>
                  {selectedApplicant.applicant?.email}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: 8 }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', fontWeight: 600 }}>Applied For</span>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', margin: '2px 0 0' }}>
                  {selectedApplicant.job?.title || job?.title || 'Job'}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', fontWeight: 600 }}>Applied Date</span>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', margin: '2px 0 0' }}>
                  {formatDate(selectedApplicant.createdAt)}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', fontWeight: 600 }}>Status</span>
                <div style={{ marginTop: 4 }}>
                  <select
                    className="form-control"
                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.8125rem' }}
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
                <span style={{ fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', fontWeight: 600 }}>Resume</span>
                <p style={{ margin: '4px 0 0' }}>
                  {selectedApplicant.resume?.fileUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setPreviewResume(selectedApplicant.resume || null)}
                        className="btn btn-outline-primary btn-sm"
                        style={{ padding: '2px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <Eye size={13} /> View Full Resume
                      </button>
                      <a
                        href={getResumeUrl(selectedApplicant.resume.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={selectedApplicant.resume.fileName}
                        style={{ fontSize: '0.78rem', color: '#0d6efd', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <Download size={13} /> {selectedApplicant.resume.fileName}
                      </a>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8125rem', color: '#6c757d' }}>No resume uploaded</span>
                  )}
                </p>
              </div>
            </div>

            {/* Candidate Headline/Bio */}
            {selectedApplicant.applicant?.seekerProfile?.headline && (
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#495057', marginBottom: '0.25rem' }}>Headline</h4>
                <p style={{ fontSize: '0.875rem', color: '#212529' }}>{selectedApplicant.applicant.seekerProfile.headline}</p>
              </div>
            )}

            {/* Cover Letter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#495057', marginBottom: '0.5rem' }}>Cover Letter</h4>
              <div style={{ padding: '0.875rem', background: '#f8f9fa', borderRadius: 8, fontSize: '0.875rem', color: '#212529', whiteSpace: 'pre-line', lineHeight: 1.6, maxHeight: 200, overflowY: 'auto' }}>
                {selectedApplicant.coverLetter || 'No cover letter was submitted with this application.'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  const appId = selectedApplicant.id;
                  setSelectedApplicant(null);
                  openConversation(appId);
                }}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <MessageSquare size={14} /> Message & Schedule
              </button>
              <button onClick={() => setSelectedApplicant(null)} className="btn btn-secondary btn-sm">
                Close
              </button>
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
