import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { UserRole } from '@/types';
import api from '../../api/client';
import {
  Search, MapPin, Briefcase, ChevronRight, Monitor, HeartPulse,
  GraduationCap, TrendingUp, Building2, Cpu, Palette, ShieldCheck,
  Users, Star, ArrowRight, CheckCircle, Zap, PlusCircle
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


// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [experienceText, setExperienceText] = useState('');

  const postJobPath = !isAuthenticated ? '/register' : user?.role === UserRole.EMPLOYER ? '/employer/jobs/new' : '/dashboard';

  useEffect(() => {
    api.get('/jobs')
      .then(res => setFeaturedJobs(res.data.slice(0, 6)))
      .catch(console.error);
  }, []);

  return (
    <>
      {/* ── DAYLIGHT HERO ─────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="container hero-content py-36 animate-fadeInUp">
          {/* Kicker badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(0,167,181,0.18)', border: '1px solid rgba(0,167,181,0.4)', color: '#34e2e4' }}>
            <span className="w-2 h-2 rounded-full bg-[#34e2e4] animate-pulse" />
            #1 Platform for Engineering &amp; Product Roles
          </div>

          {/* Main headline */}
          <h1 className="hero-title">
            Find Jobs That<br />
            <span style={{ background: 'linear-gradient(135deg, #ffffff 10%, #34e2e4 70%, #00a7b5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Actually Match You</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Connect directly with hiring managers at world-class companies.
            AI-powered matching, real-time pipeline tracking, zero ghosting.
          </p>

          {/* Search bar — clean white on hero */}
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
              className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center"
            >
              <div className="relative">
                <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="search-input"
                  placeholder="Role, skill, or keyword..."
                  style={{ paddingLeft: 40 }}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="search-input"
                  placeholder="Location or 'Remote'..."
                  style={{ paddingLeft: 40 }}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="relative">
                <Briefcase size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="search-input"
                  placeholder="Experience level..."
                  style={{ paddingLeft: 40 }}
                  value={experienceText}
                  onChange={(e) => setExperienceText(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-full" style={{ background: 'linear-gradient(135deg, #00a7b5 0%, #008b97 100%)', border: 'none', boxShadow: '0 4px 20px rgba(0,167,181,0.45)' }}>
                <Search size={17} /> Find Jobs
              </button>
            </form>

            {/* Trending pills */}
            <div className="flex items-center gap-2 mt-3 px-1 flex-wrap">
              <span className="text-xs text-slate-400 font-semibold">Trending:</span>
              {['Frontend Engineer', 'Product Designer', 'Data Scientist', 'Remote'].map((kw) => (
                <Link
                  key={kw}
                  to={`/jobs?keyword=${kw}`}
                  className="text-xs px-3 py-1 rounded-full text-slate-600 hover:text-[#00a7b5] hover:bg-[#e6f7f8] transition-all border border-slate-200 font-medium"
                >
                  {kw}
                </Link>
              ))}
            </div>
          </div>

          {/* Role-Specific Action Bar */}
          {isAuthenticated && user?.role === UserRole.EMPLOYER ? (
            <div className="mt-8 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ background: 'rgba(0,167,181,0.15)', border: '1px solid rgba(0,167,181,0.35)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00a7b5]/25 text-[#34e2e4] flex items-center justify-center font-bold shrink-0">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Hiring for your team?</h3>
                  <p className="text-xs text-white/70">Reach 2.5M+ pre-vetted candidates instantly.</p>
                </div>
              </div>
              <Link to="/employer/jobs/new" className="btn btn-primary btn-sm flex items-center gap-2 whitespace-nowrap shadow-sm shadow-teal-500/25">
                <PlusCircle size={15} /> Post a Job
              </Link>
            </div>
          ) : !isAuthenticated ? (
            <div className="mt-7 flex items-center gap-3 text-sm">
              <span className="text-white/60">Employer?</span>
              <Link
                to="/register?role=employer"
                className="font-semibold text-[#34e2e4] hover:text-white flex items-center gap-1 transition-colors"
              >
                Post a job free <ChevronRight size={14} />
              </Link>
            </div>
          ) : null}

          {/* Trust strip */}
          <div className="flex items-center gap-5 mt-10 flex-wrap">
            {[
              { icon: CheckCircle, text: 'Zero hidden fees' },
              { icon: ShieldCheck, text: '100% verified companies' },
              { icon: Users, text: '2.5M+ job seekers' },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-2 text-sm font-medium text-white/70">
                <Icon size={15} className="text-emerald-400" /> {text}
              </span>
            ))}
          </div>
        </div>
      </section>
      {/* ── Section 1: Social Proof & Metrics ───────────────────────────────────── */}
      <section className="bg-white border-y border-slate-200/80 py-14">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
              Trusted by hiring teams at world's top companies
            </span>
          </div>
          {/* Infinite Marquee Logo Ticker moving right to left with pure, high-res logos (no box) */}
          <div className="relative w-full overflow-hidden marquee-mask mb-14 py-4">
            <div className="animate-marquee flex items-center gap-14 md:gap-20">
              {(() => {
                const logos = [
                  {
                    name: 'Google',
                    node: (
                      <svg className="h-9 md:h-11 w-auto shrink-0" viewBox="0 0 272 92" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.3 81.24 25 93.5 25s22.25 9.3 22.25 22.18zm-9.74 0c0-7.98-5.79-13.6-12.51-13.6-6.72 0-12.52 5.62-12.52 13.6 0 7.9 5.8 13.6 12.52 13.6 6.72 0 12.51-5.7 12.51-13.6z" fill="#EA4335"/>
                        <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.88 9.99-22.18 22.25-22.18s22.25 9.3 22.25 22.18zm-9.74 0c0-7.98-5.79-13.6-12.51-13.6-6.72 0-12.52 5.62-12.52 13.6 0 7.9 5.8 13.6 12.52 13.6 6.72 0 12.51-5.7 12.51-13.6z" fill="#FBBC05"/>
                        <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.18 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.62h9.44zm-8.75 21.09c0-7.81-5.21-13.6-11.85-13.6-6.72 0-12.18 5.79-12.18 13.6 0 7.72 5.46 13.35 12.18 13.35 6.64 0 11.85-5.63 11.85-13.35z" fill="#4285F4"/>
                        <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
                        <path d="M262.02 54.49l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.99 14.11l1.01 2.52-29.07 12.01c2.27 4.45 5.63 6.72 10.58 6.72 4.96 0 8.15-2.43 10.5-5.87zm-13.52-8.32l19.49-8.15c-1.09-2.77-4.37-4.7-8.32-4.7-4.95 0-11.68 4.37-11.17 12.85z" fill="#EA4335"/>
                        <path d="M35.64 41.83V33.3H68c.31 1.64.47 3.58.47 5.68 0 7-1.92 15.66-8.06 21.81C54.4 67.08 46.46 71 35.64 71 16.28 71 0 55.16 0 35.5S16.28 0 35.64 0c10.42 0 17.9 4.08 23.53 9.46L52.6 16.03c-3.95-3.69-9.33-6.55-16.96-6.55-13.78 0-24.53 11.17-24.53 25.02s10.75 25.02 24.53 25.02c8.91 0 13.95-3.53 17.14-6.72 2.77-2.77 4.54-6.72 5.29-12.18H35.64z" fill="#4285F4"/>
                      </svg>
                    ),
                  },
                  {
                    name: 'Amazon',
                    node: (
                      <div className="flex items-center gap-2">
                        <svg className="h-8 md:h-10 w-auto text-[#FF9900] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 01-10.951-.577 17.88 17.88 0 01-5.43-3.35c-.1-.074-.151-.15-.151-.22 0-.047.021-.09.051-.13zm6.565-6.218c0-1.005.247-1.863.743-2.577.495-.71 1.17-1.25 2.04-1.615.796-.335 1.756-.575 2.912-.72.39-.046 1.033-.103 1.92-.174v-.37c0-.93-.105-1.558-.3-1.875-.302-.43-.78-.65-1.44-.65h-.182c-.48.046-.896.196-1.246.46-.35.27-.575.63-.675 1.096-.06.3-.206.465-.435.51l-2.52-.315c-.248-.06-.372-.18-.372-.39 0-.046.007-.09.022-.15.247-1.29.855-2.25 1.82-2.88.976-.616 2.1-.975 3.39-1.05h.54c1.65 0 2.957.434 3.888 1.29.135.15.27.3.405.48.12.165.224.314.283.45.075.134.15.33.195.57.06.254.105.42.135.51.03.104.062.3.076.615.01.313.02.493.02.553v5.28c0 .376.06.72.165 1.036.105.313.21.54.315.674l.51.674c.09.136.136.256.136.36 0 .12-.06.226-.18.314-1.2 1.05-1.86 1.62-1.963 1.71-.165.135-.375.15-.63.045a6.062 6.062 0 01-.526-.496l-.31-.347a9.391 9.391 0 01-.317-.42l-.3-.435c-.81.886-1.603 1.44-2.4 1.665-.494.15-1.093.227-1.83.227-1.11 0-2.04-.343-2.76-1.034-.72-.69-1.08-1.665-1.08-2.94l-.05-.076zm3.753-.438c0 .566.14 1.02.425 1.364.285.34.675.512 1.155.512.045 0 .106-.007.195-.02.09-.016.134-.023.166-.023.614-.16 1.08-.553 1.424-1.178.165-.28.285-.58.36-.91.09-.32.12-.59.135-.8.015-.195.015-.54.015-1.005v-.54c-.84 0-1.484.06-1.92.18-1.275.36-1.92 1.17-1.92 2.43l-.035-.02zm9.162 7.027c.03-.06.075-.11.132-.17.362-.243.714-.41 1.05-.5a8.094 8.094 0 011.612-.24c.14-.012.28 0 .41.03.65.06 1.05.168 1.172.33.063.09.099.228.099.39v.15c0 .51-.149 1.11-.424 1.8-.278.69-.664 1.248-1.156 1.68-.073.06-.14.09-.197.09-.03 0-.06 0-.09-.012-.09-.044-.107-.12-.064-.24.54-1.26.806-2.143.806-2.64 0-.15-.03-.27-.087-.344-.145-.166-.55-.257-1.224-.257-.243 0-.533.016-.87.046-.363.045-.7.09-1 .135-.09 0-.148-.014-.18-.044-.03-.03-.036-.047-.02-.077 0-.017.006-.03.02-.063v-.06z"/>
                        </svg>
                        <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight lowercase">amazon</span>
                      </div>
                    ),
                  },
                  {
                    name: 'Netflix',
                    node: (
                      <div className="flex items-center gap-2">
                        <svg className="h-8 md:h-10 w-auto text-[#E50914] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22z"/>
                        </svg>
                        <span className="text-2xl md:text-3xl font-black text-[#E50914] tracking-wider uppercase font-sans">netflix</span>
                      </div>
                    ),
                  },
                  {
                    name: 'Stripe',
                    node: (
                      <div className="flex items-center gap-2">
                        <svg className="h-8 md:h-10 w-auto text-[#635BFF] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
                        </svg>
                        <span className="text-2xl md:text-3xl font-black text-[#635BFF] tracking-tight">stripe</span>
                      </div>
                    ),
                  },
                  {
                    name: 'Microsoft',
                    node: (
                      <div className="flex items-center gap-3">
                        <svg className="h-7 md:h-8 w-auto shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="11" height="11" fill="#F25022"/>
                          <rect x="13" width="11" height="11" fill="#7FBA00"/>
                          <rect y="13" width="11" height="11" fill="#00A4EF"/>
                          <rect x="13" y="13" width="11" height="11" fill="#FFB900"/>
                        </svg>
                        <span className="text-2xl md:text-3xl font-semibold text-slate-800 tracking-tight font-sans">Microsoft</span>
                      </div>
                    ),
                  },
                  {
                    name: 'Spotify',
                    node: (
                      <div className="flex items-center gap-2.5">
                        <svg className="h-8 md:h-10 w-auto text-[#1ED760] shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.497 17.306c-.216.353-.674.464-1.027.249-2.813-1.718-6.354-2.107-10.525-1.154-.403.092-.806-.157-.899-.56-.092-.403.157-.806.56-.899 4.568-1.044 8.487-.604 11.642 1.337.353.216.464.674.249 1.027zm1.467-3.26c-.272.443-.852.583-1.295.311-3.22-1.979-8.129-2.551-11.938-1.394-.499.151-1.028-.135-1.179-.634-.151-.499.135-1.028.634-1.179 4.356-1.321 9.774-.683 13.467 1.587.443.272.583.852.311 1.295zm.126-3.41c-3.861-2.293-10.233-2.505-13.921-1.385-.593.18-1.223-.156-1.403-.749-.18-.593.156-1.223.749-1.403 4.243-1.288 11.278-1.042 15.717 1.593.535.317.708 1.01.391 1.545-.317.535-1.01.708-1.545.391z"/>
                        </svg>
                        <span className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">Spotify</span>
                      </div>
                    ),
                  },
                  {
                    name: 'GitHub',
                    node: (
                      <div className="flex items-center gap-2.5">
                        <svg className="h-8 md:h-9 w-auto text-slate-900 shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                        </svg>
                        <span className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-sans">GitHub</span>
                      </div>
                    ),
                  },
                  {
                    name: 'Airbnb',
                    node: (
                      <div className="flex items-center gap-2">
                        <svg className="h-8 md:h-10 w-auto text-[#FF5A5F] shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z"/>
                        </svg>
                        <span className="text-2xl md:text-3xl font-extrabold text-[#FF5A5F] tracking-tight font-sans lowercase">airbnb</span>
                      </div>
                    ),
                  },
                  {
                    name: 'Slack',
                    node: (
                      <div className="flex items-center gap-2.5">
                        <svg className="h-7 md:h-9 w-auto shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/>
                          <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/>
                          <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D"/>
                          <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E"/>
                        </svg>
                        <span className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight font-sans lowercase">slack</span>
                      </div>
                    ),
                  },
                  {
                    name: 'Uber',
                    node: (
                      <span className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter font-sans select-none">
                        Uber
                      </span>
                    ),
                  },
                ];

                return logos.concat(logos).map((item, idx) => (
                  <div
                    key={`${item.name}-${idx}`}
                    className="flex items-center justify-center flex-shrink-0 opacity-75 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer px-4 select-none"
                    title={item.name}
                  >
                    {item.node}
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-100">
            {[
              { number: '50,000+', label: 'Active Jobs', color: 'text-[#00a7b5]' },
              { number: '120,000+', label: 'Registered Companies', color: 'text-slate-800' },
              { number: '2.5M+', label: 'Job Seekers', color: 'text-emerald-600' },
              { number: '94%', label: 'Success Rate', color: 'text-amber-600' },
            ].map((s) => (
              <div key={s.label} className="text-center px-4 py-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <span className={`block text-3xl md:text-4xl font-extrabold tracking-tight font-mono ${s.color}`}>{s.number}</span>
                <span className="block text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Split Showcase - "How CareerLift Works for Job Seekers" (MediaNV Style) ─── */}
      <section className="py-24 bg-slate-50/70 border-b border-slate-200/80">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e6f7f8] text-[#008b97] border border-[#b2e9ec] text-xs font-bold uppercase tracking-wider mb-4">
                For Job Seekers
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
                <span className="text-[#00a7b5]">Apply in seconds.</span> Track every stage with total transparency.
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
                    <div className="w-10 h-10 rounded-lg bg-[#e6f7f8] text-[#00a7b5] flex items-center justify-center shrink-0">
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
                <Link to="/jobs" className="btn btn-primary btn-lg shadow-md shadow-teal-500/25">
                  Explore Active Openings <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Right Mockup: Live Jira/SaaS Style Interactive Candidate Preview Card with Real Photo */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                <img
                  src="/images/candidate_showcase.jpg"
                  alt="Candidate accelerating career with CareerLift"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent"></div>

                {/* Floating Real-time Jira Card on top of photo */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-xl">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2.5">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500">
                      <span className="text-[#00a7b5]">APP-STAGE</span>
                      <span>/</span>
                      <span className="text-slate-900">APPLICATION #8492</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f7f8] text-[#008b97] border border-[#b2e9ec]">
                      Interview Scheduled
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">Staff Frontend Engineer</h5>
                      <p className="text-[11px] text-slate-500">Stripe &bull; San Francisco (Remote)</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#00a7b5]">$165k - $195k</span>
                  </div>

                  {/* Progress bar stages */}
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[9px] font-bold mt-3">
                    <div className="py-1 rounded bg-[#00a7b5] text-white">Applied</div>
                    <div className="py-1 rounded bg-[#00a7b5] text-white">Review</div>
                    <div className="py-1 rounded bg-[#00a7b5] text-white">Interview</div>
                    <div className="py-1 rounded bg-slate-100 text-slate-400">Offer</div>
                  </div>
                </div>
              </div>

              {/* Decorative background blur glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Featured Job Board (Jira-inspired Ticket Cards) ─────────────── */}
      <section className="py-24 bg-white border-b border-slate-200/80">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e6f7f8] text-[#008b97] border border-[#b2e9ec] text-xs font-bold uppercase tracking-wider mb-2">
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
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-[#00a7b5] hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-[#00a7b5] transition-colors uppercase tracking-tight">
                      JOB-{job.id.slice(0, 4).toUpperCase()}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#e6f7f8] text-[#008b97] border border-[#b2e9ec]">
                      {job.type || 'Full Time'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#00a7b5] transition-colors line-clamp-1 mb-1">
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
                  <span className="font-bold text-[#00a7b5] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
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
            {/* Left Mockup: Jira-Style Employer Pipeline Visual with Real Photography */}
            <div className="order-2 lg:order-1 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                <img
                  src="/images/employer_showcase.jpg"
                  alt="Modern hiring team collaborating on candidate pipeline"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent"></div>

                {/* Floating Jira Pipeline Card on top of image */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-xl">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00a7b5]"></span>
                      <span className="text-[11px] font-mono font-bold text-slate-800 uppercase tracking-tight">HIRING PIPELINE &bull; CANDIDATES</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">Jira Board</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/70">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">APPLIED (12)</span>
                      <div className="bg-white p-1.5 rounded border border-slate-200 shadow-xs">
                        <p className="font-bold text-[11px] text-slate-800 truncate">Alex Chen</p>
                        <p className="text-[9px] text-slate-400">Full Stack</p>
                      </div>
                    </div>

                    <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200/70">
                      <span className="text-[9px] font-bold text-amber-800 uppercase block mb-1">REVIEW (4)</span>
                      <div className="bg-white p-1.5 rounded border border-amber-300 shadow-xs">
                        <p className="font-bold text-[11px] text-slate-800 truncate">David Kumar</p>
                        <p className="text-[9px] text-amber-700 font-medium">94% Match</p>
                      </div>
                    </div>

                    <div className="bg-emerald-50/50 p-2 rounded-lg border border-emerald-200/70">
                      <span className="text-[9px] font-bold text-emerald-800 uppercase block mb-1">OFFER (2)</span>
                      <div className="bg-white p-1.5 rounded border border-emerald-300 shadow-xs">
                        <p className="font-bold text-[11px] text-slate-800 truncate">Jessica Tay</p>
                        <p className="text-[9px] text-emerald-700 font-medium">Accepted</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative background blur glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl opacity-10 blur-xl -z-10"></div>
            </div>

            {/* Right Copy */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e6f7f8] text-[#008b97] border border-[#b2e9ec] text-xs font-bold uppercase tracking-wider mb-4">
                For Employers & Recruiters
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
                <span className="text-[#00a7b5]">Cut hiring cycles in half</span> with Jira-grade candidate pipelines.
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
                    <div className="w-5 h-5 rounded-full bg-[#e6f7f8] text-[#00a7b5] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle size={13} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {isAuthenticated && user?.role === UserRole.JOB_SEEKER ? (
                <Link to="/jobs" className="btn btn-secondary btn-lg shadow-md">
                  Browse Opportunities <ChevronRight size={18} />
                </Link>
              ) : isAuthenticated && user?.role === UserRole.EMPLOYER ? (
                <Link to="/employer/jobs/new" className="btn btn-secondary btn-lg shadow-md">
                  Post a Job Today <ChevronRight size={18} />
                </Link>
              ) : (
                <Link to="/register?role=employer" className="btn btn-secondary btn-lg shadow-md">
                  Hire with CareerLift <ChevronRight size={18} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Explore by Department ───────────────────────────────────── */}
      <section className="py-24 bg-white border-b border-slate-200/80">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-bold text-[#008b97] uppercase tracking-widest bg-[#e6f7f8] px-3 py-1 rounded-md border border-[#b2e9ec]">
              Specialized Tracks
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Explore by Discipline
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Browse top roles across high-growth engineering, product, and leadership fields.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {categories.map((cat, idx) => {
              const colorSets = [
                { bg: 'bg-[#e6f7f8]', iconBg: 'bg-[#00a7b5]', hover: 'hover:border-[#00a7b5]', textHover: 'group-hover:text-[#00a7b5]' },
                { bg: 'bg-rose-50', iconBg: 'bg-rose-500', hover: 'hover:border-rose-400', textHover: 'group-hover:text-rose-700' },
                { bg: 'bg-teal-50', iconBg: 'bg-[#008b97]', hover: 'hover:border-[#008b97]', textHover: 'group-hover:text-[#008b97]' },
                { bg: 'bg-amber-50', iconBg: 'bg-amber-500', hover: 'hover:border-amber-400', textHover: 'group-hover:text-amber-700' },
                { bg: 'bg-emerald-50', iconBg: 'bg-emerald-600', hover: 'hover:border-emerald-400', textHover: 'group-hover:text-emerald-700' },
                { bg: 'bg-cyan-50', iconBg: 'bg-cyan-600', hover: 'hover:border-cyan-400', textHover: 'group-hover:text-cyan-700' },
                { bg: 'bg-pink-50', iconBg: 'bg-pink-500', hover: 'hover:border-pink-400', textHover: 'group-hover:text-pink-700' },
                { bg: 'bg-indigo-50', iconBg: 'bg-indigo-600', hover: 'hover:border-indigo-400', textHover: 'group-hover:text-indigo-700' },
              ];
              const c = colorSets[idx % colorSets.length];
              return (
                <Link
                  key={cat.label}
                  to={`/jobs?category=${cat.label.toLowerCase()}`}
                  className={`group flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white border border-slate-200 ${c.hover} hover:shadow-lg transition-all duration-200`}
                >
                  <div className={`w-14 h-14 rounded-2xl ${c.iconBg} text-white flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110`}>
                    <cat.icon size={26} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-slate-900 text-sm ${c.textHover} transition-colors`}>
                      {cat.label}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{cat.count.toLocaleString()} open roles</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 6: Testimonials (MediaNV Light) ─────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: '#f4fafb' }}>
        {/* Subtle teal tint circles */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#00a7b5]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#10b981]/5 blur-3xl" />

        <div className="container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold text-[#008b97] uppercase tracking-widest bg-[#e6f7f8] border border-[#b2e9ec] px-3 py-1 rounded-full">
              Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-4">
              Loved by Candidates &amp; Founders
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Real feedback from engineers who landed dream positions and founders who scaled teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card flex flex-col justify-between group">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="testimonial-text">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-[#00a7b5] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
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

      {/* ── Section 7: MediaNV Teal Gradient CTA Banner ────────────────────────────── */}
      <section className="py-16 px-4" style={{ background: '#f4fafb' }}>
        <div className="container max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl px-8 py-14 md:px-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8"
            style={{ background: 'linear-gradient(135deg, #009aa8 0%, #00b4d8 60%, #10b981 100%)' }}>
            {/* Decorative circle */}
            <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full opacity-15" style={{ background: 'rgba(255,255,255,0.3)' }} />
            <div className="absolute right-12 -top-10 w-40 h-40 rounded-full opacity-10" style={{ background: 'rgba(255,255,255,0.4)' }} />

            <div className="relative z-10 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Join 2.5M+ professionals
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
                Ready to Take Your<br />
                <span className="text-white/90">Next Career Leap?</span>
              </h2>
              <p className="text-white/80 text-sm max-w-md leading-relaxed">
                Discover elite opportunities and connect with world-class companies on the platform trusted by top engineers and founders.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3 shrink-0">
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-full bg-white text-[#008b97] font-extrabold text-sm uppercase tracking-wide shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Create Free Account
              </Link>
              <Link
                to="/jobs"
                className="text-white/80 text-xs font-semibold hover:text-white underline underline-offset-2 transition-colors"
              >
                Browse All Jobs →
              </Link>
              <p className="text-white/60 text-[11px]">No credit card required • Always free for job seekers</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
