
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
  TrendingUp,
  Video,
  Mic,
  FileText,
  ArrowRight,
} from "lucide-react";

import { Center, TestimonialRequest } from "@/api/entities";
import StatsCard from "../components/dashboard/StatsCard";
import RecentTestimonials from "../components/dashboard/RecentTestimonials";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const { user } = useAuth();
  const centerId = user?.center_id;

  const { data: center } = useQuery({
    queryKey: ["center", centerId],
    queryFn: () => Center.findById(centerId),
    enabled: !!centerId,
  });

  const { data: completedTestimonials = [] } = useQuery({
    queryKey: ["testimonials-requests"],
    queryFn: () => TestimonialRequest.find({ ordering: "-created_date" }),
    enabled: !!centerId,
  });

  const total = center?.total_testimonials ?? 0;
  const completed = center?.completed_testimonials ?? 0;
  const pendingApproval = center?.pending_approval ?? 0;
  const approvedOrPublished = Math.max(0, completed - pendingApproval);

  const completionRate =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  const videoCount = center?.video_count ?? 0;
  const audioCount = center?.audio_count ?? 0;
  const textCount = center?.text_count ?? 0;

  const monthlyLimit = center?.monthly_testimonials_limit;
  const thisMonth = center?.testimonials_this_month ?? 0;
  const monthCapLabel =
    monthlyLimit === 0 || monthlyLimit == null
      ? "Unlimited"
      : String(monthlyLimit);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50">
      {!center?.setup_completed && (
        <div className="mb-6 bg-gradient-to-r from-[#8AE0F2] to-[#7ACDE0] rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-xl font-bold mb-2">Welcome to Childcare Stories! 👋</h3>
          <p className="mb-4 opacity-90">
            Complete your centre setup to start collecting testimonials
          </p>
          <Link to={createPageUrl("Setup")}>
            <button
              type="button"
              className="bg-white text-[#8AE0F2] font-semibold px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
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
            {center?.center_name || "Your Centre"}
          </p>
          {center && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
              {center.subscription_plan_name ? (
                <span>Plan: {center.subscription_plan_name}</span>
              ) : null}
              {center.is_trial && center.trial_days_remaining != null ? (
                <span>Trial: {center.trial_days_remaining} day(s) left</span>
              ) : null}
              {!center.is_trial &&
              center.subscription_days_remaining != null ? (
                <span>
                  Subscription renews in {center.subscription_days_remaining}{" "}
                  day(s)
                </span>
              ) : null}
              <span>
                This month: {thisMonth} / {monthCapLabel} testimonials
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total requests"
          value={total}
          icon={MessageSquare}
          color="blue"
          trend={`${pendingApproval} awaiting review`}
        />
        <StatsCard
          title="Completed responses"
          value={completed}
          icon={Send}
          color="green"
          trend={`${completionRate}% of requests`}
        />
        <StatsCard
          title="Approved / published"
          value={approvedOrPublished}
          icon={CheckCircle}
          color="purple"
        />
        <StatsCard
          title="Pending review"
          value={pendingApproval}
          icon={Clock}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">By type (completed)</h3>
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

      <RecentTestimonials testimonials={completedTestimonials.slice(0, 5)} />
    </div>
  );
}
