import { Link } from 'react-router-dom';
import { Search, Home, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', textAlign: 'center', padding: '2rem' }}>
      <div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '8rem', color: '#e9ecef', lineHeight: 1, marginBottom: '1rem' }}>
          404
        </div>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Search size={32} style={{ color: '#0d6efd' }} />
        </div>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#212529', marginBottom: '0.75rem' }}>
          Page Not Found
        </h1>
        <p style={{ color: '#6c757d', maxWidth: 400, margin: '0 auto 2rem', lineHeight: 1.7 }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Go Home
          </Link>
          <Link to="/jobs" className="btn btn-outline">
            Browse Jobs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
