import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { format, differenceInDays } from "date-fns";

import ClientDetailsModal from "./ClientDetailsModal";

const planColors = {
  trial: "bg-gray-100 text-gray-800",
  starter: "bg-blue-100 text-blue-800",
  professional: "bg-purple-100 text-purple-800",
  enterprise: "bg-orange-100 text-orange-800",
};

const statusColors = {
  active: "bg-green-100 text-green-800",
  trial: "bg-orange-100 text-orange-800",
  past_due: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export default function ClientsList({ centers }) {
  const [selectedCenter, setSelectedCenter] = useState(null);

  if (centers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#555555]">No clients found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {centers.map((center) => {
          const daysRemaining = center.trial_end_date
            ? differenceInDays(new Date(center.trial_end_date), new Date())
            : 0;

          return (
            <div
              key={center.id}
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
            >
              <div className="flex items-center gap-4 flex-1">
                {center.logo_url ? (
                  <img
                    src={center.logo_url}
                    alt={center.center_name}
                    className="w-12 h-12 rounded-xl object-contain bg-white"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8AE0F2] to-[#7ACDE0] rounded-xl flex items-center justify-center text-white font-bold">
                    {center.center_name?.charAt(0) || 'C'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[#000000] truncate">
                      {center.center_name}
                    </h3>
                    <Badge className={planColors[center.subscription_plan]}>
                      {center.subscription_plan}
                    </Badge>
                    <Badge className={statusColors[center.subscription_status]}>
                      {center.subscription_status}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#555555]">{center.contact_email}</p>
                  {center.subscription_status === 'trial' && daysRemaining > 0 && (
                    <p className="text-xs text-[#8AE0F2] mt-1">
                      {daysRemaining} days remaining in trial
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right mr-4 hidden md:block">
                  <p className="text-sm font-semibold text-[#000000]">
                    {center.testimonials_this_month || 0}/{center.monthly_testimonials_limit}
                  </p>
                  <p className="text-xs text-[#555555]">testimonials</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCenter(center)}
                  className="border-[#8AE0F2] text-[#8AE0F2] hover:bg-[#8AE0F2]/10"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCenter && (
        <ClientDetailsModal
          center={selectedCenter}
          onClose={() => setSelectedCenter(null)}
        />
      )}
    </>
  );
}