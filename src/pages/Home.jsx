import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import LandingPage from "./LandingPage";

export default function Home() {
  const navigate = useNavigate();
  
  // Check if we're on the app subdomain or main domain
  const isAppDomain = window.location.hostname.includes('app.');

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: User.getProfile,
    retry: false,
  });

  useEffect(() => {
    if (isLoading) return;
    
    if (user) {
      navigate(createPageUrl("Dashboard"));
    }
  }, [user, isLoading, navigate]);

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