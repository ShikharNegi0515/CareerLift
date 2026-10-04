import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminCategories() {
  const categories = [
    { id: '1', name: 'Software Development', count: 1245 },
    { id: '2', name: 'Design & UX', count: 834 },
    { id: '3', name: 'Marketing', count: 642 },
    { id: '4', name: 'Data Science', count: 421 },
  ];

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>Job Categories</h1>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Manage the taxonomy used to categorize jobs.</p>
        </div>
        <button className="btn btn-primary"><Plus size={16} /> Add Category</button>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase' }}>Category Name</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase' }}>Active Jobs</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600, color: '#212529' }}>{c.name}</td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d' }}>{c.count} jobs</td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
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
