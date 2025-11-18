import React, { useState } from "react";
import { usersAPI } from "@/utils/api";
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
import { Switch } from "@/components/ui/switch";

export default function AddPackageModal({ onClose, onSuccess, plan }) {
  const isEditMode = !!plan;
  
  const [formData, setFormData] = useState({
    name: plan?.name || "",
    description: plan?.description || "",
    testimonials_limit: plan?.testimonials_limit || "",
    branding_options: plan?.branding_options || false,
    price_monthly: plan?.price_monthly || "",  
    price_annual: plan?.price_annual || "",
    currency: plan?.currency || "usd",
    active: plan?.active ?? true,
    video_duration_limit: plan?.video_duration_limit || "",
  });

  const packageMutation = useMutation({
    mutationFn: (data) => 
      isEditMode 
        ? usersAPI.updatePackage(plan.id, {
          ...data,
          testimonials_limit: Number(data.testimonials_limit),
          price_monthly: Number(data.price_monthly),
          price_annual: Number(data.price_annual),
        })
        : usersAPI.createPackage({
          ...data,
          testimonials_limit: Number(data.testimonials_limit),
          price_monthly: Number(data.price_monthly),
          price_annual: Number(data.price_annual),
        }),
    onSuccess: () => {
      onSuccess();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    packageMutation.mutate(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="flex flex-col max-h-[90vh] p-0 gap-0">
        <DialogHeader className="flex-shrink-0 p-6 border-b">
          <DialogTitle className="text-[#000000]">
            {isEditMode ? 'Edit Package' : 'Add New Package'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="space-y-2 p-6 flex-1 overflow-y-auto">
            {/* Name */}
            <div>
              <Label htmlFor="name">Package Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Starter"
                required
                className="mt-2"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Starter plan"
                className="mt-2"
              />
            </div>
            {/* video discriotion */}
            <div>
              <Label htmlFor="video_duration_limit">Video Duration Limit</Label>
              <Input
                id="description"
                value={formData.video_duration_limit}
                onChange={(e) => setFormData({ ...formData, video_duration_limit: e.target.value })}
                placeholder="Video Duration"
                className="mt-2"
              />
            </div>

            {/* Testimonials Limit */}
            <div>
              <Label htmlFor="testimonials_limit">Testimonials Limit *</Label>
              <Input
                id="testimonials_limit"
                type="number"
                value={formData.testimonials_limit}
                onChange={(e) => setFormData({ ...formData, testimonials_limit: e.target.value })}
                placeholder="e.g., 200"
                required
                className="mt-2"
              />
            </div>

            {/* Branding Options */}
            {/* <div className="flex items-center justify-between mt-2">
              <Label htmlFor="branding_options">Branding Options</Label>
              <Switch
                id="branding_options"
                checked={formData.branding_options}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, branding_options: checked })
                }
              />
            </div> */}

            {/* Monthly Price */}
            <div>
              <Label htmlFor="price_monthly">Monthly Price</Label>
              <Input
                id="price_monthly"
                type="number"
                step="0.01"
                value={formData.price_monthly}
                onChange={(e) => setFormData({ ...formData, price_monthly: e.target.value })}
                placeholder="29.99"
                className="mt-2"
              />
            </div>

            {/* Annual Price */}
            <div>
              <Label htmlFor="price_annual">Annual Price</Label>
              <Input
                id="price_annual"
                type="number"
                step="0.01"
                value={formData.price_annual}
                onChange={(e) => setFormData({ ...formData, price_annual: e.target.value })}
                placeholder="299.99"
                className="mt-2"
              />
            </div>

            {/* Currency */}
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active */}
            <div className="flex items-center justify-between mt-2">
              <Label htmlFor="active">Active</Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-3 p-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="w-full" disabled={packageMutation.isLoading}>
              {packageMutation.isLoading ? 'Saving...' : isEditMode ? 'Update Package' : 'Create Package'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
