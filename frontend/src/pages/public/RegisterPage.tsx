import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import {
  Briefcase, Mail, Lock, Eye, EyeOff, User, AlertCircle, Loader2,
  Briefcase as BriefcaseIcon, Search, Building2, Globe, FileCheck2,
  ShieldCheck, MapPin, Users, Sparkles, CheckCircle2
} from 'lucide-react';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();

  const paramRole = searchParams.get('role');
  const paramEmail = searchParams.get('email') || '';
  const paramCompany = searchParams.get('company') || '';
  const inviteToken = searchParams.get('inviteToken') || '';

  const [role, setRole] = useState<UserRole.JOB_SEEKER | UserRole.EMPLOYER>(
    paramRole === 'employer' ? UserRole.EMPLOYER : UserRole.JOB_SEEKER
  );
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(paramEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Employer verification fields
  const [companyName, setCompanyName] = useState(paramCompany);
  const [jobTitle, setJobTitle] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [industry, setIndustry] = useState('Technology & Software');
  const [companySize, setCompanySize] = useState('11-50 employees');
  const [location, setLocation] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paramRole === 'employer') {
      setRole(UserRole.EMPLOYER);
    }
    if (paramEmail && !email) {
      setEmail(paramEmail);
    }
    if (paramCompany && !companyName) {
      setCompanyName(paramCompany);
    }
  }, [paramRole, paramEmail, paramCompany]);

  const isFreeEmail =
    role === UserRole.EMPLOYER &&
    /@(gmail|yahoo|hotmail|outlook|aol|icloud)\.com$/i.test(email.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (role === UserRole.EMPLOYER) {
      if (!companyName.trim()) {
        setError('Company name is required for employer registration.');
        return;
      }
      if (!jobTitle.trim()) {
        setError('Please specify your job title / role at the company.');
        return;
      }
      if (!companyWebsite.trim()) {
        setError('Official company website URL is required.');
        return;
      }
      if (!registrationNumber.trim()) {
        setError('Business registration number (CIN / Tax ID / Reg #) is required for employer validity.');
        return;
      }
      if (!location.trim()) {
        setError('Company headquarters or primary location is required.');
        return;
      }
    }

    setError('');
    setLoading(true);
    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        role,
        ...(role === UserRole.EMPLOYER && {
          companyName: companyName.trim(),
          jobTitle: jobTitle.trim(),
          companyWebsite: companyWebsite.trim(),
          registrationNumber: registrationNumber.trim(),
          industry,
          companySize,
          location: location.trim(),
        }),
      });
      navigate(role === UserRole.EMPLOYER ? '/employer' : '/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f0fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: role === UserRole.EMPLOYER ? 640 : 480, transition: 'max-width 0.3s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <Briefcase size={28} style={{ color: '#0d6efd' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.625rem', color: '#0d6efd' }}>CareerLift</span>
          </Link>
        </div>

        <div className="card" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.10)', padding: '2rem' }}>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#212529', marginBottom: '0.375rem', textAlign: 'center' }}>
            {role === UserRole.EMPLOYER ? 'Register as Verified Employer' : 'Create Your Account'}
          </h2>
          {inviteToken && (
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '1rem 1.25rem',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <Sparkles size={18} />
              </div>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
                <div style={{ fontWeight: 700, color: '#1e3a8a', marginBottom: '2px' }}>
                  Exclusive Partner Invitation Activated
                </div>
                <div style={{ color: '#1e40af' }}>
                  Welcome! You're claiming a direct recruiter invite{paramCompany ? ` for ${paramCompany}` : ''}. Finish setting up your account to post jobs and access top talent.
                </div>
              </div>
            </div>
          )}

          {/* Role selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.75rem' }}>
            {[
              { value: UserRole.JOB_SEEKER, label: 'Job Seeker', desc: 'Find jobs & advance your career', icon: Search },
              { value: UserRole.EMPLOYER, label: 'Employer', desc: 'Post jobs & hire verified talent', icon: BriefcaseIcon },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setRole(opt.value as any);
                  setError('');
                }}
                style={{
                  padding: '1rem',
                  border: `2px solid ${role === opt.value ? '#0d6efd' : '#e9ecef'}`,
                  borderRadius: 8,
                  background: role === opt.value ? '#e8f0fe' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <opt.icon size={22} style={{ color: role === opt.value ? '#0d6efd' : '#6c757d', marginBottom: 6 }} />
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: role === opt.value ? '#0d6efd' : '#212529', marginBottom: 2 }}>{opt.label}</p>
                <p style={{ fontSize: '0.75rem', color: '#6c757d' }}>{opt.desc}</p>
              </button>
            ))}
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#f8d7da', border: '1px solid #f5c2c7', borderRadius: 6, padding: '0.75rem', marginBottom: '1.25rem' }}>
              <AlertCircle size={16} style={{ color: '#842029', flexShrink: 0, marginTop: 1 }} />
              <span style={{ color: '#842029', fontSize: '0.875rem' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Account Owner Contact Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                  <input className="form-control" style={{ paddingLeft: 34 }} placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                  <input className="form-control" style={{ paddingLeft: 34 }} placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                {role === UserRole.EMPLOYER ? 'Work / Business Email' : 'Email Address'}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: 34 }}
                  placeholder={role === UserRole.EMPLOYER ? 'recruiter@company.com' : 'you@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              {isFreeEmail && (
                <p style={{ marginTop: '0.35rem', fontSize: '0.75rem', color: '#b02a37', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertCircle size={13} />
                  Tip: Official company email domains (@yourcompany.com) are verified much faster.
                </p>
              )}
            </div>

            {/* Employer Verification Section */}
            {role === UserRole.EMPLOYER && (
              <div
                style={{
                  background: '#f8fafd',
                  border: '1.5px solid #d0e2ff',
                  borderRadius: 10,
                  padding: '1.25rem',
                  marginTop: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.85rem' }}>
                  <ShieldCheck size={20} style={{ color: '#0d6efd' }} />
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0d6efd', margin: 0 }}>
                      Employer Verification & Business Boundaries
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#6c757d', margin: 0 }}>
                      Provide verifiable company information to prevent fraudulent postings
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Company Legal Name *</label>
                    <div style={{ position: 'relative' }}>
                      <Building2 size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                      <input
                        className="form-control"
                        style={{ paddingLeft: 34, fontSize: '0.875rem' }}
                        placeholder="e.g. Acme Technologies Inc."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Your Work Designation / Title *</label>
                    <div style={{ position: 'relative' }}>
                      <Briefcase size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                      <input
                        className="form-control"
                        style={{ paddingLeft: 34, fontSize: '0.875rem' }}
                        placeholder="e.g. Talent Acquisition Lead / HR"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Company Website *</label>
                    <div style={{ position: 'relative' }}>
                      <Globe size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                      <input
                        type="url"
                        className="form-control"
                        style={{ paddingLeft: 34, fontSize: '0.875rem' }}
                        placeholder="https://acmecorp.com"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>
                      Registration / Tax ID / CIN *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <FileCheck2 size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                      <input
                        className="form-control"
                        style={{ paddingLeft: 34, fontSize: '0.875rem' }}
                        placeholder="e.g. EIN 12-3456789 or CIN / Reg #"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Company Size *</label>
                    <div style={{ position: 'relative' }}>
                      <Users size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                      <select
                        className="form-control"
                        style={{ paddingLeft: 34, fontSize: '0.875rem' }}
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                      >
                        <option value="1-10 employees">1-10 employees (Startup)</option>
                        <option value="11-50 employees">11-50 employees (Small)</option>
                        <option value="51-200 employees">51-200 employees (Mid-Market)</option>
                        <option value="201-500 employees">201-500 employees (Upper Mid)</option>
                        <option value="500+ employees">500+ employees (Enterprise)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Industry *</label>
                    <select
                      className="form-control"
                      style={{ fontSize: '0.875rem' }}
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    >
                      <option value="Technology & Software">Technology & Software</option>
                      <option value="Financial Services & Fintech">Financial Services & Fintech</option>
                      <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                      <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                      <option value="Education & EdTech">Education & EdTech</option>
                      <option value="Manufacturing & Logistics">Manufacturing & Logistics</option>
                      <option value="Consulting & Agency">Consulting & Agency</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Headquarters Location *</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                    <input
                      className="form-control"
                      style={{ paddingLeft: 34, fontSize: '0.875rem' }}
                      placeholder="e.g. San Francisco, CA or London, UK"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '0.85rem',
                    padding: '0.55rem 0.75rem',
                    background: '#e7f1ff',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <ShieldCheck size={14} style={{ color: '#0d6efd', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.72rem', color: '#084298', lineHeight: 1.3 }}>
                    Verification Safeguard: All employer accounts are checked against public registries. Unverified accounts cannot post public jobs.
                  </span>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: 34, paddingRight: 36 }}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#adb5bd',
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${confirmPassword && password !== confirmPassword ? 'error' : ''}`}
                  style={{ paddingLeft: 34 }}
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="form-error">Passwords do not match</p>
              )}
            </div>

            <button
              id="register-submit"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />{' '}
                  {role === UserRole.EMPLOYER ? 'Verifying & Registering...' : 'Creating account...'}
                </>
              ) : role === UserRole.EMPLOYER ? (
                'Submit & Register Employer Account'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e9ecef' }}>
            <p style={{ color: '#6c757d', fontSize: '0.9375rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#0d6efd', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#adb5bd', fontSize: '0.8125rem', marginTop: '1.5rem' }}>
          By creating an account, you agree to our{' '}
          <Link to="/about" style={{ color: '#6c757d' }}>Terms of Service</Link> and{' '}
          <Link to="/about" style={{ color: '#6c757d' }}>Privacy Policy</Link>
        </p>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
