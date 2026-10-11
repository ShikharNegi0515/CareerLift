import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Globe, Users, Calendar, Briefcase, Building2, ExternalLink, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '@/api/client';
import type { Company, Job } from '@/types';

export default function CompanyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [company, setCompany] = useState<(Company & { jobs?: Job[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchCompany = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/companies/${slug}`);
        setCompany(res.data);
      } catch (err: any) {
        console.error('Failed to load company detail', err);
        setError(err.response?.status === 404 ? 'Company not found' : 'Failed to load company information');
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [slug]);

  const getCompanyInitial = (name: string) => {
    if (!name) return 'CO';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const formatSalary = (min?: number, max?: number, currency = 'USD') => {
    if (!min && !max) return 'Competitive';
    const symbol = currency === 'USD' ? '$' : currency + ' ';
    if (min && max) return `${symbol}${min.toLocaleString()} – ${symbol}${max.toLocaleString()}`;
    if (min) return `From ${symbol}${min.toLocaleString()}`;
    return `Up to ${symbol}${max?.toLocaleString()}`;
  };

  const formatEnum = (val?: string) => {
    if (!val) return '';
    return val.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#0d6efd' }} />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <AlertCircle size={48} style={{ color: '#dc3545', margin: '0 auto 1rem' }} />
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.5rem' }}>
          {error || 'Company not found'}
        </h2>
        <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>The company you are looking for does not exist or may have been removed.</p>
        <Link to="/companies" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={16} /> Back to Companies
        </Link>
      </div>
    );
  }

  const initial = getCompanyInitial(company.name);
  const openJobs = company.jobs || [];

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>{company.name}</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item"><Link to="/companies">Companies</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item active">{company.name}</li>
          </ol>
        </div>
      </div>

      {/* Company hero card */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e9ecef', padding: '2rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="job-logo-placeholder" style={{ width: 96, height: 96, fontSize: '2rem' }}>
              {company.logo ? (
                <img src={company.logo} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />
              ) : (
                initial
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#212529', marginBottom: 0 }}>
                  {company.name}
                </h2>
                {company.isVerified && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#198754', background: '#d1e7dd', padding: '2px 8px', borderRadius: 9999 }}>
                    ✓ Verified Employer
                  </span>
                )}
              </div>
              <div className="job-meta" style={{ marginTop: '0.5rem' }}>
                {company.location && (
                  <span className="job-meta-item"><MapPin size={14} /> {company.location}</span>
                )}
                {company.industry && (
                  <span className="job-meta-item"><Building2 size={14} /> {company.industry}</span>
                )}
                {company.size && (
                  <span className="job-meta-item"><Users size={14} /> {company.size} employees</span>
                )}
                {company.foundedYear && (
                  <span className="job-meta-item"><Calendar size={14} /> Founded {company.foundedYear}</span>
                )}
              </div>
            </div>
            {company.website && (
              <div style={{ marginLeft: 'auto' }}>
                <a
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}
                >
                  <Globe size={14} /> Visit Website <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="section-py" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
            <div>
              {/* About */}
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="card-title">About {company.name}</h3>
                <p style={{ color: '#495057', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {company.description || 'No description provided by this employer yet.'}
                </p>
              </div>

              {/* Open positions */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 className="card-title" style={{ marginBottom: 0 }}>
                    Open Positions ({openJobs.length})
                  </h3>
                  <Link to={`/jobs`} className="btn btn-outline btn-sm">Browse All Jobs</Link>
                </div>

                {openJobs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#6c757d' }}>
                    <Briefcase size={36} style={{ color: '#adb5bd', margin: '0 auto 0.75rem' }} />
                    <p style={{ fontWeight: 600, color: '#495057', marginBottom: 4 }}>No active openings right now</p>
                    <p style={{ fontSize: '0.85rem' }}>Check back soon or explore other opportunities in this category.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {openJobs.map((job) => (
                      <div key={job.id} className="job-item">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                          <div>
                            <Link to={`/jobs/${job.slug || job.id}`} className="job-title" style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                              {job.title}
                            </Link>
                            <div className="job-meta" style={{ marginTop: 6 }}>
                              <span className="job-meta-item"><MapPin size={13} /> {job.location}</span>
                              <span className="job-meta-item"><Briefcase size={13} /> {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.625rem' }}>
                              <span className="job-badge badge-primary">{formatEnum(job.jobType)}</span>
                              <span className="job-badge badge-success">{formatEnum(job.workMode)}</span>
                            </div>
                          </div>
                          <Link to={`/jobs/${job.slug || job.id}`} className="btn btn-outline btn-sm" style={{ alignSelf: 'center' }}>
                            View & Apply
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="card-title">Company Info</h3>
                {[
                  company.website && {
                    icon: Globe,
                    label: 'Website',
                    value: company.website.replace(/^https?:\/\//, ''),
                    href: company.website.startsWith('http') ? company.website : `https://${company.website}`,
                  },
                  company.industry && { icon: Building2, label: 'Industry', value: company.industry },
                  company.size && { icon: Users, label: 'Company Size', value: `${company.size} employees` },
                  company.location && { icon: MapPin, label: 'Location', value: company.location },
                  company.foundedYear && { icon: Calendar, label: 'Founded', value: String(company.foundedYear) },
                  { icon: Briefcase, label: 'Active Jobs', value: `${openJobs.length} openings` },
                ]
                  .filter(Boolean)
                  .map((item: any, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: '0.875rem' }}>
                      <item.icon size={16} style={{ color: '#0d6efd', flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6c757d', display: 'block' }}>{item.label}</span>
                        {item.href ? (
                          <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0d6efd', textDecoration: 'none' }}>
                            {item.value}
                          </a>
                        ) : (
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#212529' }}>{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              <div className="card" style={{ background: '#212529', border: 'none' }}>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#fff', marginBottom: '0.5rem', fontSize: '1rem' }}>
                  Interested in working here?
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8125rem', lineHeight: 1.6 }}>
                  Explore active job postings above or set up job alerts for when new roles are published by {company.name}.
                </p>
                <div style={{ marginTop: '0.75rem' }}>
                  <Link to="/jobs" className="btn btn-primary btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                    Explore All Opportunities
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

