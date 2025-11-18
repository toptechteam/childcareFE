
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Heart, Sparkles } from "lucide-react";
import { format } from "date-fns";

import { Center, Template, TestimonialRequest } from "@/api/entities";
import RequestHistory from "../components/request/RequestHistory";

export default function Request() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    parent_name: "",
    parent_email: "",
    parent_phone: "",
    child_name: "",
    relationship: "",
    template_id: "",
  });
  const [customMessage, setCustomMessage] = useState("");

  const { data: center } = useQuery({
    queryKey: ['center'],
    queryFn: async () => {
      const centers = await Center.find();
      return centers[0];
    },
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: () => Template.find(),
  });

  const { data: requests = [] } = useQuery({
    queryKey: ['requests'],
    queryFn: () => TestimonialRequest.find({ sort: '-created_date' }),
  });

  const sendRequestMutation = useMutation({
    mutationFn: async (data) => {
      const uniqueLink = `${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;
      const selectedTemplate = templates.find(t => t.id === data.template_id);
      
      const requestData = {
        ...data,
        unique_link: uniqueLink,
        status: 'pending',
        sent_date: new Date().toISOString(),
        center_id: center?.id,
        message: customMessage || selectedTemplate?.default_message || ''
      };

      const createdRequest = await TestimonialRequest.create(requestData);

      if (selectedTemplate) {
        let emailBody = customMessage || selectedTemplate.email_body || '';
        emailBody = emailBody.replace(/\[Parent Name\]/g, data.parent_name || '');
        emailBody = emailBody.replace(/\[Child Name\]/g, data.child_name || '');
        emailBody = emailBody.replace(/\[Center Name\]/g, center?.center_name || 'Our Center');
        emailBody += `\n\nClick here to submit your testimonial: https://childcarestories.com.au${createPageUrl('Submit')}?link=${uniqueLink}`;

        // Send email using the API
        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: data.parent_email,
              subject: selectedTemplate.email_subject || 'Share Your Experience With Us',
              body: emailBody,
              from_name: center?.center_name || 'ChildcareStories'
            }),
          });
        } catch (error) {
          console.error('Failed to send email:', error);
          // Continue even if email fails
        }
      }

      return createdRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      setFormData({
        parent_name: "",
        parent_email: "",
        parent_phone: "",
        child_name: "",
        relationship: "",
        template_id: "",
      });
      setCustomMessage("");
    },
  });

  const selectedTemplate = templates.find(t => t.id === formData.template_id);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#000000] mb-2">
          Request Testimonials
        </h1>
        <p className="text-[#555555]">Send personalised requests to parents</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#000000]">
              <Heart className="w-5 h-5 text-[#8AE0F2]" />
              New Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendRequestMutation.mutate(formData);
              }}
              className="space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parent_name">Parent Name *</Label>
                  <Input
                    id="parent_name"
                    name="parent_name"
                    value={formData.parent_name}
                    onChange={(e) => setFormData({...formData, parent_name: e.target.value})}
                    placeholder="Sarah Johnson"
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="parent_email">Parent Email *</Label>
                  <Input
                    id="parent_email"
                    name="parent_email"
                    type="email"
                    value={formData.parent_email}
                    onChange={(e) => setFormData({...formData, parent_email: e.target.value})}
                    placeholder="sarah@example.com"
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="child_name">Child's Name *</Label>
                  <Input
                    id="child_name"
                    name="child_name"
                    value={formData.child_name}
                    onChange={(e) => setFormData({...formData, child_name: e.target.value})}
                    placeholder="Emma"
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Select
                    value={formData.relationship}
                    onValueChange={(value) => setFormData({...formData, relationship: value})}
                    required
                  >
                    <SelectTrigger className="mt-2" id="relationship">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mum">Mum</SelectItem>
                      <SelectItem value="Dad">Dad</SelectItem>
                      <SelectItem value="Grandparent">Grandparent</SelectItem>
                      <SelectItem value="Guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="parent_phone">Parent Phone (Optional)</Label>
                <Input
                  id="parent_phone"
                  name="parent_phone"
                  type="tel"
                  value={formData.parent_phone}
                  onChange={(e) => setFormData({...formData, parent_phone: e.target.value})}
                  placeholder="(02) 1234 5678"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="template_id">Select Template *</Label>
                <Select
                  value={formData.template_id}
                  onValueChange={(value) => setFormData({...formData, template_id: value})}
                  required
                >
                  <SelectTrigger className="mt-2" id="template_id">
                    <SelectValue placeholder="Choose a testimonial prompt" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <div className="bg-[#8AE0F2]/10 rounded-xl p-4 border border-[#8AE0F2]/20">
                  <p className="text-sm font-medium text-[#000000] mb-2">Email Preview:</p>
                  <p className="text-sm text-[#000000] mb-2 font-semibold">Subject: {selectedTemplate.email_subject}</p>
                  <p className="text-sm text-[#555555] whitespace-pre-line">
                    {selectedTemplate.email_body
                      .replace(/\[Parent Name\]/g, formData.parent_name || '[Parent Name]')
                      .replace(/\[Child Name\]/g, formData.child_name || '[Child Name]')
                      .replace(/\[Center Name\]/g, center?.center_name || '[Center Name]')}
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="custom_message">Customise Message (Optional)</Label>
                <Textarea
                  id="custom_message"
                  name="custom_message"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add a personal note..."
                  className="mt-2 h-24"
                />
              </div>

              <Button
                type="submit"
                disabled={sendRequestMutation.isPending}
                className="w-full bg-[#8AE0F2] hover:bg-[#7ACDE0] text-white"
              >
                {sendRequestMutation.isPending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <RequestHistory requests={requests} />
      </div>
    </div>
  );
}
