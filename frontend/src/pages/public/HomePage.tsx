import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { UserRole } from '@/types';
import api from '../../api/client';
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
  const { user, isAuthenticated } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [experienceText, setExperienceText] = useState('');

  const postJobPath = !isAuthenticated
    ? '/register'
    : user?.role === UserRole.EMPLOYER
    ? '/employer/jobs/new'
    : '/dashboard';

  useEffect(() => {
    api.get('/jobs')
      .then(res => setFeaturedJobs(res.data.slice(0, 6)))
      .catch(console.error);
  }, []);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="container hero-content py-20 animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            The #1 Platform for Top Engineering & Product Roles
          </div>
          <h1 className="hero-title">
            Discover Opportunities at <br />
            <span className="text-blue-600">World-Class Companies</span>
          </h1>
          <p className="hero-subtitle">
            Connect directly with verified employers and fast-track your career with AI-driven job matching and instant hiring workflows.
          </p>

          {/* Search bar inside Hero container */}
          <div className="search-bar mt-8">
            <form
              onSubmit={(e) => { 
                e.preventDefault(); 
                const params = new URLSearchParams();
                if (keyword) params.set('keyword', keyword);
                if (location) params.set('location', location);
                if (experienceText) params.set('experienceText', experienceText);
                window.location.href = `/jobs?${params.toString()}`; 
              }}
              className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center"
            >
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="search-input" placeholder="Role, skill, or keyword..." style={{ paddingLeft: 40 }} value={keyword} onChange={(e) => setKeyword(e.target.value)} />
              </div>
              <div className="relative">
                <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="search-input" placeholder="Location or 'Remote'..." style={{ paddingLeft: 40 }} value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="relative">
                <Briefcase size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="search-input" placeholder="Experience level..." style={{ paddingLeft: 40 }} value={experienceText} onChange={(e) => setExperienceText(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-full">
                Find Jobs
              </button>
            </form>
            <div className="flex items-center gap-2 mt-4 flex-wrap text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Trending Searches:</span>
              {['Frontend Engineer', 'Product Designer', 'Data Scientist', 'Remote'].map((kw) => (
                <Link
                  key={kw}
                  to={`/jobs?keyword=${kw}`}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 transition-colors"
                >
                  {kw}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 mt-8 flex-wrap">
            {[
              'Zero hidden fees',
              '100% verified companies',
              'Direct hiring manager access',
            ].map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <CheckCircle size={16} className="text-emerald-500" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-slate-200/80 py-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center md:border-r last:border-r-0 border-slate-100 px-4">
                <span className="block text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{s.number}</span>
                <span className="block text-xs md:text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50/50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Explore Sectors</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">Browse by Category</h2>
            <p className="text-sm text-slate-600 mt-2">Find open roles tailored to your exact domain and expertise.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link key={cat.label} to={`/jobs?category=${cat.label.toLowerCase()}`} className="cat-item group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <cat.icon size={24} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors mb-1">
                  {cat.label}
                </h4>
                <p className="text-xs text-slate-500">{cat.count.toLocaleString()} Opportunities</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Jobs ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Top Opportunities</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Featured Openings</h2>
              <p className="text-sm text-slate-600 mt-1">Hand-picked high-growth opportunities hiring immediately.</p>
            </div>
            <Link to="/jobs" className="btn btn-outline btn-sm self-start md:self-auto">
              View All Openings <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="job-item flex flex-col justify-between group hover:-translate-y-1 transition-all">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="job-logo-placeholder">
                      {typeof job.company === 'object' ? (job.company?.name?.[0] || 'C') : (job.company?.[0] || job.companyInitial || 'C')}
                    </div>
                    <span className="job-badge badge-primary uppercase text-[11px] font-bold">
                      {job.type || 'Full Time'}
                    </span>
                  </div>
                  <h3 className="job-title text-base group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h3>
                  <div className="job-meta mt-2 text-xs">
                    <span className="job-meta-item">
                      <Building2 size={13} className="text-slate-400" /> {typeof job.company === 'object' ? job.company?.name : (job.company || 'Company')}
                    </span>
                    <span className="job-meta-item">
                      <MapPin size={13} className="text-slate-400" /> {job.location || 'Remote'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k
                  </span>
                  <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Apply <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why CareerLift ─────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        <div className="container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Built For Excellence</span>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-2">Why Modern Leaders Choose CareerLift</h2>
            <p className="text-sm text-slate-400 mt-2">A streamlined platform connecting exceptional candidates with visionary organizations.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: 'Verified Organizations', desc: 'Every employer is manually verified to ensure high standard opportunities.' },
              { icon: Star, title: 'Intelligent Matching', desc: 'Machine learning algorithms that connect your talent directly to ideal teams.' },
              { icon: Briefcase, title: 'Direct Hiring', desc: 'No recruitment agency middlemen—speak directly with hiring leads.' },
              { icon: Users, title: 'Executive Support', desc: 'Personalized application feedback, status transparency, and career tools.' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm hover:border-blue-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5">
                  <item.icon size={24} />
                </div>
                <h4 className="font-bold text-white text-base mb-2">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50/70">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Candidate & Employer Stories</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">Trusted by Leading Professionals</h2>
            <p className="text-sm text-slate-600 mt-2">Read how candidates and founders elevate their careers and scale their teams.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Ready to Take the Next Step in Your Career?
          </h2>
          <p className="text-base text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join over 2.5 million professionals who discovered their ideal roles and world-class teams through CareerLift.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="px-6 py-3 rounded-xl bg-white text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg shadow-black/10">
              Get Started for Free
            </Link>
            <Link to="/jobs" className="px-6 py-3 rounded-xl bg-blue-700/60 border border-blue-400/40 text-white font-bold text-sm hover:bg-blue-700 transition-colors">
              Browse Open Roles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
