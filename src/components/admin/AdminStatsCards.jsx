
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, DollarSign, MessageSquare } from "lucide-react";

export default function AdminStatsCards({
  totalCenters,
  activeSubscriptions,
  trialCenters,
  monthlyRevenue,
  totalTestimonials,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#555555] mb-2">Total Clients</p>
              <p className="text-3xl font-bold text-[#000000]">{totalCenters}</p>
              <p className="text-xs text-[#555555] mt-2">{trialCenters} on trial</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8AE0F2] to-[#7ACDE0] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#555555] mb-2">Active Subscriptions</p>
              <p className="text-3xl font-bold text-[#000000]">{activeSubscriptions}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8AE0F2] to-[#7ACDE0] flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#555555] mb-2">Monthly Revenue</p>
              <p className="text-3xl font-bold text-[#000000]">${monthlyRevenue}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8AE0F2] to-[#7ACDE0] flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#555555] mb-2">Total Testimonials</p>
              <p className="text-3xl font-bold text-[#000000]">{totalTestimonials}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8AE0F2] to-[#7ACDE0] flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
