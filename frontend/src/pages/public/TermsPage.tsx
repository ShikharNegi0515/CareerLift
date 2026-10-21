import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = 'October 21, 2026';

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Terms of Service</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item active">Terms of Service</li>
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
              <FileText size={28} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                User Agreement
              </span>
            </div>

            <p style={{ color: '#6c757d', fontSize: '0.9375rem', marginBottom: '2rem' }}>
              Effective Date: <strong>{lastUpdated}</strong>
            </p>

            <div style={{ color: '#2b2d42', lineHeight: 1.8, fontSize: '1rem' }}>
              <p>
                Welcome to <strong>CareerLift</strong>. By accessing or using our website, platform, and career services, 
                you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
              </p>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>1. Accounts and Registration</h3>
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                You are responsible for safeguarding the password and for all activities or actions under your account.
              </p>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>2. For Job Seekers</h3>
              <p>
                As a job seeker, you agree to:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
                <li>Provide honest, accurate resumes, qualifications, and employment history.</li>
                <li>Not impersonate any person or entity or misrepresent affiliation with a person or organization.</li>
                <li>Respect employer communication channels and interview schedules.</li>
              </ul>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>3. For Employers and Recruiters</h3>
              <p>
                Employers posting positions on CareerLift agree that:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
                <li>All job postings must represent genuine, active employment vacancies.</li>
                <li>Positions requiring upfront fees from candidates are strictly prohibited.</li>
                <li>Job postings must comply with all equal opportunity employment and anti-discrimination laws.</li>
              </ul>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>4. Intellectual Property</h3>
              <p>
                The Service and its original content, features, and functionality remain the exclusive property of CareerLift Inc. and its licensors. 
                Our trademarks may not be used in connection with any product or service without prior written consent.
              </p>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>5. Third-Party Advertisements & Links</h3>
              <p>
                Our Service may contain advertisements (including Google AdSense) and links to third-party web sites or services that are not owned 
                or controlled by CareerLift. We assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
              </p>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>6. Termination</h3>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
                including without limitation if you breach the Terms.
              </p>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>7. Contact Information</h3>
              <p>
                If you have any questions about these Terms, please contact us at <a href="mailto:legal@careerlift.io" style={{ color: '#0d6efd' }}>legal@careerlift.io</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
