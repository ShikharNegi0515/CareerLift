import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, Trash2, Loader2, ExternalLink, AlertTriangle, X } from 'lucide-react';
import api from '@/api/client';
import type { Job } from '@/types';

interface DeleteModalProps {
  job: Job | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteConfirmModal({ job, onConfirm, onCancel, isDeleting }: DeleteModalProps) {
  if (!job) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal card */}
      <div
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: '1.25rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          width: '100%',
          maxWidth: 440,
          padding: '2rem',
          animation: 'modalSlideIn 0.22s cubic-bezier(.4,0,.2,1)',
        }}
      >
        {/* Close btn */}
        <button
          onClick={onCancel}
          disabled={isDeleting}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#adb5bd',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 8,
            transition: 'color 0.15s',
          }}
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fff0f0 0%, #ffe0e0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            border: '2px solid #fcd1d1',
          }}
        >
          <AlertTriangle size={28} style={{ color: '#dc3545' }} />
        </div>

        <h2
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: '1.25rem',
            color: '#1a1a2e',
            marginBottom: '0.5rem',
          }}
        >
          Delete Job Posting?
        </h2>

        <p style={{ color: '#6c757d', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
          You are about to permanently delete:
        </p>

        <div
          style={{
            background: '#f8f9fa',
            borderRadius: '0.75rem',
            padding: '0.875rem 1rem',
            marginBottom: '1.5rem',
            border: '1px solid #e9ecef',
          }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#212529',
              margin: 0,
              marginBottom: '0.2rem',
            }}
          >
            {job.title}
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#6c757d', margin: 0 }}>
            <Building2 size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            {job.company?.name || 'Company'}
          </p>
        </div>

        <p style={{ fontSize: '0.825rem', color: '#dc3545', marginBottom: '1.5rem', fontWeight: 500 }}>
          ⚠️ This action is irreversible. All associated data will be lost.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            style={{
              flex: 1,
              padding: '0.7rem 1rem',
              borderRadius: '0.625rem',
              border: '1.5px solid #dee2e6',
              background: '#fff',
              color: '#495057',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'background 0.15s, border-color 0.15s',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8f9fa';
              e.currentTarget.style.borderColor = '#ced4da';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.borderColor = '#dee2e6';
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              flex: 1,
              padding: '0.7rem 1rem',
              borderRadius: '0.625rem',
              border: 'none',
              background: isDeleting
                ? '#e9ecef'
                : 'linear-gradient(135deg, #dc3545 0%, #c0392b 100%)',
              color: isDeleting ? '#adb5bd' : '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: isDeleting ? 'none' : '0 4px 12px rgba(220,53,69,0.35)',
              transition: 'opacity 0.15s',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {isDeleting ? (
              <>
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 size={14} />
                Yes, Delete
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.93) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [actionId, setActionId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get<Job[]>('/admin/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to load admin jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setActionId(id);
      await api.put(`/admin/jobs/${id}/status`, { status: newStatus });
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: newStatus as any } : j)));
    } catch (err) {
      console.error('Failed to update job status', err);
    } finally {
      setActionId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.delete(`/admin/jobs/${deleteTarget.id}`);
      setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete job', err);
    } finally {
      setIsDeleting(false);
      setActionId(null);
    }
  };

  const filtered = jobs.filter((j) => {
    if (filter !== 'All' && j.status !== filter) return false;
    const title = (j.title || '').toLowerCase();
    const company = (j.company?.name || '').toLowerCase();
    if (search && !title.includes(search.toLowerCase()) && !company.includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#0d6efd' }} />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <DeleteConfirmModal
        job={deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => !isDeleting && setDeleteTarget(null)}
        isDeleting={isDeleting}
      />

      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>Job Moderation &amp; Management</h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Review all job postings across CareerLift, update their status or remove them.</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input className="form-control" style={{ paddingLeft: 32 }} placeholder="Search jobs by title or company..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {['All', 'published', 'draft', 'closed'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.375rem 0.75rem', borderRadius: 9999, border: '1.5px solid', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 500, borderColor: filter === f ? '#0d6efd' : '#dee2e6', background: filter === f ? '#e8f0fe' : '#fff', color: filter === f ? '#0d6efd' : '#6c757d', textTransform: 'capitalize' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                {['Job Title', 'Company', 'Views', 'Status', 'Posted', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((j) => (
                <tr key={j.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600, color: '#212529' }}>
                    <Link to={`/jobs/${j.slug || j.id}`} style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {j.title} <ExternalLink size={12} style={{ color: '#0d6efd' }} />
                    </Link>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={13} /> {j.company?.name || 'Company'}</span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d' }}>
                    {j.viewCount || (j as any).viewsCount || 0}
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <select
                      className="form-control"
                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', width: 'auto' }}
                      value={j.status}
                      disabled={actionId === j.id}
                      onChange={(e) => handleStatusChange(j.id, e.target.value)}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d', fontSize: '0.8125rem' }}>
                    {new Date(j.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <button
                      className="btn btn-light btn-sm"
                      style={{ color: '#dc3545', borderColor: '#f8d7da' }}
                      disabled={actionId === j.id}
                      onClick={() => setDeleteTarget(j)}
                      title="Delete job"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
