import { useEffect, useCallback } from 'react';
import { X, Trash2, Loader2, TriangleAlert } from 'lucide-react';

interface DeleteConfirmModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  itemName: string;
  itemMeta?: string;
  chips?: string[];
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  /** Accent colour for hero gradient — defaults to red/orange */
  accentFrom?: string;
  accentTo?: string;
}

export default function DeleteConfirmModal({
  open,
  title,
  subtitle,
  itemName,
  itemMeta,
  chips = [],
  isDeleting,
  onConfirm,
  onCancel,
  accentFrom = '#ef4444',
  accentTo = '#f97316',
}: DeleteConfirmModalProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape' && !isDeleting) onCancel(); },
    [isDeleting, onCancel],
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, handleKey]);

  if (!open) return null;

  return (
    <>
      <style>{`
        @keyframes dcm-backdropIn { from{opacity:0} to{opacity:1} }
        @keyframes dcm-pop  { from{opacity:0;transform:scale(.86) translateY(28px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes dcm-float{ 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-10px) rotate(3deg)} }
        @keyframes dcm-blob { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
        @keyframes dcm-spin { to{transform:rotate(360deg)} }
        @keyframes dcm-shine{
          0%{background-position:-200% center}
          100%{background-position:200% center}
        }
        .dcm-cancel:hover{background:#f1f5f9 !important;border-color:#c4cdd8 !important;}
        .dcm-delete:hover{transform:translateY(-2px) !important;box-shadow:0 12px 32px rgba(239,68,68,.48) !important;}
      `}</style>

      {/* ── Backdrop ── */}
      <div
        onClick={() => !isDeleting && onCancel()}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(15, 23, 60, 0.28)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          animation: 'dcm-backdropIn .2s ease',
        }}
      />

      {/* ── Centerer ── */}
      <div
        role="dialog" aria-modal="true" aria-labelledby="dcm-title"
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', pointerEvents: 'none',
        }}
      >
        <div style={{
          pointerEvents: 'all', width: '100%', maxWidth: 560,
          background: '#fff', borderRadius: '2rem',
          boxShadow: '0 32px 100px rgba(15,23,60,0.18), 0 2px 8px rgba(15,23,60,0.06)',
          overflow: 'hidden',
          animation: 'dcm-pop .3s cubic-bezier(.34,1.45,.64,1)',
          position: 'relative',
        }}>

          {/* ── Hero zone ── */}
          <div style={{
            position: 'relative', overflow: 'hidden',
            background: `linear-gradient(140deg, #fff8f6 0%, #fff2ef 50%, #ffe6e0 100%)`,
            padding: '2.5rem 2.25rem 2rem',
          }}>
            {/* Dot grid */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 0,
              backgroundImage: `radial-gradient(${accentFrom}22 1.5px, transparent 1.5px)`,
              backgroundSize: '22px 22px',
            }} />

            {/* Blob top-right */}
            <div style={{
              position: 'absolute', top: -50, right: -50, width: 200, height: 200,
              borderRadius: '50%', zIndex: 0,
              background: `radial-gradient(circle, ${accentFrom}28 0%, transparent 65%)`,
              animation: 'dcm-blob 5s ease-in-out infinite',
            }} />
            {/* Blob bottom-left */}
            <div style={{
              position: 'absolute', bottom: -35, left: -35, width: 140, height: 140,
              borderRadius: '50%', zIndex: 0,
              background: `radial-gradient(circle, ${accentTo}20 0%, transparent 65%)`,
              animation: 'dcm-blob 6s ease-in-out 1.2s infinite',
            }} />

            {/* Close */}
            <button
              onClick={onCancel} disabled={isDeleting} aria-label="Close"
              style={{
                position: 'absolute', top: '1.1rem', right: '1.1rem', zIndex: 2,
                width: 34, height: 34, borderRadius: '50%',
                background: `${accentFrom}18`, border: `1px solid ${accentFrom}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
                color: accentFrom, transition: 'background .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${accentFrom}30`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${accentFrom}18`; }}
            >
              <X size={15} />
            </button>

            {/* Floating icon */}
            <div style={{
              position: 'relative', zIndex: 1,
              width: 80, height: 80, borderRadius: '1.5rem',
              background: `linear-gradient(135deg, ${accentFrom} 0%, ${accentTo} 100%)`,
              boxShadow: `0 18px 44px ${accentFrom}44, 0 4px 12px ${accentFrom}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.5rem',
              animation: 'dcm-float 3.8s ease-in-out infinite',
            }}>
              <TriangleAlert size={40} color="#fff" strokeWidth={2} />
            </div>

            <h2 id="dcm-title" style={{
              position: 'relative', zIndex: 1,
              fontFamily: 'Inter, sans-serif', fontWeight: 800,
              fontSize: '1.6rem', color: '#0f172a',
              margin: 0, marginBottom: '0.45rem', letterSpacing: '-0.035em', lineHeight: 1.2,
            }}>
              {title}
            </h2>
            <p style={{
              position: 'relative', zIndex: 1,
              fontSize: '0.9rem', color: '#64748b', margin: 0, lineHeight: 1.6,
            }}>
              {subtitle || <>This action is <strong style={{ color: accentFrom }}>permanent</strong> and cannot be reversed.</>}
            </p>
          </div>

          {/* ── Body ── */}
          <div style={{ padding: '1.75rem 2.25rem 2.25rem' }}>

            {/* Item card */}
            <div style={{
              background: '#f8fafc', border: '1.5px solid #e2e8f0',
              borderRadius: '1.1rem', padding: '1.1rem 1.25rem',
              marginBottom: '1.5rem', position: 'relative', overflow: 'hidden',
            }}>
              {/* gradient left bar */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 5,
                background: `linear-gradient(180deg, ${accentFrom}, ${accentTo})`,
                borderRadius: '5px 0 0 5px',
              }} />
              <div style={{ paddingLeft: '0.875rem' }}>
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.05rem',
                  color: '#0f172a', margin: 0,
                  marginBottom: itemMeta ? '0.45rem' : 0,
                  letterSpacing: '-0.015em',
                }}>
                  {itemName}
                </p>
                {itemMeta && (
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>{itemMeta}</p>
                )}
              </div>
            </div>

            {/* Impact chips */}
            {chips.length > 0 && (
              <>
                <p style={{
                  fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                  margin: 0, marginBottom: '0.6rem',
                }}>
                  Permanently removes
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '2rem' }}>
                  {chips.map(item => (
                    <span key={item} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: '0.78rem', fontWeight: 600,
                      color: '#dc2626', background: '#fef2f2',
                      border: '1px solid #fecaca', padding: '4px 12px', borderRadius: 999,
                    }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 900 }}>✕</span> {item}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.875rem' }}>
              <button
                className="dcm-cancel"
                onClick={onCancel}
                disabled={isDeleting}
                style={{
                  flex: 1, padding: '0.875rem 1rem', borderRadius: '1rem',
                  border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#374151',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.925rem',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  transition: 'background .15s, border-color .15s',
                  letterSpacing: '-0.01em',
                }}
              >
                Cancel
              </button>

              <button
                className="dcm-delete"
                onClick={onConfirm}
                disabled={isDeleting}
                style={{
                  flex: 1.2, padding: '0.875rem 1rem', borderRadius: '1rem', border: 'none',
                  background: `linear-gradient(135deg, ${accentFrom} 0%, ${accentTo} 100%)`,
                  color: '#fff', fontFamily: 'Inter, sans-serif',
                  fontWeight: 700, fontSize: '0.925rem',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  boxShadow: isDeleting ? 'none' : `0 6px 20px ${accentFrom}40`,
                  transition: 'transform .15s, box-shadow .15s',
                  letterSpacing: '-0.01em', opacity: isDeleting ? 0.7 : 1,
                }}
              >
                {isDeleting
                  ? <><Loader2 size={16} style={{ animation: 'dcm-spin 1s linear infinite' }} /> Deleting…</>
                  : <><Trash2 size={16} /> Yes, Delete It</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
