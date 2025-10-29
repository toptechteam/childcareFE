
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function EmbedPreview({ testimonials, centre }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-xl">
      <CardHeader>
        <CardTitle className="text-[#000000]">Website Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: centre?.primary_color || '#8AE0F2' }}>
            Happy Families at {centre?.center_name}
          </h2>
          <p className="text-center text-[#555555] mb-8">See what parents are saying about us</p>

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
                      {testimonial.parent_name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-[#000000]">{testimonial.parent_name}</p>
                      <p className="text-sm text-[#555555]">{testimonial.child_name}'s {testimonial.relationship}</p>
                    </div>
                  </div>

                  {testimonial.rating && (
                    <div className="flex gap-1 mb-3">
                      {Array(testimonial.rating).fill(0).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}

                  <p className="text-[#555555] line-clamp-4">
                    {testimonial.content || "Wonderful experience at this childcare centre!"}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#555555]">
              Powered by{' '}
              <a href="https://childcarestories.com.au" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#8AE0F2] hover:underline">
                ChildcareStories.com.au
              </a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
