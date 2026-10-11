import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Search, Filter, Download, Star, StarOff, MapPin,
  Clock, FileText, Loader2, AlertCircle, Mail, X, Eye
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
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<ApplicantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantData | null>(null);
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

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
        <button onClick={exportCSV} className="btn btn-outline btn-sm" disabled={applicants.length === 0}>
          <Download size={16} /> Export CSV
        </button>
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

        {/* Applicant list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
            <Filter size={40} style={{ color: '#dee2e6', margin: '0 auto 1rem' }} />
            <p>No applicants found matching your filters.</p>
          </div>
        ) : (
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

                    {/* Resume download or open */}
                    {a.resume?.fileUrl ? (
                      <a
                        href={a.resume.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-light btn-sm"
                        title={`View Resume: ${a.resume.fileName}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <FileText size={14} color="#0d6efd" /> Resume
                      </a>
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
                    <a
                      href={selectedApplicant.resume.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.8125rem', color: '#0d6efd', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      <Download size={14} /> {selectedApplicant.resume.fileName}
                    </a>
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
              <button onClick={() => setSelectedApplicant(null)} className="btn btn-secondary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
