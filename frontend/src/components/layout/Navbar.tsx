import { useState, useRef, useEffect } from 'react';
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
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const dashboardPath =
    user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN
      ? '/admin'
      : user?.role === UserRole.EMPLOYER
      ? '/employer'
      : '/dashboard';

  return (
    <header className="sticky top-4 z-50 px-3 sm:px-4 w-full">
      <div className="navbar-pill pointer-events-auto flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6" style={{ overflow: 'visible' }}>
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="CareerLift Home">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-black shrink-0 transition-transform group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #00a7b5 0%, #008b97 100%)',
              boxShadow: '0 4px 14px rgba(0,167,181,0.35)',
            }}
          >
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
            Career<span className="text-[#00a7b5]">Lift</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>

          {/* Jobs dropdown — hover-triggered with invisible bridge to prevent flicker */}
          <div
            className="relative"
            onMouseEnter={() => setJobsOpen(true)}
            onMouseLeave={() => setJobsOpen(false)}
          >
            <button
              className="nav-link flex items-center gap-1 font-semibold"
              aria-haspopup="true"
              aria-expanded={jobsOpen}
            >
              Jobs
              <ChevronDown
                className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
                style={{ transform: jobsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {/* Invisible bridge: fills the gap between button bottom and panel top so the mouse doesn't leave the hover zone */}
            <div className="absolute top-full left-0 w-full h-3" />

            {jobsOpen && (
              <div
                className="absolute left-0 w-56 bg-white border border-slate-100 rounded-2xl py-2 z-[9999] animate-fadeIn"
                style={{
                  top: 'calc(100% + 10px)',
                  boxShadow: '0 20px 40px -8px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
                }}
              >
                <Link
                  to="/jobs"
                  className="block px-4 py-2.5 text-xs font-bold text-slate-800 hover:text-[#00a7b5] hover:bg-slate-50 transition-colors rounded-xl mx-1"
                  onClick={() => setJobsOpen(false)}
                >
                  Browse All Jobs
                </Link>
                <Link
                  to="/jobs?type=full_time"
                  className="block px-4 py-2 text-xs font-medium text-slate-600 hover:text-[#00a7b5] hover:bg-slate-50 transition-colors rounded-xl mx-1"
                  onClick={() => setJobsOpen(false)}
                >
                  Full Time Openings
                </Link>
                <Link
                  to="/jobs?workMode=remote"
                  className="block px-4 py-2 text-xs font-medium text-slate-600 hover:text-[#00a7b5] hover:bg-slate-50 transition-colors rounded-xl mx-1"
                  onClick={() => setJobsOpen(false)}
                >
                  Remote Opportunities
                </Link>
                <Link
                  to="/jobs?type=internship"
                  className="block px-4 py-2 text-xs font-medium text-slate-600 hover:text-[#00a7b5] hover:bg-slate-50 transition-colors rounded-xl mx-1"
                  onClick={() => setJobsOpen(false)}
                >
                  Internships &amp; Fellowships
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
            About Us
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Contact
          </NavLink>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {user.role === UserRole.EMPLOYER ? (
                <Link
                  to="/employer/jobs/new"
                  className="px-5 py-2 rounded-full bg-[#00a7b5] hover:bg-[#008b97] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Briefcase size={14} /> Post a Job
                </Link>
              ) : (
                <Link
                  to="/dashboard/applications"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e6f7f8] text-[#008b97] hover:bg-[#d5f3f5] text-xs font-bold border border-[#b2e9ec] transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00a7b5]" />
                  My Applications
                </Link>
              )}
              <NotificationBell />
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-bold text-slate-800"
                  aria-expanded={userMenuOpen}
                >
                  <div className="w-7 h-7 bg-[#00a7b5] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <span className="truncate max-w-[90px]">{user.firstName}</span>
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
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-[#00a7b5] hover:bg-slate-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>
                    {user.role === UserRole.EMPLOYER && (
                      <>
                        <Link
                          to="/employer/jobs/new"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-[#00a7b5] hover:bg-slate-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          Post a Job
                        </Link>
                        <Link
                          to="/employer/company"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-[#00a7b5] hover:bg-slate-50 transition-colors"
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
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-[#00a7b5] hover:bg-slate-50 transition-colors"
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
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#00a7b5] transition-colors">
                Sign In
              </Link>
              <Link
                to="/jobs"
                className="px-6 py-2.5 rounded-full bg-[#00a7b5] hover:bg-[#008b97] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-105"
              >
                Find Jobs
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-slate-700 hover:text-[#00a7b5]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="lg:hidden pointer-events-auto max-w-[1200px] mx-auto mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-5 shadow-2xl animate-fadeIn">
          <nav className="flex flex-col gap-1.5">
            <Link to="/" className="px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-800 hover:bg-slate-50 hover:text-[#00a7b5]" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/jobs" className="px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-800 hover:bg-slate-50 hover:text-[#00a7b5]" onClick={() => setMobileOpen(false)}>Browse Jobs</Link>
            <Link to="/companies" className="px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-800 hover:bg-slate-50 hover:text-[#00a7b5]" onClick={() => setMobileOpen(false)}>Companies</Link>
            <Link to="/blog" className="px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-800 hover:bg-slate-50 hover:text-[#00a7b5]" onClick={() => setMobileOpen(false)}>Blog & Advice</Link>
            <Link to="/about" className="px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-800 hover:bg-slate-50 hover:text-[#00a7b5]" onClick={() => setMobileOpen(false)}>About Us</Link>
            <Link to="/contact" className="px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-800 hover:bg-slate-50 hover:text-[#00a7b5]" onClick={() => setMobileOpen(false)}>Contact</Link>
            <hr className="my-2 border-slate-100" />
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="btn btn-primary w-full text-center py-2.5 font-bold" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { void logout(); setMobileOpen(false); }} className="btn btn-light w-full mt-2 py-2.5 font-semibold">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link to="/login" className="btn btn-outline w-full text-center py-2.5 font-bold" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/register" className="btn btn-primary w-full text-center py-2.5 font-bold" onClick={() => setMobileOpen(false)}>Get Started</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
