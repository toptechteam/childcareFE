
import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  MessageSquare, 
  Send, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Video,
  Mic,
  FileText,
  ArrowRight
} from "lucide-react";

import StatsCard from "../components/dashboard/StatsCard";
import RecentTestimonials from "../components/dashboard/RecentTestimonials";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const { data: center } = useQuery({
    queryKey: ['center'],
    queryFn: async () => {
      const centers = await base44.entities.Center.list();
      return centers[0];
    },
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.list('-created_date'),
  });

  const { data: requests = [] } = useQuery({
    queryKey: ['requests'],
    queryFn: () => base44.entities.TestimonialRequest.list('-created_date'),
  });

  const newTestimonials = testimonials.filter(t => t.status === 'new').length;
  const approvedTestimonials = testimonials.filter(t => t.status === 'approved' || t.status === 'published').length;
  const completionRate = requests.length > 0 
    ? Math.round((requests.filter(r => r.completed).length / requests.length) * 100) 
    : 0;

  const videoCount = testimonials.filter(t => t.testimonial_type === 'video').length;
  const audioCount = testimonials.filter(t => t.testimonial_type === 'audio').length;
  const textCount = testimonials.filter(t => t.testimonial_type === 'text').length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50">
      {!center?.setup_completed && (
        <div className="mb-6 bg-gradient-to-r from-[#8AE0F2] to-[#7ACDE0] rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-xl font-bold mb-2">Welcome to Childcare Stories! 👋</h3>
          <p className="mb-4 opacity-90">Complete your centre setup to start collecting testimonials</p>
          <Link to={createPageUrl("Setup")}>
            <button className="bg-white text-[#8AE0F2] font-semibold px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2">
              Complete Setup <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#000000] mb-2">
            Dashboard
          </h1>
          <p className="text-[#555555]">
            {center?.center_name || 'Your Centre'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Testimonials"
          value={testimonials.length}
          icon={MessageSquare}
          color="blue"
          trend={`${newTestimonials} new`}
        />
        <StatsCard
          title="Requests Sent"
          value={requests.length}
          icon={Send}
          color="green"
          trend={`${completionRate}% completed`}
        />
        <StatsCard
          title="Approved"
          value={approvedTestimonials}
          icon={CheckCircle}
          color="purple"
        />
        <StatsCard
          title="Pending Review"
          value={newTestimonials}
          icon={Clock}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">By Type</h3>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">Video</span>
              </div>
              <span className="font-semibold text-gray-900">{videoCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Audio</span>
              </div>
              <span className="font-semibold text-gray-900">{audioCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-600">Text</span>
              </div>
              <span className="font-semibold text-gray-900">{textCount}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <QuickActions />
        </div>
      </div>

      <RecentTestimonials testimonials={testimonials.slice(0, 5)} />
    </div>
  );
}
