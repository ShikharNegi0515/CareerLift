import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import {
  LayoutDashboard, User, FileText, Bookmark, Star, Settings, LogOut,
  Briefcase, Users, Building2, Tag, BookOpen, LifeBuoy, PlusCircle,
  Menu, MessageSquare,
} from 'lucide-react';
import NotificationBell from './NotificationBell';

const seekerNav = [
  { to: '/dashboard',                 label: 'Overview',              icon: LayoutDashboard, end: true },
  { to: '/dashboard/profile',         label: 'My Profile',            icon: User },
  { to: '/dashboard/applications',    label: 'Applications',          icon: FileText },
  { to: '/dashboard/messages',        label: 'Messages & Interviews', icon: MessageSquare },
  { to: '/dashboard/saved-jobs',      label: 'Saved Jobs',            icon: Bookmark },
  { to: '/dashboard/resumes',         label: 'Resumes',               icon: Star },
  { to: '/dashboard/recommendations', label: 'Recommendations',       icon: Star },
  { to: '/dashboard/settings',        label: 'Settings',              icon: Settings },
];
const employerNav = [
  { to: '/employer',              label: 'Overview',              icon: LayoutDashboard, end: true },
  { to: '/employer/jobs',         label: 'My Jobs',               icon: Briefcase },
  { to: '/employer/applicants',   label: 'Applicants',            icon: Users },
  { to: '/employer/messages',     label: 'Messages & Interviews', icon: MessageSquare },
  { to: '/employer/jobs/new',     label: 'Post a Job',            icon: PlusCircle },
  { to: '/employer/company',      label: 'Company Profile',       icon: Building2 },
  { to: '/employer/settings',     label: 'Settings',              icon: Settings },
];
const adminNav = [
  { to: '/admin',            label: 'Overview',   icon: LayoutDashboard, end: true },
  { to: '/admin/users',      label: 'Users',      icon: Users },
  { to: '/admin/jobs',       label: 'Jobs',       icon: Briefcase },
  { to: '/admin/companies',  label: 'Companies',  icon: Building2 },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/blog',       label: 'Blog',       icon: BookOpen },
  { to: '/admin/support',    label: 'Support',    icon: LifeBuoy },
];

interface Props { role: 'seeker' | 'employer' | 'admin'; }

function SidebarContent({
  navItems, user, roleLabel, roleColor, handleLogout, onNavigate,
}: {
  navItems: typeof seekerNav;
  user: any; roleLabel: string; roleColor: string;
  handleLogout: () => void; onNavigate?: () => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>

      {/* ── Logo ── */}
      <div style={{
        height: 64,
        padding: '0 20px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: '1px solid #f1f3f5',
        flexShrink: 0,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, boxShadow: '0 2px 6px rgba(59,130,246,0.3)',
        }}>
          <Briefcase size={15} color="#fff" strokeWidth={2.2} />
        </div>
        <Link to="/" onClick={onNavigate} style={{ textDecoration: 'none' }}>
          <span style={{
            fontWeight: 800, fontSize: '1.075rem',
            color: '#111827', letterSpacing: '-0.5px',
          }}>
            Career<span style={{ color: '#3b82f6' }}>Lift</span>
          </span>
        </Link>
      </div>

      {/* ── User profile strip ── */}
      {user && (
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f1f3f5',
          display: 'flex', alignItems: 'center', gap: 11,
          flexShrink: 0,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
            color: '#fff', fontWeight: 700, fontSize: '0.8125rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, letterSpacing: '-0.3px',
            boxShadow: '0 2px 6px rgba(59,130,246,0.25)',
          }}>
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{
              margin: 0, fontWeight: 600, fontSize: '0.875rem',
              color: '#111827', whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {user.firstName} {user.lastName}
            </p>
            <p style={{
              margin: 0, fontSize: '0.72rem', fontWeight: 500,
              color: roleColor, textTransform: 'uppercase',
              letterSpacing: '0.06em', marginTop: 2,
            }}>
              {roleLabel}
            </p>
          </div>
        </div>
      )}

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto' }}>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onNavigate}
            style={{ textDecoration: 'none', display: 'block' }}>
            {({ isActive }) => (
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  padding: '9px 12px', marginBottom: 2, borderRadius: 8,
                  background: isActive ? '#2563eb' : 'transparent',
                  color: isActive ? '#fff' : '#6b7280',
                  fontSize: '0.855rem', fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.12s ease',
                  userSelect: 'none',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#111827'; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}}
              >
                <Icon size={16} strokeWidth={isActive ? 2.2 : 1.75}
                  style={{ flexShrink: 0, color: isActive ? 'rgba(255,255,255,0.85)' : '#9ca3af' }} />
                <span style={{ letterSpacing: '-0.01em' }}>{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div style={{ padding: '8px 10px 14px', borderTop: '1px solid #f1f3f5', flexShrink: 0 }}>
        <button onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 11,
            width: '100%', padding: '9px 12px',
            background: 'transparent', border: 'none', borderRadius: 8,
            cursor: 'pointer', fontSize: '0.855rem', fontWeight: 400,
            color: '#ef4444', fontFamily: 'inherit', transition: 'background 0.12s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fff1f2'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={16} strokeWidth={1.75} style={{ flexShrink: 0, color: '#ef4444' }} />
          Log Out
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ role }: Props) {
  const { user, logout }   = useAuth();
  const navigate            = useNavigate();
  const [mobileOpen, setMo] = useState(false);

  const navItems  = role === 'seeker' ? seekerNav : role === 'employer' ? employerNav : adminNav;
  const roleLabel = role === 'seeker' ? 'Job Seeker' : role === 'employer' ? 'Employer' : 'Admin';
  const roleColor = role === 'admin' ? '#dc2626' : role === 'employer' ? '#16a34a' : '#2563eb';
  const logout_  = async () => { await logout(); navigate('/'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f9', fontFamily: "'Inter',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px}
      `}</style>

      {/* Overlay */}
      {mobileOpen && (
        <div style={{ position:'fixed',inset:0,zIndex:48,background:'rgba(15,23,42,0.4)',backdropFilter:'blur(2px)' }}
          onClick={() => setMo(false)} />
      )}

      {/* ═══ Desktop sidebar ═══ */}
      <aside className="hidden lg:flex" style={{
        width: 240, flexShrink: 0,
        position: 'sticky', top: 0, height: '100vh',
        flexDirection: 'column',
        background: '#fff',
        borderRight: '1.5px solid #edf0f3',
        zIndex: 40, overflowY: 'auto',
      }}>
        <SidebarContent navItems={navItems} user={user} roleLabel={roleLabel}
          roleColor={roleColor} handleLogout={logout_} />
      </aside>

      {/* ═══ Main ═══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 30,
          height: 64, background: '#fff',
          borderBottom: '1.5px solid #edf0f3',
          padding: '0 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          flexShrink: 0,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className="lg:hidden" onClick={() => setMo(true)}
              style={{ background:'none',border:'none',cursor:'pointer',color:'#6b7280',padding:4,borderRadius:6,display:'flex',alignItems:'center' }}>
              <Menu size={20} />
            </button>
            <div>
              <p style={{ margin:0,fontWeight:700,fontSize:'0.9375rem',color:'#111827',letterSpacing:'-0.2px' }}>
                {roleLabel} Console
              </p>
              <p style={{ margin:0,fontSize:'0.75rem',color:'#9ca3af',marginTop:1 }}>
                Welcome back, {user?.firstName} 👋
              </p>
            </div>
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <NotificationBell />
            <Link to="/"
              style={{ fontSize:'0.8125rem',fontWeight:500,color:'#6b7280',textDecoration:'none',
                padding:'5px 13px',borderRadius:7,border:'1.5px solid #e5e7eb',background:'#fff',
                transition:'all 0.12s',fontFamily:'inherit' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#3b82f6';e.currentTarget.style.color='#3b82f6';e.currentTarget.style.background='#eff6ff';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.color='#6b7280';e.currentTarget.style.background='#fff';}}>
              ← View Site
            </Link>
            <div style={{
              width:34,height:34,borderRadius:'50%',
              background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',
              color:'#fff',fontWeight:700,fontSize:'0.8rem',
              display:'flex',alignItems:'center',justifyContent:'center',
              flexShrink:0,cursor:'pointer',
              boxShadow:'0 2px 6px rgba(59,130,246,0.3)',
              letterSpacing:'-0.3px',
            }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex:1, padding:'28px 32px', maxWidth:1300, width:'100%', margin:'0 auto' }}>
          <Outlet />
        </main>
      </div>

      {/* ═══ Mobile sidebar ═══ */}
      <aside style={{
        position:'fixed',top:0,left:0,bottom:0,width:240,zIndex:49,
        background:'#fff',borderRight:'1.5px solid #edf0f3',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition:'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflowY:'auto', display:'flex', flexDirection:'column',
      }}>
        <SidebarContent navItems={navItems} user={user} roleLabel={roleLabel}
          roleColor={roleColor} handleLogout={logout_} onNavigate={() => setMo(false)} />
      </aside>
    </div>
  );
}
