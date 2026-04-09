
import React, { useState, useEffect } from "react";
import { usersAPI } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
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

export default function AddClientModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    center_name: "",
    contact_email: "",
    contact_phone: "",
    subscription_plan: "",
    subscription_type: "monthly",
    is_trial: true,
    trial_days: 7,
  });

  const { data: packages = [], isLoading: isLoadingPackage } = useQuery({
    queryKey: ['allPackages'],
    queryFn: () => usersAPI.getPackageList(),
  });

  useEffect(() => {
    if (!formData.subscription_plan && Array.isArray(packages) && packages.length > 0) {
      const firstPkg = packages[0];
      setFormData((prev) => ({
        ...prev,
        subscription_plan: firstPkg.id.toString(),
        trial_days: prev.is_trial ? (firstPkg.number_of_trail_days || prev.trial_days || 7) : 0,
      }));
    }
  }, [packages]);

  useEffect(() => {
    if (!formData.is_trial) return;
    const pkg = packages.find((p) => p.id.toString() === formData.subscription_plan?.toString());
    if (!pkg) return;
    setFormData((prev) => ({
      ...prev,
      trial_days: pkg.number_of_trail_days || prev.trial_days || 7,
    }));
  }, [formData.subscription_plan, formData.is_trial]);

  const createCenterMutation = useMutation({
    mutationFn: async (data) => {
      const centerData = {
        center_name: data.center_name,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        subscription_plan: data.subscription_plan ? Number(data.subscription_plan) : null,
        subscription_type: data.subscription_type,
        is_trial: !!data.is_trial,
        trial_days: data.is_trial ? Number(data.trial_days || 7) : 0,
      };

      return usersAPI.createCenter(centerData);


    },
    onSuccess: () => {
      console.log("✅ Center created successfully");
      toast({
        title: 'Creation successful',
        description: 'Center created successfully!',
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create center!',
      });
      console.error("❌ Error creating center:", error);
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
              value={formData.subscription_plan.toString()}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, subscription_plan: value }));
              }}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a plan">
                  {formData.subscription_plan && packages.find(p => p.id.toString() === formData.subscription_plan.toString())?.name || 'Select a plan'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="p-2">
                {packages.map((pkg) => (
                  <SelectItem
                    key={pkg.id}
                    value={pkg.id.toString()}
                    className="py-3 px-4 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <div className="flex flex-col space-y-1">
                      <div className="font-medium text-gray-900">{pkg.name}</div>
                      <div className="flex justify-between text-sm text-gray-600" style={{ display: 'flex', gap: '1rem' }}>
                        <span>${pkg.price_monthly}<span className="text-xs text-gray-500">/month</span></span>
                        <span>${pkg.price_annual}<span className="text-xs text-gray-500">/year</span></span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subscription_type">Plan Type</Label>
            <Select
              value={formData.subscription_type}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, subscription_type: value }));
              }}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a plan">
                  {formData.subscription_type === 'monthly' ? 'Monthly' : 'Annually'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="p-2">
                <SelectItem key="monthly" value="monthly"
                  className="py-3 px-4 hover:bg-gray-50 rounded-md transition-colors"
                > Monthly </SelectItem>
                <SelectItem key="annually" value="annually"
                  className="py-3 px-4 hover:bg-gray-50 rounded-md transition-colors"
                > Annually </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-2">
            <Label htmlFor="is_trial">Trial</Label>
            <Switch
              id="is_trial"
              checked={formData.is_trial}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_trial: checked })
              }
            />
          </div>

          {formData.is_trial && (
            <div>
              <Label htmlFor="trial_days">Trial Days</Label>
              <Input
                id="trial_days"
                type="number"
                value={formData.trial_days}
                onChange={(e) => setFormData({ ...formData, trial_days: e.target.value })}
                className="mt-2"
              />
            </div>
          )}

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
