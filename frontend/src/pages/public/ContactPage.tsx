import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ChevronDown, Loader2 } from 'lucide-react';
import api from '@/api/client';

const faqs = [
  { q: 'Is CareerLift free to use for job seekers?', a: 'Yes! CareerLift is completely free for job seekers. Create your account, upload your resume, and start applying to thousands of jobs at no cost.' },
  { q: 'How do I post a job as an employer?', a: 'Register as an employer, complete your company profile, and you can start posting jobs immediately. We offer various subscription plans to fit your hiring needs.' },
  { q: 'How does the job matching algorithm work?', a: 'Our AI analyzes your profile, skills, experience, and preferences to suggest the most relevant job opportunities. The more complete your profile, the better the matches.' },
  { q: 'Can I apply to jobs without creating an account?', a: 'You need to create a free account to apply for jobs. This allows employers to track applications and contact you about your candidacy.' },
  { q: 'How long does it take for employers to respond?', a: 'Response times vary by employer. Most employers respond within 5–7 business days. You\'ll receive email and in-app notifications for any updates on your applications.' },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.post('/support', form);
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item active">Contact</li>
          </ol>
        </div>
      </div>

      <section className="section-py">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
            {/* Contact form */}
            <div>
              <h2 className="section-title-left">Get in Touch</h2>
              <p style={{ color: '#6c757d', marginBottom: '2rem', lineHeight: 1.7 }}>
                Have a question or need help? We'd love to hear from you. Fill out the form and our team will get back to you within 24 hours.
              </p>

              {submitted ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <CheckCircle size={56} style={{ color: '#198754', margin: '0 auto 1rem' }} />
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, marginBottom: '0.5rem' }}>Message Sent!</h3>
                  <p style={{ color: '#6c757d' }}>We'll get back to you within 24 hours.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        className="form-control" required placeholder="John Doe"
                        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email" className="form-control" required placeholder="john@example.com"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <select
                      className="form-control" required
                      value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    >
                      <option value="">Select a topic</option>
                      <option>Job Search Help</option>
                      <option>Account Issues</option>
                      <option>Employer Inquiry</option>
                      <option>Technical Support</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea
                      className="form-control" rows={5} required placeholder="How can we help you?"
                      value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  {submitError && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dc3545', background: '#f8d7da', padding: '0.6rem 0.9rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>
                      {submitError}
                    </div>
                  )}
                  <button type="submit" disabled={submitting} className="btn btn-primary btn-lg">
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="card-title">Contact Information</h3>
                {[
                  { icon: MapPin, label: 'Address', value: '123 Career Street, Suite 400\nNew York, NY 10001, USA' },
                  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
                  { icon: Mail, label: 'Email', value: 'hello@careerlift.io' },
                  { icon: Clock, label: 'Business Hours', value: 'Mon – Fri: 9:00 AM – 6:00 PM EST' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', gap: 12, marginBottom: '1.25rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <item.icon size={18} style={{ color: '#0d6efd' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: 2 }}>{item.label}</p>
                      <p style={{ fontSize: '0.9rem', fontWeight: 500, color: '#212529', whiteSpace: 'pre-line' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)', color: '#fff', border: 'none' }}>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>For Employers</h3>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                  Looking to hire top talent? Our sales team can help you find the right plan for your company's needs.
                </p>
                <Link to="/register?role=employer" className="btn" style={{ background: '#fff', color: '#0d6efd', width: '100%', justifyContent: 'center' }}>
                  Get Started as Employer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-py" style={{ background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, i) => (
              <div key={i} style={{ marginBottom: '0.75rem', border: '1px solid #e9ecef', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#212529' }}>{faq.q}</span>
                  <ChevronDown size={18} style={{ color: '#6c757d', transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 1.25rem 1rem', color: '#495057', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
