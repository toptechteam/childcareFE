
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Send, Eye, Code } from "lucide-react";

export default function QuickActions() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#000000]">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link to={createPageUrl("Request")} className="block">
          <Button className="w-full justify-start bg-[#8AE0F2]/10 text-[#000000] hover:bg-[#8AE0F2]/20 border-0">
            <Send className="w-4 h-4 mr-3" />
            Send Testimonial Request
          </Button>
        </Link>
        <Link to={createPageUrl("Testimonials")} className="block">
          <Button className="w-full justify-start bg-[#8AE0F2]/10 text-[#000000] hover:bg-[#8AE0F2]/20 border-0">
            <Eye className="w-4 h-4 mr-3" />
            Review Testimonials
          </Button>
        </Link>
        <Link to={createPageUrl("Embed")} className="block">
          <Button className="w-full justify-start bg-[#8AE0F2]/10 text-[#000000] hover:bg-[#8AE0F2]/20 border-0">
            <Code className="w-4 h-4 mr-3" />
            Get Embed Code
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
