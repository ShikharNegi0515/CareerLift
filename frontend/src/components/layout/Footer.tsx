import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Phone, Mail, ArrowUpRight, Globe, CheckCircle2, Send, Sparkles } from 'lucide-react';
import api from '@/api/client';

const footerLinks = {
  quickLinks: [
    { label: 'About Us', to: '/about' },
    { label: 'Browse Jobs', to: '/jobs' },
    { label: 'Companies', to: '/companies' },
    { label: 'Blog & Advice', to: '/blog' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'FAQs', to: '/contact#faq' },
  ],
  forJobSeekers: [
    { label: 'Create Account', to: '/register' },
    { label: 'Browse Jobs', to: '/jobs' },
    { label: 'Job Categories', to: '/jobs' },
    { label: 'Career Advice', to: '/blog' },
    { label: 'Resume Builder', to: '/dashboard/resumes' },
    { label: 'Saved Jobs', to: '/dashboard/saved-jobs' },
  ],
  forEmployers: [
    { label: 'Post a Job', to: '/register?role=employer' },
    { label: 'Employer Dashboard', to: '/employer' },
    { label: 'Browse Candidates', to: '/employer' },
    { label: 'Pricing Plans', to: '/about' },
    { label: 'Advertise With Us', to: '/contact' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'job_seeker' | 'employer'>('job_seeker');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const res = await api.post('/newsletter/subscribe', {
        email,
        role,
      });
      setStatus({
        type: 'success',
        message: res.data?.message || 'Thank you for subscribing! Check your inbox for updates.',
      });
      setEmail('');
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to subscribe. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* Newsletter Subscription Banner */}
        <div className="mb-14 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-[#00a7b5]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00a7b5]/20 text-[#00e1f4] text-xs font-semibold mb-2.5">
                <Sparkles size={13} />
                <span>Weekly Curated Digest</span>
              </div>
              <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Get handpicked jobs &amp; hiring insights
              </h4>
              <p className="text-slate-400 text-xs md:text-sm mt-1.5 leading-relaxed">
                Tailored for your role: high-paying tech openings for job seekers, top-tier talent metrics &amp; applicant insights for employers.
              </p>
            </div>

            <div className="lg:col-span-7">
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-300">I am a:</span>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs text-white">
                    <input
                      type="radio"
                      name="footer_newsletter_role"
                      value="job_seeker"
                      checked={role === 'job_seeker'}
                      onChange={() => setRole('job_seeker')}
                      className="accent-[#00a7b5]"
                    />
                    <span>Job Seeker (Openings &amp; Tips)</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs text-white">
                    <input
                      type="radio"
                      name="footer_newsletter_role"
                      value="employer"
                      checked={role === 'employer'}
                      onChange={() => setRole('employer')}
                      className="accent-[#00a7b5]"
                    />
                    <span>Employer (Hiring &amp; Candidates)</span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your work or personal email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 text-white placeholder-slate-500 rounded-xl border border-slate-700 focus:outline-none focus:border-[#00a7b5] text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00a7b5] hover:bg-[#00919e] text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-teal-500/20 disabled:opacity-50 shrink-0"
                  >
                    {loading ? (
                      'Subscribing...'
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <Send size={14} />
                      </>
                    )}
                  </button>
                </div>

                {status && (
                  <div
                    className={`text-xs flex items-center gap-1.5 pt-1 ${
                      status.type === 'success' ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'
                    }`}
                  >
                    {status.type === 'success' && <CheckCircle2 size={14} />}
                    <span>{status.message}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          {/* Brand column */}
          <div>
            <Link to="/" className="footer-brand flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-xl bg-[#00a7b5] text-white shadow-md shadow-teal-500/25 inline-flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </span>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Career<span className="text-[#00a7b5]">Lift</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
              Your gateway to top engineering &amp; product opportunities. Connecting ambitious talent with industry-leading teams worldwide.
            </p>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00a7b5] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin size={14} />
                </div>
                <span className="text-slate-700 font-medium text-xs">123 Career Street, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00a7b5] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone size={14} />
                </div>
                <span className="text-slate-900 font-semibold text-xs">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00a7b5] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Mail size={14} />
                </div>
                <span className="text-slate-900 font-semibold text-xs">hello@careerlift.io</span>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Twitter">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.73C24 .774 23.205 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://careerlift.io" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Website">
                <Globe size={15} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="footer-link">
                    <ArrowUpRight size={13} className="text-[#00a7b5] opacity-80 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For job seekers */}
          <div>
            <h5 className="footer-heading">For Job Seekers</h5>
            <ul className="space-y-2">
              {footerLinks.forJobSeekers.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="footer-link">
                    <ArrowUpRight size={13} className="text-[#00a7b5] opacity-80 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For employers */}
          <div>
            <h5 className="footer-heading">For Employers</h5>
            <ul className="space-y-2">
              {footerLinks.forEmployers.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="footer-link">
                    <ArrowUpRight size={13} className="text-[#00a7b5] opacity-80 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 m-0">
            &copy; {new Date().getFullYear()} <strong className="text-slate-900 font-bold">CareerLift Inc.</strong> All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
            <Link to="/privacy-policy" className="hover:text-[#00a7b5] transition-colors">Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-[#00a7b5] transition-colors">Terms of Service</Link>
            <span>&bull;</span>
            <Link to="/contact" className="hover:text-[#00a7b5] transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
