
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDays, format } from "date-fns";

export default function AddClientModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    center_name: "",
    contact_email: "",
    contact_phone: "",
    subscription_plan: "trial",
  });

  const createCenterMutation = useMutation({
    mutationFn: async (data) => {
      const trialEndDate = format(addDays(new Date(), 7), 'yyyy-MM-dd');
      const planLimits = {
        trial: { testimonials: 5, videoDuration: 120 },
        starter: { testimonials: 5, videoDuration: 120 },
        professional: { testimonials: 50, videoDuration: 300 },
        enterprise: { testimonials: 999999, videoDuration: 600 },
      };

      const limits = planLimits[data.subscription_plan];

      return base44.entities.Center.create({
        ...data,
        trial_end_date: data.subscription_plan === 'trial' ? trialEndDate : null,
        subscription_status: data.subscription_plan === 'trial' ? 'trial' : 'active',
        monthly_testimonials_limit: limits.testimonials,
        video_duration_limit: limits.videoDuration,
        testimonials_this_month: 0,
        billing_period_start: new Date().toISOString(),
        setup_completed: false,
      });
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createCenterMutation.mutate(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#000000]">Add New Client</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="center_name">Centre Name *</Label>
            <Input
              id="center_name"
              value={formData.center_name}
              onChange={(e) => setFormData({ ...formData, center_name: e.target.value })}
              placeholder="Little Sunshine Childcare"
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="contact_email">Contact Email *</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              placeholder="admin@littlesunshine.com"
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="contact_phone">Contact Phone</Label>
            <Input
              id="contact_phone"
              type="tel"
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              placeholder="(02) 1234 5678"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="subscription_plan">Initial Plan</Label>
            <Select
              value={formData.subscription_plan}
              onValueChange={(value) => setFormData({ ...formData, subscription_plan: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trial">7-Day Trial</SelectItem>
                <SelectItem value="starter">Starter - $29/month</SelectItem>
                <SelectItem value="professional">Professional - $79/month</SelectItem>
                <SelectItem value="enterprise">Enterprise - $149/month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCenterMutation.isPending}
              className="bg-[#8AE0F2] hover:bg-[#7ACDE0] text-white"
            >
              {createCenterMutation.isPending ? "Creating..." : "Create Client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
