import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Video, Mic, FileText, Send, CheckCircle } from "lucide-react";

import { Template, Testimonial, TestimonialRequest } from "@/api/entities";
import { resolveMediaUrl } from "@/config/urls";
import { toast } from "@/components/ui/use-toast";
import SubmitHeader from "../components/submit/SubmitHeader";
import RecordingInterface from "../components/submit/RecordingInterface";
import TextReviewForm from "../components/submit/TextReviewForm";

function formatSubmitError(error) {
  if (error == null) return "Something went wrong. Please try again.";
  if (typeof error === "string") return error;
  if (error.message && typeof error.message === "string") return error.message;
  if (error.detail) return String(error.detail);
  if (error.error) return String(error.error);
  try {
    return JSON.stringify(error);
  } catch {
    return "Something went wrong. Please try again.";
  }
}

export default function Submit() {
  const [selectedType, setSelectedType] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [thankYouLogoFailed, setThankYouLogoFailed] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const linkId = urlParams.get('link');
  const queryClient = useQueryClient();
  const { data: request, isPending, isError } = useQuery({
    queryKey: ['request', linkId],
    queryFn: async () => {
      const requests = await TestimonialRequest.testimonialRequestDetail(linkId);
      return requests;
    },
    enabled: !!linkId,
  });

  // const { data: center } = useQuery({
  //   queryKey: ['center', request?.center],
  //   queryFn: async () => {
  //     if (!request?.center) return null;
  //     return Center.findById(request.center);
  //   },
  //   enabled: !!request?.center,
  // });

  const templateId = request?.testimonial?.template;

  const { data: template } = useQuery({
    queryKey: ['template', templateId],
    queryFn: async () => {
      if (!templateId) return null;
      const templates = await Template.find();
      return templates.find((t) => t.id === templateId) || null;
    },
    enabled: !!templateId,
  });

  const submitTestimonialMutation = useMutation({
    mutationFn: async (data) => {
      // Single API call: backend marks the testimonial completed (no second
      // "complete" request — that route is disabled and was failing after success).
      await Testimonial.submit({
        ...data,
        center_id: request?.center?.id,
        request_id: request?.testimonial?.id,
        testimonial_type: selectedType ?? data?.testimonial_type,
        status: "pending",
        created_at: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials-requests"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["center"] });
      setThankYouLogoFailed(false);
      setSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Could not submit",
        description: formatSubmitError(error),
        variant: "destructive",
      });
    },
  });

  if (!linkId) {
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

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if (isError || !request) {
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
          {resolveMediaUrl(request?.center?.logo_url) && !thankYouLogoFailed ? (
            <img
              src={resolveMediaUrl(request.center.logo_url)}
              alt={
                request?.center?.center_name?.trim()
                  ? `Logo for ${request.center.center_name.trim()}`
                  : "Childcare Stories"
              }
              className="h-16 mx-auto max-w-[200px] object-contain opacity-70"
              loading="lazy"
              decoding="async"
              onError={() => setThankYouLogoFailed(true)}
            />
          ) : null}
        </div>
      </div>
    );
  }

  if (!selectedType) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <SubmitHeader
            center={request?.center}
            parentName={request?.testimonial?.parent_name}
            childName={request?.testimonial?.child_name}
            promptText={template?.prompt_text}
          />

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <button
              onClick={() => setSelectedType('video')}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 shadow-sm"
              style={{
                borderColor: request?.center?.primary_color
                  ? `${request?.center?.primary_color}55`
                  : undefined,
              }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 bg-blue-50 ring-1 ring-blue-200/80"
                style={
                  request?.center?.primary_color
                    ? { backgroundColor: `${request.center.primary_color}24` }
                    : undefined
                }
              >
                <Video className="w-10 h-10 text-sky-500" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Record Video</h3>
              <p className="text-gray-600 text-sm">Share your story on camera</p>
            </button>

            <button
              onClick={() => setSelectedType('audio')}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-300 shadow-sm"
              style={{
                borderColor: request?.center?.secondary_color
                  ? `${request?.center?.secondary_color}55`
                  : undefined,
              }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 bg-green-50 ring-1 ring-green-200/80"
                style={
                  request?.center?.secondary_color
                    ? { backgroundColor: `${request.center.secondary_color}24` }
                    : undefined
                }
              >
                <Mic className="w-10 h-10 text-emerald-500" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Record Audio</h3>
              <p className="text-gray-600 text-sm">Voice your thoughts</p>
            </button>

            <button
              onClick={() => setSelectedType('text')}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-orange-200 hover:border-orange-400 hover:shadow-2xl transition-all duration-300 shadow-sm"
              style={{
                borderColor: request?.center?.primary_color
                  ? `${request?.center?.primary_color}55`
                  : undefined,
              }}
            >
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 ring-1 ring-orange-200/80">
                <FileText className="w-10 h-10 text-orange-500" strokeWidth={2} />
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
            center={request?.center}
            parentName={request?.testimonial?.parent_name}
            childName={request?.testimonial?.child_name}
            promptText={template?.prompt_text}
          />

          <TextReviewForm
            type={selectedType}
            request={request?.testimonial}
            center={request?.center}
            onSubmit={(data) => submitTestimonialMutation.mutateAsync(data)}
            onBack={() => setSelectedType(null)}
            isSubmitting={submitTestimonialMutation.isPending}
          />
        </div>
      </div>
    );
  }

  else {

    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <SubmitHeader
            center={request?.center}
            parentName={request.testimonial?.parent_name}
            childName={request.testimonial?.child_name}
            promptText={template?.prompt_text}
          />

          <RecordingInterface
            type={selectedType}
            request={request?.testimonial}
            center={request?.center}
            onSubmit={(data) => submitTestimonialMutation.mutateAsync(data)}
            onBack={() => setSelectedType(null)}
            isSubmitting={submitTestimonialMutation.isPending}
          />
        </div>
      </div>
    );
  }
}