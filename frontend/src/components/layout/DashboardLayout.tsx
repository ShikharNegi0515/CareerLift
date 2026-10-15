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
    <div className="flex min-h-screen bg-slate-50/60">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 bg-white border-r border-slate-200/80 sticky top-0 h-screen transition-all duration-300 z-40 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar brand */}
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2.5 text-slate-900 hover:text-blue-600 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm shadow-blue-500/20">
                <Briefcase size={18} />
              </div>
              <span className="font-extrabold text-lg tracking-tight">Career<span className="text-blue-600">Lift</span></span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors ${
              collapsed ? 'mx-auto' : ''
            }`}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* User info */}
        {!collapsed && user && (
          <div className="p-4 border-b border-slate-100 bg-slate-50/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-blue-500/20 flex-shrink-0">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-slate-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60 mt-0.5">
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  collapsed ? 'justify-center' : 'justify-start'
                } ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors ${
              collapsed ? 'justify-center' : 'justify-start'
            }`}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 h-16 flex items-center justify-between shadow-sm shadow-slate-900/5">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <h2 className="font-bold text-sm text-slate-800 tracking-tight">
              {roleLabel} Console
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1.5">
              ← View Site
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white z-50 flex flex-col border-r border-slate-200/80 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-slate-900" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Briefcase size={18} />
            </div>
            <span className="font-extrabold text-lg tracking-tight">Career<span className="text-blue-600">Lift</span></span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
