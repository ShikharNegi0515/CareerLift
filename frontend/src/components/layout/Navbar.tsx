import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { UserRole } from '@/types';
import {
  Briefcase, Menu, X, ChevronDown, User, LogOut,
  LayoutDashboard, Building2
} from 'lucide-react';

import NotificationBell from './NotificationBell';


export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [jobsOpen, setJobsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dashboardPath =
    user?.role === UserRole.ADMIN
      ? '/admin'
      : user?.role === UserRole.EMPLOYER
      ? '/employer'
      : '/dashboard';

  return (
    <nav className="navbar">
      <div className="container flex items-center justify-between h-[72px]">
        {/* Brand */}
        <Link to="/" className="navbar-brand flex items-center gap-2.5" aria-label="CareerLift Home">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 font-black">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">Career<span className="text-blue-600">Lift</span></span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1.5">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>

          <div className="relative" onMouseEnter={() => setJobsOpen(true)} onMouseLeave={() => setJobsOpen(false)}>
            <button className="nav-link flex items-center gap-1">
              Jobs <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {jobsOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-white shadow-xl shadow-slate-900/5 border border-slate-100 rounded-xl py-2 z-50 animate-fadeIn">
                <Link to="/jobs" className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                  Browse All Jobs
                </Link>
                <Link to="/jobs?type=full_time" className="block px-4 py-2 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                  Full Time Openings
                </Link>
                <Link to="/jobs?workMode=remote" className="block px-4 py-2 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                  Remote Opportunities
                </Link>
                <Link to="/jobs?type=internship" className="block px-4 py-2 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                  Internships & Fellowships
                </Link>
              </div>
            )}
          </div>

          <NavLink to="/companies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Companies
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Blog
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Contact
          </NavLink>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {user.role === UserRole.EMPLOYER ? (
                <Link
                  to="/employer/jobs/new"
                  className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
                >
                  <Briefcase size={14} /> Post a Job
                </Link>
              ) : (
                <Link
                  to="/dashboard/applications"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200/50 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  My Applications
                </Link>
              )}
              <NotificationBell />
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 py-1.5 px-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-800"
                  aria-expanded={userMenuOpen}
                >
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-blue-500/20">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <span className="text-xs font-bold text-slate-900">{user.firstName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white shadow-xl shadow-slate-900/10 border border-slate-100 rounded-2xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    <Link
                      to={dashboardPath}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>
                    {user.role === UserRole.EMPLOYER && (
                      <>
                        <Link
                          to="/employer/jobs/new"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          Post a Job
                        </Link>
                        <Link
                          to="/employer/company"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Building2 className="w-4 h-4 text-slate-400" />
                          My Company
                        </Link>
                      </>
                    )}
                    {user.role === UserRole.JOB_SEEKER && (
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile
                      </Link>
                    )}
                    <hr className="my-1.5 border-slate-100" />
                    <button
                      onClick={() => { void logout(); setUserMenuOpen(false); }}
                      className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link to="/login" className="btn btn-outline btn-sm font-semibold">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm font-semibold shadow-sm shadow-blue-500/20">
                Post a Job
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-gray-600"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 py-4 px-6 animate-fadeIn" style={{ background: 'var(--bg-surface, #fff)' }}>
          <nav className="flex flex-col gap-1">
            <Link to="/" className="nav-link py-2" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/jobs" className="nav-link py-2" onClick={() => setMobileOpen(false)}>Jobs</Link>
            <Link to="/companies" className="nav-link py-2" onClick={() => setMobileOpen(false)}>Companies</Link>
            <Link to="/blog" className="nav-link py-2" onClick={() => setMobileOpen(false)}>Blog</Link>
            <Link to="/about" className="nav-link py-2" onClick={() => setMobileOpen(false)}>About</Link>
            <Link to="/contact" className="nav-link py-2" onClick={() => setMobileOpen(false)}>Contact</Link>
            <hr className="my-2 border-gray-200" />
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="btn btn-primary w-full" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { void logout(); setMobileOpen(false); }} className="btn btn-light w-full mt-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-light w-full" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/register" className="btn btn-primary w-full mt-2" onClick={() => setMobileOpen(false)}>Get Started</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </nav>
  );
}
