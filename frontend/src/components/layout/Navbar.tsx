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
        <Link to="/" className="navbar-brand" aria-label="CareerLift Home">
          <Briefcase className="w-6 h-6 mr-2" />
          CareerLift
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>

          <div className="relative" onMouseEnter={() => setJobsOpen(true)} onMouseLeave={() => setJobsOpen(false)}>
            <button className="nav-link flex items-center gap-1">
              Jobs <ChevronDown className="w-4 h-4" />
            </button>
            {jobsOpen && (
              <div className="absolute top-full left-0 mt-0 w-48 bg-white shadow-lg border border-gray-100 rounded-b-lg py-2 z-50 animate-fadeIn">
                <Link to="/jobs" className="block px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-blue-50 transition-colors">
                  Browse Jobs
                </Link>
                <Link to="/jobs?type=full_time" className="block px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-blue-50 transition-colors">
                  Full Time
                </Link>
                <Link to="/jobs?workMode=remote" className="block px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-blue-50 transition-colors">
                  Remote Jobs
                </Link>
                <Link to="/jobs?type=internship" className="block px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-blue-50 transition-colors">
                  Internships
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
            <div className="flex items-center gap-2">
              <NotificationBell />
              <div className="relative">

              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
                aria-expanded={userMenuOpen}
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <span>{user.firstName}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white shadow-lg border border-gray-100 rounded-lg py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    to={dashboardPath}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-blue-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  {user.role === UserRole.EMPLOYER && (
                    <Link
                      to="/employer/company"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-blue-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Building2 className="w-4 h-4" />
                      My Company
                    </Link>
                  )}
                  {user.role === UserRole.JOB_SEEKER && (
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-blue-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => { void logout(); setUserMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-light btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Post A Job</Link>
            </>
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
        <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-6 animate-fadeIn">
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
