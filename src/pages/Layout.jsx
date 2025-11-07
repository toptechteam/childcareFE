import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  Settings,
  MessageSquare,
  Send,
  FileText,
  Code,
  Shield,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const isSubmitPage = currentPageName === "Submit";

  const { logout } = useAuth();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNavigationItems = [
    {
      title: "Admin Dashboard",
      url: createPageUrl("admin"),
      icon: Shield,
    },
  ];

  const navigationItems = [
    {
      title: "Dashboard",
      url: createPageUrl("Dashboard"),
      icon: LayoutDashboard,
    },
    {
      title: "Request Testimonials",
      url: createPageUrl("Request"),
      icon: Send,
    },
    {
      title: "All Testimonials",
      url: createPageUrl("Testimonials"),
      icon: MessageSquare,
    },
    {
      title: "Templates",
      url: createPageUrl("Templates"),
      icon: FileText,
    },
    {
      title: "Website Widget",
      url: createPageUrl("Embed"),
      icon: Code,
    },
    {
      title: "Settings",
      url: createPageUrl("Settings"),
      icon: Settings,
    },
  ];

  if (isSubmitPage) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  return (
    <SidebarProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600&family=Manrope:wght@400;500&display=swap');
        
        .logo-text {
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
        }
        
        .tagline-text {
          font-family: 'Manrope', sans-serif;
          font-weight: 400;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-white">
        <Sidebar className="border-r border-gray-100 bg-white">
          <SidebarHeader className="border-b border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ed9f71df888d487eb37e90/e38ecc91c_2.png"
                alt="Childcare Stories"
                className="h-16 w-auto"
              />
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            {isAdmin && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-[#555555] uppercase tracking-wider px-3 py-2">
                  Admin
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminNavigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`hover:bg-[#8AE0F2]/10 transition-all duration-200 rounded-xl mb-1 ${location.pathname === item.url ? 'bg-[#8AE0F2]/20 text-[#000000]' : 'text-[#555555]'
                            }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-4 h-4" />
                            <span className="font-medium text-sm">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
            {!isAdmin && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-[#555555] uppercase tracking-wider px-3 py-2">
                  Main Menu
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`hover:bg-[#8AE0F2]/10 transition-all duration-200 rounded-xl mb-1 ${location.pathname === item.url ? 'bg-[#8AE0F2]/20 text-[#000000]' : 'text-[#555555]'
                            }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-4 h-4" />
                            <span className="font-medium text-sm">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-100 p-4">
            {!isAdmin && (<div className="bg-gradient-to-r from-[#8AE0F2]/10 to-[#8AE0F2]/5 rounded-xl p-4 border border-[#8AE0F2]/20">
              <p className="text-xs font-semibold text-[#000000] mb-1">7-Day Free Trial</p>
              <p className="text-xs text-[#555555]">5 days remaining</p>
              <Link to={createPageUrl("Settings")}>
                <button className="mt-2 w-full bg-[#8AE0F2] text-white text-xs font-medium py-2 px-3 rounded-lg hover:bg-[#7ACDE0] transition-all duration-200">
                  Upgrade Now
                </button>
              </Link>
            </div>
            )}
            <div className="mt-3 text-center">
                <button 
                  onClick={handleLogout}
                  className="mb-2 w-full bg-[#8AE0F2] text-white text-xs font-medium py-2 px-3 rounded-lg hover:bg-[#7ACDE0] transition-all duration-200"
                >
                  Logout
                </button>
              <p className="tagline-text text-xs text-[#555555]">
                Powered by{' '}
                <a href="https://childcarestories.com.au" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#8AE0F2] hover:underline">
                  ChildcareStories.com.au
                </a>
              </p>
            </div>
          </SidebarFooter>

        </Sidebar>

        <main className="flex-1 flex flex-col bg-gray-50">
          <header className="bg-white border-b border-gray-100 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ed9f71df888d487eb37e90/e38ecc91c_2.png"
                alt="Childcare Stories"
                className="h-10 w-auto"
              />
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

