
import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, MapPin, Calendar, CreditCard, Building2, Settings as SettingsIcon, ExternalLink } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Settings() {
  const { data: center } = useQuery({
    queryKey: ['center'],
    queryFn: async () => {
      const centers = await base44.entities.Center.list();
      return centers[0];
    },
  });

  const daysRemaining = center?.trial_end_date 
    ? differenceInDays(new Date(center.trial_end_date), new Date())
    : 7;

  const handleUpgrade = async (plan) => {
    try {
      const response = await base44.functions.invoke('createCheckout', {
        plan,
        center_id: center?.id
      });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await base44.functions.invoke('createCustomerPortal', {
        stripe_customer_id: center?.stripe_customer_id
      });
      if (response.data.url) {
        window.open(response.data.url, '_blank');
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
                <Badge className="bg-white/20 text-white border-white/30 mb-2">
                  {center?.subscription_plan === 'trial' ? 'Free Trial' : center?.subscription_plan}
                </Badge>
                <p className="text-white/90">
                  {center?.subscription_plan === 'trial' 
                    ? `${daysRemaining} days remaining in your trial`
                    : 'Active subscription'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">
                  {center?.subscription_plan === 'starter' && '$29'}
                  {center?.subscription_plan === 'professional' && '$79'}
                  {center?.subscription_plan === 'enterprise' && '$149'}
                  {center?.subscription_plan === 'trial' && '$0'}
                </p>
                <p className="text-white/80 text-sm">per month</p>
              </div>
            </div>

            {center?.subscription_plan === 'trial' && (
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <h3 className="font-semibold mb-2">Choose Your Plan:</h3>
                <div className="grid gap-3">
                  <button
                    onClick={() => handleUpgrade('starter')}
                    className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg text-left transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Starter - $29/month</p>
                        <p className="text-sm text-white/80">5 testimonials, 2min videos</p>
                      </div>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </button>
                  <button
                    onClick={() => handleUpgrade('professional')}
                    className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg text-left transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Professional - $79/month</p>
                        <p className="text-sm text-white/80">50 testimonials, 5min videos</p>
                      </div>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </button>
                  <button
                    onClick={() => handleUpgrade('enterprise')}
                    className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg text-left transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Enterprise - $149/month</p>
                        <p className="text-sm text-white/80">Unlimited testimonials, 10min videos</p>
                      </div>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {center?.subscription_status === 'active' && center?.stripe_customer_id && (
              <Button 
                onClick={handleManageBilling}
                className="w-full bg-white text-[#8AE0F2] hover:bg-gray-50 font-semibold"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Billing & Subscription
              </Button>
            )}
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
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Center Name</p>
                <p className="font-semibold text-gray-900">{center?.center_name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Locations</p>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {center?.locations_count || 1}
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
            </div>

            <Link to={createPageUrl("Setup")}>
              <Button variant="outline" className="w-full">
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
              Billing Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 mb-4">No payment method on file</p>
              <Button variant="outline">Add Payment Method</Button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold mb-3">Additional Locations</h3>
              <p className="text-sm text-gray-600 mb-2">
                Need to manage multiple locations? Add more for just $11/month each.
              </p>
              <Button variant="outline" size="sm">
                Add Location
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
