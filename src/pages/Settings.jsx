
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Crown, MapPin, Calendar, CreditCard, Building2, Settings as SettingsIcon, KeyRound } from "lucide-react";
import { differenceInDays } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Center } from "@/api/entities";
import { createCustomerPortal, listPaymentMethods } from "@/api/functions";
import { useAuth } from "@/contexts/AuthContext";
import { usersAPI, authAPI } from "@/utils/api";

export default function Settings() {
   const { user } = useAuth();
  const { toast } = useToast();
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const changePasswordMutation = useMutation({
    mutationFn: () =>
      authAPI.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    onSuccess: (data) => {
      toast({
        title: "Password updated",
        description: data?.message || "You remain signed in with your current session.",
      });
      setChangePwdOpen(false);
      resetPasswordForm();
    },
    onError: (error) => {
      toast({
        title: "Could not update password",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "New password and confirmation must be the same.",
        variant: "destructive",
      });
      return;
    }
    changePasswordMutation.mutate();
  };
  const centerId = user?.center_id;
  const { data: center } = useQuery({
    queryKey: ["center", centerId],
    queryFn: async () => {
      const centers = await Center.findById(centerId);
      return centers;
    },
    enabled: !!centerId,
  });

  const { data: pkg } = useQuery({
    queryKey: ["centerPackage", center?.subscription_plan],
    queryFn: () => usersAPI.getPackageById(center.subscription_plan),
    enabled: !!center?.subscription_plan && !center?.package,
  });

  const effectivePackage = center?.package || pkg;
  const planDisplayName =
    effectivePackage?.name || center?.subscription_plan_name || "Plan";

  const daysRemaining = center?.trial_end_date 
    ? differenceInDays(new Date(center.trial_end_date), new Date())
    : 7;

  const stripeStatus = String(center?.subscription_status || "").toLowerCase();
  const hasPositivePeriodDays =
    center?.subscription_days_remaining != null && center.subscription_days_remaining > 0;
  const stripePaidLike = stripeStatus === "active" || stripeStatus === "trialing";
  const subscriptionEnd = center?.subscription_end_date
    ? new Date(center.subscription_end_date)
    : null;
  const periodEndInFuture =
    Boolean(subscriptionEnd) &&
    !Number.isNaN(subscriptionEnd.getTime()) &&
    subscriptionEnd > new Date();
  const subscriptionLooksActive =
    center?.subscription_active === true ||
    user?.subscription_active === true ||
    stripePaidLike ||
    hasPositivePeriodDays ||
    periodEndInFuture;

  const subscriptionStatusLine = (() => {
    if (center?.is_trial) {
      return `${center?.trial_days_remaining ?? daysRemaining} day(s) remaining in your trial`;
    }
    if (stripeStatus === "past_due") {
      return "Payment past due — update your payment method";
    }
    if (stripeStatus === "canceled" || stripeStatus === "cancelled") {
      return "Subscription canceled";
    }
    // Prefer “active” signals over Stripe status labels — DB status can stay
    // `incomplete` briefly (or longer) after a successful charge.
    if (hasPositivePeriodDays) {
      return `${center.subscription_days_remaining} day(s) left in current period`;
    }
    if (subscriptionLooksActive) {
      return "Active subscription";
    }
    if (
      stripeStatus === "unpaid" ||
      stripeStatus === "incomplete" ||
      stripeStatus === "incomplete_expired"
    ) {
      return "Payment required to activate your subscription";
    }
    return "No active subscription";
  })();

  const { data: paymentMethods } = useQuery({
    queryKey: ["paymentMethods"],
    queryFn: () => listPaymentMethods(),
    enabled: !!user,
  });

  const handleManageBilling = async () => {
    try {
      const response = await createCustomerPortal(`${window.location.origin}/settings`);
      if (response?.url) {
        window.open(response.url, '_blank');
      }
    } catch (error) {
      console.error('Portal error:', error);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Settings
        </h1>
        <p className="text-gray-500">Manage your account and subscription</p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <KeyRound className="w-5 h-5 text-[#8AE0F2]" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="font-medium text-gray-900">{user?.email || "—"}</p>
            </div>
            <p className="text-sm text-gray-600">
              Update your password here while signed in. Your session stays active.
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setChangePwdOpen(true)}
            >
              Change password
            </Button>
            <Dialog
              open={changePwdOpen}
              onOpenChange={(open) => {
                setChangePwdOpen(open);
                if (!open) resetPasswordForm();
              }}
            >
              <DialogContent className="sm:max-w-md">
                <form onSubmit={handleChangePasswordSubmit}>
                  <DialogHeader>
                    <DialogTitle>Change password</DialogTitle>
                    <DialogDescription>
                      Enter your current password, then choose a new one. You will stay logged in.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                      <Label htmlFor="settings-current-password">Current password</Label>
                      <Input
                        id="settings-current-password"
                        type="password"
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(ev) => setCurrentPassword(ev.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="settings-new-password">New password</Label>
                      <Input
                        id="settings-new-password"
                        type="password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(ev) => setNewPassword(ev.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="settings-confirm-password">Confirm new password</Label>
                      <Input
                        id="settings-confirm-password"
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(ev) => setConfirmPassword(ev.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setChangePwdOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={changePasswordMutation.isPending}>
                      {changePasswordMutation.isPending ? "Saving…" : "Update password"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#8AE0F2] to-[#7ACDE0] text-white border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Crown className="w-6 h-6" />
              Subscription Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {planDisplayName}
                  </Badge>
                  {center?.is_trial ? (
                    <Badge className="bg-white/30 text-white border-white/40">
                      Free trial
                    </Badge>
                  ) : null}
                </div>
                <p className="text-white/90">{subscriptionStatusLine}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">
                  {effectivePackage?.price_monthly
                    ? `$${effectivePackage.price_monthly}`
                    : "—"}
                </p>
                <p className="text-white/80 text-sm">
                  {center?.is_trial
                    ? "per month after trial"
                    : "per month"}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-xs text-white/80">This month</p>
                <p className="text-lg font-semibold">
                  {center?.testimonials_this_month || 0} / {Number(center?.monthly_testimonials_limit) === 0 ? "Unlimited" : center?.monthly_testimonials_limit || 0}
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-xs text-white/80">Plan limit</p>
                <p className="text-lg font-semibold">
                  {effectivePackage?.testimonials_limit === 0 ? "Unlimited" : effectivePackage?.testimonials_limit || 0} testimonials
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-xs text-white/80">Video limit</p>
                <p className="text-lg font-semibold">
                  {effectivePackage?.video_duration_limit
                    ? `${Number(effectivePackage.video_duration_limit)} min`
                    : "—"}
                </p>
              </div>
            </div>

            <Button
              onClick={handleManageBilling}
              className="w-full bg-white text-[#8AE0F2] hover:bg-gray-50 font-semibold"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Manage billing / add payment method / change or cancel plan
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Center Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mt-2" />
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Center Name</p>
                <p className="font-semibold text-gray-900">{center?.center_name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {center?.address || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Contact Email</p>
                <p className="font-semibold text-gray-900">{center?.contact_email || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="font-semibold text-gray-900">{center?.contact_phone || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Website</p>
                <p className="font-semibold text-gray-900">{center?.website_url || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Brand colors</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded border border-gray-200"
                      style={{ backgroundColor: center?.primary_color || "#ffffff" }}
                      title={center?.primary_color || ""}
                    />
                    <span className="text-sm text-gray-700">
                      {center?.primary_color || "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded border border-gray-200"
                      style={{ backgroundColor: center?.secondary_color || "#ffffff" }}
                      title={center?.secondary_color || ""}
                    />
                    <span className="text-sm text-gray-700">
                      {center?.secondary_color || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Link to={createPageUrl("Setup")}>
              <Button variant="outline" className="w-full mt-4">
                <SettingsIcon className="w-4 h-4 mr-2" />
                Edit Center Information
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Payment methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-xl p-6">
              {paymentMethods?.cards?.length ? (
                <div className="space-y-2">
                  {paymentMethods.cards.map((c) => (
                    <div key={c.id} className="flex items-center justify-between bg-white rounded-lg p-3 border">
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">{(c.brand || "").toUpperCase()}</span>{" "}
                        •••• {c.last4} (exp {c.exp_month}/{c.exp_year})
                      </div>
                    </div>
                  ))}
                  <Button onClick={handleManageBilling} variant="outline" className="w-full mt-4">
                    Manage payment methods in Stripe
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 mb-4">No payment method on file</p>
                  <Button onClick={handleManageBilling} variant="outline">
                    Add Payment Method
                  </Button>
                </div>
              )}
            </div>

            {/* <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold mb-3">Additional Locations</h3>
              <p className="text-sm text-gray-600 mb-2">
                Need to manage multiple locations? Add more for just $11/month each.
              </p>
              <Button variant="outline" size="sm">
                Add Location
              </Button>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
