
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Mic, FileText, Star, Check, Eye } from "lucide-react";
import { format } from "date-fns";

const typeIcons = {
  video: { icon: Video, color: "text-blue-500", bg: "bg-blue-50" },
  audio: { icon: Mic, color: "text-green-500", bg: "bg-green-50" },
  text: { icon: FileText, color: "text-orange-500", bg: "bg-orange-50" },
};

const statusColors = {
  new: "bg-orange-100 text-orange-800",
  approved: "bg-[#8AE0F2]/20 text-[#000000]",
  published: "bg-[#8AE0F2]/30 text-[#000000]",
};

export default function TestimonialCard({ testimonial, onStatusChange, onClick }) {
  const typeConfig = typeIcons[testimonial.testimonial_type];
  const TypeIcon = typeConfig.icon;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 ${typeConfig.bg} rounded-xl flex items-center justify-center`}>
            <TypeIcon className={`w-6 h-6 ${typeConfig.color}`} />
          </div>
          <Badge className={statusColors[testimonial.status]}>
            {testimonial.status}
          </Badge>
        </div>

        <h3 className="font-bold text-lg text-[#000000] mb-1">{testimonial.parent_name}</h3>
        <p className="text-sm text-[#555555] mb-3">{testimonial.child_name}'s {testimonial.relationship}</p>

        {testimonial.rating && (
          <div className="flex items-center gap-1 mb-3">
            {Array(testimonial.rating).fill(0).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        )}

        {testimonial.content && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">{testimonial.content}</p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <p className="text-xs text-[#555555]">
            {format(new Date(testimonial.created_date), 'MMM d, yyyy')}
          </p>

          {testimonial.status === 'new' && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(testimonial, 'approved');
              }}
              className="bg-[#8AE0F2] hover:bg-[#7ACDE0] text-white"
            >
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
          )}

          {testimonial.status !== 'new' && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="border-[#8AE0F2] text-[#8AE0F2] hover:bg-[#8AE0F2]/10"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
