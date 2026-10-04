import { useState } from 'react';
import { Search, Building2, Ban, CheckCircle, Eye, MoreVertical } from 'lucide-react';

const mockCompanies = [
  { id: '1', name: 'TechCorp', industry: 'Technology', jobs: 12, status: 'Verified', joined: 'Oct 1, 2026' },
  { id: '2', name: 'InnovateCo', industry: 'Software', jobs: 5, status: 'Verified', joined: 'Sep 25, 2026' },
  { id: '3', name: 'FakeCompany', industry: 'Unknown', jobs: 2, status: 'Suspended', joined: 'Oct 4, 2026' },
];

export default function AdminCompanies() {
  const [companies, setCompanies] = useState(mockCompanies);
  const [search, setSearch] = useState('');

  const filtered = companies.filter((c) =>
    search ? c.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>Companies</h1>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Manage registered employers and verify their business profiles.</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input className="form-control" style={{ paddingLeft: 32 }} placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                {['Company', 'Industry', 'Active Jobs', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, background: '#f8f9fa', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={16} color="#0d6efd" /></div>
                      <span style={{ fontWeight: 600, color: '#212529' }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#495057' }}>{c.industry}</td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>{c.jobs}</td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: c.status === 'Verified' ? '#198754' : '#dc3545', background: c.status === 'Verified' ? '#d1e7dd' : '#f8d7da', padding: '3px 10px', borderRadius: 9999 }}>{c.status}</span>
                  </td>
                  <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d', fontSize: '0.8125rem' }}>{c.joined}</td>
                  <td style={{ padding: '0.875rem 0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-light btn-sm"><Eye size={14} /></button>
                      <button className="btn btn-light btn-sm"><MoreVertical size={14} /></button>
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
