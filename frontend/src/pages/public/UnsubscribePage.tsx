import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Mail, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import api from '@/api/client';

export default function UnsubscribePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If token or email is already provided in URL, perform unsubscribe automatically
    if (token || emailParam) {
      handleUnsubscribeAuto();
    }
  }, []);

  const handleUnsubscribeAuto = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/newsletter/unsubscribe', {
        token: token || undefined,
        email: emailParam || undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not process unsubscribe request.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post('/newsletter/unsubscribe', {
        email: email.trim(),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to unsubscribe. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 text-[#00a7b5] flex items-center justify-center mx-auto mb-5 shadow-sm">
          <Mail size={30} />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Newsletter Preferences
        </h1>

        {loading ? (
          <div className="py-8 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#00a7b5] animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Updating your subscription preferences...</p>
          </div>
        ) : success ? (
          <div className="py-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mb-4">
              <CheckCircle2 size={16} />
              <span>Unsubscribed Successfully</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              You will no longer receive recurring newsletter digests from CareerLift. You can resubscribe anytime from our website footer.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#00a7b5] text-white text-sm font-semibold hover:bg-[#00929e] transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Return to Homepage</span>
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              We are sorry to see you go. Confirm your email address below to unsubscribe from CareerLift newsletter digests.
            </p>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 text-left">
                <XCircle size={16} className="shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleManualSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00a7b5] focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                Confirm Unsubscribe
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Link to="/" className="text-[#00a7b5] hover:underline font-medium">
                Keep receiving updates & return home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
