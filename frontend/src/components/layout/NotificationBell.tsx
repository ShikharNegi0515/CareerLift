import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/api/client';

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get<{ unreadCount: number }>('/notifications/unread-count');
      setUnreadCount(res.data.unreadCount);
    } catch {
      // ignore unauthenticated or network errors silently
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get<NotificationItem[]>('/notifications');
      setNotifications(res.data);
      const unread = res.data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      fetchUnreadCount();
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#495057',
          position: 'relative',
          padding: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
        }}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              minWidth: 16,
              height: 16,
              padding: '0 4px',
              borderRadius: 999,
              background: '#dc3545',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 320,
            background: '#fff',
            borderRadius: 10,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e9ecef',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderBottom: '1px solid #e9ecef',
              background: '#f8f9fa',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#212529' }}>
              Notifications {unreadCount > 0 && `(${unreadCount} new)`}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0d6efd',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>
                <Loader2 size={20} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
                <span style={{ fontSize: '0.8rem' }}>Loading alerts...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#6c757d', fontSize: '0.85rem' }}>
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid #f1f3f5',
                    background: n.isRead ? '#fff' : '#f0f7ff',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#212529' }}>
                      {n.title}
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      {!n.isRead && (
                        <button
                          onClick={(e) => markAsRead(n.id, e)}
                          title="Mark as read"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0d6efd', padding: 2 }}
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        onClick={(e) => deleteNotification(n.id, e)}
                        title="Delete"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#adb5bd', padding: 2 }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#495057', marginTop: 2, lineHeight: 1.35 }}>
                    {n.message}
                  </div>
                  {n.link && (
                    <Link
                      to={n.link}
                      onClick={() => setOpen(false)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        fontSize: '0.75rem',
                        color: '#0d6efd',
                        textDecoration: 'none',
                        marginTop: 4,
                        fontWeight: 600,
                      }}
                    >
                      View details <ExternalLink size={10} />
                    </Link>
                  )}
                  <div style={{ fontSize: '0.6875rem', color: '#adb5bd', marginTop: 4 }}>
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
