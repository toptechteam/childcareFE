import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import ClientDetailsModal from "./ClientDetailsModal";
import AddPackageModal from "./AddPackageModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersAPI } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
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

const planStatusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
};

export default function PackageList({ plans }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (planId) => usersAPI.deletePackage(planId),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Package deleted successfully',
      });
      queryClient.invalidateQueries('packages');
      setPlanToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete package',
        variant: 'destructive',
      });
    },
  });

  const handleDeleteClick = (plan, e) => {
    e.stopPropagation();
    setPlanToDelete(plan);
  };

  const handleConfirmDelete = () => {
    if (planToDelete) {
      deleteMutation.mutate(planToDelete.id);
    }
  };

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#555555]">No Plans available</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
          >
            {/* Plan Info */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8AE0F2] to-[#7ACDE0] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {plan.name.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-[#000000] truncate">
                    {plan.name}
                  </h3>
                  <Badge
                    className={
                      planStatusColors[plan.active ? "active" : "inactive"]
                    }
                  >
                    {plan.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-[#555555] truncate">
                  {plan.description}
                </p>
              </div>
            </div>

            {/* Pricing Info */}
            <div className="flex items-center gap-4">
              <div className="text-right mr-4 hidden md:block">
                <p className="text-sm font-semibold text-[#000000]">
                  ${plan.price_monthly}/mo
                </p>
                <p className="text-xs text-[#555555]">
                  ${plan.price_annual}/yr
                </p>
              </div>
              <div className="text-right mr-4 hidden md:block">
                <p className="text-sm font-semibold text-[#000000]">
                  {plan.testimonials_limit}
                </p>
                <p className="text-xs text-[#555555]">testimonials limit</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPlan(plan)}
                className="border-[#8AE0F2] text-[#8AE0F2] hover:bg-[#8AE0F2]/10"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleDeleteClick(plan, e)}
                className="border-[red] text-[red] hover:bg-[red]/10"
                disabled={deleteMutation.isLoading}
              >
                {deleteMutation.isLoading && planToDelete?.id === plan.id ? (
                  'Deleting...'
                ) : (
                  <Trash className="w-4 h-4 text-[red]" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Details Modal */}
      {selectedPlan && (
        <AddPackageModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!planToDelete} onOpenChange={(open) => !open && setPlanToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the package "{planToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
