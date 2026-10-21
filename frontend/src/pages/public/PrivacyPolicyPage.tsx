import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Cookie, Eye, RefreshCw, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = 'October 21, 2026';

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Privacy Policy</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item active">Privacy Policy</li>
          </ol>
        </div>
      </div>

      <section className="section-py">
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            background: 'var(--color-surface, #ffffff)',
            borderRadius: '12px',
            border: '1px solid var(--color-border, #e9ecef)',
            padding: '2.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#0d6efd' }}>
              <ShieldCheck size={28} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Legal & Compliance
              </span>
            </div>

            <p style={{ color: '#6c757d', fontSize: '0.9375rem', marginBottom: '2rem' }}>
              Last updated: <strong>{lastUpdated}</strong>
            </p>

            <div style={{ color: '#2b2d42', lineHeight: 1.8, fontSize: '1rem' }}>
              <p>
                At <strong>CareerLift</strong> (accessible at careerlift.io), your privacy is one of our primary concerns. 
                This Privacy Policy document outlines the types of information collected and recorded by CareerLift and how we use it.
              </p>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={20} className="text-primary" /> 1. Information We Collect
              </h3>
              <p>
                When you register for an account, apply for jobs, upload a resume, or contact us, we may collect:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
                <li>Personal identification details (Name, email address, phone number).</li>
                <li>Professional details (Resume/CV data, work history, education, skills, and portfolio links).</li>
                <li>Account credentials and security tokens.</li>
                <li>Log and usage data (IP addresses, browser type, referring pages, timestamps).</li>
              </ul>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cookie size={20} className="text-primary" /> 2. Cookies and Web Beacons
              </h3>
              <p>
                CareerLift uses cookies to store information about visitors' preferences, maintain authentication sessions, 
                and optimize user experience by customizing web page content based on browser type or other information.
              </p>

              <div style={{
                background: '#f8f9fa',
                borderLeft: '4px solid #0d6efd',
                padding: '1.25rem',
                borderRadius: '0 8px 8px 0',
                margin: '1.5rem 0'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#0d6efd' }}>
                  Google DoubleClick DART Cookie & Third-Party Advertising
                </h4>
                <p style={{ margin: 0, fontSize: '0.9375rem', color: '#495057' }}>
                  Google is one of our third-party vendors. It also uses cookies, known as DART cookies, to serve ads to our 
                  site visitors based upon their visit to CareerLift and other sites on the internet. Visitors may choose to decline 
                  the use of DART cookies by visiting the Google ad and content network Privacy Policy at:{' '}
                  <a 
                    href="https://policies.google.com/technologies/ads" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: '#0d6efd', wordBreak: 'break-all' }}
                  >
                    https://policies.google.com/technologies/ads
                  </a>
                </p>
              </div>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={20} className="text-primary" /> 3. Third-Party Advertising Partners
              </h3>
              <p>
                Some advertisers on our site may use cookies and web beacons. Our advertising partners include:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
                <li><strong>Google AdSense</strong> (Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>)</li>
              </ul>
              <p>
                These third-party ad servers or ad networks use technology in their respective advertisements and links that appear on CareerLift, 
                which are sent directly to users' browsers. They automatically receive your IP address when this occurs. 
                These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising 
                content that you see on websites that you visit. Note that CareerLift has no access to or control over these cookies used by third-party advertisers.
              </p>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                4. How We Use Your Information
              </h3>
              <p>
                We use the information we collect in various ways, including to:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
                <li>Provide, operate, and maintain our career platform and job search services.</li>
                <li>Improve, personalize, and expand platform features and AI recommendations.</li>
                <li>Understand and analyze how visitors interact with our job postings and articles.</li>
                <li>Facilitate direct communication between applicants and verified employers.</li>
                <li>Prevent fraudulent job listings and safeguard user accounts.</li>
              </ul>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                5. GDPR & CCPA Privacy Rights
              </h3>
              <p>
                Under data privacy regulations (including GDPR and CCPA), you have the right to request access to your personal data, 
                request correction of inaccurate data, request erasure of your account and resume data, or restrict data processing. 
                If you make a request, we will respond within one month.
              </p>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={20} className="text-primary" /> 6. Contact Us Regarding Privacy
              </h3>
              <p>
                If you have additional questions or require more information about our Privacy Policy, please contact our Data Protection Officer at:
              </p>
              <p style={{ fontWeight: 500 }}>
                Email: <a href="mailto:privacy@careerlift.io" style={{ color: '#0d6efd' }}>privacy@careerlift.io</a><br />
                Address: 100 Innovation Way, Suite 400, San Francisco, CA 94105
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
