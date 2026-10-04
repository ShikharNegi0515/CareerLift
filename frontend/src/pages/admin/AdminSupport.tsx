import { MessageSquare, Clock, CheckCircle } from 'lucide-react';

export default function AdminSupport() {
  const tickets = [
    { id: '1', user: 'Jane Doe', subject: 'Cannot upload resume', status: 'Open', time: '1 hour ago', priority: 'High' },
    { id: '2', user: 'InnovateCo', subject: 'Billing issue', status: 'Pending', time: '3 hours ago', priority: 'Medium' },
    { id: '3', user: 'TechCorp', subject: 'Change email address', status: 'Resolved', time: '1 day ago', priority: 'Low' },
  ];

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>Support Tickets</h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Respond to user inquiries and issues.</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tickets.map((t) => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #e9ecef', borderRadius: 8 }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <MessageSquare size={20} style={{ color: '#0d6efd', marginTop: 2 }} />
                <div>
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '1rem', color: '#212529', marginBottom: 2 }}>{t.subject}</h3>
                  <p style={{ fontSize: '0.8125rem', color: '#6c757d' }}>From {t.user} · <Clock size={12} style={{ display: 'inline' }} /> {t.time}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: t.status === 'Resolved' ? '#198754' : t.status === 'Open' ? '#dc3545' : '#ffc107' }}>
                  {t.status}
                </span>
                <button className="btn btn-outline btn-sm">Reply</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
