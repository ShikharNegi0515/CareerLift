import { useState, useEffect } from 'react';
import api from '@/api/client';
import {
  Mail,
  Send,
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Filter,
  UserCheck,
  UserX,
  Calendar,
  Layers,
  Eye,
  ExternalLink,
} from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  role: 'job_seeker' | 'employer' | 'all';
  status: 'subscribed' | 'unsubscribed';
  isRegisteredUser: boolean;
  createdAt: string;
}

interface Campaign {
  id: string;
  subject: string;
  targetAudience: 'job_seeker' | 'employer' | 'all';
  customHeadline: string | null;
  customMessage: string | null;
  sentCount: number;
  failureCount: number;
  triggerType: string;
  sentBy: string | null;
  sentAt: string;
}

interface NewsletterStats {
  totalSubscribers: number;
  jobSeekerSubscribers: number;
  employerSubscribers: number;
  unsubscribedCount: number;
  registeredUsersCount: number;
  registeredSeekers: number;
  registeredEmployers: number;
  totalCampaigns: number;
}

export default function AdminNewsletter() {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'previews' | 'subscribers' | 'history'>('previews');
  const [selectedPreview, setSelectedPreview] = useState<'job_seeker' | 'employer' | 'welcome' | 'welcome_employer'>('job_seeker');
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'job_seeker' | 'employer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'subscribed' | 'unsubscribed'>('all');

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Broadcast Form State
  const [formData, setFormData] = useState({
    targetAudience: 'all' as 'all' | 'job_seeker' | 'employer',
    subject: '',
    customHeadline: '',
    customMessage: '',
  });

  const fetchData = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const [statsRes, subsRes, campaignsRes] = await Promise.all([
        api.get('/newsletter/admin/stats'),
        api.get('/newsletter/admin/subscribers'),
        api.get('/newsletter/admin/campaigns'),
      ]);
      setStats(statsRes.data);
      setSubscribers(subsRes.data || []);
      setCampaigns(campaignsRes.data || []);
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to load newsletter dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    const targetDesc =
      formData.targetAudience === 'job_seeker'
        ? 'Job Seekers'
        : formData.targetAudience === 'employer'
        ? 'Employers'
        : 'All Subscribers (Job Seekers & Employers)';

    const confirmed = window.confirm(
      `Are you sure you want to broadcast this newsletter immediately to ${targetDesc}?`
    );
    if (!confirmed) return;

    setSending(true);
    try {
      const res = await api.post('/newsletter/admin/send', formData);
      setActionSuccess(
        `Newsletter dispatched successfully! Sent to ${res.data?.sentCount || 0} recipient(s).`
      );
      setFormData({
        targetAudience: 'all',
        subject: '',
        customHeadline: '',
        customMessage: '',
      });
      // Refresh stats & campaign history
      fetchData();
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to dispatch newsletter.');
    } finally {
      setSending(false);
    }
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch =
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.name && sub.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || sub.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-teal-50 text-[#00a7b5]">
              <Mail size={22} />
            </span>
            Newsletter &amp; Email Campaigns
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Dispatch role-tailored digests to job seekers &amp; employers, manage subscriber lists, and monitor campaign performance.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold shadow-xs disabled:opacity-50 transition-all self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5">
          <CheckCircle size={18} className="text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2.5">
          <AlertCircle size={18} className="text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Active Subscribers</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {stats?.totalSubscribers ?? '—'}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Public + Registered users</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#00a7b5] flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Seekers</p>
            <h3 className="text-2xl font-extrabold text-teal-600 mt-1">
              {stats?.jobSeekerSubscribers ?? '—'}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Receiving openings &amp; career tips</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#00a7b5] flex items-center justify-center">
            <Briefcase size={22} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employers / Recruiters</p>
            <h3 className="text-2xl font-extrabold text-blue-600 mt-1">
              {stats?.employerSubscribers ?? '—'}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Receiving candidate insights</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Dispatched</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {stats?.totalCampaigns ?? '—'}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Auto Weekly Cron Active</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('previews')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'previews'
              ? 'border-[#00a7b5] text-[#00a7b5]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Eye size={16} />
          <span>Live Template Previews</span>
        </button>
        <button
          onClick={() => setActiveTab('broadcast')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'broadcast'
              ? 'border-[#00a7b5] text-[#00a7b5]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send size={16} />
          <span>Send Newsletter</span>
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'subscribers'
              ? 'border-[#00a7b5] text-[#00a7b5]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users size={16} />
          <span>Subscribers ({subscribers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'history'
              ? 'border-[#00a7b5] text-[#00a7b5]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock size={16} />
          <span>Campaign History ({campaigns.length})</span>
        </button>
      </div>

      {/* Tab: Live Template Previews */}
      {activeTab === 'previews' && (
        <div className="space-y-4">
          {/* Format Selector Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
                Select Template:
              </span>
              <button
                onClick={() => setSelectedPreview('job_seeker')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedPreview === 'job_seeker'
                    ? 'bg-[#00a7b5] text-white shadow-md shadow-teal-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>🚀 Job Seeker Digest</span>
              </button>
              <button
                onClick={() => setSelectedPreview('employer')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedPreview === 'employer'
                    ? 'bg-[#00a7b5] text-white shadow-md shadow-teal-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>💼 Employer &amp; Hiring Digest</span>
              </button>
              <button
                onClick={() => setSelectedPreview('welcome')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedPreview === 'welcome'
                    ? 'bg-[#00a7b5] text-white shadow-md shadow-teal-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>🎉 Candidate Welcome Email</span>
              </button>
              <button
                onClick={() => setSelectedPreview('welcome_employer')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedPreview === 'welcome_employer'
                    ? 'bg-[#00a7b5] text-white shadow-md shadow-teal-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>🤝 Employer Welcome Email</span>
              </button>
            </div>

            <a
              href={`http://localhost:3000/api/newsletter/preview?template=${selectedPreview}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              <span>Open in New Tab</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Iframe Preview Container */}
          <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-2xl flex flex-col items-center">
            <div className="w-full max-w-[680px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              {/* Browser-like window header */}
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="font-mono text-[11px] text-slate-600 bg-white px-3 py-1 rounded-md border border-slate-200">
                  Inbox Preview &bull; {selectedPreview.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-[11px] font-bold text-teal-600">600px Responsive</span>
              </div>

              {/* Iframe */}
              <iframe
                title="Email Preview"
                src={`http://localhost:3000/api/newsletter/preview?template=${selectedPreview}`}
                className="w-full h-[780px] border-none bg-[#0b1120]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Broadcast */}
      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Sparkles size={18} className="text-[#00a7b5]" />
              <h2 className="text-base font-bold text-slate-900">Broadcast Campaign Composer</h2>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-5">
              {/* Target Audience */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Target Audience
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'all', label: 'All Subscribers', desc: 'Job seekers & employers' },
                    { id: 'job_seeker', label: 'Job Seekers Only', desc: 'Curated job openings' },
                    { id: 'employer', label: 'Employers Only', desc: 'Market insights & talent' },
                  ].map((aud) => (
                    <label
                      key={aud.id}
                      className={`p-3.5 rounded-xl border cursor-pointer flex flex-col transition-all ${
                        formData.targetAudience === aud.id
                          ? 'border-[#00a7b5] bg-teal-50/50 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="targetAudience"
                          value={aud.id}
                          checked={formData.targetAudience === aud.id}
                          onChange={(e) =>
                            setFormData({ ...formData, targetAudience: e.target.value as any })
                          }
                          className="accent-[#00a7b5]"
                        />
                        <span className="text-xs font-bold text-slate-900">{aud.label}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 pl-5">{aud.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Subject Line (Optional - Defaults if blank)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ⚡ Weekly Top Openings: High-Growth Engineering Roles"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#00a7b5]"
                />
              </div>

              {/* Custom Headline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Featured Headline Banner
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15+ Verified Roles Handpicked For You This Week"
                  value={formData.customHeadline}
                  onChange={(e) => setFormData({ ...formData, customHeadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#00a7b5]"
                />
              </div>

              {/* Custom Announcement Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Admin Note / Custom Announcement Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Include a personalized tip, platform announcement, or featured highlight for this week's broadcast..."
                  value={formData.customMessage}
                  onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#00a7b5]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Ready to send to {stats?.totalSubscribers ?? 0} subscriber(s).
                </span>
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00a7b5] hover:bg-[#00919e] text-white font-semibold text-sm transition-all shadow-md shadow-teal-500/20 disabled:opacity-50"
                >
                  {sending ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Sending Broadcast...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Dispatch Newsletter Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-[#00e1f4] text-xs font-semibold mb-3">
                <Clock size={13} />
                <span>Automated Cron Active</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Automated Weekly Dispatch</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                CareerLift runs a built-in automated weekly schedule that gathers new verified job listings and candidate stats, sending them automatically to subscribers every week.
              </p>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00a7b5]" />
                  <span>Job seekers automatically receive active published jobs.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00a7b5]" />
                  <span>Employers receive candidate dynamics and conversion tips.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00a7b5]" />
                  <span>One-click safe unsubscribe tokens are embedded in every mail.</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Layers size={16} className="text-[#00a7b5]" />
                <span>Audience Segmentation Matrix</span>
              </h4>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-100">
                  <span className="font-bold text-[#008b97] block mb-1">Job Seeker Edition</span>
                  <p className="text-slate-600 m-0">
                    Includes direct links to live job positions, salary brackets, hiring company badges, and quick-apply CTAs.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <span className="font-bold text-blue-800 block mb-1">Employer Edition</span>
                  <p className="text-slate-600 m-0">
                    Includes active candidate counts, trending high-demand technical skills, and recruiter posting incentives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Subscribers List */}
      {activeTab === 'subscribers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00a7b5] focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#00a7b5]"
              >
                <option value="all">All Roles</option>
                <option value="job_seeker">Job Seekers</option>
                <option value="employer">Employers</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#00a7b5]"
              >
                <option value="all">All Statuses</option>
                <option value="subscribed">Subscribed</option>
                <option value="unsubscribed">Unsubscribed</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Email &amp; Subscriber</th>
                  <th className="px-6 py-3.5">Target Audience Role</th>
                  <th className="px-6 py-3.5">Member Type</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No subscribers found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{sub.email}</div>
                        {sub.name && <div className="text-[11px] text-slate-400">{sub.name}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            sub.role === 'employer'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-teal-50 text-[#008b97] border border-teal-200'
                          }`}
                        >
                          {sub.role === 'employer' ? '💼 Employer' : '🚀 Job Seeker'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {sub.isRegisteredUser ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                            <UserCheck size={13} />
                            <span>Registered Member</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">Website Visitor</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            sub.status === 'subscribed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {sub.status === 'subscribed' ? 'Subscribed' : 'Unsubscribed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Campaign History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Sent Newsletter Broadcasts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Subject &amp; Headline</th>
                  <th className="px-6 py-3.5">Audience</th>
                  <th className="px-6 py-3.5">Recipients Delivered</th>
                  <th className="px-6 py-3.5">Triggered By</th>
                  <th className="px-6 py-3.5">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No broadcast campaigns sent yet. Use the "Send Newsletter" tab to dispatch your first email digest!
                    </td>
                  </tr>
                ) : (
                  campaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{camp.subject}</div>
                        {camp.customHeadline && (
                          <div className="text-[11px] text-slate-500 italic mt-0.5">
                            "{camp.customHeadline}"
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {camp.targetAudience.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-emerald-600 text-sm">{camp.sentCount} sent</span>
                        {camp.failureCount > 0 && (
                          <span className="text-rose-500 text-[11px] ml-2">({camp.failureCount} failed)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        <span className="font-medium">{camp.sentBy || 'Admin'}</span>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {camp.triggerType}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                        {new Date(camp.sentAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
