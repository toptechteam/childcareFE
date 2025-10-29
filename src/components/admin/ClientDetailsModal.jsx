import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Mail, Phone, Globe, MapPin, Calendar, TrendingUp, Trash2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const planDetails = {
  starter: { price: 29, testimonials: 5, videoDuration: 120 },
  professional: { price: 79, testimonials: 50, videoDuration: 300 },
  enterprise: { price: 149, testimonials: 999999, videoDuration: 600 },
};

export default function ClientDetailsModal({ center, onClose }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("info");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Edit form state
  const [editData, setEditData] = useState({
    center_name: center.center_name || "",
    contact_email: center.contact_email || "",
    contact_phone: center.contact_phone || "",
    website_url: center.website_url || "",
    address: center.address || "",
  });

  // Subscription form state
  const [selectedPlan, setSelectedPlan] = useState(center.subscription_plan);
  const [selectedStatus, setSelectedStatus] = useState(center.subscription_status);

  const updateCenterMutation = useMutation({
    mutationFn: async (updates) => {
      return base44.entities.Center.update(center.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCenters'] });
    },
  });

  const deleteCenterMutation = useMutation({
    mutationFn: async () => {
      return base44.entities.Center.delete(center.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCenters'] });
      onClose();
    },
  });

  const handleUpdateInfo = () => {
    updateCenterMutation.mutate(editData);
  };

  const handleUpdateSubscription = () => {
    const planInfo = planDetails[selectedPlan];
    updateCenterMutation.mutate({
      subscription_plan: selectedPlan,
      subscription_status: selectedStatus,
      monthly_testimonials_limit: planInfo.testimonials,
      video_duration_limit: planInfo.videoDuration,
    });
  };

  const handleResetUsage = () => {
    updateCenterMutation.mutate({
      testimonials_this_month: 0,
      billing_period_start: new Date().toISOString(),
    });
  };

  const handleDelete = () => {
    deleteCenterMutation.mutate();
  };

  return (
    <>
      <Dialog open={!!center} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {center.logo_url ? (
                <img src={center.logo_url} alt={center.center_name} className="w-12 h-12 rounded-xl object-contain" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-[#8AE0F2] to-[#7ACDE0] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {center.center_name?.charAt(0)}
                </div>
              )}
              <div>
                <span className="block text-[#000000]">{center.center_name}</span>
                <div className="flex gap-2 mt-1">
                  <Badge className="bg-blue-100 text-blue-800">{center.subscription_plan}</Badge>
                  <Badge className="bg-green-100 text-green-800">{center.subscription_status}</Badge>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Information</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="danger">Danger Zone</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 mt-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-[#000000]">
                  <Building2 className="w-4 h-4" />
                  Edit Center Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="center_name">Center Name</Label>
                    <Input
                      id="center_name"
                      value={editData.center_name}
                      onChange={(e) => setEditData({...editData, center_name: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="contact_email">Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={editData.contact_email}
                        onChange={(e) => setEditData({...editData, contact_email: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_phone">Phone</Label>
                      <Input
                        id="contact_phone"
                        value={editData.contact_phone}
                        onChange={(e) => setEditData({...editData, contact_phone: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="website_url">Website</Label>
                    <Input
                      id="website_url"
                      value={editData.website_url}
                      onChange={(e) => setEditData({...editData, website_url: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={editData.address}
                      onChange={(e) => setEditData({...editData, address: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={handleUpdateInfo}
                    disabled={updateCenterMutation.isPending}
                    className="w-full bg-[#8AE0F2] hover:bg-[#7ACDE0] text-white"
                  >
                    {updateCenterMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>

              <div className="bg-[#8AE0F2]/10 rounded-xl p-4 border border-[#8AE0F2]/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-[#000000]">
                  <TrendingUp className="w-4 h-4" />
                  Usage This Month
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#555555]">Testimonials</p>
                    <p className="text-2xl font-bold text-[#000000]">
                      {center.testimonials_this_month || 0}
                      <span className="text-sm text-[#555555]"> / {center.monthly_testimonials_limit}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#555555]">Video Limit</p>
                    <p className="text-2xl font-bold text-[#000000]">
                      {center.video_duration_limit / 60}
                      <span className="text-sm text-[#555555]"> min</span>
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetUsage}
                  disabled={updateCenterMutation.isPending}
                  className="mt-3 w-full"
                >
                  Reset Usage Counter
                </Button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#555555] mb-1">Created</p>
                    <p className="font-semibold text-[#000000]">{format(new Date(center.created_date), 'MMM d, yyyy')}</p>
                  </div>
                  {center.trial_end_date && (
                    <div>
                      <p className="text-[#555555] mb-1">Trial Ends</p>
                      <p className="font-semibold text-[#000000]">{format(new Date(center.trial_end_date), 'MMM d, yyyy')}</p>
                    </div>
                  )}
                  {center.stripe_customer_id && (
                    <div className="col-span-2">
                      <p className="text-[#555555] mb-1">Stripe Customer ID</p>
                      <p className="font-mono text-xs text-[#000000]">{center.stripe_customer_id}</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-4 mt-4">
              <div className="bg-gradient-to-br from-[#8AE0F2] to-[#7ACDE0] rounded-xl p-6 text-white">
                <h3 className="font-semibold mb-2">Current Plan</h3>
                <p className="text-3xl font-bold mb-1">
                  {center.subscription_plan === 'starter' && '$29'}
                  {center.subscription_plan === 'professional' && '$79'}
                  {center.subscription_plan === 'enterprise' && '$149'}
                  {center.subscription_plan === 'trial' && '$0'}
                  <span className="text-lg font-normal"> /month</span>
                </p>
                <p className="text-white/80 text-sm">
                  {center.monthly_testimonials_limit} testimonials • {center.video_duration_limit / 60} min videos
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4 text-[#000000]">Manage Subscription</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Subscription Plan</Label>
                    <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trial">Trial (Free)</SelectItem>
                        <SelectItem value="starter">
                          Starter - $29/month (5 testimonials, 2min videos)
                        </SelectItem>
                        <SelectItem value="professional">
                          Professional - $79/month (50 testimonials, 5min videos)
                        </SelectItem>
                        <SelectItem value="enterprise">
                          Enterprise - $149/month (Unlimited, 10min videos)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trial">Trial</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="past_due">Past Due</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleUpdateSubscription}
                    disabled={updateCenterMutation.isPending}
                    className="w-full bg-[#8AE0F2] hover:bg-[#7ACDE0] text-white"
                  >
                    {updateCenterMutation.isPending ? "Updating..." : "Update Subscription"}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-2">Plan Comparison</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-800">Starter ($29)</span>
                    <span className="text-blue-600">5 testimonials, 2min videos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Professional ($79)</span>
                    <span className="text-blue-600">50 testimonials, 5min videos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Enterprise ($149)</span>
                    <span className="text-blue-600">Unlimited, 10min videos</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="danger" className="space-y-4 mt-4">
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Delete Client</h3>
                    <p className="text-sm text-red-800 mb-4">
                      Permanently delete this client and all associated data. This action cannot be undone.
                    </p>
                    <ul className="text-sm text-red-700 space-y-1 mb-4 list-disc list-inside">
                      <li>All testimonials will be deleted</li>
                      <li>All testimonial requests will be removed</li>
                      <li>Subscription will be cancelled (if active)</li>
                      <li>Center information will be permanently erased</li>
                    </ul>
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Client
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <h3 className="font-semibold text-orange-900 mb-2">Suspend Account</h3>
                <p className="text-sm text-orange-800 mb-3">
                  Temporarily disable this client's access without deleting data.
                </p>
                <Button
                  variant="outline"
                  onClick={() => updateCenterMutation.mutate({ subscription_status: 'cancelled' })}
                  disabled={updateCenterMutation.isPending}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  Suspend Account
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#000000]">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#555555]">
              This will permanently delete <strong>{center.center_name}</strong> and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteCenterMutation.isPending ? "Deleting..." : "Yes, Delete Client"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}