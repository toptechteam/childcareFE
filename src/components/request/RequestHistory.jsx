
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Mail } from "lucide-react";
import { format } from "date-fns";

export default function RequestHistory({ requests }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#000000]">
          <Mail className="w-5 h-5 text-[#555555]" />
          Recent Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-[#555555] text-center py-8">No requests sent yet</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {requests.map((request) => (
              <div key={request.id} className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-[#000000]">{request.parent_name}</p>
                    <p className="text-sm text-[#555555]">{request.child_name}'s {request.relationship}</p>
                  </div>
                  {request.completed ? (
                    <Badge className="bg-[#8AE0F2]/20 text-[#000000]">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[#555555]">
                  Sent {format(new Date(request.sent_date), 'MMM d, yyyy')}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
