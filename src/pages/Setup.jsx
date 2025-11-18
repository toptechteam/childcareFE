
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Check, Building2, Palette, Globe } from "lucide-react";
import { format, addDays } from "date-fns";
import { Center } from "@/api/entities";
import { UploadFile } from "@/api/integrations";

export default function Setup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    center_name: "",
    logo_url: "",
    primary_color: "#8AE0F2",
    secondary_color: "#555555",
    contact_email: "",
    contact_phone: "",
    website_url: "",
    address: "",
  });

  const { data: center } = useQuery({
    queryKey: ['center'],
    queryFn: async () => {
      const centers = await Center.find();
      return centers[0];
    },
  });

  useEffect(() => {
    if (center) {
      setFormData({
        center_name: center.center_name || "",
        logo_url: center.logo_url || "",
        primary_color: center.primary_color || "#8AE0F2",
        secondary_color: center.secondary_color || "#555555",
        contact_email: center.contact_email || "",
        contact_phone: center.contact_phone || "",
        website_url: center.website_url || "",
        address: center.address || "",
      });
    }
  }, [center]);

  const createOrUpdateMutation = useMutation({
    mutationFn: async (data) => {
      const trialEndDate = format(addDays(new Date(), 7), 'yyyy-MM-dd');
      const centerData = {
        ...data,
        setup_completed: true,
        ...(!center?.id && {
          trial_end_date: trialEndDate,
          subscription_plan: "trial"
        })
      };

      if (center?.id) {
        return Center.update(center.id, centerData);
      } else {
        return Center.create(centerData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['center'] });
      navigate(createPageUrl("Dashboard"));
    },
  });

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const { fileUrl } = await response.json();
      setFormData(prev => ({ ...prev, logo_url: fileUrl }));
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createOrUpdateMutation.mutate(formData);
  };

  const steps = [
    { number: 1, title: "Center Info", icon: Building2 },
    { number: 2, title: "Branding", icon: Palette },
    { number: 3, title: "Contact", icon: Globe },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600&family=Manrope:wght@400;500&display=swap');
        
        .logo-text {
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
        }
      `}</style>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ed9f71df888d487eb37e90/1c51a949d_1.png" 
            alt="Childcare Stories" 
            className="h-32 mx-auto mb-6"
          />
          <h1 className="logo-text text-3xl md:text-4xl text-[#000000] mb-2">
            Welcome! Let's Set Up Your Centre
          </h1>
          <p className="text-[#555555]">Just a few quick steps to get started</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {steps.map((s, idx) => (
              <React.Fragment key={s.number}>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  step >= s.number 
                    ? 'bg-[#8AE0F2] text-white shadow-lg' 
                    : 'bg-white text-gray-400 border border-gray-200'
                }`}>
                  {step > s.number ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <s.icon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium hidden md:inline">{s.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-200" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">
              {step === 1 && "Tell us about your center"}
              {step === 2 && "Add your branding"}
              {step === 3 && "Contact information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="center_name">Center Name *</Label>
                    <Input
                      id="center_name"
                      value={formData.center_name}
                      onChange={(e) => setFormData({...formData, center_name: e.target.value})}
                      placeholder="Little Sunshine Daycare"
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="123 Main Street, City, State"
                      className="mt-2"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label>Center Logo</Label>
                    <div className="mt-2 flex items-center gap-4">
                      {formData.logo_url ? (
                        <img src={formData.logo_url} alt="Logo" className="w-24 h-24 object-contain rounded-xl border-2 border-gray-200" />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          id="logo"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('logo').click()}
                          disabled={uploading}
                        >
                          {uploading ? "Uploading..." : "Upload Logo"}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primary_color">Primary Color</Label>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="color"
                          id="primary_color"
                          value={formData.primary_color}
                          onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                          className="w-16 h-10 rounded-lg cursor-pointer"
                        />
                        <Input
                          value={formData.primary_color}
                          onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondary_color">Secondary Color</Label>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="color"
                          id="secondary_color"
                          value={formData.secondary_color}
                          onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
                          className="w-16 h-10 rounded-lg cursor-pointer"
                        />
                        <Input
                          value={formData.secondary_color}
                          onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contact_email">Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                      placeholder="hello@littlesunshine.com"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_phone">Phone</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                      placeholder="(555) 123-4567"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                      id="website_url"
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                      placeholder="https://littlesunshine.com"
                      className="mt-2"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 && !formData.center_name}
                    className="ml-auto bg-[#8AE0F2] hover:bg-[#7ACDE0] text-white"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createOrUpdateMutation.isPending}
                    className="ml-auto bg-[#8AE0F2] hover:bg-[#7ACDE0] text-white"
                  >
                    {createOrUpdateMutation.isPending ? "Saving..." : "Complete Setup"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
