import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { UserRole } from '@/types';
import api from '../../api/client';
import {
  Search, MapPin, Briefcase, ChevronRight, Monitor, HeartPulse,
  GraduationCap, TrendingUp, Building2, Cpu, Palette, ShieldCheck,
  Users, Star, ArrowRight, CheckCircle, Zap
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

      {/* ── Section 1: Social Proof & Metrics (Clean Crisp Separator) ───────────────── */}
      <section className="bg-white border-y border-slate-200/80 py-12">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
              POWERING HIRING TEAMS AT GLOBAL INNOVATORS
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all mb-12">
            <span className="font-extrabold text-2xl tracking-tighter text-slate-700">stripe</span>
            <span className="font-bold text-2xl tracking-tight text-slate-700">DATADOG</span>
            <span className="font-black text-2xl tracking-tight text-slate-700">Linear</span>
            <span className="font-extrabold text-2xl tracking-tight text-slate-700">ramp</span>
            <span className="font-bold text-2xl tracking-tight text-slate-700">VERCEL</span>
            <span className="font-extrabold text-2xl tracking-tight text-slate-700">GitHub</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-100">
            {stats.map((s) => (
              <div key={s.label} className="text-center px-4">
                <span className="block text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">{s.number}</span>
                <span className="block text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Split Showcase - "How CareerLift Works for Job Seekers" (BeginDaily / LinkedIn Style) ─── */}
      <section className="py-24 bg-slate-50/70 border-b border-slate-200/80">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
                For Job Seekers
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
                Apply in seconds. Track every stage with total transparency.
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-8">
                Say goodbye to ghosting. CareerLift offers direct access to hiring managers, real-time application status updates, and automated interview scheduling.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: 'One-Click Instant Application',
                    desc: 'Upload your resume once or use our direct parser to apply to top-tier companies in one click.',
                    icon: Zap,
                  },
                  {
                    title: 'Live Stage Tracking (Jira-style Pipeline)',
                    desc: 'Monitor whether your resume is under review, shortlisted, or scheduled for technical interview.',
                    icon: CheckCircle,
                  },
                  {
                    title: 'Direct Messaging & Interview Invitations',
                    desc: 'Communicate directly with recruiters without agency spam or endless third-party email threads.',
                    icon: Users,
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/70 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/jobs" className="btn btn-primary btn-lg shadow-md shadow-blue-500/20">
                  Explore Active Openings <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Right Mockup: Live Jira/SaaS Style Interactive Candidate Preview Card */}
            <div className="relative">
              <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xl relative z-10">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500">
                    <span className="text-blue-600">APP-STAGE</span>
                    <span>/</span>
                    <span className="text-slate-900">APPLICATION #8492</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Interview Scheduled
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-sm text-slate-900">Senior React & Node Engineer</h5>
                      <span className="font-bold text-xs text-blue-600 font-mono">$145k - $180k</span>
                    </div>
                    <p className="text-xs text-slate-500">Stripe &bull; San Francisco, CA (Remote)</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        AI
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Resume Match Score: 96%</p>
                        <p className="text-[11px] text-slate-500">Skills matched: React, TypeScript, GraphQL</p>
                      </div>
                    </div>
                    <CheckCircle size={18} className="text-blue-600" />
                  </div>
                </div>

                {/* Progress bar stages */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Hiring Pipeline</span>
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                    <div className="py-1.5 rounded bg-blue-600 text-white">Applied</div>
                    <div className="py-1.5 rounded bg-blue-600 text-white">Review</div>
                    <div className="py-1.5 rounded bg-blue-600 text-white">Interview</div>
                    <div className="py-1.5 rounded bg-slate-100 text-slate-400">Offer</div>
                  </div>
                </div>
              </div>

              {/* Decorative background blur glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-10 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Featured Job Board (Jira-inspired Ticket Cards) ─────────────── */}
      <section className="py-24 bg-white border-b border-slate-200/80">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
                Curated Opportunities
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Featured Verified Openings
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Hand-picked high-growth opportunities with salary transparency and verified employer badges.
              </p>
            </div>
            <Link to="/jobs" className="btn btn-outline btn-sm font-semibold self-start md:self-auto">
              Browse All Openings <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                      JOB-{job.id.slice(0, 4).toUpperCase()}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60">
                      {job.type || 'Full Time'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                    {job.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-4">
                    <Building2 size={13} className="text-slate-400" />
                    {typeof job.company === 'object' ? job.company?.name : (job.company || 'Company')}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-slate-400" /> {job.location || 'Remote'}
                    </span>
                    <span>&bull;</span>
                    <span className="font-bold text-slate-900">
                      ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-slate-400 font-medium">Verified Employer</span>
                  <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View & Apply <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Split Showcase - "For Employers: Hire Faster with Built-In Kanban" ──── */}
      <section className="py-24 bg-slate-50/70 border-b border-slate-200/80">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Mockup: Jira-Style Employer Pipeline Visual */}
            <div className="order-2 lg:order-1">
              <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-tight">HIRING CONSOLE &bull; APPLICANTS</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">Jira Board View</span>
                </div>

                {/* 3 mini columns */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2">APPLIED (12)</span>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs mb-2">
                      <p className="font-bold text-xs text-slate-800">Alex Chen</p>
                      <p className="text-[10px] text-slate-400">Full Stack Eng</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                      <p className="font-bold text-xs text-slate-800">Maria Rossi</p>
                      <p className="text-[10px] text-slate-400">Product Designer</p>
                    </div>
                  </div>

                  <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/70">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block mb-2">IN REVIEW (4)</span>
                    <div className="bg-white p-2.5 rounded-lg border border-amber-300 shadow-xs">
                      <p className="font-bold text-xs text-slate-800">David Kumar</p>
                      <p className="text-[10px] text-amber-700 font-medium">CV Verified &bull; 94%</p>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/70">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-2">OFFER (2)</span>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-300 shadow-xs">
                      <p className="font-bold text-xs text-slate-800">Jessica Tay</p>
                      <p className="text-[10px] text-emerald-700 font-medium">Offer Accepted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Copy */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
                For Employers & Recruiters
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
                Cut hiring cycles in half with Jira-grade candidate pipelines.
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-8">
                Post positions in minutes, drag candidates between stages, download verified resumes, and schedule candidate calls in one unified portal.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  {
                    title: 'Interactive Drag-and-Drop Pipeline',
                    desc: 'Manage hundreds of candidates across custom stages without losing context or history.',
                  },
                  {
                    title: 'Built-in Resume Parser & Scorecard',
                    desc: 'Preview parsed candidate skills, experience years, and portfolio links directly inside modal views.',
                  },
                  {
                    title: 'Instant Messaging & Real-Time Sync',
                    desc: 'Schedule screening calls and send status updates automatically as candidates transition stages.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle size={13} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to={postJobPath} className="btn btn-secondary btn-lg shadow-md">
                Post a Job Today <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Explore by Department ───────────────────────────────────── */}
      <section className="py-24 bg-white border-b border-slate-200/80">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/50">
              Specialized Tracks
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Explore by Discipline
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Browse top roles across high-growth engineering, product, and leadership fields.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                to={`/jobs?category=${cat.label.toLowerCase()}`}
                className="group flex items-center gap-4 p-4 rounded-xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-white group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center border border-slate-200 group-hover:border-blue-600 shadow-xs transition-all shrink-0">
                  <cat.icon size={22} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                    {cat.label}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.count.toLocaleString()} roles</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: Testimonials (Enterprise Quote Grid) ────────────────────── */}
      <section className="py-24 bg-slate-50/70 border-b border-slate-200/80">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/50">
              Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Loved by Candidates & Founders
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Real feedback from engineers who landed dream positions and founders who scaled teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
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

      {/* ── Section 7: Final High-Impact CTA Banner ────────────────────────────── */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
            Ready to Take Your Next Career Leap?
          </h2>
          <p className="text-base text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join over 2.5 million professionals discovering elite opportunities and world-class companies on CareerLift.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="px-7 py-3.5 rounded-xl bg-white text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors shadow-xl">
              Create Free Account
            </Link>
            <Link to="/jobs" className="px-7 py-3.5 rounded-xl bg-blue-800/80 border border-blue-400/40 text-white font-bold text-sm hover:bg-blue-800 transition-colors">
              Browse All Jobs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
