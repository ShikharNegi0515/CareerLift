import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Send, Calendar, Clock, Video, FileText, CheckCircle2,
  XCircle, AlertCircle, Loader2, MessageSquare, Plus, ChevronRight, User
} from 'lucide-react';
import api from '@/api/client';
import { useAuth } from '@/store/auth';
import { UserRole } from '@/types';

interface ConversationItem {
  id: string;
  applicationId: string;
  lastMessageAt: string;
  createdAt: string;
  employer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  seeker: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  application?: {
    id: string;
    status: string;
    job?: {
      id: string;
      title: string;
    };
  };
  messages?: MessageItem[];
}

interface MessageItem {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface InterviewItem {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink?: string;
  notes?: string;
  status: 'PROPOSED' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';
  proposerId: string;
  createdAt: string;
}

export default function MessagesInterviewsPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const queryConversationId = searchParams.get('c');

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConv, setSelectedConv] = useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);

  // Modal for scheduling interview
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [meetingLink, setMeetingLink] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [submittingInterview, setSubmittingInterview] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isEmployer = user?.role === UserRole.EMPLOYER;

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConv) {
      loadConversationDetails(selectedConv.id);
    }
  }, [selectedConv?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoadingList(true);
      const res = await api.get<ConversationItem[]>('/conversations');
      setConversations(res.data);
      if (res.data.length > 0) {
        if (queryConversationId) {
          const match = res.data.find((c) => c.id === queryConversationId);
          setSelectedConv(match || res.data[0]);
        } else {
          setSelectedConv(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoadingList(false);
    }
  };

  const loadConversationDetails = async (convId: string) => {
    setLoadingChat(true);
    try {
      const [msgRes, intRes] = await Promise.all([
        api.get<MessageItem[]>(`/conversations/${convId}/messages`),
        api.get<InterviewItem[]>(`/conversations/${convId}/interviews`),
      ]);
      setMessages(msgRes.data);
      setInterviews(intRes.data);
    } catch (err) {
      console.error('Failed to load details', err);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !newMessage.trim() || sending) return;

    try {
      setSending(true);
      const res = await api.post<MessageItem>(`/conversations/${selectedConv.id}/messages`, {
        content: newMessage.trim(),
      });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSending(false);
    }
  };

  const handleProposeInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !interviewDate || !interviewTime) return;

    try {
      setSubmittingInterview(true);
      const scheduledAt = new Date(`${interviewDate}T${interviewTime}`).toISOString();
      const res = await api.post<InterviewItem>(`/conversations/${selectedConv.id}/interviews`, {
        scheduledAt,
        durationMinutes: Number(durationMinutes),
        meetingLink: meetingLink.trim() || undefined,
        notes: interviewNotes.trim() || undefined,
      });

      setInterviews((prev) => [res.data, ...prev]);
      setShowScheduleModal(false);
      setMeetingLink('');
      setInterviewNotes('');
      // Reload messages because an interview announcement message is also posted
      const msgRes = await api.get<MessageItem[]>(`/conversations/${selectedConv.id}/messages`);
      setMessages(msgRes.data);
    } catch (err) {
      console.error('Failed to propose interview', err);
    } finally {
      setSubmittingInterview(false);
    }
  };

  const handleRespondInterview = async (interviewId: string, status: 'ACCEPTED' | 'DECLINED') => {
    try {
      await api.put(`/conversations/interviews/${interviewId}/respond`, { status });
      setInterviews((prev) =>
        prev.map((i) => (i.id === interviewId ? { ...i, status } : i))
      );
    } catch (err) {
      console.error('Failed to respond to interview', err);
    }
  };

  const handleCancelInterview = async (interviewId: string) => {
    try {
      await api.put(`/conversations/interviews/${interviewId}/cancel`);
      setInterviews((prev) =>
        prev.map((i) => (i.id === interviewId ? { ...i, status: 'CANCELLED' } : i))
      );
    } catch (err) {
      console.error('Failed to cancel interview', err);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#1a1f36', margin: 0 }}>
            Messages & Interviews
          </h1>
          <p style={{ color: '#6c757d', fontSize: '0.875rem', marginTop: 4 }}>
            Direct communication, applicant questions, and interview scheduling
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1rem', flex: 1, minHeight: 0 }}>
        {/* Left column: Conversations list */}
        <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e9ecef', fontWeight: 700, fontSize: '0.875rem' }}>
            Conversations ({conversations.length})
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loadingList ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>
                <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto 8px' }} />
                <span>Loading chats...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>
                <MessageSquare size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>No conversations yet</p>
                <p style={{ fontSize: '0.75rem' }}>
                  {isEmployer
                    ? 'Message an applicant from your Applicants list'
                    : 'Conversations will appear here when an employer contacts you'}
                </p>
              </div>
            ) : (
              conversations.map((c) => {
                const otherParty = isEmployer ? c.seeker : c.employer;
                const isSelected = selectedConv?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedConv(c)}
                    style={{
                      padding: '0.875rem 1rem',
                      borderBottom: '1px solid #f1f3f5',
                      cursor: 'pointer',
                      background: isSelected ? '#f0f7ff' : '#fff',
                      borderLeft: isSelected ? '4px solid #0d6efd' : '4px solid transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#212529' }}>
                        {otherParty?.firstName} {otherParty?.lastName}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#adb5bd' }}>
                        {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#0d6efd', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.application?.job?.title || 'Job Application'}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: Active conversation chat & interviews */}
        {selectedConv ? (
          <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Chat header */}
            <div style={{
              padding: '0.875rem 1.25rem',
              borderBottom: '1px solid #e9ecef',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#fff'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1a1f36' }}>
                  {isEmployer
                    ? `${selectedConv.seeker?.firstName} ${selectedConv.seeker?.lastName}`
                    : `${selectedConv.employer?.firstName} ${selectedConv.employer?.lastName}`}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                  Application for <strong>{selectedConv.application?.job?.title || 'Position'}</strong>
                </span>
              </div>

              {isEmployer && (
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Calendar size={14} /> Schedule Interview
                </button>
              )}
            </div>

            {/* Interviews banner list if any */}
            {interviews.length > 0 && (
              <div style={{ background: '#f8f9fa', borderBottom: '1px solid #e9ecef', padding: '0.75rem 1.25rem', maxHeight: 180, overflowY: 'auto' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#6c757d', marginBottom: '0.5rem' }}>
                  Scheduled / Proposed Interviews
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {interviews.map((iv) => {
                    const isProposed = iv.status === 'PROPOSED';
                    const isAccepted = iv.status === 'ACCEPTED';
                    const isDeclined = iv.status === 'DECLINED';
                    const isCancelled = iv.status === 'CANCELLED';

                    return (
                      <div
                        key={iv.id}
                        style={{
                          background: '#fff',
                          border: '1px solid #dee2e6',
                          borderRadius: 8,
                          padding: '0.625rem 0.875rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 12,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8125rem' }}>
                          <Calendar size={16} color="#0d6efd" />
                          <div>
                            <span style={{ fontWeight: 700 }}>
                              {new Date(iv.scheduledAt).toLocaleString([], {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </span>
                            <span style={{ color: '#6c757d', marginLeft: 8 }}>({iv.durationMinutes} mins)</span>
                            {iv.meetingLink && (
                              <div style={{ marginTop: 2 }}>
                                <a
                                  href={iv.meetingLink.startsWith('http') ? iv.meetingLink : `https://${iv.meetingLink}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#0d6efd', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none', fontWeight: 600 }}
                                >
                                  <Video size={12} /> Join Call
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              padding: '2px 8px',
                              borderRadius: 9999,
                              fontWeight: 700,
                              background: isAccepted ? '#d1e7dd' : isDeclined || isCancelled ? '#f8d7da' : '#fff3cd',
                              color: isAccepted ? '#0f5132' : isDeclined || isCancelled ? '#842029' : '#664d03',
                            }}
                          >
                            {iv.status}
                          </span>

                          {!isEmployer && isProposed && (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button
                                onClick={() => handleRespondInterview(iv.id, 'ACCEPTED')}
                                className="btn btn-sm btn-outline-success"
                                style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleRespondInterview(iv.id, 'DECLINED')}
                                className="btn btn-sm btn-outline-danger"
                                style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                              >
                                Decline
                              </button>
                            </div>
                          )}

                          {isEmployer && !isCancelled && (
                            <button
                              onClick={() => handleCancelInterview(iv.id)}
                              className="btn btn-sm btn-outline-secondary"
                              style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Messages body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#f8f9fa' }}>
              {loadingChat ? (
                <div style={{ textAlign: 'center', margin: 'auto', color: '#6c757d' }}>
                  <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto 8px' }} />
                  <span>Loading messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto', color: '#adb5bd' }}>
                  <MessageSquare size={36} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>No messages yet. Send a message to begin the chat.</p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMine = m.senderId === user?.id;
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMine ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '70%',
                          padding: '0.625rem 0.875rem',
                          borderRadius: 12,
                          background: isMine ? '#0d6efd' : '#fff',
                          color: isMine ? '#fff' : '#212529',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {m.content}
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#adb5bd', marginTop: 2, padding: '0 4px' }}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <form onSubmit={handleSendMessage} style={{ padding: '0.75rem 1rem', background: '#fff', borderTop: '1px solid #e9ecef', display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{
                  flex: 1,
                  border: '1px solid #ced4da',
                  borderRadius: 20,
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="btn btn-primary"
                style={{ borderRadius: 20, padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              </button>
            </form>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d' }}>
            <div style={{ textAlign: 'center' }}>
              <MessageSquare size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <h3>No conversation selected</h3>
              <p style={{ fontSize: '0.875rem' }}>Select a chat from the left panel to read and reply.</p>
            </div>
          </div>
        )}
      </div>

      {/* Propose Interview Modal */}
      {showScheduleModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            padding: '1rem',
          }}
          onClick={() => setShowScheduleModal(false)}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: 460 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1rem' }}>
              Schedule Interview
            </h3>
            <form onSubmit={handleProposeInterview}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Date *</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Time *</label>
                  <input
                    type="time"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Duration (Minutes)</label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="form-control"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Meeting URL (Google Meet / Zoom)</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Notes / Agenda</label>
                <textarea
                  rows={3}
                  placeholder="Technical screening / System design interview..."
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingInterview}
                  className="btn btn-primary btn-sm"
                >
                  {submittingInterview ? <Loader2 className="animate-spin" size={16} /> : 'Send Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
