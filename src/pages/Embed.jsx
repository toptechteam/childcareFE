
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Center, Testimonial } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Copy, Check, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import EmbedPreview from "../components/embed/EmbedPreview";

export default function Embed() {
  const [copied, setCopied] = useState(false);

  // Renamed 'center' to 'centre' for Australian spelling
  const { data: centre } = useQuery({
    queryKey: ['centre'],
    queryFn: async () => {
      const centres = await Center.find();
      return centres[0] || null;
    },
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => Testimonial.find({ sort: '-created_date' }),
  });

  const approvedTestimonials = testimonials.filter(
    t => t.status === 'approved' || t.status === 'published'
  );

  const embedCode = `<!-- ChildcareStories Testimonial Widget -->
<div id="childcare-testimonials"></div>
<script>
  (function() {
    fetch('https://childcarestories.com.au/api/testimonials')
      .then(res => res.json())
      .then(testimonials => {
        const container = document.getElementById('childcare-testimonials');
        container.innerHTML = testimonials.map(t => \`
          <div style="padding: 20px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
            <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
              <div style="font-weight: 600; color: #1f2937;">\${t.parent}</div>
              <div style="color: #6b7280; font-size: 14px;">• \${t.child}'s \${t.relationship || 'Parent'}</div>
            </div>
            <div style="color: #4b5563; line-height: 1.6;">\${t.content || 'Wonderful experience!'}</div>
            <div style="margin-top: 12px; color: #fbbf24;">\${'★'.repeat(t.rating || 5)}</div>
          </div>
        \`).join('');
      });
  })();
</script>
<!-- Powered by ChildcareStories.com.au -->`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#000000] mb-2">
          Website Widget
        </h1>
        <p className="text-[#555555]">Embed testimonials on your website</p>
      </div>

      <Tabs defaultValue="code" className="space-y-6">
        <TabsList className="bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="code" className="gap-2">
            <Code className="w-4 h-4" />
            Embed Code
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code">
          <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-xl">
            <CardHeader>
              <CardTitle className="text-[#000000]">Copy & Paste This Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-900 rounded-xl p-6 relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-white hover:bg-white/10"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copied ? "Copied!" : "Copy Code"}
                </Button>
                <pre className="text-sm text-green-400 overflow-x-auto">
                  <code>{embedCode}</code>
                </pre>
              </div>

              <div className="bg-[#8AE0F2]/10 rounded-xl p-6 border border-[#8AE0F2]/20">
                <h3 className="font-semibold text-[#000000] mb-3">How to Use:</h3>
                <ol className="list-decimal list-inside space-y-2 text-[#555555]">
                  <li>Copy the code above</li>
                  <li>Paste it into your website's HTML where you want testimonials to appear</li>
                  <li>The widget will automatically display your approved testimonials</li>
                  <li>Updates automatically as you approve new testimonials</li>
                </ol>
              </div>

              <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                <h3 className="font-semibold text-orange-900 mb-2">Note:</h3>
                <p className="text-orange-800">
                  Currently showing {approvedTestimonials.length} approved testimonials.
                  Make sure to approve testimonials in the Testimonials section before they appear on your website.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                <p className="text-sm text-[#555555]">
                  Powered by <span className="font-semibold text-[#8AE0F2]">ChildcareStories.com.au</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          {/* Passed 'centre' variable to EmbedPreview */}
          <EmbedPreview testimonials={approvedTestimonials.slice(0, 6)} centre={centre} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
