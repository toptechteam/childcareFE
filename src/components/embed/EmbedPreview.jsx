import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Video, Mic, MessageSquare } from "lucide-react";
import { PUBLIC_SITE_ORIGIN } from "@/config/urls";

export default function EmbedPreview({ testimonials, centre }) {
  const renderMedia = (testimonial) => {
    if (!testimonial.testimonial_type) return null;

    switch (testimonial.testimonial_type.toLowerCase()) {
      case 'video':
        return (
          <div className="mt-4 rounded-lg overflow-hidden">
            <video
              src={testimonial.file_url}
              controls
              className="w-full rounded-lg"

            />
          </div>
        );
      case 'audio':
        return (
          <div className="mt-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Mic className="w-5 h-5 text-[#8AE0F2]" />
              <audio
                src={testimonial.file_url}
                controls
                className="w-full"
              />
            </div>
          </div>
        );
      case 'text':
      default:
        return (
          <p className="text-[#555555] mt-4 line-clamp-4">
            {testimonial.content}
          </p>
        );
    }
  };

  const getMediaIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return <Video className="w-6 h-6 text-[#8AE0F2]" />;
      case 'audio':
        return <Mic className="w-6 h-6 text-[#8AE0F2]" />;
      default:
        return <MessageSquare className="w-6 h-6 text-[#8AE0F2]" />;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-xl">
      <CardHeader>
        <CardTitle className="text-[#000000]">Website Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 rounded-xl p-8">
          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: centre?.primary_color || '#8AE0F2' }}
          >
            Happy Families at {centre?.center_name}
          </h2>
          <p className="text-center text-[#555555] mb-8">
            See what parents are saying about us
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-[#555555]">
                No approved testimonials yet. Approve testimonials to see them here.
              </div>
            ) : (
              testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8AE0F2] to-[#7ACDE0] flex items-center justify-center text-white font-bold">
                      {testimonial.parent_name?.[0] || 'P'}
                    </div>
                    <div>
                      <p className="font-semibold text-[#000000]">
                        {testimonial.parent_name || 'Parent'}
                      </p>
                      {testimonial.child_name && (
                        <p className="text-sm text-[#555555]">
                          {testimonial.child_name}'s {testimonial.relationship || 'Parent'}
                        </p>
                      )}
                      {testimonial.rating > 0 && (
                        <div className="flex gap-1 mt-1">
                          {Array(5).fill(0).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {renderMedia(testimonial)}


                  <div className="flex justify-between items-center mt-4">
                    {/* {testimonial.testimonial_type === 'text' && testimonial.content && (
                      <p className="text-[#555555] mt-4 line-clamp-4">
                        {testimonial.content}
                      </p>
                    )} */}

                    {testimonial.created_date && (
                      <p className="text-xs text-gray-400 mt-3">
                        {new Date(testimonial.created_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                    {testimonial.testimonial_type && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#8AE0F2]/10 text-[#7ACDE0]">
                        {testimonial.testimonial_type.charAt(0).toUpperCase() + testimonial.testimonial_type.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#555555]">
              Powered by{' '}
              <a
                href={PUBLIC_SITE_ORIGIN}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#8AE0F2] hover:underline"
              >
                ChildcareStories.com.au
              </a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}