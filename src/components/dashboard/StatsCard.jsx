
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const colorClasses = {
  blue: "from-[#8AE0F2] to-[#7ACDE0]",
  green: "from-[#8AE0F2] to-[#7ACDE0]",
  purple: "from-[#8AE0F2] to-[#7ACDE0]",
  orange: "from-[#8AE0F2] to-[#7ACDE0]",
};

export default function StatsCard({ title, value, icon: Icon, color, trend }) {
  return (
    <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[#555555] mb-2">{title}</p>
            <p className="text-3xl font-bold text-[#000000]">{value}</p>
            {trend && (
              <p className="text-xs text-[#555555] mt-2">{trend}</p>
            )}
          </div>
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
