import { Link } from 'react-router-dom';
import { Users, Target, Award, Heart, CheckCircle, ArrowRight } from 'lucide-react';

const team = [
  { name: 'Alex Morgan', role: 'CEO & Co-Founder', avatar: 'AM', bio: '15 years in HR tech and talent acquisition.' },
  { name: 'Jordan Lee', role: 'CTO & Co-Founder', avatar: 'JL', bio: 'Full-stack engineer with a passion for scalable systems.' },
  { name: 'Taylor Kim', role: 'Head of Product', avatar: 'TK', bio: 'Product leader focused on user-centered design.' },
  { name: 'Casey Rivera', role: 'Head of Growth', avatar: 'CR', bio: 'Data-driven growth strategist with 8 years experience.' },
];

const values = [
  { icon: Target, title: 'Transparency', desc: 'We believe in honest, clear communication between candidates and employers.' },
  { icon: Heart, title: 'People First', desc: 'Every decision we make centers around the humans on both sides of hiring.' },
  { icon: Award, title: 'Excellence', desc: 'We hold ourselves to the highest standards in everything we build and do.' },
  { icon: Users, title: 'Community', desc: 'We foster a supportive community of job seekers and forward-thinking employers.' },
];

const milestones = [
  { year: '2020', event: 'CareerLift founded with a mission to democratize job searching.' },
  { year: '2021', event: 'Reached 100,000 registered users and 5,000 company partners.' },
  { year: '2022', event: 'Launched AI-powered job recommendation engine.' },
  { year: '2023', event: 'Expanded to 50+ countries. Series B funding of $40M.' },
  { year: '2024', event: '1 million job seekers successfully placed. Launched Resume Builder.' },
  { year: '2026', event: 'Now serving 2.5M+ professionals and 120,000+ companies worldwide.' },
];

export default function AboutPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>About CareerLift</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item active">About</li>
          </ol>
        </div>
      </div>

      {/* Mission */}
      <section className="section-py">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h2 className="section-title-left">Our Mission</h2>
              <p style={{ color: '#495057', lineHeight: 1.8, marginBottom: '1.25rem', fontSize: '1.0625rem' }}>
                At CareerLift, we're on a mission to make finding meaningful work accessible to everyone. We believe that talent should transcend geography, background, and circumstance.
              </p>
              <p style={{ color: '#495057', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                We built CareerLift because we saw that the job search process was broken — opaque, slow, and demoralizing. We set out to change that with a platform that puts people first.
              </p>
              {['AI-powered job matching', 'Verified employer listings', 'Career coaching resources', 'Transparent hiring process'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
                  <CheckCircle size={16} style={{ color: '#198754', flexShrink: 0 }} />
                  <span style={{ color: '#495057' }}>{item}</span>
                </div>
              ))}
              <Link to="/register" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                Join CareerLift <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #e8f0fe 0%, #cfe2ff 100%)', borderRadius: 16, padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {[
                  { number: '2.5M+', label: 'Job Seekers' },
                  { number: '120K+', label: 'Companies' },
                  { number: '50K+', label: 'Active Jobs' },
                  { number: '94%', label: 'Success Rate' },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#0d6efd', display: 'block' }}>{stat.number}</span>
                    <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-py" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {values.map((v) => (
              <div key={v.title} className="card" style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <v.icon size={24} style={{ color: '#0d6efd' }} />
                </div>
                <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, marginBottom: '0.5rem' }}>{v.title}</h4>
                <p style={{ color: '#6c757d', fontSize: '0.9rem', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-py">
        <div className="container">
          <h2 className="section-title">Meet the Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {team.map((member) => (
              <div key={member.name} className="card" style={{ textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#0d6efd', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#fff', fontWeight: 800, fontSize: '1.25rem' }}>
                  {member.avatar}
                </div>
                <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{member.name}</h4>
                <p style={{ fontSize: '0.8125rem', color: '#0d6efd', fontWeight: 600, marginBottom: '0.5rem' }}>{member.role}</p>
                <p style={{ fontSize: '0.8125rem', color: '#6c757d', lineHeight: 1.5 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-py" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title">Our Journey</h2>
          <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', paddingLeft: '2rem' }}>
            <div style={{ position: 'absolute', left: '0.75rem', top: 0, bottom: 0, width: 2, background: '#e9ecef' }} />
            {milestones.map((m, i) => (
              <div key={m.year} style={{ position: 'relative', marginBottom: '2rem', paddingLeft: '1.5rem' }}>
                <div style={{ position: 'absolute', left: -8, top: 4, width: 16, height: 16, borderRadius: '50%', background: '#0d6efd', border: '3px solid #fff', boxShadow: '0 0 0 2px #0d6efd' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, color: '#0d6efd', fontSize: '0.875rem' }}>{m.year}</span>
                <p style={{ color: '#495057', marginTop: 4, lineHeight: 1.6 }}>{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0d6efd', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#fff', marginBottom: '0.75rem' }}>Ready to Lift Your Career?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '2rem' }}>Join millions of professionals who trust CareerLift.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-lg" style={{ background: '#fff', color: '#0d6efd', borderColor: '#fff' }}>Create Free Account</Link>
            <Link to="/jobs" className="btn btn-lg" style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}>Browse Jobs</Link>
          </div>
        </div>
      </section>
    </>
  );
}
