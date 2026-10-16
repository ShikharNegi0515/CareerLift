import { MessageSquare, Calendar, Clock, Rocket, Video } from 'lucide-react';

export default function MessagesInterviewsPage() {
  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 80px)', overflow: 'hidden', borderRadius: 14 }}>

      {/* ══ BACKGROUND: Light chat UI — blurred ══ */}
      <div style={{
        position: 'absolute', inset: 0,
        filter: 'blur(3.5px)',
        pointerEvents: 'none',
        userSelect: 'none',
        background: '#f8fafc',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: '100%' }}>

          {/* Left: conversation list */}
          <div style={{
            background: '#ffffff',
            borderRight: '1px solid #e5e7eb',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Search bar mock */}
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ height: 36, background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', paddingLeft: 12, gap: 8 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #d1d5db' }} />
                <div style={{ height: 10, width: 100, background: '#e5e7eb', borderRadius: 4 }} />
              </div>
            </div>
            {/* Tabs */}
            <div style={{ display: 'flex', padding: '0 14px', borderBottom: '1px solid #f3f4f6', gap: 16 }}>
              <div style={{ padding: '10px 0', fontSize: 13, color: '#2563eb', fontWeight: 600, borderBottom: '2px solid #2563eb' }}>Open</div>
              <div style={{ padding: '10px 0', fontSize: 13, color: '#9ca3af', fontWeight: 400 }}>Closed</div>
            </div>
            {/* Conversation rows */}
            {[
              { name: 'Priya Sharma',   job: 'Frontend Engineer',  time: '2m ago',  active: true  },
              { name: 'Alex Johnson',   job: 'Product Manager',    time: '1h ago',  active: false },
              { name: 'Ritu Mehta',     job: 'Data Analyst',       time: 'Yesterday',active: false },
              { name: 'Tom Williams',   job: 'Backend Developer',  time: 'Mon',     active: false },
            ].map((c) => (
              <div key={c.name} style={{
                padding: '12px 14px',
                borderBottom: '1px solid #f9fafb',
                background: c.active ? '#eff6ff' : '#fff',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: c.active ? '#2563eb' : '#e5e7eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: c.active ? '#fff' : '#6b7280', fontWeight: 700, fontSize: 12,
                }}>{c.name[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{c.job}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: chat pane */}
          <div style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
            {/* Chat header */}
            <div style={{ padding: '14px 20px', background: '#fff', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>P</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>Priya Sharma</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>Frontend Engineer at Google</div>
              </div>
              <div style={{ padding: '6px 14px', background: '#2563eb', color: '#fff', borderRadius: 7, fontSize: 12, fontWeight: 600 }}>Schedule Interview</div>
            </div>
            {/* Messages */}
            <div style={{ flex: 1, padding: '16px 20px', background: '#f9fafb', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
              {[
                { side: 'left',  text: 'Hi! Thanks for applying. We were impressed with your portfolio.',      bg: '#fff',    color: '#111827' },
                { side: 'right', text: "Thank you! I'm really excited about this role at Google.",              bg: '#2563eb', color: '#fff'    },
                { side: 'left',  text: 'Would next Thursday at 10AM work for a technical interview?',          bg: '#fff',    color: '#111827' },
                { side: 'right', text: 'That sounds perfect! Should I prepare anything specific?',             bg: '#2563eb', color: '#fff'    },
                { side: 'left',  text: 'Brush up on React hooks and system design. We\'ll send a calendar invite.', bg: '#fff', color: '#111827' },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.side === 'right' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '58%', padding: '9px 13px', borderRadius: 12,
                    background: m.bg, color: m.color,
                    fontSize: 13, lineHeight: 1.5,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    border: m.side === 'left' ? '1px solid #f3f4f6' : 'none',
                  }}>{m.text}</div>
                </div>
              ))}
            </div>
            {/* Input */}
            <div style={{ padding: '10px 16px', background: '#fff', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, height: 40, background: '#f9fafb', borderRadius: 20, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
                <span style={{ color: '#9ca3af', fontSize: 13 }}>Type your message...</span>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={16} color="#fff" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Very light overlay — just enough to soften the blur ══ */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(255, 255, 255, 0.32)',
        zIndex: 5,
      }} />

      {/* ══ Coming Soon card ══ */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          borderRadius: 20,
          boxShadow: '0 12px 36px rgba(15, 23, 42, 0.08), 0 2px 10px rgba(0, 0, 0, 0.04)',
          padding: '2.5rem 3rem',
          maxWidth: 460,
          width: '90%',
          textAlign: 'center',
          animation: 'fadeInUp 0.45s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          {/* Icons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: '1.5rem' }}>
            {[
              { bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', Icon: MessageSquare, delay: '0s'   },
              { bg: 'linear-gradient(135deg,#f59e0b,#ef4444)', Icon: Calendar,      delay: '0.3s' },
              { bg: 'linear-gradient(135deg,#10b981,#06b6d4)', Icon: Video,         delay: '0.6s' },
            ].map(({ bg, Icon, delay }) => (
              <div key={delay} style={{
                width: 52, height: 52, borderRadius: 14,
                background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
                animation: `floatIcon 3s ease-in-out infinite ${delay}`,
              }}>
                <Icon size={24} color="#fff" />
              </div>
            ))}
          </div>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#eff6ff', border: '1px solid #bfdbfe',
            borderRadius: 99, padding: '4px 14px', marginBottom: '1rem',
            fontSize: '0.72rem', fontWeight: 700, color: '#2563eb',
            letterSpacing: '0.07em', textTransform: 'uppercase',
          }}>
            <Rocket size={11} /> Feature Coming Soon
          </div>

          {/* Headline */}
          <h2 style={{
            margin: '0 0 0.75rem',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800, fontSize: '1.625rem',
            color: '#111827', lineHeight: 1.2,
            letterSpacing: '-0.5px',
          }}>
            Messages &amp; Interviews
          </h2>

          {/* Body */}
          <p style={{
            color: '#6b7280', fontSize: '0.9375rem', lineHeight: 1.65,
            margin: '0 0 1.75rem',
            fontFamily: "'Inter', sans-serif",
          }}>
            This feature is currently under development and will be
            available very soon. Real-time chat, smart interview
            scheduling, and video-call integration — all in one place.
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#e5e7eb,transparent)', margin: '0 0 1.25rem' }} />

          {/* Feature pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {[
              { Icon: MessageSquare, label: 'Real-time Chat',        color: '#6366f1' },
              { Icon: Calendar,      label: 'Interview Scheduler',   color: '#f59e0b' },
              { Icon: Clock,         label: 'Video Calls',           color: '#10b981' },
            ].map(({ Icon, label, color }) => (
              <span key={label} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: '#f9fafb', border: '1px solid #e5e7eb',
                borderRadius: 99, padding: '6px 14px',
                fontSize: '0.8rem', color: '#374151', fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
              }}>
                <Icon size={12} style={{ color }} /> {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes floatIcon {
          0%,100% { transform: translateY(0);   }
          50%     { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
