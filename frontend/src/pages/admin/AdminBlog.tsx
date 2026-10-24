import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Loader2, X, AlertCircle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/api/client';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  status: 'draft' | 'published' | 'archived';
  authorName?: string;
  views: number;
  createdAt: string;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit/Create Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '', slug: '', category: '', excerpt: '', content: '',
    status: 'published' as 'draft' | 'published' | 'archived',
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete Modal
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<BlogPost[]>('/blog/admin/all');
      setPosts(res.data);
    } catch (err: any) {
      console.error('Failed to load blog posts', err);
      setError(err.response?.data?.message || 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const openCreateModal = () => {
    setEditingPost(null);
    setFormData({ title: '', slug: '', category: 'Career Advice', excerpt: '', content: '', status: 'published' });
    setModalOpen(true);
  };

  const openEditModal = (p: BlogPost) => {
    setEditingPost(p);
    setFormData({ title: p.title, slug: p.slug, category: p.category || '', excerpt: p.excerpt || '', content: p.content, status: p.status });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    setSubmitting(true);
    try {
      if (editingPost) {
        await api.put(`/blog/${editingPost.id}`, formData);
      } else {
        await api.post('/blog', formData);
      }
      setModalOpen(false);
      fetchPosts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save post');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.delete(`/blog/${deleteTarget.id}`);
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const statusColor: Record<string, string> = { published: '#198754', draft: '#6c757d', archived: '#6c757d' };
  const statusBg: Record<string, string> = { published: '#d1e7dd', draft: '#e9ecef', archived: '#e9ecef' };

  const blogMeta = deleteTarget
    ? [`By ${deleteTarget.authorName || 'Admin'}`, deleteTarget.category || 'General', `${deleteTarget.views || 0} views`, new Date(deleteTarget.createdAt).toLocaleDateString()].join('  ·  ')
    : '';

  return (
    <div className="animate-fadeIn">
      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete this article?"
        subtitle="The post will be permanently removed from the blog. This cannot be undone."
        itemName={deleteTarget?.title || ''}
        itemMeta={blogMeta}
        chips={['Blog article', 'SEO slug', 'View count data', 'Reader comments']}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => !isDeleting && setDeleteTarget(null)}
        accentFrom="#0ea5e9"
        accentTo="#6366f1"
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>
            Blog Content
          </h1>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
            Publish career articles, industry guides, and resources.
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} /> New Post
        </button>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc3545', background: '#f8d7da', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6c757d' }}>
            <Loader2 size={28} className="animate-spin" style={{ margin: '0 auto 0.75rem auto' }} />
            <p>Loading articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6c757d' }}>
            <BookOpen size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
            <p>No blog posts found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                  {['Title', 'Category', 'Status', 'Views', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Actions' ? 'right' : 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr
                    key={p.id}
                    style={{ borderBottom: '1px solid #f0f0f0', transition: 'background .12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafbff')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600, color: '#212529' }}>
                      <div>{p.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6c757d', fontWeight: 400 }}>
                        By {p.authorName || 'Admin'} · {new Date(p.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem', color: '#495057' }}>{p.category || 'General'}</td>
                    <td style={{ padding: '0.875rem 0.5rem' }}>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 600,
                        color: statusColor[p.status] || '#6c757d',
                        background: statusBg[p.status] || '#e9ecef',
                        padding: '3px 10px', borderRadius: 9999, textTransform: 'capitalize',
                      }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d' }}>{p.views || 0}</td>
                    <td style={{ padding: '0.875rem 0.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Link to={`/blog/${p.slug}`} target="_blank" className="btn btn-light btn-sm" title="View Public Article">
                          <Eye size={14} />
                        </Link>
                        <button onClick={() => openEditModal(p)} className="btn btn-light btn-sm" title="Edit">
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          title="Delete"
                          style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 32, height: 32, borderRadius: '0.5rem',
                            border: '1px solid #fcd1d1', background: '#fff5f5', color: '#dc3545',
                            cursor: 'pointer',
                            transition: 'background .15s, border-color .15s, transform .12s, box-shadow .15s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = '#dc3545';
                            e.currentTarget.style.borderColor = '#dc3545';
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 4px 14px rgba(220,53,69,0.35)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = '#fff5f5';
                            e.currentTarget.style.borderColor = '#fcd1d1';
                            e.currentTarget.style.color = '#dc3545';
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ── */}
      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1050, padding: '1rem',
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                {editingPost ? 'Edit Article' : 'New Article'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: '#495057' }}>Article Title *</label>
                <input type="text" required placeholder="e.g. Navigating Technical Interviews" className="form-control"
                  value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #ced4da' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: '#495057' }}>Category</label>
                  <input type="text" placeholder="e.g. Career Advice" className="form-control"
                    value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #ced4da' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: '#495057' }}>Status</label>
                  <select className="form-control" value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #ced4da' }}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: '#495057' }}>Short Excerpt</label>
                <textarea rows={2} placeholder="Brief preview of this article..." className="form-control"
                  value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #ced4da' }} />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: '#495057' }}>Article Content *</label>
                <textarea rows={7} required placeholder="Write your article body here..." className="form-control"
                  value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #ced4da' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-light">Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : editingPost ? 'Update' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
