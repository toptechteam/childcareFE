import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Video, Mic, FileText, Check, X, Download } from "lucide-react";
import { format } from "date-fns";

const typeIcons = {
  video: { icon: Video, label: "Video" },
  audio: { icon: Mic, label: "Audio" },
  text: { icon: FileText, label: "Text" },
};

const statusColors = {
  new: "bg-orange-100 text-orange-800",
  approved: "bg-green-100 text-green-800",
  published: "bg-blue-100 text-blue-800",
};

export default function TestimonialModal({ testimonial, onClose, onStatusChange }) {
  if (!testimonial) return null;

  const typeConfig = typeIcons[testimonial.testimonial_type];
  const TypeIcon = typeConfig.icon;

  return (
    <Dialog open={!!testimonial} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <TypeIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>{testimonial.parent_name}</span>
                <Badge className={statusColors[testimonial.status]}>
                  {testimonial.status}
                </Badge>
              </div>
              <p className="text-sm font-normal text-gray-500">
                {testimonial.child_name}'s {testimonial.relationship}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {testimonial.rating && (
            <div className="flex items-center gap-2">
              {Array(testimonial.rating).fill(0).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          )}

          {testimonial.testimonial_type === 'video' && testimonial.file_url && (
            <div className="rounded-xl overflow-hidden bg-gray-100">
              <video src={testimonial.file_url} controls className="w-full" />
            </div>
          )}

          {testimonial.testimonial_type === 'audio' && testimonial.file_url && (
            <div className="bg-gray-50 rounded-xl p-6">
              <audio src={testimonial.file_url} controls className="w-full" />
            </div>
          )}

          {testimonial.content && (
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 whitespace-pre-line">{testimonial.content}</p>
            </div>
          )}

          {testimonial.photo_url && (
            <div className="rounded-xl overflow-hidden">
              <img src={testimonial.photo_url} alt="Testimonial" className="w-full h-auto" />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Submitted {format(new Date(testimonial.created_date), 'MMM d, yyyy')}
            </p>

            <div className="flex gap-2">
              {testimonial.file_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={testimonial.file_url} download>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
              )}

              {testimonial.status === 'new' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onStatusChange(testimonial, 'new');
                      onClose();
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      onStatusChange(testimonial, 'approved');
                      onClose();
                    }}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}

              {testimonial.status === 'approved' && (
                <Button
                  size="sm"
                  onClick={() => {
                    onStatusChange(testimonial, 'published');
                    onClose();
                  }}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Publish to Website
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}