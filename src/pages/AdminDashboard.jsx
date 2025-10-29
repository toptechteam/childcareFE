
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Search,
  Plus,
  Crown,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

import AdminStatsCards from "../components/admin/AdminStatsCards";
import ClientsList from "../components/admin/ClientsList";
import AddClientModal from "../components/admin/AddClientModal";

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: centers = [] } = useQuery({
    queryKey: ['allCenters'],
    queryFn: () => base44.entities.Center.list('-created_date'),
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['allTestimonials'],
    queryFn: () => base44.entities.Testimonial.list(),
  });

  // Check if current user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[#8AE0F2]" />
            <h2 className="text-2xl font-bold mb-2 text-[#000000]">Admin Access Required</h2>
            <p className="text-[#555555]">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeSubscriptions = centers.filter(c => c.subscription_status === 'active').length;
  const trialCenters = centers.filter(c => c.subscription_status === 'trial').length;
  const monthlyRevenue = centers
    .filter(c => c.subscription_status === 'active')
    .reduce((sum, c) => {
      const prices = { starter: 29, professional: 79, enterprise: 149 };
      return sum + (prices[c.subscription_plan] || 0);
    }, 0);

  const filteredCenters = centers.filter(c =>
    c.center_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contact_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#000000] mb-2">
            Master Admin Dashboard
          </h1>
          <p className="text-[#555555]">Manage all childcare centre clients</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#8AE0F2] hover:bg-[#7ACDE0] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      <AdminStatsCards
        totalCenters={centers.length}
        activeSubscriptions={activeSubscriptions}
        trialCenters={trialCenters}
        monthlyRevenue={monthlyRevenue}
        totalTestimonials={testimonials.length}
      />

      <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-xl mt-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="flex items-center gap-2 text-[#000000]">
              <Building2 className="w-5 h-5" />
              All Clients
            </CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#555555]" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ClientsList centers={filteredCenters} />
        </CardContent>
      </Card>

      {showAddModal && (
        <AddClientModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['allCenters'] });
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
