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

import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PAGES = {

    Dashboard: Dashboard,

    Setup: Setup,

    Request: Request,

    Testimonials: Testimonials,

    Templates: Templates,

    Embed: Embed,

    Settings: Settings,

    Submit: Submit,

    AdminDashboard: AdminDashboard,

    Home: Home,

    LandingPage: LandingPage,
    Login: Login,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// A wrapper that renders children only if user is authenticated
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    const { isAuthenticated, isLoading } = useAuth();

    // Show loading state while checking auth
    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    // If user is not authenticated and trying to access a protected route
    if (!isAuthenticated && !['/login', '/landing'].includes(location.pathname)) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
                isAuthenticated ? 
                    <Navigate to="/dashboard" replace /> : 
                    <Login />
            } />
            <Route path="/landing" element={<LandingPage />} />

            {/* Protected Routes */}
            <Route element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/setup" element={<Setup />} />
                            <Route path="/request" element={<Request />} />
                            <Route path="/testimonials" element={<Testimonials />} />
                            <Route path="/templates" element={<Templates />} />
                            <Route path="/embed" element={<Embed />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/submit" element={<Submit />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </Layout>
                </ProtectedRoute>
            }>
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
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