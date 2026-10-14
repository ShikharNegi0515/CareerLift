import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import {
  LayoutDashboard, User, FileText, Bookmark, Star, Settings, LogOut,
  Briefcase, Users, Building2, Tag, BookOpen, LifeBuoy, PlusCircle,
  ChevronLeft, ChevronRight, Menu, X, MessageSquare
} from 'lucide-react';
import NotificationBell from './NotificationBell';


const seekerNav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/profile', label: 'My Profile', icon: User },
  { to: '/dashboard/applications', label: 'Applications', icon: FileText },
  { to: '/dashboard/messages', label: 'Messages & Interviews', icon: MessageSquare },
  { to: '/dashboard/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
  { to: '/dashboard/resumes', label: 'Resumes', icon: Star },
  { to: '/dashboard/recommendations', label: 'Recommendations', icon: Star },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const employerNav = [
  { to: '/employer', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/employer/jobs', label: 'My Jobs', icon: Briefcase },
  { to: '/employer/applicants', label: 'Applicants', icon: Users },
  { to: '/employer/messages', label: 'Messages & Interviews', icon: MessageSquare },
  { to: '/employer/jobs/new', label: 'Post a Job', icon: PlusCircle },
  { to: '/employer/company', label: 'Company Profile', icon: Building2 },
  { to: '/employer/settings', label: 'Settings', icon: Settings },
];

const adminNav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/admin/companies', label: 'Companies', icon: Building2 },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/blog', label: 'Blog', icon: BookOpen },
  { to: '/admin/support', label: 'Support', icon: LifeBuoy },
];

interface Props {
  role: 'seeker' | 'employer' | 'admin';
}

export default function DashboardLayout({ role }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = role === 'seeker' ? seekerNav : role === 'employer' ? employerNav : adminNav;

  const roleLabel = role === 'seeker' ? 'Job Seeker' : role === 'employer' ? 'Employer' : 'Admin';
  const roleColor = role === 'admin' ? '#dc3545' : role === 'employer' ? '#198754' : '#0d6efd';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: collapsed ? 72 : 260,
          flexShrink: 0,
          background: '#fff',
          borderRight: '1px solid #e9ecef',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s ease',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 100,
        }}
        className={`hidden lg:flex`}
      >
        {/* Sidebar brand */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {!collapsed && (
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <Briefcase size={20} style={{ color: '#0d6efd' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.125rem', color: '#0d6efd' }}>
                CareerLift
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              marginLeft: collapsed ? 'auto' : 0,
              width: 28, height: 28,
              borderRadius: '50%',
              border: '1px solid #e9ecef',
              background: '#f8f9fa',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#6c757d', flexShrink: 0,
            }}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* User info */}
        {!collapsed && user && (
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e9ecef' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: roleColor, display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff', fontWeight: 700,
                fontSize: '0.875rem', flexShrink: 0,
              }}>
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.firstName} {user.lastName}
                </p>
                <span style={{
                  display: 'inline-block', padding: '1px 8px', borderRadius: 9999,
                  background: roleColor + '20', color: roleColor,
                  fontSize: '0.7rem', fontWeight: 600,
                }}>
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '0.75rem 0' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: collapsed ? '0.75rem' : '0.75rem 1.25rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: isActive ? '#0d6efd' : '#6c757d',
                background: isActive ? '#e8f0fe' : 'transparent',
                borderLeft: isActive ? '3px solid #0d6efd' : '3px solid transparent',
                transition: 'all 0.15s',
              })}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '0.75rem 0', borderTop: '1px solid #e9ecef' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: collapsed ? '0.75rem' : '0.75rem 1.25rem',
              justifyContent: collapsed ? 'center' : 'flex-start',
              width: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#dc3545',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'background 0.15s',
            }}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top header */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: '#fff', borderBottom: '1px solid #e9ecef',
          padding: '0 1.5rem',
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="lg:hidden" onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>
              <Menu size={22} />
            </button>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#212529' }}>
              {roleLabel} Dashboard
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <NotificationBell />
            <Link to="/" style={{ fontSize: '0.8125rem', color: '#0d6efd', textDecoration: 'none', fontWeight: 500 }}>
              ← Back to Site
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '1.5rem' }}>
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar */}
      <aside
        style={{
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          width: 260,
          background: '#fff',
          zIndex: 300,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid #e9ecef',
        }}
      >
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <Briefcase size={20} style={{ color: '#0d6efd' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.125rem', color: '#0d6efd' }}>CareerLift</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>
            <X size={20} />
          </button>
        </div>
        <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '0.75rem 1.25rem',
                textDecoration: 'none',
                fontSize: '0.9rem', fontWeight: 500,
                color: isActive ? '#0d6efd' : '#6c757d',
                background: isActive ? '#e8f0fe' : 'transparent',
                borderLeft: isActive ? '3px solid #0d6efd' : '3px solid transparent',
              })}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '0.75rem 0', borderTop: '1px solid #e9ecef' }}>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.75rem 1.25rem', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', fontSize: '0.9rem', fontWeight: 500 }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
}
