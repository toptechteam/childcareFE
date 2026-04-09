import Layout from "./Layout.jsx";
import Dashboard from "./Dashboard";
import Setup from "./Setup";
import Request from "./Request";
import Testimonials from "./Testimonials";
import Templates from "./Templates";
import Embed from "./Embed";
import Settings from "./Settings";
import Submit from "./Submit";
import AdminDashboard from "./AdminDashboard";
import Home from "./Home";
import LandingPage from "./LandingPage";
import Login from "./Login";

import { BrowserRouter as Router, Route, Routes, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionCheck from '@/components/SubscriptionCheck';
import Subscription from "./Subscription.jsx";
import ResetPassword from "./ResetPassword.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import AccountCreated from "./AccountCreated.jsx";

const PAGES = {
  Dashboard,
  Setup,
  Request,
  Testimonials,
  Templates,
  Embed,
  Settings,
  Submit,
  AdminDashboard,
  Home,
  LandingPage,
  Login,
  AccountCreated,
};

function _getCurrentPage(url) {
  if (url === '/') return 'LandingPage';
  if (url.endsWith('/')) url = url.slice(0, -1);
  let urlLastPart = url.split('/').pop();
  if (urlLastPart.includes('?')) urlLastPart = urlLastPart.split('?')[0];

  const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
  return pageName || 'LandingPage';
}

// A wrapper that renders children only if user is authenticated
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const publicPaths = ['/login', '/', '/setup', '/submit', '/forgot-password', '/reset-password', '/account-created'];
  if (!isAuthenticated && !publicPaths.includes(location.pathname)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <SubscriptionCheck>
      {children}
    </SubscriptionCheck>
  );
}


// Admin route wrapper
function AdminRoute({ children }) {

  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Redirect if not authenticated or not an admin
  if (isAuthenticated && user && (user.role == 'admin' && user.is_superuser)) {
    return children
  }
}

// User route wrapper
function UserRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Redirect if not authenticated or is an admin
  if (isAuthenticated && user && (user.role === 'admin' && !user.is_superuser)) {
    return children
  }


}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Determine redirect target based on user role
  const getRedirectPath = () => {
    if (!isAuthenticated) return '/';
    if (user?.role === 'admin' && user?.is_superuser) return '/admin';
    return '/dashboard';
  };

  // Redirect authenticated users away from landing/login to their dashboard
  if (isAuthenticated && ['/', '/login'].includes(location.pathname)) {
    return <Navigate to={getRedirectPath()} replace />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="setup" element={<Setup />} />
      <Route path="submit" element={<Submit />} />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={getRedirectPath()} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/account-created" element={<AccountCreated />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout currentPageName={currentPage}>
              <Routes>
                {/* User Routes */}
                <Route element={<UserRoute><Outlet /></UserRoute>}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="request" element={<Request />} />
                  <Route path="testimonials" element={<Testimonials />} />
                  <Route path="templates" element={<Templates />} />
                  <Route path="embed" element={<Embed />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="subscription" element={<Subscription />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<AdminRoute><Outlet /></AdminRoute>}>
                  <Route path="admin" element={<AdminDashboard />} />
                  <Route path="admin/templates" element={<Templates />} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route path="*" element={<Navigate to={getRedirectPath()} replace />} />
      </Route>
    </Routes>
  );
}

export default function Pages() {
  return (
    <Router>
      <PagesContent />
    </Router>
  );
}
