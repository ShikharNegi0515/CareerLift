import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Phone, Mail } from 'lucide-react';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
          {/* Brand column */}
          <div>
            <Link to="/" className="footer-brand flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              CareerLift
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Your gateway to top opportunities. Connecting talented professionals with companies that value their skills.
            </p>
            <div className="flex items-center gap-2">
              <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <MapPin className="inline w-4 h-4 mr-1 text-blue-400" />
                123 Career Street, New York, USA
              </p>
            </div>
            <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <Phone className="inline w-4 h-4 mr-1 text-blue-400" />
              +1 (555) 123-4567
            </p>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <Mail className="inline w-4 h-4 mr-1 text-blue-400" />
              hello@careerlift.io
            </p>
            <div className="flex gap-2">
              {/* Social icons removed to fix missing exports from lucide-react */}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="space-y-1">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-link">→ {link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For job seekers */}
          <div>
            <h5 className="footer-heading">For Job Seekers</h5>
            <ul className="space-y-1">
              {footerLinks.forJobSeekers.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-link">→ {link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For employers */}
          <div>
            <h5 className="footer-heading">For Employers</h5>
            <ul className="space-y-1">
              {footerLinks.forEmployers.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-link">→ {link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} <strong className="text-white">CareerLift</strong>. All rights reserved.{' '}
            <Link to="/about" className="hover:text-white underline">Privacy Policy</Link>
            {' · '}
            <Link to="/about" className="hover:text-white underline">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
