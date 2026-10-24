import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, X, FolderTree, AlertCircle } from 'lucide-react';
import api from '@/api/client';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  jobCount?: number;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit/Create Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', icon: '' });
  const [submitting, setSubmitting] = useState(false);

  // Delete Modal
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<Category[]>('/categories');
      setCategories(res.data);
    } catch (err: any) {
      console.error('Failed to load categories', err);
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', icon: '' });
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, slug: cat.slug || '', description: cat.description || '', icon: cat.icon || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSubmitting(true);
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.delete(`/categories/${deleteTarget.id}`);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  const categoryMeta = deleteTarget
    ? [`Slug: ${deleteTarget.slug}`, `${deleteTarget.jobCount || 0} active jobs`].join('  ·  ')
    : '';

  return (
    <div className="animate-fadeIn">
      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete this category?"
        subtitle="All jobs in this category will lose their classification. This cannot be undone."
        itemName={deleteTarget?.name || ''}
        itemMeta={categoryMeta}
        chips={['Category entry', 'Classification on all linked jobs', 'Slug URL']}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => !isDeleting && setDeleteTarget(null)}
        accentFrom="#8b5cf6"
        accentTo="#6366f1"
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.25rem' }}>
            Job Categories
          </h1>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
            Manage the job taxonomy used for listings and candidate search.
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} /> Add Category
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
            <p>Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6c757d' }}>
            <FolderTree size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
            <p>No job categories defined yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                  {['Category Name', 'Slug', 'Active Jobs', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Actions' ? 'right' : 'left', padding: '0.75rem 0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr
                    key={c.id}
                    style={{ borderBottom: '1px solid #f0f0f0', transition: 'background .12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafbff')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600, color: '#212529' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{c.name}</span>
                        {c.description && (
                          <span style={{ fontSize: '0.75rem', color: '#6c757d', fontWeight: 400 }}>— {c.description}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d', fontFamily: 'monospace' }}>{c.slug}</td>
                    <td style={{ padding: '0.875rem 0.5rem', color: '#6c757d' }}>
                      <span className="badge badge-light" style={{ padding: '0.2rem 0.6rem', borderRadius: 999 }}>
                        {c.jobCount || 0} jobs
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 0.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => openEditModal(c)} className="btn btn-light btn-sm" title="Edit">
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(c)}
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
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: '#495057' }}>
                  Category Name *
                </label>
                <input
                  type="text" required placeholder="e.g. Frontend Development"
                  className="form-control" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #ced4da' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: '#495057' }}>
                  URL Slug (Optional)
                </label>
                <input
                  type="text" placeholder="e.g. frontend-development"
                  className="form-control" value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #ced4da' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: '#495057' }}>
                  Description (Optional)
                </label>
                <textarea
                  rows={3} placeholder="Short description of this category..."
                  className="form-control" value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #ced4da' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-light">Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
