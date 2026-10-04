import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Globe, Users, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

const allCompanies = Array.from({ length: 18 }, (_, i) => ({
  id: String(i + 1),
  name: ['TechCorp', 'InnovateCo', 'DesignStudio', 'DataWave', 'CloudFirst', 'GrowthLabs', 'BuildIt', 'AppForge', 'HealthPlus', 'EduReach', 'FinVault', 'RetailNow'][i % 12],
  slug: ['techcorp', 'innovateco', 'designstudio', 'datawave', 'cloudfirst', 'growthlabs', 'buildit', 'appforge', 'healthplus', 'edureach', 'finvault', 'retailnow'][i % 12],
  initial: ['TC', 'IC', 'DS', 'DW', 'CF', 'GL', 'BI', 'AF', 'HP', 'ER', 'FV', 'RN'][i % 12],
  location: ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Chicago, IL', 'Los Angeles, CA', 'Boston, MA', 'Remote'][i % 8],
  industry: ['Technology', 'Design', 'Marketing', 'Finance', 'Healthcare', 'Education'][i % 6],
  size: ['1–50', '51–200', '201–500', '500–1000', '1000+'][i % 5],
  jobCount: 5 + i * 3,
  color: ['#0d6efd', '#198754', '#fd7e14', '#6f42c1', '#0dcaf0', '#dc3545'][i % 6],
}));

const PAGE_SIZE = 9;

export default function CompaniesPage() {
  const [keyword, setKeyword] = useState('');
  const [industry, setIndustry] = useState('');
  const [page, setPage] = useState(1);

  const filtered = allCompanies.filter((c) => {
    if (keyword && !c.name.toLowerCase().includes(keyword.toLowerCase())) return false;
    if (industry && c.industry !== industry) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Browse Companies</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item active">Companies</li>
          </ol>
        </div>
      </div>

      <div className="search-bar">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
              <input className="search-input" placeholder="Search companies..." style={{ paddingLeft: 40 }} value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1); }} />
            </div>
            <select className="search-input" value={industry} onChange={(e) => { setIndustry(e.target.value); setPage(1); }}>
              <option value="">All Industries</option>
              {['Technology', 'Design', 'Marketing', 'Finance', 'Healthcare', 'Education'].map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            <button className="btn btn-secondary">Search</button>
          </div>
        </div>
      </div>

      <section className="section-py" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: '#6c757d', fontSize: '0.9375rem' }}>
              Showing <strong>{paginated.length}</strong> of <strong>{filtered.length}</strong> companies
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {paginated.map((company) => (
              <Link key={company.id} to={`/companies/${company.slug}`} className="company-item">
                <div style={{ width: 72, height: 72, borderRadius: 12, background: company.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: company.color }}>
                  {company.initial}
                </div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#212529', marginBottom: '0.5rem' }}>{company.name}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#6c757d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <MapPin size={12} /> {company.location}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: '#6c757d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Building2 size={12} /> {company.industry}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: '#6c757d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Users size={12} /> {company.size} employees
                  </span>
                </div>
                <span className="job-badge badge-primary">{company.jobCount} Open Positions</span>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              <button onClick={() => setPage(page - 1)} disabled={page === 1} className="btn btn-light btn-sm" style={{ padding: '0.5rem 0.75rem' }}><ChevronLeft size={16} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-light'}`} style={{ minWidth: 36 }}>{p}</button>
              ))}
              <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="btn btn-light btn-sm" style={{ padding: '0.5rem 0.75rem' }}><ChevronRight size={16} /></button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
