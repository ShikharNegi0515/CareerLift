import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminBlog() {
  const posts = [
    { id: '1', title: 'Top 10 Remote Work Tools in 2026', author: 'Alex Morgan', status: 'Published', date: 'Oct 1, 2026' },
    { id: '2', title: 'How to Ace Your System Design Interview', author: 'Jordan Lee', status: 'Draft', date: 'Oct 3, 2026' },
  ];

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>Blog Content</h1>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Manage articles and career resources.</p>
        </div>
        <button className="btn btn-primary"><Plus size={16} /> New Post</button>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase' }}>Author</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600, color: '#212529' }}>{p.title}</td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#495057' }}>{p.author}</td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: p.status === 'Published' ? '#198754' : '#6c757d', background: p.status === 'Published' ? '#d1e7dd' : '#e9ecef', padding: '3px 10px', borderRadius: 9999 }}>{p.status}</span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-light btn-sm"><Eye size={14} /></button>
                      <button className="btn btn-light btn-sm"><Edit size={14} /></button>
                      <button className="btn btn-light btn-sm" style={{ color: '#dc3545' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
