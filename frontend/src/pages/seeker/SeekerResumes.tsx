import { useState } from 'react';
import { FileText, Upload, Trash2, Star, StarOff, Download, Eye, Plus } from 'lucide-react';

const mockResumes = [
  { id: '1', name: 'John_Doe_Resume_2026.pdf', size: 245680, uploadedAt: 'Oct 1, 2026', isDefault: true },
  { id: '2', name: 'John_Doe_Resume_Creative.pdf', size: 312000, uploadedAt: 'Sep 15, 2026', isDefault: false },
];

const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(0)} KB`;

export default function SeekerResumes() {
  const [resumes, setResumes] = useState(mockResumes);
  const [dragging, setDragging] = useState(false);

  const setDefault = (id: string) => setResumes(resumes.map((r) => ({ ...r, isDefault: r.id === id })));
  const remove = (id: string) => setResumes(resumes.filter((r) => r.id !== id));

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>My Resumes</h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Upload and manage your resumes. Set a default for quick applications.</p>
      </div>

      {/* Upload zone */}
      <div
        className="card"
        style={{ marginBottom: '1.5rem', border: `2px dashed ${dragging ? '#0d6efd' : '#dee2e6'}`, background: dragging ? '#e8f0fe' : '#fff', textAlign: 'center', padding: '3rem', cursor: 'pointer', transition: 'all 0.2s' }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); }}
        onClick={() => document.getElementById('resume-upload')?.click()}
      >
        <Upload size={40} style={{ color: dragging ? '#0d6efd' : '#adb5bd', margin: '0 auto 1rem' }} />
        <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#212529', marginBottom: '0.5rem' }}>
          {dragging ? 'Drop your resume here!' : 'Upload Your Resume'}
        </h4>
        <p style={{ color: '#6c757d', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Drag & drop or click to browse. Supports PDF, DOC, DOCX. Max 10MB.
        </p>
        <button className="btn btn-primary btn-sm"><Plus size={15} /> Choose File</button>
        <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} />
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
            <div key={resume.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', border: '1px solid #e9ecef', borderRadius: 8, marginBottom: '0.75rem', background: resume.isDefault ? '#f0f7ff' : '#fff', borderColor: resume.isDefault ? '#b6d4fe' : '#e9ecef' }}>
              <div style={{ width: 48, height: 48, background: '#e8f0fe', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={22} style={{ color: '#0d6efd' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#212529', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resume.name}</p>
                  {resume.isDefault && <span className="job-badge badge-primary" style={{ fontSize: '0.7rem', flexShrink: 0 }}>Default</span>}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#6c757d' }}>{formatSize(resume.size)} · Uploaded {resume.uploadedAt}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button className="btn btn-light btn-sm" title="Preview"><Eye size={15} /></button>
                <button className="btn btn-light btn-sm" title="Download"><Download size={15} /></button>
                {!resume.isDefault && (
                  <button onClick={() => setDefault(resume.id)} className="btn btn-light btn-sm" title="Set as default">
                    <Star size={15} style={{ color: '#ffc107' }} />
                  </button>
                )}
                {!resume.isDefault && (
                  <button onClick={() => remove(resume.id)} className="btn btn-light btn-sm" style={{ color: '#dc3545' }} title="Delete">
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
