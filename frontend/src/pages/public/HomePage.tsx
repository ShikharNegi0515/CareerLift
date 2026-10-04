import { Link } from 'react-router-dom';
import {
  Search, MapPin, Briefcase, ChevronRight, Monitor, HeartPulse,
  GraduationCap, TrendingUp, Building2, Cpu, Palette, ShieldCheck,
  Users, Star, ArrowRight, CheckCircle
} from 'lucide-react';

// ─── Mock data ───────────────────────────────────────────────────────────────

const categories = [
  { icon: Monitor, label: 'Technology', count: 1240 },
  { icon: HeartPulse, label: 'Healthcare', count: 845 },
  { icon: GraduationCap, label: 'Education', count: 632 },
  { icon: TrendingUp, label: 'Finance', count: 710 },
  { icon: Building2, label: 'Real Estate', count: 415 },
  { icon: Cpu, label: 'Engineering', count: 934 },
  { icon: Palette, label: 'Design', count: 521 },
  { icon: ShieldCheck, label: 'Legal', count: 288 },
];

const featuredJobs = [
  {
    id: '1', title: 'Senior React Developer', company: 'TechCorp', companyInitial: 'TC',
    location: 'San Francisco, CA', type: 'Full Time', mode: 'Remote',
    salary: '$120k – $160k', posted: '2 days ago',
  },
  {
    id: '2', title: 'Product Manager', company: 'InnovateCo', companyInitial: 'IC',
    location: 'New York, NY', type: 'Full Time', mode: 'Hybrid',
    salary: '$100k – $140k', posted: '1 day ago',
  },
  {
    id: '3', title: 'UX Designer', company: 'DesignStudio', companyInitial: 'DS',
    location: 'Austin, TX', type: 'Full Time', mode: 'On-site',
    salary: '$85k – $110k', posted: '3 days ago',
  },
  {
    id: '4', title: 'Data Scientist', company: 'DataWave', companyInitial: 'DW',
    location: 'Seattle, WA', type: 'Full Time', mode: 'Remote',
    salary: '$130k – $170k', posted: '5 hours ago',
  },
  {
    id: '5', title: 'DevOps Engineer', company: 'CloudFirst', companyInitial: 'CF',
    location: 'Chicago, IL', type: 'Contract', mode: 'Remote',
    salary: '$110k – $145k', posted: '1 day ago',
  },
  {
    id: '6', title: 'Marketing Specialist', company: 'GrowthLabs', companyInitial: 'GL',
    location: 'Los Angeles, CA', type: 'Full Time', mode: 'Hybrid',
    salary: '$70k – $95k', posted: '4 days ago',
  },
];

const testimonials = [
  {
    id: 1, name: 'Sarah Johnson', role: 'Software Engineer at TechCorp',
    text: 'CareerLift completely transformed my job search. Within 2 weeks I had multiple interviews and landed my dream job at a top tech company!',
    avatar: 'SJ',
  },
  {
    id: 2, name: 'Michael Chen', role: 'Product Manager at InnovateCo',
    text: 'The job recommendations were incredibly accurate. CareerLift understood exactly what I was looking for and connected me with the perfect opportunity.',
    avatar: 'MC',
  },
  {
    id: 3, name: 'Emily Rodriguez', role: 'HR Director at GrowthLabs',
    text: 'As an employer, CareerLift has been invaluable. We found top-tier candidates in record time, cutting our hiring process in half.',
    avatar: 'ER',
  },
];

const stats = [
  { number: '50,000+', label: 'Active Jobs' },
  { number: '120,000+', label: 'Registered Companies' },
  { number: '2.5M+', label: 'Job Seekers' },
  { number: '94%', label: 'Success Rate' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="container hero-content py-20 animate-fadeInUp">
          <p style={{ color: '#93c5fd', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9375rem' }}>
            # 1 Job Platform in the Industry
          </p>
          <h1 className="hero-title">
            Find Your Dream Job<br />
            <span style={{ color: '#93c5fd' }}>Without the Hassle</span>
          </h1>
          <p className="hero-subtitle">
            Connect with top employers and discover thousands of opportunities
            tailored to your skills and career goals.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/jobs" className="btn btn-primary btn-lg">
              <Search size={18} /> Browse Jobs
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#fff' }}>
              Post a Job <ArrowRight size={18} />
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {[
              'No registration fee',
              'Verified employers',
              'Instant notifications',
            ].map((item) => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>
                <CheckCircle size={15} style={{ color: '#4ade80' }} /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Search bar ───────────────────────────────────────────────── */}
      <div className="search-bar">
        <div className="container">
          <form
            onSubmit={(e) => { e.preventDefault(); window.location.href = '/jobs'; }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}
          >
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
              <input className="search-input" placeholder="Job title, keywords..." style={{ paddingLeft: 40 }} />
            </div>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
              <input className="search-input" placeholder="Location or remote..." style={{ paddingLeft: 40 }} />
            </div>
            <button type="submit" className="btn btn-secondary btn-lg" style={{ whiteSpace: 'nowrap' }}>
              Search Jobs
            </button>
          </form>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8125rem' }}>Popular:</span>
            {['React Developer', 'Product Manager', 'Data Analyst', 'Remote'].map((kw) => (
              <Link key={kw} to={`/jobs?keyword=${kw}`} style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8125rem', textDecoration: 'none', background: 'rgba(255,255,255,0.15)', padding: '2px 10px', borderRadius: 9999 }}>
                {kw}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <div className="stats-bar">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {stats.map((s) => (
              <div key={s.label} className="stat-item">
                <span className="stat-number">{s.number}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Categories ───────────────────────────────────────────────── */}
      <section className="section-py" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat) => (
              <Link key={cat.label} to={`/jobs?category=${cat.label.toLowerCase()}`} className="cat-item">
                <div className="cat-icon">
                  <cat.icon size={40} />
                </div>
                <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem' }}>
                  {cat.label}
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>{cat.count.toLocaleString()} Jobs</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Jobs ─────────────────────────────────────────────── */}
      <section className="section-py">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h2 className="section-title-left">Featured Job Openings</h2>
            <Link to="/jobs" className="btn btn-outline btn-sm">
              View All Jobs <ChevronRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
            {featuredJobs.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="job-item" style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="job-logo-placeholder">{job.companyInitial}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-meta">
                      <span className="job-meta-item"><Building2 size={14} /> {job.company}</span>
                      <span className="job-meta-item"><MapPin size={14} /> {job.location}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                      <span className="job-badge badge-primary">{job.type}</span>
                      <span className="job-badge badge-success">{job.mode}</span>
                      <span className="job-badge badge-secondary">{job.salary}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#adb5bd', marginTop: '0.5rem' }}>{job.posted}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why CareerLift ─────────────────────────────────────────────── */}
      <section className="section-py" style={{ background: 'linear-gradient(135deg, #2b3940 0%, #1a3a4a 100%)' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: '#fff' }}>Why Choose CareerLift?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
            {[
              { icon: ShieldCheck, title: 'Verified Employers', desc: 'All companies are thoroughly vetted to ensure legitimate opportunities.' },
              { icon: Star, title: 'Smart Matching', desc: 'AI-powered job recommendations tailored to your skills and preferences.' },
              { icon: Briefcase, title: '50,000+ Jobs Daily', desc: 'New opportunities added every day across hundreds of industries.' },
              { icon: Users, title: 'Career Support', desc: 'Access resume tips, interview prep, and career coaching resources.' },
            ].map((item) => (
              <div key={item.title} style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(13,110,253,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <item.icon size={28} style={{ color: '#93c5fd' }} />
                </div>
                <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{item.title}</h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="section-py" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title">Success Stories</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                <Star size={20} style={{ color: '#ffc107', marginBottom: '0.75rem' }} />
                <Star size={20} style={{ color: '#ffc107' }} />
                <Star size={20} style={{ color: '#ffc107' }} />
                <Star size={20} style={{ color: '#ffc107' }} />
                <Star size={20} style={{ color: '#ffc107', marginBottom: '1rem' }} />
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#0d6efd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#212529' }}>{t.name}</p>
                    <p style={{ fontSize: '0.8rem', color: '#6c757d' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section style={{ background: '#0d6efd', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#fff', marginBottom: '0.75rem' }}>
            Ready to Take the Next Step?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '2rem', fontSize: '1.0625rem' }}>
            Join over 2.5 million professionals who found their dream jobs through CareerLift.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-lg" style={{ background: '#fff', color: '#0d6efd', borderColor: '#fff' }}>
              Get Started Free
            </Link>
            <Link to="/jobs" className="btn btn-lg" style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}>
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
