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
import { toast } from "../ui/use-toast";

export default function AddPackageModal({ onClose, onSuccessPackages = () => { }, plan }) {
  const isEditMode = !!plan;

  const initialFeatures = Array.isArray(plan?.features)
    ? plan.features
    : [];

  const initialUnlimitedTestimonials =
    plan?.testimonials_limit === 0 ||
    plan?.testimonials_limit === "0";

  const [formData, setFormData] = useState({
    name: plan?.name || "",
    description: plan?.description || "",
    testimonials_limit: initialUnlimitedTestimonials ? 0 : (plan?.testimonials_limit ?? ""),
    branding_options: plan?.branding_options || false,
    price_monthly: plan?.price_monthly || "",
    price_annual: plan?.price_annual || "",
    currency: plan?.currency || "usd",
    active: plan?.active ?? true,
    show_on_public: plan?.show_on_public ?? true,
    video_duration_limit: plan?.video_duration_limit || "",
    number_of_trail_days: plan?.number_of_trail_days || "",
    features: initialFeatures,
  });

  const [unlimitedTestimonials, setUnlimitedTestimonials] = useState(
    initialUnlimitedTestimonials
  );

  const [featuresText, setFeaturesText] = useState(
    initialFeatures.join("\n")
  );

  const packageMutation = useMutation({
    mutationFn: (data) => {
      const normalizedTestimonialsLimit = unlimitedTestimonials
        ? 0
        : Number(data.testimonials_limit || 0);
      return isEditMode
        ? usersAPI.updatePackage(plan.id, {
          ...data,
          testimonials_limit: normalizedTestimonialsLimit,
          price_monthly: Number(data.price_monthly),
          price_annual: Number(data.price_annual),
        })
        : usersAPI.createPackage({
          ...data,
          testimonials_limit: normalizedTestimonialsLimit,
          price_monthly: Number(data.price_monthly),
          price_annual: Number(data.price_annual),
        });
    },
    onSuccess: () => {
      try {
        if (typeof onSuccessPackages === 'function') {
          toast({
            title: 'Success',
            description: isEditMode ?  'Package updated successfully' : 'Package created successfully',
          });
          onSuccessPackages();
        }
        onClose();
      } catch (error) {
        console.error("Error in onSuccess callback:", error);
        onClose(); // Ensure modal still closes even if there's an error
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to save package",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizedFeatures = (featuresText || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    packageMutation.mutate({
      ...formData,
      description: (formData.description || "").trim() || (formData.name || "").trim(),
      features: normalizedFeatures,
      number_of_trail_days: Number(formData.number_of_trail_days || 0),
      testimonials_limit: unlimitedTestimonials ? 0 : formData.testimonials_limit,
    });
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
                onChange={(e) => {
                  const nextName = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    name: nextName,
                    description:
                      (prev.description || "").trim().length === 0
                        ? nextName
                        : prev.description,
                  }));
                }}
                placeholder="Starter"
                required
                className="mt-2"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Short description shown on public page"
                className="mt-2 w-full min-h-[90px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            {/* video discriotion */}
            <div>
              <Label htmlFor="video_duration_limit">Video duration limit (minutes)</Label>
              <Input
                id="video_duration_limit"
                type="number"
                min={1}
                step={1}
                value={formData.video_duration_limit}
                onChange={(e) => setFormData({ ...formData, video_duration_limit: e.target.value })}
                placeholder="e.g. 2 for two minutes"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="number_of_trail_days">Trial Days</Label>
              <Input
                id="number_of_trail_days"
                type="number"
                value={formData.number_of_trail_days}
                onChange={(e) => setFormData({ ...formData, number_of_trail_days: e.target.value })}
                placeholder="7"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="features">Package Features (one per line)</Label>
              <textarea
                id="features"
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder={"Email requests\nWebsite embed widget\nPriority support"}
                className="mt-2 w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            {/* Testimonials Limit */}
            <div>
              <Label htmlFor="testimonials_limit">Testimonials Limit *</Label>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-[#555555]">Unlimited testimonials</span>
                <Switch
                  checked={unlimitedTestimonials}
                  onCheckedChange={(checked) => {
                    setUnlimitedTestimonials(checked);
                    setFormData((prev) => ({
                      ...prev,
                      testimonials_limit: checked ? 0 : (prev.testimonials_limit || ""),
                    }));
                  }}
                />
              </div>
              <Input
                id="testimonials_limit"
                type="number"
                value={formData.testimonials_limit}
                onChange={(e) => setFormData({ ...formData, testimonials_limit: e.target.value })}
                placeholder="e.g., 200"
                required={!unlimitedTestimonials}
                disabled={unlimitedTestimonials}
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
                onChange={(e) => {
                  const nextMonthly = e.target.value;
                  setFormData((prev) => {
                    const annualEmpty =
                      prev.price_annual === "" ||
                      prev.price_annual === null ||
                      typeof prev.price_annual === "undefined";
                    if (!annualEmpty) {
                      return { ...prev, price_monthly: nextMonthly };
                    }
                    const monthlyNum = Number(nextMonthly);
                    const nextAnnual =
                      Number.isFinite(monthlyNum) && monthlyNum > 0
                        ? (monthlyNum * 12).toFixed(2)
                        : "";
                    return { ...prev, price_monthly: nextMonthly, price_annual: nextAnnual };
                  });
                }}
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

            <div className="flex items-center justify-between mt-2">
              <Label htmlFor="show_on_public">Show on public page</Label>
              <Switch
                id="show_on_public"
                checked={formData.show_on_public}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, show_on_public: checked })
                }
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
