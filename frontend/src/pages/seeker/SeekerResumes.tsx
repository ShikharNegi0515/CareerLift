import { useState, useEffect } from 'react';
import { FileText, Upload, Trash2, Star, Download, Eye, Plus, Loader2, AlertCircle, Sparkles, Check, CheckCircle2 } from 'lucide-react';
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
  const [uploadSuccess, setUploadSuccess] = useState<{ count: number; skills: string[] } | null>(null);
  const [previewResume, setPreviewResume] = useState<Resume | null>(null);

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

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('syncSkills', 'true');

      const res = await api.post<{ resume: Resume; parsedSkills: string[] }>('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newResume = res.data.resume;
      const extractedSkills = res.data.parsedSkills || [];

      setResumes((prev) => {
        if (newResume.isDefault) {
          return [newResume, ...prev.map((r) => ({ ...r, isDefault: false }))];
        }
        return [newResume, ...prev];
      });

      if (extractedSkills.length > 0) {
        setUploadSuccess({ count: extractedSkills.length, skills: extractedSkills });
      }
    } catch (err: any) {
      console.error('Failed to upload resume', err);
      setError(err.response?.data?.message || 'Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
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
      setResumes((prev) => prev.filter((r) => r.id !== id));
      if (previewResume?.id === id) {
        setPreviewResume(null);
      }
    } catch (err: any) {
      console.error('Failed to delete resume', err);
      setError('Failed to delete resume.');
    }
  };

  const handlePreview = (resume: Resume) => {
    setPreviewResume(resume);
  };

  const handleDownload = (resume: Resume) => {
    if (resume.fileUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = resume.fileUrl;
      link.download = resume.fileName;
      link.click();
    } else {
      window.open(resume.fileUrl, '_blank');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1f36', margin: 0 }}>
          Manage Resumes
        </h1>
        <p style={{ color: '#6c757d', fontSize: '0.875rem', marginTop: 4 }}>
          Upload PDF resumes to auto-extract skills and match with top job recommendations
        </p>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8d7da', color: '#842029', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {uploadSuccess && (
        <div style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', color: '#1b5e20', padding: '0.85rem 1.1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, marginBottom: 6 }}>
            <Sparkles size={18} style={{ color: '#2e7d32' }} />
            <span>AI Parser detected and synced {uploadSuccess.count} skills to your profile!</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {uploadSuccess.skills.map((skill) => (
              <span key={skill} style={{ background: '#fff', border: '1px solid #a5d6a7', borderRadius: 16, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 500 }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragging ? '#0d6efd' : '#dee2e6'}`,
          borderRadius: 12,
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          background: dragging ? '#f0f7ff' : '#fafafa',
          marginBottom: '1.5rem',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ width: 56, height: 56, background: '#e8f0fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <Upload size={26} style={{ color: '#0d6efd' }} />
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
          Drop your PDF resume here
        </h3>
        <p style={{ color: '#6c757d', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          PDF, DOCX, or TXT up to 10MB. Skills will be automatically parsed.
        </p>
        <label className={`btn btn-primary ${uploading ? 'disabled' : ''}`} style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}>
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Parsing & Uploading...
            </>
          ) : (
            <>
              <Plus size={16} /> Select File
            </>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={onFileInputChange}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Resumes List */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '1rem' }}>
          Uploaded Resumes ({resumes.length})
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#6c757d' }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
            <p>Loading resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#adb5bd' }}>
            <FileText size={48} style={{ margin: '0 auto 0.75rem', strokeWidth: 1.5 }} />
            <p style={{ fontWeight: 500, color: '#495057' }}>No resumes uploaded yet</p>
            <p style={{ fontSize: '0.85rem' }}>Upload your first resume above to get started</p>
          </div>
        ) : (
          resumes.map((resume) => (
            <div
              key={resume.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1rem',
                border: '1px solid #e9ecef',
                borderRadius: 8,
                marginBottom: '0.75rem',
                background: resume.isDefault ? '#f0f7ff' : '#fff',
                borderColor: resume.isDefault ? '#b6d4fe' : '#e9ecef',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

              {/* Parsed Skills Badges */}
              {resume.parsedSkills && resume.parsedSkills.length > 0 && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px dashed #dee2e6', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6c757d', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                    <Sparkles size={13} style={{ color: '#0d6efd' }} /> Extracted Skills:
                  </span>
                  {resume.parsedSkills.slice(0, 8).map((skill) => (
                    <span key={skill} style={{ fontSize: '0.72rem', background: '#e7f1ff', color: '#0a58ca', borderRadius: 12, padding: '1px 7px' }}>
                      {skill}
                    </span>
                  ))}
                  {resume.parsedSkills.length > 8 && (
                    <span style={{ fontSize: '0.72rem', color: '#6c757d' }}>
                      +{resume.parsedSkills.length - 8} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Preview Modal */}
      {previewResume && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050, padding: '1.5rem' }}>
          <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 700, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={18} style={{ color: '#0d6efd' }} />
                {previewResume.fileName}
              </h3>
              <button className="btn btn-light btn-sm" onClick={() => setPreviewResume(null)}>
                Close
              </button>
            </div>
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {previewResume.parsedSkills && previewResume.parsedSkills.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.85rem', color: '#6c757d', textTransform: 'uppercase', marginBottom: 8 }}>
                    Detected Skills
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {previewResume.parsedSkills.map((s) => (
                      <span key={s} style={{ background: '#e8f0fe', color: '#0d6efd', padding: '3px 10px', borderRadius: 16, fontSize: '0.8rem', fontWeight: 500 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {previewResume.parsedText ? (
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: '#6c757d', textTransform: 'uppercase', marginBottom: 8 }}>
                    Parsed Resume Text
                  </h4>
                  <pre style={{ background: '#f8f9fa', padding: '1rem', borderRadius: 8, fontSize: '0.8rem', whiteSpace: 'pre-wrap', maxHeight: 350, overflowY: 'auto', fontFamily: 'monospace' }}>
                    {previewResume.parsedText}
                  </pre>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#6c757d' }}>
                  <p>Direct preview is available for parsed PDF resumes.</p>
                  <button className="btn btn-primary" onClick={() => handleDownload(previewResume)}>
                    <Download size={16} /> Download Resume File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
