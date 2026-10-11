import { useState, useEffect } from 'react';
import { FileText, Upload, Trash2, Star, Download, Eye, Plus, Loader2, AlertCircle } from 'lucide-react';
import api from '@/api/client';
import type { Resume } from '@/types';

const formatSize = (bytes: number) => {
  if (!bytes) return '0 KB';
  return `${(bytes / 1024).toFixed(0)} KB`;
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function SeekerResumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get<Resume[]>('/resumes/me');
      setResumes(res.data);
    } catch (err: any) {
      console.error('Failed to fetch resumes', err);
      setError('Unable to load your resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Check size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }

    setUploading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fileUrl = reader.result as string;
        const res = await api.post<Resume>('/resumes', {
          fileName: file.name,
          fileUrl,
          fileSize: file.size,
        });
        setResumes((prev) => {
          // If this is the first resume or default, update accordingly
          if (res.data.isDefault) {
            return [res.data, ...prev.map((r) => ({ ...r, isDefault: false }))];
          }
          return [res.data, ...prev];
        });
      } catch (err: any) {
        console.error('Failed to upload resume', err);
        setError(err.response?.data?.message || 'Failed to upload resume. Please try again.');
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read the file.');
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
      e.target.value = '';
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const setDefault = async (id: string) => {
    try {
      await api.put(`/resumes/${id}/default`);
      setResumes((prev) =>
        prev.map((r) => ({
          ...r,
          isDefault: r.id === id,
        }))
      );
    } catch (err: any) {
      console.error('Failed to set default resume', err);
      setError('Failed to set default resume.');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      setResumes((prev) => {
        const filtered = prev.filter((r) => r.id !== id);
        // If we deleted the default resume and remaining exist, the latest becomes default on the backend
        if (prev.find((r) => r.id === id)?.isDefault && filtered.length > 0) {
          filtered[0].isDefault = true;
        }
        return [...filtered];
      });
    } catch (err: any) {
      console.error('Failed to delete resume', err);
      setError('Failed to delete resume.');
    }
  };

  const handlePreview = (resume: Resume) => {
    if (!resume.fileUrl) return;
    const win = window.open();
    if (win) {
      win.document.write(
        `<iframe src="${resume.fileUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
      );
    }
  };

  const handleDownload = (resume: Resume) => {
    if (!resume.fileUrl) return;
    const a = document.createElement('a');
    a.href = resume.fileUrl;
    a.download = resume.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>My Resumes</h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Upload and manage your resumes. Set a default for quick applications.</p>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.75rem 1rem', background: '#f8d7da', color: '#842029', borderRadius: 8, marginBottom: '1rem' }}>
          <AlertCircle size={18} />
          <span style={{ fontSize: '0.875rem' }}>{error}</span>
          <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#842029', fontWeight: 'bold' }}>×</button>
        </div>
      )}

      {/* Upload zone */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          border: `2px dashed ${dragging ? '#0d6efd' : '#dee2e6'}`,
          background: dragging ? '#e8f0fe' : '#fff',
          textAlign: 'center',
          padding: '3rem',
          cursor: uploading ? 'wait' : 'pointer',
          transition: 'all 0.2s',
          opacity: uploading ? 0.7 : 1,
        }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && document.getElementById('resume-upload')?.click()}
      >
        {uploading ? (
          <>
            <Loader2 size={40} style={{ color: '#0d6efd', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#212529', marginBottom: '0.5rem' }}>
              Uploading Resume...
            </h4>
            <p style={{ color: '#6c757d', fontSize: '0.875rem' }}>Please wait while your file is being processed</p>
          </>
        ) : (
          <>
            <Upload size={40} style={{ color: dragging ? '#0d6efd' : '#adb5bd', margin: '0 auto 1rem' }} />
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#212529', marginBottom: '0.5rem' }}>
              {dragging ? 'Drop your resume here!' : 'Upload Your Resume'}
            </h4>
            <p style={{ color: '#6c757d', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Drag & drop or click to browse. Supports PDF, DOC, DOCX. Max 10MB.
            </p>
            <button className="btn btn-primary btn-sm" type="button"><Plus size={15} /> Choose File</button>
          </>
        )}
        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          disabled={uploading}
          onChange={onFileInputChange}
        />
      </div>

      {/* Resume list */}
      <div className="card">
        <h3 className="card-title">Uploaded Resumes ({resumes.length})</h3>
        {resumes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
            <FileText size={40} style={{ color: '#dee2e6', margin: '0 auto 1rem' }} />
            <p>No resumes uploaded yet.</p>
          </div>
        ) : (
          resumes.map((resume) => (
            <div
              key={resume.id}
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                padding: '1rem',
                border: '1px solid #e9ecef',
                borderRadius: 8,
                marginBottom: '0.75rem',
                background: resume.isDefault ? '#f0f7ff' : '#fff',
                borderColor: resume.isDefault ? '#b6d4fe' : '#e9ecef',
              }}
            >
              <div style={{ width: 48, height: 48, background: '#e8f0fe', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={22} style={{ color: '#0d6efd' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#212529', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {resume.fileName}
                  </p>
                  {resume.isDefault && <span className="job-badge badge-primary" style={{ fontSize: '0.7rem', flexShrink: 0 }}>Default</span>}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                  {formatSize(resume.fileSize)} · Uploaded {formatDate(resume.createdAt)}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  className="btn btn-light btn-sm"
                  title="Preview"
                  onClick={() => handlePreview(resume)}
                >
                  <Eye size={15} />
                </button>
                <button
                  className="btn btn-light btn-sm"
                  title="Download"
                  onClick={() => handleDownload(resume)}
                >
                  <Download size={15} />
                </button>
                {!resume.isDefault && (
                  <button
                    onClick={() => setDefault(resume.id)}
                    className="btn btn-light btn-sm"
                    title="Set as default"
                  >
                    <Star size={15} style={{ color: '#ffc107' }} />
                  </button>
                )}
                {!resume.isDefault && (
                  <button
                    onClick={() => remove(resume.id)}
                    className="btn btn-light btn-sm"
                    style={{ color: '#dc3545' }}
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tips */}
      <div className="card" style={{ marginTop: '1.5rem', background: '#f8f9fa', border: 'none' }}>
        <h3 className="card-title">Resume Tips</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { emoji: '📄', tip: 'Use PDF format for best compatibility across all applicant tracking systems.' },
            { emoji: '📏', tip: 'Keep your resume to 1-2 pages max. Recruiters spend ~6 seconds on first review.' },
            { emoji: '🎯', tip: 'Tailor your resume keywords to match each job description for better ATS scores.' },
            { emoji: '🔢', tip: 'Quantify achievements with numbers — "Increased sales by 35%" beats "Improved sales."' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '1rem', background: '#fff', borderRadius: 8, border: '1px solid #e9ecef' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.emoji}</p>
              <p style={{ fontSize: '0.8125rem', color: '#495057', lineHeight: 1.5 }}>{item.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
