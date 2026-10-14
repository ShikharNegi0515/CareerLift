import { useEffect, useRef } from 'react';

type SseEvent = {
  data: {
    type: 'notification';
    notification: {
      id: string;
      type: string;
      title: string;
      message: string;
      link?: string;
      isRead: boolean;
      createdAt: string;
    };
  };
};

type Options = {
  onNotification: (notification: SseEvent['data']['notification']) => void;
  enabled: boolean;
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * useNotificationStream
 *
 * Opens a Server-Sent Events connection to /api/notifications/stream.
 * The backend uses the Authorization header from the JWT guard, but
 * EventSource doesn't support custom headers. We work around this by
 * using fetch with ReadableStream manually (which DOES allow headers).
 */
export function useNotificationStream({ onNotification, enabled }: Options) {
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    const abortController = new AbortController();
    abortRef.current = abortController;

    let buffer = '';

    const connect = async () => {
      try {
        const response = await fetch(`${API_BASE}/notifications/stream`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'text/event-stream',
          },
          signal: abortController.signal,
        });

        if (!response.ok || !response.body) return;

        const reader = response.body.getReader();
        readerRef.current = reader;
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done || abortController.signal.aborted) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE messages are separated by double newlines
          const parts = buffer.split('\n\n');
          buffer = parts.pop() ?? '';

          for (const part of parts) {
            const dataLine = part.split('\n').find((l) => l.startsWith('data:'));
            if (!dataLine) continue;

            try {
              const json = JSON.parse(dataLine.replace(/^data:\s?/, '')) as SseEvent['data'];
              if (json?.type === 'notification' && json.notification) {
                onNotification(json.notification);
              }
            } catch {
              // ignore malformed lines
            }
          }
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return; // normal cleanup
        // Reconnect after 5s on unexpected errors
        setTimeout(connect, 5000);
      }
    };

    void connect();

    return () => {
      abortController.abort();
      readerRef.current?.cancel();
    };
  }, [enabled, onNotification]);
}
