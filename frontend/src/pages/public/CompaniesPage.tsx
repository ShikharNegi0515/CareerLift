import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, Users, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import api from '@/api/client';
import type { Company } from '@/types';

const INDUSTRIES = [
  'Technology',
  'Design',
  'Marketing',
  'Finance',
  'Healthcare',
  'Education',
  'Engineering',
  'Legal',
];

const COMPANY_COLORS = ['#0d6efd', '#198754', '#fd7e14', '#6f42c1', '#0dcaf0', '#dc3545'];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [keyword, setKeyword] = useState('');
  const [industry, setIndustry] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (keyword.trim()) params.append('keyword', keyword.trim());
      if (industry && industry !== 'All') params.append('industry', industry);
      params.append('page', String(page));
      params.append('limit', '9');

      const res = await api.get(`/companies?${params.toString()}`);
      setCompanies(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Failed to load companies', err);
      setError('Failed to load companies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [keyword, industry, page]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCompanies();
  };

  const getCompanyColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COMPANY_COLORS.length;
    return COMPANY_COLORS[index];
  };

  const getCompanyInitial = (name: string) => {
    if (!name) return 'CO';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

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
          <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
              <input
                className="search-input"
                placeholder="Search companies by name or keyword..."
                style={{ paddingLeft: 40 }}
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <select
              className="search-input"
              value={industry}
              onChange={(e) => {
                setIndustry(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Industries</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            <button type="submit" className="btn btn-secondary">Search</button>
          </form>
        </div>
      </div>

      <section className="section-py" style={{ background: '#f8f9fa', minHeight: '50vh' }}>
        <div className="container">
          {error && (
            <div style={{ background: '#f8d7da', color: '#842029', padding: '0.875rem 1rem', borderRadius: 8, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: '#6c757d', fontSize: '0.9375rem' }}>
              Showing <strong>{companies.length}</strong> of <strong>{total}</strong> companies
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '30vh' }}>
              <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#0d6efd' }} />
            </div>
          ) : companies.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <Building2 size={48} style={{ color: '#adb5bd', margin: '0 auto 1rem' }} />
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#212529', marginBottom: '0.5rem' }}>No companies found</h3>
              <p style={{ color: '#6c757d', fontSize: '0.9rem', maxWidth: 420, margin: '0 auto 1.5rem' }}>
                We couldn't find any companies matching your search criteria. Try modifying your filters or search keywords.
              </p>
              <button
                onClick={() => { setKeyword(''); setIndustry(''); setPage(1); }}
                className="btn btn-outline btn-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {companies.map((company) => {
                const color = getCompanyColor(company.name);
                const initial = getCompanyInitial(company.name);
                return (
                  <Link key={company.id} to={`/companies/${company.slug}`} className="company-item">
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 12,
                        background: color + '20',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 800,
                        fontSize: '1.25rem',
                        color,
                      }}
                    >
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />
                      ) : (
                        initial
                      )}
                    </div>
                    <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#212529', marginBottom: '0.5rem' }}>
                      {company.name}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#6c757d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <MapPin size={12} /> {company.location || 'Location Not Specified'}
                      </span>
                      <span style={{ fontSize: '0.8125rem', color: '#6c757d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <Building2 size={12} /> {company.industry || 'General'}
                      </span>
                      {company.size && (
                        <span style={{ fontSize: '0.8125rem', color: '#6c757d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                          <Users size={12} /> {company.size} employees
                        </span>
                      )}
                    </div>
                    <span className="job-badge badge-primary">
                      {company.jobCount || 0} Open Position{(company.jobCount || 0) === 1 ? '' : 's'}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-light btn-sm"
                style={{ padding: '0.5rem 0.75rem' }}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-light'}`}
                  style={{ minWidth: 36 }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-light btn-sm"
                style={{ padding: '0.5rem 0.75rem' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

