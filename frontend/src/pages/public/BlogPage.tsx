import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, Tag, ChevronLeft, ChevronRight, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import api from '@/api/client';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  authorName?: string;
  views: number;
  createdAt: string;
  status: string;
}

const PAGE_SIZE = 6;

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await api.get<BlogPost[]>('/blog');
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to load blog posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const readTime = (post: BlogPost) => {
    const words = (post.excerpt || '').split(' ').length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  };

  const featured = posts[0];
  const rest = posts.slice(1);

  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));

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
          {loading && (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#6c757d' }}>
              <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
              <p>Loading articles...</p>
            </div>
          )}
          {!loading && posts.length === 0 && (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#6c757d' }}>
              <BookOpen size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p>No blog posts published yet.</p>
            </div>
          )}
          {/* Featured post */}
          {!loading && featured && (
          <div className="card" style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <span className="job-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: '1rem', display: 'inline-block' }}>
              Featured
            </span>
            {featured.category && (
              <span className="job-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: '1rem', display: 'inline-block', marginLeft: '0.5rem' }}>
                {featured.category}
              </span>
            )}
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.75rem', marginBottom: '1rem', color: '#fff' }}>
              {featured.title}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 600 }}>{featured.excerpt || ''}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {new Date(featured.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {readTime(featured)}</span>
              {featured.authorName && <span>By {featured.authorName}</span>}
            </div>
            <Link to={`/blog/${featured.slug}`} className="btn" style={{ background: '#fff', color: '#0d6efd', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              Read Article <ArrowRight size={16} />
            </Link>
          </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', alignItems: 'start' }}>
            {/* Posts grid */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {paginated.map((post) => (
                  <div key={post.id} className="card" style={{ transition: 'all 0.3s', cursor: 'pointer' }}>
                    {post.category && (
                      <span className="job-badge badge-primary" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
                        <Tag size={11} style={{ marginRight: 4 }} />{post.category}
                      </span>
                    )}
                    <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#212529', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                      <Link to={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {post.title}
                      </Link>
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6c757d', lineHeight: 1.6, marginBottom: '1rem' }}>{post.excerpt || ''}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#adb5bd', borderTop: '1px solid #f0f0f0', paddingTop: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {readTime(post)}</span>
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
                {categories.length === 0 && <p style={{ fontSize: '0.85rem', color: '#adb5bd' }}>No categories yet.</p>}
                {categories.map((cat) => (
                  <button key={cat} onClick={() => { setCategory(category === cat ? '' : cat!); setPage(1); }}
                    style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 0', fontSize: '0.9rem', color: category === cat ? '#0d6efd' : '#495057', fontWeight: category === cat ? 600 : 400, borderBottom: '1px solid #f0f0f0' }}>
                    <span><Tag size={13} style={{ marginRight: 6, color: '#0d6efd' }} />{cat}</span>
                    <span className="job-badge badge-primary" style={{ fontSize: '0.75rem' }}>{posts.filter(p => p.category === cat).length}</span>
                  </button>
                ))}
              </div>
              <div className="card">
                <h3 className="card-title">Recent Posts</h3>
                {posts.slice(0, 4).map((post) => (
                  <div key={post.id} style={{ paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid #f0f0f0' }}>
                    <Link to={`/blog/${post.slug}`} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#212529', textDecoration: 'none', lineHeight: 1.4, display: 'block', marginBottom: '0.25rem' }}>
                      {post.title}
                    </Link>
                    <span style={{ fontSize: '0.75rem', color: '#adb5bd' }}>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
