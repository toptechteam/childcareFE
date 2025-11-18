
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Template } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Heart, Home, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const scenarioIcons = {
  general: Heart,
  choosing: ThumbsUp,
  daily: Home,
  recommendation: FileText,
};

const scenarioColors = {
  general: "text-[#8AE0F2] bg-[#8AE0F2]/10",
  choosing: "text-[#8AE0F2] bg-[#8AE0F2]/10",
  daily: "text-[#8AE0F2] bg-[#8AE0F2]/10",
  recommendation: "text-[#8AE0F2] bg-[#8AE0F2]/10",
};

export default function Templates() {
  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: () => Template.find(),
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#000000] mb-2">
          Testimonial Templates
        </h1>
        <p className="text-[#555555]">Pre-written prompts for different scenarios</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => {
          const Icon = scenarioIcons[template.scenario] || FileText;
          const colorClass = scenarioColors[template.scenario] || "text-[#555555] bg-gray-50";

          return (
            <Card key={template.id} className="bg-white/80 backdrop-blur-sm border-white/60 shadow-sm hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#000000]">{template.title}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {template.scenario}
                      </Badge>
                    </div>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-[#000000] mb-2">Prompt Question:</p>
                  <p className="text-[#555555] italic">"{template.prompt_text}"</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#000000] mb-2">Email Subject:</p>
                  <p className="text-sm text-[#555555]">{template.email_subject}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#000000] mb-2">Email Body:</p>
                  <p className="text-sm text-[#555555] whitespace-pre-line line-clamp-3">
                    {template.email_body}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
