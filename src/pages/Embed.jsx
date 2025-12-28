
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Center, Testimonial, TestimonialRequest } from "@/api/entities";
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
    queryFn: () => TestimonialRequest.find({ status: 'approved', sort: '-created_date' }),
  });

  const embedCode = `<!-- ChildcareStories Testimonial Widget -->
  <style>
    .testimonials-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .testimonial-card {
      background: #1a1a1a;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      color: #e0e0e0;
      transition: transform 0.3s ease;
      break-inside: avoid;
    }
    
    .testimonial-card:hover {
      transform: translateY(-4px);
    }
    
    .testimonial-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .testimonial-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: #fff;
      font-weight: bold;
      font-size: 20px;
    }
    
    .testimonial-info {
      flex: 1;
    }
    
    .testimonial-name {
      font-weight: 600;
      color: #ffffff;
      margin: 0;
      font-size: 16px;
    }
    
    .testimonial-relation {
      color: #a0a0a0;
      font-size: 14px;
      margin: 4px 0 0;
    }
    
    .testimonial-content {
      color: #e0e0e0;
      line-height: 1.6;
      margin: 16px 0;
      font-size: 15px;
    }
    
    .testimonial-rating {
      color: #ffc107;
      font-size: 18px;
      margin: 12px 0;
      letter-spacing: 2px;
    }
    
    .testimonial-date {
      color: #888;
      font-size: 12px;
      margin-top: 16px;
      display: flex;
      align-items: center;
    }
    
    .testimonial-date:before {
      content: "•";
      margin: 0 8px;
      color: #444;
    }
    
    .testimonial-media {
      margin: 16px 0;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .testimonial-media video,
    .testimonial-media audio {
      width: 100%;
      border-radius: 8px;
    }
    
    .testimonial-tag {
      display: inline-block;
      background: rgba(255, 193, 7, 0.1);
      color: #ffc107;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      margin-top: 12px;
    }
    
    @media (max-width: 768px) {
      .testimonials-container {
        grid-template-columns: 1fr;
        padding: 10px;
      }
    }
  </style>
  
  <div id="childcare-testimonials" class="testimonials-container"></div>
  
  <script>
    (function() {
      // Function to get initials from name
      function getInitials(name) {
        if (!name) return 'P';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      }
  
      // Function to format date
      function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      }
  
      // Function to render media
      function renderMedia(testimonial) {
        if (!testimonial.testimonial_type) return '';
        
        const mediaUrl = testimonial.file_url || testimonial.photo_url;
        if (!mediaUrl) return '';
        
        switch(testimonial.testimonial_type.toLowerCase()) {
          case 'video':
            return \`
              <div class="testimonial-media">
                <video 
                  src="\${mediaUrl}" 
                  controls 
                  playsinline
                  style="background: #000;"
                ></video>
              </div>
            \`;
          case 'audio':
            return \`
              <div class="testimonial-media">
                <audio 
                  src="\${mediaUrl}" 
                  controls 
                  style="width: 100%;"
                ></audio>
              </div>
            \`;
          default:
            return '';
        }
      }
  
      // Fetch and render testimonials
      fetch('https://childcarestories.com.au/soptima/api/testimonials/6/')
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then(testimonials => {
          const container = document.getElementById('childcare-testimonials');
          
          if (!testimonials || !testimonials.length) {
            container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #888; padding: 40px;">No testimonials available yet.</div>';
            return;
          }
  
          container.innerHTML = testimonials.map(t => \`
            <div class="testimonial-card">
              <div class="testimonial-header">
                <div class="testimonial-avatar">
                  \${getInitials(t.parent_name)}
                </div>
                <div class="testimonial-info">
                  <h3 class="testimonial-name">\${t.parent_name || 'Parent'}</h3>
                  \${t.child_name ? \`
                    <p class="testimonial-relation">\${t.child_name}'s</p>
                  \` : ''}
                </div>
              </div>
              
              \${t.content ? \`
                <div class="testimonial-content">\${t.content}</div>
              \` : ''}
              
              \${renderMedia(t)}
              
              \${t.rating ? \`
                <div class="testimonial-rating">
                  \${'★'.repeat(Math.min(5, Math.max(0, t.rating)))}
                  \${'☆'.repeat(5 - Math.min(5, Math.max(0, t.rating)))}
                </div>
              \` : ''}
              
              <div class="testimonial-date">
                \${formatDate(t.created_date)}
                \${t.testimonial_type ? \`
                  <span class="testimonial-tag">\${t.testimonial_type}</span>
                \` : ''}
              </div>
            </div>
          \`).join('');
        })
        .catch(error => {
          console.error('Error loading testimonials:', error);
          const container = document.getElementById('childcare-testimonials');
          container.innerHTML = \`
            <div style="grid-column: 1 / -1; text-align: center; color: #ff6b6b; padding: 40px;">
              Failed to load testimonials. Please check your connection and try again.
            </div>
          \`;
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
                  Currently showing {testimonials.length} approved testimonials.
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
          <EmbedPreview testimonials={testimonials.slice(0, 6)} centre={centre} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
