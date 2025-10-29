import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Heart, Video, Mic, FileText, Send, CheckCircle } from "lucide-react";

import SubmitHeader from "../components/submit/SubmitHeader";
import RecordingInterface from "../components/submit/RecordingInterface";
import TextReviewForm from "../components/submit/TextReviewForm";

export default function Submit() {
  const [selectedType, setSelectedType] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const linkId = urlParams.get('link');

  const { data: request } = useQuery({
    queryKey: ['request', linkId],
    queryFn: async () => {
      const requests = await base44.entities.TestimonialRequest.list();
      return requests.find(r => r.unique_link === linkId);
    },
    enabled: !!linkId,
  });

  const { data: center } = useQuery({
    queryKey: ['center', request?.center_id],
    queryFn: async () => {
      if (!request?.center_id) return null;
      const centers = await base44.entities.Center.list();
      return centers.find(c => c.id === request.center_id);
    },
    enabled: !!request?.center_id,
  });

  const { data: template } = useQuery({
    queryKey: ['template', request?.template_id],
    queryFn: async () => {
      if (!request?.template_id) return null;
      const templates = await base44.entities.Template.list();
      return templates.find(t => t.id === request.template_id);
    },
    enabled: !!request?.template_id,
  });

  const submitTestimonialMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.Testimonial.create({
        ...data,
        center_id: request?.center_id,
        request_id: request?.id,
      });

      if (request) {
        await base44.entities.TestimonialRequest.update(request.id, {
          completed: true,
          completed_date: new Date().toISOString(),
        });
      }
    },
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  if (!linkId || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
          <p className="text-gray-600">This testimonial link is not valid or has expired.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your testimonial has been submitted successfully. We truly appreciate you taking the time to share your experience!
          </p>
          {center?.logo_url && (
            <img src={center.logo_url} alt="Center logo" className="h-16 mx-auto opacity-50" />
          )}
        </div>
      </div>
    );
  }

  if (!selectedType) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <SubmitHeader
            center={center}
            parentName={request.parent_name}
            childName={request.child_name}
            promptText={template?.prompt_text}
          />

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <button
              onClick={() => setSelectedType('video')}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/60 hover:border-blue-300 hover:shadow-2xl transition-all duration-300"
              style={{ borderColor: center?.primary_color ? `${center.primary_color}33` : undefined }}
            >
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: `${center?.primary_color || '#3B82F6'}15` }}
              >
                <Video className="w-10 h-10" style={{ color: center?.primary_color || '#3B82F6' }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Record Video</h3>
              <p className="text-gray-600 text-sm">Share your story on camera</p>
            </button>

            <button
              onClick={() => setSelectedType('audio')}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/60 hover:border-green-300 hover:shadow-2xl transition-all duration-300"
              style={{ borderColor: center?.secondary_color ? `${center.secondary_color}33` : undefined }}
            >
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: `${center?.secondary_color || '#10B981'}15` }}
              >
                <Mic className="w-10 h-10" style={{ color: center?.secondary_color || '#10B981' }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Record Audio</h3>
              <p className="text-gray-600 text-sm">Voice your thoughts</p>
            </button>

            <button
              onClick={() => setSelectedType('text')}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/60 hover:border-orange-300 hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Write Review</h3>
              <p className="text-gray-600 text-sm">Type your testimonial</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedType === 'text') {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <SubmitHeader
            center={center}
            parentName={request.parent_name}
            childName={request.child_name}
            promptText={template?.prompt_text}
          />

          <TextReviewForm
            request={request}
            onSubmit={(data) => submitTestimonialMutation.mutate(data)}
            onBack={() => setSelectedType(null)}
            isSubmitting={submitTestimonialMutation.isPending}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <SubmitHeader
          center={center}
          parentName={request.parent_name}
          childName={request.child_name}
          promptText={template?.prompt_text}
        />

        <RecordingInterface
          type={selectedType}
          request={request}
          center={center}
          onSubmit={(data) => submitTestimonialMutation.mutate(data)}
          onBack={() => setSelectedType(null)}
          isSubmitting={submitTestimonialMutation.isPending}
        />
      </div>
    </div>
  );
}