import { Link } from 'react-router-dom';
import { MapPin, Building2, DollarSign, Zap, RefreshCw, Bookmark, ArrowRight } from 'lucide-react';

const recommendations = [
  { id: '1', title: 'Full Stack Developer', company: 'CloudFirst', initial: 'CF', location: 'Remote', salary: '$110k–$140k', type: 'Full Time', mode: 'Remote', match: 95, reason: 'Matches your React & Node.js skills', posted: '1 day ago' },
  { id: '2', title: 'Senior Frontend Engineer', company: 'BuildIt', initial: 'BI', location: 'Seattle, WA', salary: '$120k–$155k', type: 'Full Time', mode: 'Hybrid', match: 91, reason: 'Aligns with your experience level', posted: '3 hours ago' },
  { id: '3', title: 'React Native Developer', company: 'AppForge', initial: 'AF', location: 'Austin, TX', salary: '$100k–$130k', type: 'Contract', mode: 'Remote', match: 87, reason: 'Based on your TypeScript expertise', posted: '2 days ago' },
  { id: '4', title: 'Lead UI Engineer', company: 'TechCorp', initial: 'TC', location: 'San Francisco, CA', salary: '$130k–$170k', type: 'Full Time', mode: 'Hybrid', match: 84, reason: 'Matches your preferred salary range', posted: '4 days ago' },
  { id: '5', title: 'Frontend Architect', company: 'DataWave', initial: 'DW', location: 'New York, NY', salary: '$140k–$180k', type: 'Full Time', mode: 'On-site', match: 80, reason: 'Matches your career growth aspirations', posted: '1 week ago' },
  { id: '6', title: 'JavaScript Developer', company: 'InnovateCo', initial: 'IC', location: 'Remote', salary: '$90k–$120k', type: 'Full Time', mode: 'Remote', match: 78, reason: 'Based on your job search history', posted: '5 days ago' },
];

const matchColor = (match: number) => match >= 90 ? '#198754' : match >= 80 ? '#0d6efd' : '#ffc107';

export default function SeekerRecommendations() {
  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>
            <Zap size={22} style={{ color: '#ffc107', marginRight: 6, verticalAlign: 'middle' }} />
            AI-Matched Jobs
          </h1>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Jobs curated by our AI based on your profile, skills, and preferences.</p>
        </div>
        <button className="btn btn-light btn-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Match score legend */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { range: '90–100%', label: 'Excellent match', color: '#198754' },
          { range: '80–89%', label: 'Great match', color: '#0d6efd' },
          { range: '70–79%', label: 'Good match', color: '#ffc107' },
        ].map((item) => (
          <div key={item.range} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.color }} />
            <span style={{ fontSize: '0.875rem', color: '#495057' }}><strong>{item.range}</strong> — {item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
        {recommendations.map((job) => (
          <div key={job.id} className="card" style={{ position: 'relative', borderTop: `3px solid ${matchColor(job.match)}` }}>
            {/* Match badge */}
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: matchColor(job.match), color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1rem', width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', lineHeight: 1 }}>
              <span>{job.match}%</span>
              <span style={{ fontSize: '0.5rem', fontWeight: 500 }}>match</span>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: '0.75rem', paddingRight: 60 }}>
              <div className="job-logo-placeholder" style={{ width: 48, height: 48, fontSize: '0.875rem', flexShrink: 0 }}>{job.initial}</div>
              <div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#212529', marginBottom: '0.25rem' }}>{job.title}</h3>
                <div style={{ fontSize: '0.8rem', color: '#6c757d', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Building2 size={11} />{job.company}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={11} />{job.location}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className="job-badge badge-primary">{job.type}</span>
              <span className="job-badge badge-success">{job.mode}</span>
              <span className="job-badge badge-secondary" style={{ display: 'flex', alignItems: 'center', gap: 3 }}><DollarSign size={10} />{job.salary}</span>
            </div>

            <div style={{ background: matchColor(job.match) + '15', borderRadius: 6, padding: '0.5rem 0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={13} style={{ color: matchColor(job.match), flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem', color: '#495057' }}>{job.reason}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                Apply Now <ArrowRight size={13} />
              </Link>
              <button className="btn btn-light btn-sm"><Bookmark size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/jobs" className="btn btn-outline">
          Browse All Jobs <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
