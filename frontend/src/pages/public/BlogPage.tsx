import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, Tag, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const allPosts = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  slug: `post-${i + 1}`,
  title: [
    '10 Resume Tips That Will Get You Hired in 2026',
    'How to Ace Your Technical Interview',
    'Remote Work: The Ultimate Guide for Job Seekers',
    'Negotiating Your Salary: Expert Strategies',
    'Building a Personal Brand on LinkedIn',
    'The Best Skills to Learn for Tech Jobs in 2026',
    'How to Write a Killer Cover Letter',
    'Career Change Guide: Switching Industries Successfully',
    'Interview Red Flags to Watch Out For',
    'How to Follow Up After a Job Interview',
    'Top Industries Hiring Right Now',
    'Working with a Recruiter: Dos and Don\'ts',
  ][i],
  excerpt: 'Discover proven strategies and expert insights to elevate your career and land the job of your dreams in today\'s competitive market.',
  category: ['Career Tips', 'Interview', 'Remote Work', 'Salary', 'Personal Brand', 'Skills'][i % 6],
  author: ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Park'][i % 4],
  publishedAt: new Date(2026, 9 - (i % 3), 4 - (i % 4)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  readTime: `${5 + (i % 5)} min read`,
}));

const PAGE_SIZE = 6;

export default function BlogPage() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const featured = allPosts[0];
  const rest = allPosts.slice(1);

  const filtered = rest.filter((p) => {
    if (keyword && !p.title.toLowerCase().includes(keyword.toLowerCase())) return false;
    if (category && p.category !== category) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Career Blog & Advice</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item active">Blog</li>
          </ol>
        </div>
      </div>

      <section className="section-py" style={{ background: '#f8f9fa' }}>
        <div className="container">
          {/* Featured post */}
          <div className="card" style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <span className="job-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: '1rem', display: 'inline-block' }}>
              Featured
            </span>
            <span className="job-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: '1rem', display: 'inline-block', marginLeft: '0.5rem' }}>
              {featured.category}
            </span>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.75rem', marginBottom: '1rem', color: '#fff' }}>
              {featured.title}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 600 }}>{featured.excerpt}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {featured.publishedAt}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {featured.readTime}</span>
              <span>By {featured.author}</span>
            </div>
            <Link to={`/blog/${featured.slug}`} className="btn" style={{ background: '#fff', color: '#0d6efd', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              Read Article <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', alignItems: 'start' }}>
            {/* Posts grid */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {paginated.map((post) => (
                  <div key={post.id} className="card" style={{ transition: 'all 0.3s', cursor: 'pointer' }}>
                    <span className="job-badge badge-primary" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
                      <Tag size={11} style={{ marginRight: 4 }} />{post.category}
                    </span>
                    <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#212529', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                      <Link to={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {post.title}
                      </Link>
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6c757d', lineHeight: 1.6, marginBottom: '1rem' }}>{post.excerpt}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#adb5bd', borderTop: '1px solid #f0f0f0', paddingTop: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {post.publishedAt}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {post.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  <button onClick={() => setPage(page - 1)} disabled={page === 1} className="btn btn-light btn-sm" style={{ padding: '0.5rem 0.75rem' }}><ChevronLeft size={16} /></button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-light'}`} style={{ minWidth: 36 }}>{p}</button>
                  ))}
                  <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="btn btn-light btn-sm" style={{ padding: '0.5rem 0.75rem' }}><ChevronRight size={16} /></button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="card-title">Search</h3>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                  <input className="form-control" placeholder="Search articles..." style={{ paddingLeft: 34 }} value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1); }} />
                </div>
              </div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="card-title">Categories</h3>
                {['Career Tips', 'Interview', 'Remote Work', 'Salary', 'Personal Brand', 'Skills'].map((cat) => (
                  <button key={cat} onClick={() => { setCategory(category === cat ? '' : cat); setPage(1); }}
                    style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 0', fontSize: '0.9rem', color: category === cat ? '#0d6efd' : '#495057', fontWeight: category === cat ? 600 : 400, borderBottom: '1px solid #f0f0f0' }}>
                    <span><Tag size={13} style={{ marginRight: 6, color: '#0d6efd' }} />{cat}</span>
                    <span className="job-badge badge-primary" style={{ fontSize: '0.75rem' }}>{allPosts.filter(p => p.category === cat).length}</span>
                  </button>
                ))}
              </div>
              <div className="card">
                <h3 className="card-title">Recent Posts</h3>
                {allPosts.slice(0, 4).map((post) => (
                  <div key={post.id} style={{ paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid #f0f0f0' }}>
                    <Link to={`/blog/${post.slug}`} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#212529', textDecoration: 'none', lineHeight: 1.4, display: 'block', marginBottom: '0.25rem' }}>
                      {post.title}
                    </Link>
                    <span style={{ fontSize: '0.75rem', color: '#adb5bd' }}>{post.publishedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
