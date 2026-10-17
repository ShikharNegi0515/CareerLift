import { useState, useEffect } from 'react';
import api from '@/api/client';
import {
  Mail,
  Send,
  Building2,
  User,
  CheckCircle,
  Clock,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Search,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface RecruiterInvite {
  id: string;
  email: string;
  companyName: string | null;
  contactName: string | null;
  inviteToken: string;
  status: 'pending' | 'accepted' | 'revoked';
  customMessage: string | null;
  sentAt: string;
  acceptedAt: string | null;
  createdAt: string;
}

interface Stats {
  total: number;
  pending: number;
  accepted: number;
  conversionRate: number;
}

export default function AdminRecruiterInvites() {
  const [invites, setInvites] = useState<RecruiterInvite[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, accepted: 0, conversionRate: 0 });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted'>('all');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    contactName: '',
    customMessage: '',
  });

  const fetchInvites = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/recruiter-invites');
      setInvites(res.data.invites || []);
      setStats(res.data.stats || { total: 0, pending: 0, accepted: 0, conversionRate: 0 });
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to load recruiter invites.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) return;

    try {
      setSending(true);
      setActionError(null);
      setActionSuccess(null);

      await api.post('/admin/recruiter-invites', formData);
      setActionSuccess(`Invitation sent successfully to ${formData.email}!`);
      setFormData({
        email: '',
        companyName: '',
        contactName: '',
        customMessage: '',
      });
      await fetchInvites();
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to send recruiter invite.');
    } finally {
      setSending(false);
    }
  };

  const handleResend = async (id: string, email: string) => {
    try {
      setActionError(null);
      await api.post(`/admin/recruiter-invites/${id}/resend`);
      setActionSuccess(`Invitation resent to ${email}!`);
      await fetchInvites();
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to resend invite.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invite?')) return;
    try {
      setActionError(null);
      await api.delete(`/admin/recruiter-invites/${id}`);
      setActionSuccess('Invite deleted.');
      await fetchInvites();
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to delete invite.');
    }
  };

  const copyInviteLink = (token: string, email: string, company: string | null, id: string) => {
    const origin = window.location.origin;
    const url = `${origin}/register?role=employer&inviteToken=${token}${
      company ? `&company=${encodeURIComponent(company)}` : ''
    }&email=${encodeURIComponent(email)}`;

    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredInvites = invites.filter((inv) => {
    const matchesSearch =
      inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.companyName && inv.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.contactName && inv.contactName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Mail className="w-8 h-8 text-blue-600" />
            Recruiter Invitations & Outreach
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Send high-converting email invitations to target HRs and recruiters to join CareerLift and post jobs.
          </p>
        </div>
        <button
          onClick={fetchInvites}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 bg-white transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Status Alerts ── */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-800 text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-600 hover:text-rose-800 text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-xs font-medium text-slate-500">Total Invites Sent</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.pending}</div>
            <div className="text-xs font-medium text-slate-500">Pending Registration</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.accepted}</div>
            <div className="text-xs font-medium text-slate-500">Recruiters Joined</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.conversionRate}%</div>
            <div className="text-xs font-medium text-slate-500">Conversion Rate</div>
          </div>
        </div>
      </div>

      {/* ── Invite Form & Value Proposition ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Send New Recruiter Invite
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Deliver a personalized invitation email with a pre-configured registration link to fast-track employer onboarding.
          </p>

          <form onSubmit={handleSendInvite} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Recruiter Work Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. hr@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact / Recruiter Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Personal Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Saw your open Senior Backend role on LinkedIn!"
                  value={formData.customMessage}
                  onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all disabled:opacity-60"
              >
                <Send className={`w-4 h-4 ${sending ? 'animate-pulse' : ''}`} />
                {sending ? 'Sending Invite...' : 'Send Recruiter Invite'}
              </button>
            </div>
          </form>
        </div>

        {/* Info card */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-200 text-xs font-semibold rounded-full mb-3 border border-blue-400/20">
              Employer Growth Strategy
            </span>
            <h3 className="text-lg font-bold text-white mb-2">Automated Recruiter Onboarding</h3>
            <p className="text-xs text-blue-200 leading-relaxed">
              When recruiters click the invitation link in their email:
            </p>
            <ul className="text-xs text-blue-100/90 space-y-2 mt-3 pl-4 list-disc">
              <li>Their role defaults to <strong>Employer</strong> automatically.</li>
              <li>Company name and work email are pre-filled.</li>
              <li>Status transitions from <strong>Pending</strong> to <strong>Accepted</strong> in real-time.</li>
              <li>They get immediate access to post jobs and search talent.</li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-blue-200/80 flex items-center justify-between">
            <span>CareerLift B2B Outreach</span>
            <span className="font-semibold text-white">Active</span>
          </div>
        </div>
      </div>

      {/* ── Table & Search Section ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by email, company, contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Filter:</span>
            {(['all', 'pending', 'accepted'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === filter
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Recruiter / Target</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Sent Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading recruiter invites...
                  </td>
                </tr>
              ) : filteredInvites.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No recruiter invites found.
                  </td>
                </tr>
              ) : (
                filteredInvites.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-semibold text-slate-900">{inv.email}</div>
                      {inv.contactName && <div className="text-xs text-slate-400">{inv.contactName}</div>}
                    </td>

                    <td className="py-3.5 px-4">
                      {inv.companyName ? (
                        <span className="font-medium text-slate-700">{inv.companyName}</span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not specified</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {inv.status === 'accepted' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Joined
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {new Date(inv.sentAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Copy Invite Link */}
                        <button
                          onClick={() => copyInviteLink(inv.inviteToken, inv.email, inv.companyName, inv.id)}
                          title="Copy direct invite link"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                        >
                          {copiedId === inv.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {/* Resend */}
                        {inv.status === 'pending' && (
                          <button
                            onClick={() => handleResend(inv.id, inv.email)}
                            title="Resend invitation email"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-blue-600 transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(inv.id)}
                          title="Delete invite"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
