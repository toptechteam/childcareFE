
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Mic, FileText, Star } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const typeIcons = {
  video: Video,
  audio: Mic,
  text: FileText,
};

const statusColors = {
  new: "bg-orange-100 text-orange-800",
  approved: "bg-[#8AE0F2]/20 text-[#000000]",
  published: "bg-[#8AE0F2]/30 text-[#000000]",
};

export default function RecentTestimonials({ testimonials }) {
  if (testimonials.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#000000]">Recent Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#555555] text-center py-8">No testimonials yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-[#000000]">Recent Testimonials</CardTitle>
          <Link to={createPageUrl("Testimonials")} className="text-sm text-[#8AE0F2] hover:text-[#7ACDE0] font-medium">
            View All →
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testimonials.map((testimonial) => {
            const Icon = typeIcons[testimonial.testimonial_type];
            return (
              <div key={testimonial.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Icon className="w-6 h-6 text-[#555555]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-[#000000] truncate">{testimonial.parent_name}</p>
                    <span className="text-[#555555]">•</span>
                    <p className="text-sm text-[#555555]">{testimonial.child_name}</p>
                  </div>
                  {testimonial.rating && (
                    <div className="flex items-center gap-1">
                      {Array(testimonial.rating).fill(0).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={statusColors[testimonial.status]}>
                    {testimonial.status}
                  </Badge>
                  <p className="text-xs text-[#555555] hidden md:block">
                    {format(new Date(testimonial.created_date), 'MMM d')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
