
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Template } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileTextIcon, Heart, Home, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AddTemplateModal from "@/components/admin/AddTemplateModal";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: () => Template.find(),
  });

  const [showAddTemplateModal, setshowAddTemplateModal] = useState(false);


  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#000000] mb-2">
            All Testimonials
          </h1>
          <p className="text-[#555555]">Manage and review parent testimonials</p>
        </div>
        {user?.role === 'admin' && user?.is_superuser && <Button
          onClick={() => { setshowAddTemplateModal(true) }}
          className="whitespace-nowrap"
        >
          <FileText className="mr-2 h-4 w-4" />
          Request Template
        </Button>}
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

      {showAddTemplateModal && (
        <AddTemplateModal
          onClose={() => setshowAddTemplateModal(false)}
          onSuccess={() => {
            // queryClient.invalidateQueries({ queryKey: ['templates'] });
            setshowAddTemplateModal(false);
          }}
        />
      )}
    </div>
  );
}
