import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { UserRole } from '@/types';

// Layouts
import PublicLayout from '@/components/layout/PublicLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Public pages
import HomePage from '@/pages/public/HomePage';
import JobsPage from '@/pages/public/JobsPage';
import JobDetailPage from '@/pages/public/JobDetailPage';
import CompaniesPage from '@/pages/public/CompaniesPage';
import CompanyDetailPage from '@/pages/public/CompanyDetailPage';
import BlogPage from '@/pages/public/BlogPage';
import BlogPostPage from '@/pages/public/BlogPostPage';
import AboutPage from '@/pages/public/AboutPage';
import ContactPage from '@/pages/public/ContactPage';
import NotFoundPage from '@/pages/public/NotFoundPage';

// Auth pages
import LoginPage from '@/pages/public/LoginPage';
import RegisterPage from '@/pages/public/RegisterPage';
import ForgotPasswordPage from '@/pages/public/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/public/ResetPasswordPage';

// Job Seeker dashboard
import SeekerDashboard from '@/pages/seeker/SeekerDashboard';
import SeekerProfile from '@/pages/seeker/SeekerProfile';
import SeekerApplications from '@/pages/seeker/SeekerApplications';
import SeekerSavedJobs from '@/pages/seeker/SeekerSavedJobs';
import SeekerResumes from '@/pages/seeker/SeekerResumes';
import SeekerRecommendations from '@/pages/seeker/SeekerRecommendations';
import SeekerSettings from '@/pages/seeker/SeekerSettings';
import MessagesInterviewsPage from '@/pages/common/MessagesInterviewsPage';

// Employer dashboard
import EmployerDashboard from '@/pages/employer/EmployerDashboard';
import EmployerJobs from '@/pages/employer/EmployerJobs';
import EmployerJobForm from '@/pages/employer/EmployerJobForm';
import EmployerApplicants from '@/pages/employer/EmployerApplicants';
import EmployerCompanyProfile from '@/pages/employer/EmployerCompanyProfile';
import EmployerSettings from '@/pages/employer/EmployerSettings';
import EmployerOnboarding from '@/pages/employer/EmployerOnboarding';

// Admin dashboard
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminJobs from '@/pages/admin/AdminJobs';
import AdminCompanies from '@/pages/admin/AdminCompanies';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminBlog from '@/pages/admin/AdminBlog';
import AdminSupport from '@/pages/admin/AdminSupport';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminRecruiterInvites from '@/pages/admin/AdminRecruiterInvites';

// ================================
// ROUTE GUARDS
// ================================

function RequireAuth({ children, roles }: { children: React.ReactNode; roles?: UserRole[] }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="skeleton w-8 h-8 rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function GuestOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// ================================
// APP ROUTES
// ================================

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public and Auth routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:slug" element={<JobDetailPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:slug" element={<CompanyDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/login"
          element={<GuestOnly><LoginPage /></GuestOnly>}
        />
        <Route
          path="/register"
          element={<GuestOnly><RegisterPage /></GuestOnly>}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Job Seeker dashboard */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth roles={[UserRole.JOB_SEEKER]}>
            <DashboardLayout role="seeker" />
          </RequireAuth>
        }
      >
        <Route index element={<SeekerDashboard />} />
        <Route path="profile" element={<SeekerProfile />} />
        <Route path="applications" element={<SeekerApplications />} />
        <Route path="messages" element={<MessagesInterviewsPage />} />
        <Route path="saved-jobs" element={<SeekerSavedJobs />} />
        <Route path="resumes" element={<SeekerResumes />} />
        <Route path="recommendations" element={<SeekerRecommendations />} />
        <Route path="settings" element={<SeekerSettings />} />
      </Route>

      {/* Seeker route aliases */}
      <Route path="/seeker/resumes" element={<Navigate to="/dashboard/resumes" replace />} />
      <Route path="/seeker/profile" element={<Navigate to="/dashboard/profile" replace />} />
      <Route path="/seeker/applications" element={<Navigate to="/dashboard/applications" replace />} />
      <Route path="/seeker/saved-jobs" element={<Navigate to="/dashboard/saved-jobs" replace />} />
      <Route path="/seeker/*" element={<Navigate to="/dashboard" replace />} />

      {/* Employer Onboarding (Standalone) */}
      <Route
        path="/employer/onboarding"
        element={
          <RequireAuth roles={[UserRole.EMPLOYER]}>
            <EmployerOnboarding />
          </RequireAuth>
        }
      />

      {/* Employer dashboard */}
      <Route
        path="/employer"
        element={
          <RequireAuth roles={[UserRole.EMPLOYER]}>
            <DashboardLayout role="employer" />
          </RequireAuth>
        }
      >
        <Route index element={<EmployerDashboard />} />
        <Route path="jobs" element={<EmployerJobs />} />
        <Route path="jobs/new" element={<EmployerJobForm />} />
        <Route path="jobs/:id/edit" element={<EmployerJobForm />} />
        <Route path="jobs/:id/applicants" element={<EmployerApplicants />} />
        <Route path="applicants" element={<EmployerApplicants />} />
        <Route path="messages" element={<MessagesInterviewsPage />} />
        <Route path="company" element={<EmployerCompanyProfile />} />
        <Route path="settings" element={<EmployerSettings />} />
      </Route>

      {/* Admin dashboard */}
      <Route
        path="/admin"
        element={
          <RequireAuth roles={[UserRole.ADMIN]}>
            <DashboardLayout role="admin" />
          </RequireAuth>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="companies" element={<AdminCompanies />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="support" element={<AdminSupport />} />
        <Route path="recruiter-invites" element={<AdminRecruiterInvites />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
