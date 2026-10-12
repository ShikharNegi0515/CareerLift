import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, Loader2, AlertCircle, X, Send } from 'lucide-react';
import api from '@/api/client';

interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  adminReply?: string;
  createdAt: string;
}

const priorityColor = (p: string) =>
  p === 'high' ? '#dc3545' : p === 'medium' ? '#ffc107' : '#6c757d';

const statusColor = (s: string) =>
  s === 'resolved' ? '#198754' : s === 'open' ? '#dc3545' : '#ffc107';

export default function AdminSupport() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'pending' | 'resolved'>('all');

  // Reply modal state
  const [replyOpen, setReplyOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState<'open' | 'pending' | 'resolved'>('pending');
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get<Ticket[]>(`/support?status=${filter}`);
      setTickets(res.data);
    } catch (err: any) {
      console.error('Failed to load support tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const openReply = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setReplyText(ticket.adminReply || '');
    setNewStatus(ticket.status);
    setReplyOpen(true);
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setSubmitting(true);
    try {
      await api.put(`/support/${selectedTicket.id}`, {
        status: newStatus,
        adminReply: replyText,
      });
      setReplyOpen(false);
      fetchTickets();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCount = (s: string) => tickets.filter(t => t.status === s).length;

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>
          Support Tickets
        </h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Respond to user inquiries and resolve issues.</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Open', status: 'open', color: '#dc3545', bg: '#f8d7da' },
          { label: 'Pending', status: 'pending', color: '#856404', bg: '#fff3cd' },
          { label: 'Resolved', status: 'resolved', color: '#198754', bg: '#d1e7dd' },
        ].map((s) => (
          <button
            key={s.status}
            onClick={() => setFilter(s.status as any)}
            className="card"
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              border: filter === s.status ? `2px solid ${s.color}` : '1px solid #e9ecef',
              transition: 'all 0.2s',
              padding: '1rem',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{filteredCount(s.status)}</div>
            <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: 2 }}>{s.label}</div>
          </button>
        ))}
        <button
          onClick={() => setFilter('all')}
          className="card"
          style={{
            textAlign: 'left',
            cursor: 'pointer',
            border: filter === 'all' ? '2px solid #0d6efd' : '1px solid #e9ecef',
            transition: 'all 0.2s',
            padding: '1rem',
          }}
        >
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0d6efd' }}>{tickets.length}</div>
          <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: 2 }}>All Tickets</div>
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6c757d' }}>
            <Loader2 size={28} className="animate-spin" style={{ margin: '0 auto 0.75rem' }} />
            <p>Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6c757d' }}>
            <MessageSquare size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <p>No support tickets in this category.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tickets.map((t) => (
              <div
                key={t.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '1rem 1.25rem',
                  border: '1px solid #e9ecef',
                  borderRadius: 8,
                  background: t.status === 'resolved' ? '#fcfcfc' : '#fff',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                  <MessageSquare size={20} style={{ color: statusColor(t.status), marginTop: 2, flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: '#212529', marginBottom: 2 }}>
                      {t.subject}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#6c757d', marginBottom: 4 }}>
                      From <strong>{t.name}</strong> ({t.email}) ·{' '}
                      <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
                      {new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#495057', margin: 0, lineHeight: 1.5 }}>
                      {t.message}
                    </p>
                    {t.adminReply && (
                      <div style={{ marginTop: 8, padding: '0.5rem 0.75rem', background: '#f0f7ff', borderLeft: '3px solid #0d6efd', borderRadius: 4 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0d6efd', marginBottom: 2 }}>Admin Reply:</div>
                        <div style={{ fontSize: '0.8125rem', color: '#343a40' }}>{t.adminReply}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: priorityColor(t.priority),
                    border: `1px solid ${priorityColor(t.priority)}`,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    textTransform: 'capitalize',
                  }}>
                    {t.priority}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: statusColor(t.status), textTransform: 'capitalize' }}>
                    {t.status}
                  </span>
                  <button onClick={() => openReply(t)} className="btn btn-outline btn-sm">
                    {t.status === 'resolved' ? <CheckCircle size={14} /> : <Send size={14} />}
                    {t.status === 'resolved' ? 'View' : 'Reply'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyOpen && selectedTicket && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1050, padding: '1rem',
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 520, padding: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                Reply to: {selectedTicket.subject}
              </h2>
              <button onClick={() => setReplyOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: 8, marginBottom: '1rem', fontSize: '0.8125rem', color: '#495057' }}>
              <strong>{selectedTicket.name}</strong> &lt;{selectedTicket.email}&gt;<br />
              {selectedTicket.message}
            </div>

            <form onSubmit={handleSubmitReply}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: '#495057' }}>
                  Update Status
                </label>
                <select
                  className="form-control"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #ced4da' }}
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: '#495057' }}>
                  Your Reply
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your reply to the user..."
                  className="form-control"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #ced4da' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setReplyOpen(false)} className="btn btn-light">Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                  {submitting ? 'Saving...' : 'Save & Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
