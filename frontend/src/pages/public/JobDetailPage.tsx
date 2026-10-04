import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MapPin, Briefcase, Clock, DollarSign, Building2, Globe, Users,
  Share2, Bookmark, CheckCircle, ChevronRight, Monitor, ExternalLink
} from 'lucide-react';

// Mock job data (in real app, fetched by slug/id)
const mockJob = {
  id: '1',
  title: 'Senior React Developer',
  company: { name: 'TechCorp', initial: 'TC', location: 'San Francisco, CA', website: 'https://techcorp.com', size: '500–1000 employees', founded: 2015, industry: 'Technology' },
  location: 'San Francisco, CA',
  type: 'Full Time', mode: 'Remote', experience: 'Senior',
  salaryMin: 120000, salaryMax: 160000,
  postedAt: '2 days ago', deadline: 'November 30, 2026',
  category: 'Technology',
  description: `We're looking for a Senior React Developer to join our growing engineering team. You'll be building cutting-edge web applications that serve millions of users worldwide.

As a Senior React Developer, you'll lead technical decisions, mentor junior developers, and collaborate closely with product and design teams to deliver exceptional user experiences.`,
  responsibilities: [
    'Lead development of new features using React, TypeScript, and modern frontend tooling',
    'Collaborate with UX/UI designers to implement pixel-perfect designs',
    'Write clean, maintainable, and well-tested code',
    'Mentor junior developers and conduct code reviews',
    'Participate in architecture discussions and technical planning',
    'Optimize application performance and ensure scalability',
  ],
  requirements: [
    '5+ years of experience with React.js and TypeScript',
    'Strong understanding of state management (Redux, Zustand, or similar)',
    'Experience with testing frameworks (Jest, React Testing Library)',
    'Familiarity with REST APIs and GraphQL',
    'Experience with CI/CD pipelines and modern DevOps practices',
    'Excellent communication skills and team-first mindset',
  ],
  benefits: [
    'Competitive salary ($120k–$160k DOE)',
    'Comprehensive health, dental, and vision insurance',
    'Flexible remote work policy',
    '401(k) with 4% company match',
    '$2,000 annual learning & development budget',
    'Unlimited PTO with minimum 2 weeks encouraged',
  ],
  skills: ['React', 'TypeScript', 'Redux', 'GraphQL', 'Jest', 'Node.js'],
};

const relatedJobs = [
  { id: '2', title: 'Frontend Engineer', company: 'InnovateCo', location: 'Remote', type: 'Full Time', initial: 'IC' },
  { id: '3', title: 'React Native Developer', company: 'AppForge', location: 'Austin, TX', type: 'Contract', initial: 'AF' },
  { id: '4', title: 'UI Engineer', company: 'DesignStudio', location: 'New York, NY', type: 'Full Time', initial: 'DS' },
];

export default function JobDetailPage() {
  const { slug } = useParams();
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const job = mockJob; // use slug to fetch in real app

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div className="container">
          <h1>{job.title}</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item"><Link to="/jobs">Jobs</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item active">{job.title}</li>
          </ol>
        </div>
      </div>

      <section className="section-py" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
            {/* Main content */}
            <div>
              {/* Job card header */}
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div className="job-logo-placeholder" style={{ width: 80, height: 80, fontSize: '1.5rem' }}>{job.company.initial}</div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.5rem' }}>{job.title}</h2>
                    <div className="job-meta">
                      <span className="job-meta-item"><Building2 size={14} /> {job.company.name}</span>
                      <span className="job-meta-item"><MapPin size={14} /> {job.location}</span>
                      <span className="job-meta-item"><Clock size={14} /> {job.postedAt}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                      <span className="job-badge badge-primary">{job.type}</span>
                      <span className="job-badge badge-success">{job.mode}</span>
                      <span className="job-badge badge-secondary">{job.experience}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {!applied ? (
                    <button
                      onClick={() => setShowModal(true)}
                      className="btn btn-primary btn-lg"
                    >
                      <Briefcase size={18} /> Apply Now
                    </button>
                  ) : (
                    <span className="btn btn-lg" style={{ background: '#d1e7dd', color: '#0a3622', borderColor: '#badbcc' }}>
                      <CheckCircle size={18} /> Applied!
                    </span>
                  )}
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`btn btn-lg ${saved ? 'btn-primary' : 'btn-light'}`}
                  >
                    <Bookmark size={18} fill={saved ? '#fff' : 'none'} />
                    {saved ? 'Saved' : 'Save Job'}
                  </button>
                  <button className="btn btn-light btn-lg"><Share2 size={18} /> Share</button>
                </div>
              </div>

              {/* Description */}
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="card-title">Job Description</h3>
                <p style={{ color: '#495057', lineHeight: 1.8, whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>{job.description}</p>

                <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#212529', marginBottom: '0.75rem' }}>Responsibilities</h4>
                <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
                  {job.responsibilities.map((r, i) => (
                    <li key={i} style={{ color: '#495057', marginBottom: '0.5rem', lineHeight: 1.6 }}>{r}</li>
                  ))}
                </ul>

                <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#212529', marginBottom: '0.75rem' }}>Requirements</h4>
                <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
                  {job.requirements.map((r, i) => (
                    <li key={i} style={{ color: '#495057', marginBottom: '0.5rem', lineHeight: 1.6 }}>{r}</li>
                  ))}
                </ul>

                <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#212529', marginBottom: '0.75rem' }}>Benefits</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {job.benefits.map((b, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#495057', marginBottom: '0.5rem' }}>
                      <CheckCircle size={16} style={{ color: '#198754', marginTop: 2, flexShrink: 0 }} />{b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div className="card">
                <h3 className="card-title">Required Skills</h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {job.skills.map((s) => (
                    <span key={s} className="job-badge badge-primary" style={{ fontSize: '0.875rem' }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Job overview */}
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="card-title">Job Overview</h3>
                {[
                  { icon: DollarSign, label: 'Salary', value: `$${(job.salaryMin / 1000).toFixed(0)}k – $${(job.salaryMax / 1000).toFixed(0)}k` },
                  { icon: Briefcase, label: 'Job Type', value: job.type },
                  { icon: Monitor, label: 'Work Mode', value: job.mode },
                  { icon: MapPin, label: 'Location', value: job.location },
                  { icon: Clock, label: 'Deadline', value: job.deadline },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <item.icon size={16} style={{ color: '#0d6efd' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: 2 }}>{item.label}</p>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#212529' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Company info */}
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="card-title">About {job.company.name}</h3>
                <div className="job-logo-placeholder" style={{ margin: '0 auto 1rem', width: 64, height: 64 }}>{job.company.initial}</div>
                <h4 style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 700, marginBottom: '1rem' }}>{job.company.name}</h4>
                {[
                  { icon: Globe, label: job.company.website, href: job.company.website },
                  { icon: MapPin, label: job.company.location },
                  { icon: Users, label: job.company.size },
                  { icon: Building2, label: job.company.industry },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6c757d' }}>
                    <item.icon size={14} style={{ color: '#0d6efd', flexShrink: 0 }} />
                    {item.href ? <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ color: '#0d6efd', textDecoration: 'none' }}>{item.label} <ExternalLink size={11} /></a> : item.label}
                  </div>
                ))}
                <Link to={`/companies/${job.company.name.toLowerCase()}`} className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
                  View Company Profile
                </Link>
              </div>

              {/* Related jobs */}
              <div className="card">
                <h3 className="card-title">Similar Jobs</h3>
                {relatedJobs.map((rj) => (
                  <div key={rj.id} style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #e9ecef' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div className="job-logo-placeholder" style={{ width: 44, height: 44, fontSize: '0.875rem' }}>{rj.initial}</div>
                      <div>
                        <Link to={`/jobs/${rj.id}`} style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', textDecoration: 'none', display: 'block' }}>{rj.title}</Link>
                        <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>{rj.company} · {rj.location}</span>
                      </div>
                    </div>
                    <span className="job-badge badge-primary" style={{ marginTop: '0.5rem' }}>{rj.type}</span>
                  </div>
                ))}
                <Link to="/jobs" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  View All Jobs <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: 500, width: '100%', animation: 'fadeInUp 0.3s ease' }}>
            <h3 className="card-title">Apply for {job.title}</h3>
            <p style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: '1.25rem' }}>at {job.company.name}</p>
            <div className="form-group">
              <label className="form-label">Cover Letter</label>
              <textarea className="form-control" rows={5} placeholder="Tell us why you're a great fit for this role..." style={{ resize: 'vertical' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Resume</label>
              <input type="file" className="form-control" accept=".pdf,.doc,.docx" />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} className="btn btn-light">Cancel</button>
              <button onClick={() => { setApplied(true); setShowModal(false); }} className="btn btn-primary">Submit Application</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
