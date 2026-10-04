import { Link, useParams } from 'react-router-dom';
import { MapPin, Globe, Users, Calendar, Briefcase, Building2, ExternalLink, ChevronRight } from 'lucide-react';

const mockCompany = {
  name: 'TechCorp',
  initial: 'TC',
  slug: 'techcorp',
  description: `TechCorp is a leading technology company specializing in cloud infrastructure and developer tools. Founded in 2015, we've grown from a small startup to a team of 800+ engineers, designers, and product specialists.

Our mission is to make technology accessible to everyone. We believe that great software has the power to change the world, and we're on a mission to build the tools that developers need to do their best work.`,
  location: 'San Francisco, CA',
  website: 'https://techcorp.com',
  size: '500–1000 employees',
  industry: 'Technology',
  founded: 2015,
  specialties: ['Cloud Computing', 'Developer Tools', 'Infrastructure', 'APIs', 'DevOps'],
  openJobs: [
    { id: '1', title: 'Senior React Developer', type: 'Full Time', mode: 'Remote', location: 'San Francisco, CA', salary: '$120k–$160k' },
    { id: '2', title: 'Backend Engineer', type: 'Full Time', mode: 'Hybrid', location: 'San Francisco, CA', salary: '$110k–$150k' },
    { id: '3', title: 'DevOps Engineer', type: 'Contract', mode: 'Remote', location: 'Remote', salary: '$100k–$130k' },
    { id: '4', title: 'Product Designer', type: 'Full Time', mode: 'On-site', location: 'San Francisco, CA', salary: '$90k–$120k' },
  ],
  benefits: ['Health & dental insurance', 'Flexible remote work', '401(k) matching', 'Learning stipend', 'Unlimited PTO', 'Stock options'],
};

export default function CompanyDetailPage() {
  const { slug } = useParams();
  const company = mockCompany;

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
            <div className="job-logo-placeholder" style={{ width: 96, height: 96, fontSize: '2rem' }}>{company.initial}</div>
            <div>
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#212529', marginBottom: '0.5rem' }}>{company.name}</h2>
              <div className="job-meta">
                <span className="job-meta-item"><MapPin size={14} /> {company.location}</span>
                <span className="job-meta-item"><Building2 size={14} /> {company.industry}</span>
                <span className="job-meta-item"><Users size={14} /> {company.size}</span>
                <span className="job-meta-item"><Calendar size={14} /> Founded {company.founded}</span>
              </div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                <Globe size={14} /> Visit Website <ExternalLink size={12} />
              </a>
            </div>
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
                <p style={{ color: '#495057', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{company.description}</p>
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.75rem', color: '#212529' }}>Specialties</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {company.specialties.map((s) => (
                      <span key={s} className="job-badge badge-primary">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Open positions */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 className="card-title" style={{ marginBottom: 0 }}>Open Positions ({company.openJobs.length})</h3>
                  <Link to={`/jobs?company=${company.slug}`} className="btn btn-outline btn-sm">View All</Link>
                </div>
                {company.openJobs.map((job) => (
                  <div key={job.id} className="job-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <Link to={`/jobs/${job.id}`} className="job-title">{job.title}</Link>
                        <div className="job-meta" style={{ marginTop: 4 }}>
                          <span className="job-meta-item"><MapPin size={13} /> {job.location}</span>
                          <span className="job-meta-item"><Briefcase size={13} /> {job.salary}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <span className="job-badge badge-primary">{job.type}</span>
                          <span className="job-badge badge-success">{job.mode}</span>
                        </div>
                      </div>
                      <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">Apply</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="card-title">Company Info</h3>
                {[
                  { icon: Globe, label: 'Website', value: 'techcorp.com', href: company.website },
                  { icon: Building2, label: 'Industry', value: company.industry },
                  { icon: Users, label: 'Size', value: company.size },
                  { icon: MapPin, label: 'Location', value: company.location },
                  { icon: Calendar, label: 'Founded', value: String(company.founded) },
                  { icon: Briefcase, label: 'Open Jobs', value: `${company.openJobs.length} positions` },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: '0.875rem' }}>
                    <item.icon size={16} style={{ color: '#0d6efd', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#6c757d', display: 'block' }}>{item.label}</span>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0d6efd', textDecoration: 'none' }}>{item.value}</a>
                      ) : (
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#212529' }}>{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="card">
                <h3 className="card-title">Benefits & Perks</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {company.benefits.map((b) => (
                    <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: '#495057', marginBottom: '0.5rem' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0d6efd', flexShrink: 0 }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
