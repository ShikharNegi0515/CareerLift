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
              {[
                {
                  name: 'Google',
                  node: (
                    <svg className="h-8 md:h-9 w-auto" viewBox="0 0 272 92" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  name: 'Stripe',
                  node: (
                    <svg className="h-8 md:h-9 w-auto" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M59.64 14.28c0-4.47-2.19-8.06-6.42-8.06-4.26 0-6.84 3.59-6.84 8.03 0 5.26 3.1 7.97 7.42 7.97 2.1 0 3.68-.47 4.88-1.13v-3.3c-1.2.62-2.52.95-4.1.95-1.63 0-3.05-.62-3.24-2.48h8.25c.02-.32.05-.66.05-.98zm-8.35-1.63c.08-1.74 1.1-2.43 2.15-2.43 1.02 0 2.05.69 2.13 2.43h-4.28zM38.83 6.22c-1.73 0-2.85.8-3.4 1.37l-.23-1.09h-4.32v20.48l4.95-1.05.02-4.89c.56.5 1.58 1.18 3.1 1.18 3.13 0 5.96-2.5 5.96-7.85 0-5.11-2.8-8.15-6.08-8.15zm-1.06 12.01c-1.02 0-1.63-.37-2.05-.81l-.03-6.64c.45-.49 1.1-.85 2.08-.85 1.6 0 2.68 1.45 2.68 4.14 0 2.73-1.07 4.16-2.68 4.16zM24.84 4.85l4.98-1.06V.03L24.84 1.1v3.75zm0 1.64h4.98v15.48h-4.98V6.49zM19.38 7.85l-.29-1.36h-4.23v15.48h4.96v-8.2c1.17-1.52 3.15-1.24 3.77-1.04V7.81c-.65-.24-3.04-.69-4.21.04zM8.32 9.77c0-.85.7-1.18 1.83-1.18 1.63 0 3.7.5 5.33 1.4v-4.6C13.67 4.6 11.75 4.3 9.9 4.3 4.83 4.3 1.5 6.94 1.5 11.23c0 6.64 9.13 5.58 9.13 8.45 0 .99-.86 1.32-2.07 1.32-1.78 0-4.1-.73-5.91-1.74v4.68c2.04.88 4.2 1.28 6.08 1.28 5.2 0 8.7-2.58 8.7-6.95-.01-7.14-9.11-5.88-9.11-8.5z" fill="#635BFF"/>
                    </svg>
                  ),
                },
                {
                  name: 'Netflix',
                  node: (
                    <svg className="h-7 md:h-8 w-auto" viewBox="0 0 111 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M105.06 14.3l5.94 14.88h-6.28l-3.32-8.9-3.26 8.9h-6.23l5.88-14.88-5.61-14.3h6.28l2.94 8.35 3.05-8.35h6.23l-5.62 14.3zm-27.5 14.88h-6.17V0h6.17v29.18zm-11.45-6.29v6.29H54.02V0h6.09v22.89h6.00zm-18.08 6.29V5.51h-5.23V0h16.65v5.51h-5.28v23.67H48.03zm-19.14 0h-6.11V0h17.24v5.35h-11.13v6.52h10.02v5.35H28.89v6.61h11.41v5.35H28.89zM0 29.18V0h6.17l8.6 16.94V0h6.17v29.18h-6.17L6.17 12.24v16.94H0z" fill="#E50914"/>
                    </svg>
                  ),
                },
                {
                  name: 'Amazon',
                  node: (
                    <svg className="h-7 md:h-8 w-auto" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M55.8 19.3c-7.9 5.8-19.4 8.9-29.3 8.9-13.9 0-26.4-5.1-35.9-13.6-.8-.7-.1-1.6.8-1.1 10.3 5.9 23 9.5 36.1 9.5 8.8 0 18.3-2.1 26.9-6.5 1.3-.7 2.4.9 1.4 2.8z" fill="#FF9900"/>
                      <path d="M58.7 15.9c-1-.7-3.3-.3-4.7.1-1.3.4-1.9-.3-1.6-1 .9-2.3 4.2-2.1 5.4-1.6 1.3.5 1.6 1.9 1.2 4-1.1 5.3-2.7 7.8-6.4 11-1.2 1-2.1.5-1.4-.7 1.8-3.1 4.7-6.5 7.5-11.8z" fill="#FF9900"/>
                      <path d="M19.1 15.6c0 3.3-1.9 5.2-4.7 5.2-2.4 0-4-1.6-4-4.5 0-4.4 3.2-5.4 8.7-5.4v4.7zm4.3 6.9h-4.1v-2.1c-1.3 1.6-3.1 2.4-5.4 2.4-3.9 0-6.9-2.6-6.9-6.8 0-4.9 3.6-7.3 9.9-7.3 2.1 0 4.3.3 6.5.7v-.9c0-2.3-1.4-3.5-4.3-3.5-2.2 0-4.5.6-6.5 1.7l-1.3-3.1c2.4-1.4 5.3-2.1 8.3-2.1 5.5 0 8 2.7 8 7.3v13.7h-.2z" fill="#000000"/>
                      <path d="M43.7 22.5h-4.3v-10c0-2.5-1.1-3.6-3.1-3.6-2 0-3.6 1.4-4.5 3.3v10.3h-4.3V4.8h4.3v2.3c1.4-1.8 3.5-2.6 5.8-2.6 4.1 0 6.1 2.3 6.1 6.5v11.5z" fill="#000000"/>
                      <path d="M60.1 13.5c0 5.4-3.6 9.3-9.1 9.3s-9.1-3.9-9.1-9.3c0-5.4 3.6-9.3 9.1-9.3s9.1 3.9 9.1 9.3zm-4.3 0c0-3.6-2.1-6-4.8-6s-4.8 2.4-4.8 6 2.1 6 4.8 6 4.8-2.4 4.8-6z" fill="#000000"/>
                      <path d="M78.6 22.5h-4.3v-10c0-2.5-1.1-3.6-3.1-3.6-2 0-3.6 1.4-4.5 3.3v10.3h-4.3V4.8h4.3v2.3c1.4-1.8 3.5-2.6 5.8-2.6 4.1 0 6.1 2.3 6.1 6.5v11.5z" fill="#000000"/>
                    </svg>
                  ),
                },
                {
                  name: 'Microsoft',
                  node: (
                    <svg className="h-7 md:h-8 w-auto" viewBox="0 0 130 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="13" height="13" fill="#F25022"/>
                      <rect x="15" width="13" height="13" fill="#7FBA00"/>
                      <rect y="15" width="13" height="13" fill="#00A4EF"/>
                      <rect x="15" y="15" width="13" height="13" fill="#FFB900"/>
                      <text x="36" y="20" fill="#5E5E5E" fontFamily="Segoe UI, -apple-system, sans-serif" fontWeight="600" fontSize="19" letterSpacing="-0.5">Microsoft</text>
                    </svg>
                  ),
                },
                {
                  name: 'Spotify',
                  node: (
                    <svg className="h-8 md:h-9 w-auto" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="15" cy="15" r="14" fill="#1DB954"/>
                      <path d="M22.8 11.2c-4.4-2.6-11.6-2.9-15.8-1.6-.7.2-1.4-.2-1.6-.9-.2-.7.2-1.4.9-1.6 4.8-1.5 12.8-1.2 17.8 1.8.6.4.8 1.2.5 1.8-.4.7-1.2.9-1.8.5zm-.4 3.7c-.3.5-1 .7-1.5.4-3.7-2.3-9.3-2.9-13.6-1.6-.6.2-1.2-.2-1.4-.7-.2-.6.2-1.2.7-1.4 5-1.5 11.2-.8 15.4 1.8.5.3.7 1 .4 1.5zm-.5 3.7c-.3.4-.8.6-1.2.3-3.2-2-7.3-2.4-12-1.3-.5.1-1-.2-1.1-.7-.1-.5.2-1 .7-1.1 5.2-1.2 9.7-.7 13.3 1.5.4.3.6.8.3 1.3z" fill="#FFFFFF"/>
                      <text x="36" y="21" fill="#191414" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="18" letterSpacing="-0.5">Spotify</text>
                    </svg>
                  ),
                },
                {
                  name: 'GitHub',
                  node: (
                    <svg className="h-8 md:h-9 w-auto" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M14 0C6.27 0 0 6.27 0 14c0 6.19 4.01 11.43 9.58 13.28.7.13.96-.3.96-.67v-2.36c-3.9.85-4.72-1.88-4.72-1.88-.64-1.62-1.56-2.05-1.56-2.05-1.27-.87.1-.85.1-.85 1.41.1 2.15 1.45 2.15 1.45 1.25 2.15 3.29 1.53 4.09 1.17.13-.91.49-1.53.89-1.88-3.11-.35-6.38-1.56-6.38-6.93 0-1.53.55-2.79 1.44-3.77-.14-.35-.63-1.78.14-3.72 0 0 1.18-.38 3.86 1.44 1.12-.31 2.32-.47 3.51-.47 1.19 0 2.39.16 3.51.47 2.68-1.82 3.86-1.44 3.86-1.44.77 1.94.28 3.37.14 3.72.9 0.98 1.44 2.24 1.44 3.77 0 5.38-3.28 6.57-6.4 6.92.51.44.96 1.3.96 2.62v3.89c0 .38.25.81.97.67C23.99 25.43 28 20.19 28 14c0-7.73-6.27-14-14-14z" fill="#24292F"/>
                      <text x="34" y="20" fill="#24292F" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="19" letterSpacing="-0.5">GitHub</text>
                    </svg>
                  ),
                },
                {
                  name: 'Airbnb',
                  node: (
                    <svg className="h-8 md:h-9 w-auto" viewBox="0 0 102 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.9 0C9.6 0 5 4.3 5 9.7c0 7.8 9.9 19.3 9.9 19.3s9.9-11.5 9.9-19.3C24.8 4.3 20.2 0 14.9 0zm0 14.5c-2.7 0-4.9-2.2-4.9-4.8 0-2.7 2.2-4.8 4.9-4.8s4.9 2.2 4.9 4.8c0 2.6-2.2 4.8-4.9 4.8z" fill="#FF5A5F"/>
                      <text x="32" y="22" fill="#FF5A5F" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="21" letterSpacing="-0.6">airbnb</text>
                    </svg>
                  ),
                },
                {
                  name: 'Slack',
                  node: (
                    <svg className="h-7 md:h-8 w-auto" viewBox="0 0 95 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g fillRule="evenodd" clipRule="evenodd">
                        <path d="M5.4 14.9c0 1.5-1.2 2.7-2.7 2.7S0 16.4 0 14.9s1.2-2.7 2.7-2.7h2.7v2.7zm1.3 0c0-1.5 1.2-2.7 2.7-2.7s2.7 1.2 2.7 2.7v6.8c0 1.5-1.2 2.7-2.7 2.7s-2.7-1.2-2.7-2.7v-6.8z" fill="#E01E5A"/>
                        <path d="M9.4 5.4c-1.5 0-2.7-1.2-2.7-2.7S7.9 0 9.4 0s2.7 1.2 2.7 2.7v2.7H9.4zm0 1.3c1.5 0 2.7 1.2 2.7 2.7s-1.2 2.7-2.7 2.7H2.7C1.2 12.1 0 10.9 0 9.4s1.2-2.7 2.7-2.7h6.7z" fill="#36C5F0"/>
                        <path d="M18.8 9.4c0-1.5 1.2-2.7 2.7-2.7s2.7 1.2 2.7 2.7-1.2 2.7-2.7 2.7h-2.7V9.4zm-1.3 0c0 1.5-1.2 2.7-2.7 2.7s-2.7-1.2-2.7-2.7V2.7C12.1 1.2 13.3 0 14.8 0s2.7 1.2 2.7 2.7v6.7z" fill="#2EB67D"/>
                        <path d="M14.8 18.8c1.5 0 2.7 1.2 2.7 2.7s-1.2 2.7-2.7 2.7-2.7-1.2-2.7-2.7v-2.7h2.7zm0-1.3c-1.5 0-2.7-1.2-2.7-2.7s1.2-2.7 2.7-2.7h6.8c1.5 0 2.7 1.2 2.7 2.7s-1.2 2.7-2.7 2.7h-6.8z" fill="#ECB22E"/>
                      </g>
                      <text x="30" y="19" fill="#1D1C1D" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="19" letterSpacing="-0.5">slack</text>
                    </svg>
                  ),
                },
                {
                  name: 'Uber',
                  node: (
                    <svg className="h-6 md:h-7 w-auto" viewBox="0 0 75 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <text x="0" y="19" fill="#000000" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="900" fontSize="23" letterSpacing="-0.5">Uber</text>
                    </svg>
                  ),
                },
              ].concat([
                {
                  name: 'Google',
                  node: (
                    <svg className="h-8 md:h-9 w-auto" viewBox="0 0 272 92" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  name: 'Stripe',
                  node: (
                    <svg className="h-8 md:h-9 w-auto" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M59.64 14.28c0-4.47-2.19-8.06-6.42-8.06-4.26 0-6.84 3.59-6.84 8.03 0 5.26 3.1 7.97 7.42 7.97 2.1 0 3.68-.47 4.88-1.13v-3.3c-1.2.62-2.52.95-4.1.95-1.63 0-3.05-.62-3.24-2.48h8.25c.02-.32.05-.66.05-.98zm-8.35-1.63c.08-1.74 1.1-2.43 2.15-2.43 1.02 0 2.05.69 2.13 2.43h-4.28zM38.83 6.22c-1.73 0-2.85.8-3.4 1.37l-.23-1.09h-4.32v20.48l4.95-1.05.02-4.89c.56.5 1.58 1.18 3.1 1.18 3.13 0 5.96-2.5 5.96-7.85 0-5.11-2.8-8.15-6.08-8.15zm-1.06 12.01c-1.02 0-1.63-.37-2.05-.81l-.03-6.64c.45-.49 1.1-.85 2.08-.85 1.6 0 2.68 1.45 2.68 4.14 0 2.73-1.07 4.16-2.68 4.16zM24.84 4.85l4.98-1.06V.03L24.84 1.1v3.75zm0 1.64h4.98v15.48h-4.98V6.49zM19.38 7.85l-.29-1.36h-4.23v15.48h4.96v-8.2c1.17-1.52 3.15-1.24 3.77-1.04V7.81c-.65-.24-3.04-.69-4.21.04zM8.32 9.77c0-.85.7-1.18 1.83-1.18 1.63 0 3.7.5 5.33 1.4v-4.6C13.67 4.6 11.75 4.3 9.9 4.3 4.83 4.3 1.5 6.94 1.5 11.23c0 6.64 9.13 5.58 9.13 8.45 0 .99-.86 1.32-2.07 1.32-1.78 0-4.1-.73-5.91-1.74v4.68c2.04.88 4.2 1.28 6.08 1.28 5.2 0 8.7-2.58 8.7-6.95-.01-7.14-9.11-5.88-9.11-8.5z" fill="#635BFF"/>
                    </svg>
                  ),
                },
                {
                  name: 'Netflix',
                  node: (
                    <svg className="h-7 md:h-8 w-auto" viewBox="0 0 111 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M105.06 14.3l5.94 14.88h-6.28l-3.32-8.9-3.26 8.9h-6.23l5.88-14.88-5.61-14.3h6.28l2.94 8.35 3.05-8.35h6.23l-5.62 14.3zm-27.5 14.88h-6.17V0h6.17v29.18zm-11.45-6.29v6.29H54.02V0h6.09v22.89h6.00zm-18.08 6.29V5.51h-5.23V0h16.65v5.51h-5.28v23.67H48.03zm-19.14 0h-6.11V0h17.24v5.35h-11.13v6.52h10.02v5.35H28.89v6.61h11.41v5.35H28.89zM0 29.18V0h6.17l8.6 16.94V0h6.17v29.18h-6.17L6.17 12.24v16.94H0z" fill="#E50914"/>
                    </svg>
                  ),
                },
                {
                  name: 'Amazon',
                  node: (
                    <svg className="h-7 md:h-8 w-auto" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M55.8 19.3c-7.9 5.8-19.4 8.9-29.3 8.9-13.9 0-26.4-5.1-35.9-13.6-.8-.7-.1-1.6.8-1.1 10.3 5.9 23 9.5 36.1 9.5 8.8 0 18.3-2.1 26.9-6.5 1.3-.7 2.4.9 1.4 2.8z" fill="#FF9900"/>
                      <path d="M58.7 15.9c-1-.7-3.3-.3-4.7.1-1.3.4-1.9-.3-1.6-1 .9-2.3 4.2-2.1 5.4-1.6 1.3.5 1.6 1.9 1.2 4-1.1 5.3-2.7 7.8-6.4 11-1.2 1-2.1.5-1.4-.7 1.8-3.1 4.7-6.5 7.5-11.8z" fill="#FF9900"/>
                      <path d="M19.1 15.6c0 3.3-1.9 5.2-4.7 5.2-2.4 0-4-1.6-4-4.5 0-4.4 3.2-5.4 8.7-5.4v4.7zm4.3 6.9h-4.1v-2.1c-1.3 1.6-3.1 2.4-5.4 2.4-3.9 0-6.9-2.6-6.9-6.8 0-4.9 3.6-7.3 9.9-7.3 2.1 0 4.3.3 6.5.7v-.9c0-2.3-1.4-3.5-4.3-3.5-2.2 0-4.5.6-6.5 1.7l-1.3-3.1c2.4-1.4 5.3-2.1 8.3-2.1 5.5 0 8 2.7 8 7.3v13.7h-.2z" fill="#000000"/>
                      <path d="M43.7 22.5h-4.3v-10c0-2.5-1.1-3.6-3.1-3.6-2 0-3.6 1.4-4.5 3.3v10.3h-4.3V4.8h4.3v2.3c1.4-1.8 3.5-2.6 5.8-2.6 4.1 0 6.1 2.3 6.1 6.5v11.5z" fill="#000000"/>
                      <path d="M60.1 13.5c0 5.4-3.6 9.3-9.1 9.3s-9.1-3.9-9.1-9.3c0-5.4 3.6-9.3 9.1-9.3s9.1 3.9 9.1 9.3zm-4.3 0c0-3.6-2.1-6-4.8-6s-4.8 2.4-4.8 6 2.1 6 4.8 6 4.8-2.4 4.8-6z" fill="#000000"/>
                      <path d="M78.6 22.5h-4.3v-10c0-2.5-1.1-3.6-3.1-3.6-2 0-3.6 1.4-4.5 3.3v10.3h-4.3V4.8h4.3v2.3c1.4-1.8 3.5-2.6 5.8-2.6 4.1 0 6.1 2.3 6.1 6.5v11.5z" fill="#000000"/>
                    </svg>
                  ),
                },
                {
                  name: 'Microsoft',
                  node: (
                    <svg className="h-7 md:h-8 w-auto" viewBox="0 0 130 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="13" height="13" fill="#F25022"/>
                      <rect x="15" width="13" height="13" fill="#7FBA00"/>
                      <rect y="15" width="13" height="13" fill="#00A4EF"/>
                      <rect x="15" y="15" width="13" height="13" fill="#FFB900"/>
                      <text x="36" y="20" fill="#5E5E5E" fontFamily="Segoe UI, -apple-system, sans-serif" fontWeight="600" fontSize="19" letterSpacing="-0.5">Microsoft</text>
                    </svg>
                  ),
                },
                {
                  name: 'Spotify',
                  node: (
                    <svg className="h-8 md:h-9 w-auto" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="15" cy="15" r="14" fill="#1DB954"/>
                      <path d="M22.8 11.2c-4.4-2.6-11.6-2.9-15.8-1.6-.7.2-1.4-.2-1.6-.9-.2-.7.2-1.4.9-1.6 4.8-1.5 12.8-1.2 17.8 1.8.6.4.8 1.2.5 1.8-.4.7-1.2.9-1.8.5zm-.4 3.7c-.3.5-1 .7-1.5.4-3.7-2.3-9.3-2.9-13.6-1.6-.6.2-1.2-.2-1.4-.7-.2-.6.2-1.2.7-1.4 5-1.5 11.2-.8 15.4 1.8.5.3.7 1 .4 1.5zm-.5 3.7c-.3.4-.8.6-1.2.3-3.2-2-7.3-2.4-12-1.3-.5.1-1-.2-1.1-.7-.1-.5.2-1 .7-1.1 5.2-1.2 9.7-.7 13.3 1.5.4.3.6.8.3 1.3z" fill="#FFFFFF"/>
                      <text x="36" y="21" fill="#191414" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="18" letterSpacing="-0.5">Spotify</text>
                    </svg>
                  ),
                },
                {
                  name: 'GitHub',
                  node: (
                    <svg className="h-8 md:h-9 w-auto" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M14 0C6.27 0 0 6.27 0 14c0 6.19 4.01 11.43 9.58 13.28.7.13.96-.3.96-.67v-2.36c-3.9.85-4.72-1.88-4.72-1.88-.64-1.62-1.56-2.05-1.56-2.05-1.27-.87.1-.85.1-.85 1.41.1 2.15 1.45 2.15 1.45 1.25 2.15 3.29 1.53 4.09 1.17.13-.91.49-1.53.89-1.88-3.11-.35-6.38-1.56-6.38-6.93 0-1.53.55-2.79 1.44-3.77-.14-.35-.63-1.78.14-3.72 0 0 1.18-.38 3.86 1.44 1.12-.31 2.32-.47 3.51-.47 1.19 0 2.39.16 3.51.47 2.68-1.82 3.86-1.44 3.86-1.44.77 1.94.28 3.37.14 3.72.9 0.98 1.44 2.24 1.44 3.77 0 5.38-3.28 6.57-6.4 6.92.51.44.96 1.3.96 2.62v3.89c0 .38.25.81.97.67C23.99 25.43 28 20.19 28 14c0-7.73-6.27-14-14-14z" fill="#24292F"/>
                      <text x="34" y="20" fill="#24292F" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="19" letterSpacing="-0.5">GitHub</text>
                    </svg>
                  ),
                },
                {
                  name: 'Airbnb',
                  node: (
                    <svg className="h-8 md:h-9 w-auto" viewBox="0 0 102 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.9 0C9.6 0 5 4.3 5 9.7c0 7.8 9.9 19.3 9.9 19.3s9.9-11.5 9.9-19.3C24.8 4.3 20.2 0 14.9 0zm0 14.5c-2.7 0-4.9-2.2-4.9-4.8 0-2.7 2.2-4.8 4.9-4.8s4.9 2.2 4.9 4.8c0 2.6-2.2 4.8-4.9 4.8z" fill="#FF5A5F"/>
                      <text x="32" y="22" fill="#FF5A5F" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="21" letterSpacing="-0.6">airbnb</text>
                    </svg>
                  ),
                },
                {
                  name: 'Slack',
                  node: (
                    <svg className="h-7 md:h-8 w-auto" viewBox="0 0 95 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g fillRule="evenodd" clipRule="evenodd">
                        <path d="M5.4 14.9c0 1.5-1.2 2.7-2.7 2.7S0 16.4 0 14.9s1.2-2.7 2.7-2.7h2.7v2.7zm1.3 0c0-1.5 1.2-2.7 2.7-2.7s2.7 1.2 2.7 2.7v6.8c0 1.5-1.2 2.7-2.7 2.7s-2.7-1.2-2.7-2.7v-6.8z" fill="#E01E5A"/>
                        <path d="M9.4 5.4c-1.5 0-2.7-1.2-2.7-2.7S7.9 0 9.4 0s2.7 1.2 2.7 2.7v2.7H9.4zm0 1.3c1.5 0 2.7 1.2 2.7 2.7s-1.2 2.7-2.7 2.7H2.7C1.2 12.1 0 10.9 0 9.4s1.2-2.7 2.7-2.7h6.7z" fill="#36C5F0"/>
                        <path d="M18.8 9.4c0-1.5 1.2-2.7 2.7-2.7s2.7 1.2 2.7 2.7-1.2 2.7-2.7 2.7h-2.7V9.4zm-1.3 0c0 1.5-1.2 2.7-2.7 2.7s-2.7-1.2-2.7-2.7V2.7C12.1 1.2 13.3 0 14.8 0s2.7 1.2 2.7 2.7v6.7z" fill="#2EB67D"/>
                        <path d="M14.8 18.8c1.5 0 2.7 1.2 2.7 2.7s-1.2 2.7-2.7 2.7-2.7-1.2-2.7-2.7v-2.7h2.7zm0-1.3c-1.5 0-2.7-1.2-2.7-2.7s1.2-2.7 2.7-2.7h6.8c1.5 0 2.7 1.2 2.7 2.7s-1.2 2.7-2.7 2.7h-6.8z" fill="#ECB22E"/>
                      </g>
                      <text x="30" y="19" fill="#1D1C1D" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="19" letterSpacing="-0.5">slack</text>
                    </svg>
                  ),
                },
                {
                  name: 'Uber',
                  node: (
                    <svg className="h-6 md:h-7 w-auto" viewBox="0 0 75 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <text x="0" y="19" fill="#000000" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="900" fontSize="23" letterSpacing="-0.5">Uber</text>
                    </svg>
                  ),
                },
              ]).map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="flex items-center justify-center flex-shrink-0 opacity-60 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer px-2"
                  title={item.name}
                >
                  {item.node}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-100">
            {[
              { number: '50,000+', label: 'Active Jobs', color: 'text-blue-600' },
              { number: '120,000+', label: 'Registered Companies', color: 'text-violet-600' },
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
                      <span className="text-blue-600">APP-STAGE</span>
                      <span>/</span>
                      <span className="text-slate-900">APPLICATION #8492</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Interview Scheduled
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">Staff Frontend Engineer</h5>
                      <p className="text-[11px] text-slate-500">Stripe &bull; San Francisco (Remote)</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-blue-600">$165k - $195k</span>
                  </div>

                  {/* Progress bar stages */}
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[9px] font-bold mt-3">
                    <div className="py-1 rounded bg-blue-600 text-white">Applied</div>
                    <div className="py-1 rounded bg-blue-600 text-white">Review</div>
                    <div className="py-1 rounded bg-blue-600 text-white">Interview</div>
                    <div className="py-1 rounded bg-slate-100 text-slate-400">Offer</div>
                  </div>
                </div>
              </div>

              {/* Decorative background blur glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-10 blur-xl -z-10"></div>
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
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
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
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl opacity-10 blur-xl -z-10"></div>
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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {categories.map((cat, idx) => {
              const colorSets = [
                { bg: 'bg-blue-50', iconBg: 'bg-blue-600', hover: 'hover:border-blue-400', textHover: 'group-hover:text-blue-700' },
                { bg: 'bg-rose-50', iconBg: 'bg-rose-500', hover: 'hover:border-rose-400', textHover: 'group-hover:text-rose-700' },
                { bg: 'bg-violet-50', iconBg: 'bg-violet-600', hover: 'hover:border-violet-400', textHover: 'group-hover:text-violet-700' },
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

      {/* ── Section 6: Testimonials (Dark Premium Quote Grid) ─────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
        {/* Decorative dot grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        {/* Glow accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>

        <div className="container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/20 border border-blue-400/30 px-2.5 py-1 rounded-md">
              Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-3">
              Loved by Candidates &amp; Founders
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Real feedback from engineers who landed dream positions and founders who scaled teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm flex flex-col justify-between hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-normal">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 7: Final High-Impact CTA Banner ────────────────────────────── */}
      <section className="py-24 bg-white border-t border-slate-200 relative overflow-hidden">
        {/* Background decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-blue-100/60"></div>
          <div className="absolute w-[400px] h-[400px] rounded-full border border-blue-100/80"></div>
          <div className="absolute w-[200px] h-[200px] rounded-full border border-blue-200/60"></div>
        </div>
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Join 2.5M+ professionals
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5 leading-tight text-slate-900">
            Ready to Take Your<br />
            <span className="text-blue-600">Next Career Leap?</span>
          </h2>
          <p className="text-base text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover elite opportunities and connect with world-class companies on the platform trusted by top engineers and founders.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn btn-primary btn-lg shadow-lg shadow-blue-500/25">
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link to="/jobs" className="btn btn-outline btn-lg">
              Browse All Jobs
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-6">No credit card required • Free forever for job seekers</p>
        </div>
      </section>
    </>
  );
}
