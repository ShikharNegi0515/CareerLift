import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Clock, User, Tag, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import api from '@/api/client';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  authorName?: string;
  views: number;
  createdAt: string;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get<BlogPost>(`/blog/${slug}`);
        setPost(res.data);
      } catch (err: any) {
        setError(err.response?.status === 404 ? 'Article not found.' : 'Failed to load article.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const readTime = (post: BlogPost) => {
    const words = post.content.split(' ').length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 10, color: '#6c757d' }}>
        <Loader2 size={24} className="animate-spin" />
        <span>Loading article...</span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 12, color: '#6c757d' }}>
        <AlertCircle size={40} style={{ color: '#dc3545' }} />
        <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{error || 'Article not found.'}</p>
        <Link to="/blog" className="btn btn-light">← Back to Blog</Link>
      </div>
    );
  }

  const publishedDate = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const readTimeStr = readTime(post);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 style={{ fontSize: '1.75rem', lineHeight: 1.3 }}>{post.title}</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item"><Link to="/blog">Blog</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item active" style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</li>
          </ol>
        </div>
      </div>

      <section className="section-py" style={{ background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="card" style={{ padding: '2rem' }}>
            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              {post.category && (
                <span className="job-badge badge-primary">
                  <Tag size={12} style={{ marginRight: 4 }} />{post.category}
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: '#6c757d' }}>
                <Calendar size={14} /> {publishedDate}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: '#6c757d' }}>
                <Clock size={14} /> {readTimeStr}
              </span>
              {post.authorName && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: '#6c757d' }}>
                  <User size={14} /> {post.authorName}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#212529', lineHeight: 1.3, marginBottom: '1.5rem' }}>
              {post.title}
            </h1>

            {/* Content */}
            <div
              style={{ fontSize: '1rem', lineHeight: 1.8, color: '#343a40', whiteSpace: 'pre-wrap' }}
            >
              {post.content}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e9ecef', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {post.tags.map((tag, i) => (
                  <span key={i} className="job-badge badge-light">
                    <Tag size={11} style={{ marginRight: 4 }} />{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author box */}
            {post.authorName && (
              <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: '#f8f9fa', borderRadius: 10, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#0d6efd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>
                  {post.authorName[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#212529', fontSize: '0.95rem' }}>{post.authorName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Career Advisor &amp; Content Writer</div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e9ecef' }}>
              <Link to="/blog" className="btn btn-light" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ArrowLeft size={16} /> Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
