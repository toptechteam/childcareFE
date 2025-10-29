import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import LandingPage from "./LandingPage";

export default function Home() {
  const navigate = useNavigate();
  
  // Check if we're on the app subdomain or main domain
  const isAppDomain = window.location.hostname.includes('app.');

  const { data: isAuthenticated, isLoading } = useQuery({
    queryKey: ['isAuthenticated'],
    queryFn: () => base44.auth.isAuthenticated(),
  });

  useEffect(() => {
    // If on app subdomain and authenticated, redirect to Dashboard
    if (isAppDomain && isAuthenticated && !isLoading) {
      navigate(createPageUrl("Dashboard"));
    }
  }, [isAuthenticated, isLoading, isAppDomain, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8AE0F2] mx-auto"></div>
          <p className="mt-4 text-[#555555]">Loading...</p>
        </div>
      </div>
    );
  }

  // If on app subdomain but not authenticated, show loading (will redirect to login)
  if (isAppDomain && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8AE0F2] mx-auto"></div>
          <p className="mt-4 text-[#555555]">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If on main domain (childcarestories.com.au), show the landing page
  if (!isAppDomain) {
    return <LandingPage />;
  }

  // Default: show loading
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8AE0F2] mx-auto"></div>
        <p className="mt-4 text-[#555555]">Loading...</p>
      </div>
    </div>
  );
}