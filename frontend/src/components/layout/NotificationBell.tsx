import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Check, Trash2, ExternalLink, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/api/client';
import { useAuth } from '@/store/auth';
import { useNotificationStream } from '@/hooks/useNotificationStream';

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface ToastNotification extends NotificationItem {
  toastId: string;
}

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ─── REST fetch helpers ─────────────────────────────────────────────────────

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.get<{ unreadCount: number }>('/notifications/unread-count');
      setUnreadCount(res.data.unreadCount);
    } catch {
      // ignore silently
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<NotificationItem[]>('/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── SSE real-time stream ───────────────────────────────────────────────────

  const handleLiveNotification = useCallback((notification: NotificationItem) => {
    // Prepend to the notification list immediately
    setNotifications((prev) => [notification, ...prev.slice(0, 49)]);
    setUnreadCount((prev) => prev + 1);

    // Show a dismissable toast for 6 seconds
    const toastId = `toast-${Date.now()}`;
    const toast: ToastNotification = { ...notification, toastId };
    setToasts((prev) => [toast, ...prev.slice(0, 2)]); // max 3 toasts at once

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
    }, 6000);
  }, []);

  useNotificationStream({ onNotification: handleLiveNotification, enabled: isAuthenticated });

  // ─── Lifecycle ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      // Keep a light fallback poll every 60s in case SSE drops
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchUnreadCount]);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ─── Actions ────────────────────────────────────────────────────────────────

  const markAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
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

  const dismissToast = (toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Toast notifications (bottom-right) */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.toastId}
            style={{
              background: '#fff',
              borderRadius: 10,
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              border: '1px solid #e9ecef',
              padding: '0.75rem 1rem',
              maxWidth: 320,
              animation: 'slideInRight 0.3s ease-out',
              pointerEvents: 'all',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#0d6efd',
                marginTop: 5,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#212529', marginBottom: 2 }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#495057', lineHeight: 1.35 }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => dismissToast(toast.toastId)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#adb5bd', padding: 2, flexShrink: 0 }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Bell button + dropdown */}
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
                animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
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

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.15); }
        }
      `}</style>
    </>
  );
}
