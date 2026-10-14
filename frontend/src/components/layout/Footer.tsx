import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Phone, Mail, ArrowUpRight, Globe } from 'lucide-react';

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
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          {/* Brand column */}
          <div>
            <Link to="/" className="footer-brand flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 inline-flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </span>
              <span>CareerLift</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Your gateway to top opportunities. Connecting ambitious talent with industry-leading teams and high-growth startups.
            </p>
            <div className="space-y-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>123 Career Street, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>hello@careerlift.io</span>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Twitter">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.73C24 .774 23.205 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://careerlift.io" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Website">
                <Globe size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="space-y-1.5">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="footer-link">
                    <ArrowUpRight size={14} className="opacity-60 inline-block mr-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For job seekers */}
          <div>
            <h5 className="footer-heading">For Job Seekers</h5>
            <ul className="space-y-1.5">
              {footerLinks.forJobSeekers.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="footer-link">
                    <ArrowUpRight size={14} className="opacity-60 inline-block mr-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For employers */}
          <div>
            <h5 className="footer-heading">For Employers</h5>
            <ul className="space-y-1.5">
              {footerLinks.forEmployers.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="footer-link">
                    <ArrowUpRight size={14} className="opacity-60 inline-block mr-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
          <p style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} <strong className="text-white">CareerLift Inc.</strong> All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/about" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>&bull;</span>
            <Link to="/contact" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
