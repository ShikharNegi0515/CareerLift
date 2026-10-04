import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Briefcase, Building2, ChevronLeft, ChevronRight,
  SlidersHorizontal, X, Clock, DollarSign
} from 'lucide-react';

// ─── Mock data ───────────────────────────────────────────────────────────────

const allJobs = Array.from({ length: 24 }, (_, i) => ({
  id: String(i + 1),
  title: ['Senior React Developer', 'Product Manager', 'UX Designer', 'Data Scientist', 'DevOps Engineer', 'Marketing Specialist', 'Backend Engineer', 'Mobile Developer'][i % 8],
  company: ['TechCorp', 'InnovateCo', 'DesignStudio', 'DataWave', 'CloudFirst', 'GrowthLabs', 'BuildIt', 'AppForge'][i % 8],
  companyInitial: ['TC', 'IC', 'DS', 'DW', 'CF', 'GL', 'BI', 'AF'][i % 8],
  location: ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Chicago, IL', 'Los Angeles, CA', 'Boston, MA', 'Remote'][i % 8],
  type: ['Full Time', 'Part Time', 'Contract', 'Internship'][i % 4],
  mode: ['Remote', 'Hybrid', 'On-site'][i % 3],
  salaryMin: 70000 + i * 5000,
  salaryMax: 100000 + i * 5000,
  experience: ['Entry', 'Mid', 'Senior', 'Executive'][i % 4],
  posted: [`${i + 1} day${i > 0 ? 's' : ''} ago`],
  category: ['Technology', 'Design', 'Marketing', 'Finance'][i % 4],
  isFeatured: i < 3,
}));

const PAGE_SIZE = 8;

export default function JobsPage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedMode, setSelectedMode] = useState<string[]>([]);
  const [selectedExp, setSelectedExp] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = allJobs.filter((j) => {
    const kw = keyword.toLowerCase();
    if (kw && !j.title.toLowerCase().includes(kw) && !j.company.toLowerCase().includes(kw)) return false;
    if (location && !j.location.toLowerCase().includes(location.toLowerCase())) return false;
    if (selectedType.length && !selectedType.includes(j.type)) return false;
    if (selectedMode.length && !selectedMode.includes(j.mode)) return false;
    if (selectedExp.length && !selectedExp.includes(j.experience)) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleFilter = (arr: string[], setArr: (a: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
    setPage(1);
  };

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div className="container">
          <h1>Browse Jobs</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item active">Jobs</li>
          </ol>
        </div>
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <div className="container">
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}
          >
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
              <input className="search-input" placeholder="Job title or keyword..." style={{ paddingLeft: 40 }} value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1); }} />
            </div>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
              <input className="search-input" placeholder="Location..." style={{ paddingLeft: 40 }} value={location} onChange={(e) => { setLocation(e.target.value); setPage(1); }} />
            </div>
            <button type="submit" className="btn btn-secondary">Search</button>
          </form>
        </div>
      </div>

      {/* Main content */}
      <section className="section-py" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
            {/* Sidebar Filters */}
            <aside className="card" style={{ position: 'sticky', top: 80 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#212529' }}>
                  <SlidersHorizontal size={16} style={{ display: 'inline', marginRight: 6 }} />Filters
                </h3>
                <button
                  onClick={() => { setSelectedType([]); setSelectedMode([]); setSelectedExp([]); setPage(1); }}
                  style={{ fontSize: '0.8rem', color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Clear all
                </button>
              </div>

              {/* Job Type */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', marginBottom: '0.75rem' }}>Job Type</h4>
                {['Full Time', 'Part Time', 'Contract', 'Internship'].map((t) => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#495057' }}>
                    <input
                      type="checkbox" checked={selectedType.includes(t)}
                      onChange={() => toggleFilter(selectedType, setSelectedType, t)}
                      style={{ accentColor: '#0d6efd' }}
                    />
                    {t}
                  </label>
                ))}
              </div>

              {/* Work Mode */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', marginBottom: '0.75rem' }}>Work Mode</h4>
                {['Remote', 'Hybrid', 'On-site'].map((m) => (
                  <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#495057' }}>
                    <input
                      type="checkbox" checked={selectedMode.includes(m)}
                      onChange={() => toggleFilter(selectedMode, setSelectedMode, m)}
                      style={{ accentColor: '#0d6efd' }}
                    />
                    {m}
                  </label>
                ))}
              </div>

              {/* Experience */}
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', marginBottom: '0.75rem' }}>Experience Level</h4>
                {['Entry', 'Mid', 'Senior', 'Executive'].map((e) => (
                  <label key={e} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#495057' }}>
                    <input
                      type="checkbox" checked={selectedExp.includes(e)}
                      onChange={() => toggleFilter(selectedExp, setSelectedExp, e)}
                      style={{ accentColor: '#0d6efd' }}
                    />
                    {e}
                  </label>
                ))}
              </div>
            </aside>

            {/* Job listings */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.9375rem', color: '#6c757d' }}>
                  Showing <strong>{paginated.length}</strong> of <strong>{filtered.length}</strong> jobs
                </p>
                <select className="form-control" style={{ width: 'auto' }}>
                  <option>Newest First</option>
                  <option>Most Relevant</option>
                </select>
              </div>

              {paginated.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <Search size={48} style={{ color: '#dee2e6', margin: '0 auto 1rem' }} />
                  <h4 style={{ color: '#6c757d' }}>No jobs found</h4>
                  <p style={{ color: '#adb5bd', fontSize: '0.9rem' }}>Try adjusting your search or filters</p>
                </div>
              ) : (
                paginated.map((job) => (
                  <div key={job.id} className="job-item">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      {job.isFeatured && (
                        <span className="job-badge badge-warning" style={{ position: 'absolute', right: 16, top: 16, fontSize: '0.75rem' }}>Featured</span>
                      )}
                      <div className="job-logo-placeholder">{job.companyInitial}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link to={`/jobs/${job.id}`} className="job-title">{job.title}</Link>
                        <div className="job-meta" style={{ marginTop: 4 }}>
                          <span className="job-meta-item"><Building2 size={14} /> {job.company}</span>
                          <span className="job-meta-item"><MapPin size={14} /> {job.location}</span>
                          <span className="job-meta-item"><DollarSign size={14} /> ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k</span>
                          <span className="job-meta-item"><Clock size={14} /> {job.posted}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                          <span className="job-badge badge-primary">{job.type}</span>
                          <span className="job-badge badge-success">{job.mode}</span>
                          <span className="job-badge badge-secondary">{job.experience}</span>
                        </div>
                      </div>
                      <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>
                        Apply Now
                      </Link>
                    </div>
                  </div>
                ))
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                  <button
                    onClick={() => setPage(page - 1)} disabled={page === 1}
                    className="btn btn-light btn-sm" style={{ padding: '0.5rem 0.75rem' }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p} onClick={() => setPage(p)}
                      className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-light'}`}
                      style={{ minWidth: 36 }}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(page + 1)} disabled={page === totalPages}
                    className="btn btn-light btn-sm" style={{ padding: '0.5rem 0.75rem' }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
