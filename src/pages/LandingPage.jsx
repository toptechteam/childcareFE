import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Video, 
  Mic, 
  FileText, 
  Shield, 
  Zap, 
  Heart,
  CheckCircle2,
  Star,
  ArrowRight,
  Play,
  Users,
  TrendingUp,
  Sparkles,
  Mail,
  Phone
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: Video,
      title: "Video Testimonials",
      description: "Parents record authentic video stories directly from their phones"
    },
    {
      icon: Mic,
      title: "Audio Reviews",
      description: "Quick voice testimonials captured in seconds"
    },
    {
      icon: FileText,
      title: "Written Stories",
      description: "Traditional text reviews with structured prompts"
    },
    {
      icon: Shield,
      title: "Full Control",
      description: "Review and approve all testimonials before publishing"
    },
    {
      icon: Zap,
      title: "One-Click Sharing",
      description: "Embed testimonials on your website instantly"
    },
    {
      icon: Heart,
      title: "Brand Customization",
      description: "Match your centre's colours and branding perfectly"
    }
  ];

  const sampleTestimonials = [
    {
      parent: "Sarah M.",
      child: "Emma",
      text: "The staff genuinely care about every child. Emma runs to the door every morning!",
      rating: 5
    },
    {
      parent: "James T.",
      child: "Oliver",
      text: "Best decision we made! The communication and daily updates give us such peace of mind.",
      rating: 5
    },
    {
      parent: "Lisa K.",
      child: "Sophie",
      text: "Sophie has grown so much here. The educators are incredible and the facilities are amazing.",
      rating: 5
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      features: [
        "5 testimonials per month",
        "2-minute video length",
        "Email requests",
        "Basic analytics",
        "Website embed widget"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      features: [
        "50 testimonials per month",
        "5-minute video length",
        "Custom email templates",
        "Advanced analytics",
        "Priority support",
        "Brand customization"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$149",
      period: "/month",
      features: [
        "Unlimited testimonials",
        "10-minute video length",
        "Multi-location support",
        "Dedicated account manager",
        "Custom integrations",
        "White-label options"
      ],
      popular: false
    }
  ];

  const stats = [
    { value: "10,000+", label: "Happy Families" },
    { value: "500+", label: "Childcare Centres" },
    { value: "50,000+", label: "Testimonials Collected" },
    { value: "98%", label: "Parent Response Rate" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Manrope:wght@400;500;600&display=swap');
        
        .logo-text {
          font-family: 'Montserrat', sans-serif;
        }
        
        .body-text {
          font-family: 'Manrope', sans-serif;
        }
      `}</style>

      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ed9f71df888d487eb37e90/e38ecc91c_2.png" 
              alt="Childcare Stories" 
              className="h-12 w-auto"
            />
            <div className="flex items-center gap-4">
              <a href="https://app.childcarestories.com.au">
                <Button variant="ghost" className="text-[#555555] hover:text-[#000000]">
                  Sign In
                </Button>
              </a>
              <a href="https://app.childcarestories.com.au/Setup">
                <Button className="bg-[#8AE0F2] hover:bg-[#7ACDE0] text-white">
                  Start Free Trial
                </Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#8AE0F2]/10 via-white to-[#8AE0F2]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#8AE0F2]/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-[#8AE0F2]" />
                <span className="text-sm font-semibold text-[#000000]">7-Day Free Trial</span>
              </div>
              <h1 className="logo-text text-5xl md:text-6xl font-bold text-[#000000] mb-6 leading-tight">
                Turn Happy Families into Powerful Social Proof
              </h1>
              <p className="body-text text-xl text-[#555555] mb-8 leading-relaxed">
                Collect authentic video, audio, and written testimonials from parents. 
                Build trust, attract new families, and showcase your childcare centre's amazing impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://app.childcarestories.com.au/Setup">
                  <Button size="lg" className="bg-[#8AE0F2] hover:bg-[#7ACDE0] text-white text-lg px-8 py-6">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-[#8AE0F2] text-[#000000] hover:bg-[#8AE0F2]/5">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              <p className="body-text text-sm text-[#555555] mt-6">
                No credit card required • Setup in 5 minutes • Cancel anytime
              </p>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="aspect-video bg-gradient-to-br from-[#8AE0F2] to-[#7ACDE0] rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <Play className="w-20 h-20 text-white relative z-10" />
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#8AE0F2]/20 rounded-full flex items-center justify-center">
                      <Video className="w-6 h-6 text-[#8AE0F2]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#000000]">Sarah Johnson</p>
                      <p className="text-sm text-[#555555]">Emma's Mum</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-[#555555] italic">"The best childcare experience we could have hoped for..."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#000000] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#8AE0F2] mb-2">
                  {stat.value}
                </div>
                <div className="text-white/80 body-text">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="logo-text text-4xl md:text-5xl font-bold text-[#000000] mb-4">
              Everything You Need to Collect & Showcase Testimonials
            </h2>
            <p className="body-text text-xl text-[#555555] max-w-3xl mx-auto">
              From collection to publication, we've made it incredibly simple for childcare centres.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border-gray-100 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#8AE0F2] to-[#7ACDE0] rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="logo-text text-xl font-bold text-[#000000] mb-3">
                    {feature.title}
                  </h3>
                  <p className="body-text text-[#555555]">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="logo-text text-4xl md:text-5xl font-bold text-[#000000] mb-4">
              Real Stories from Real Families
            </h2>
            <p className="body-text text-xl text-[#555555]">
              See how parents are sharing their experiences
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {sampleTestimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-gray-100 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="body-text text-[#555555] mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#8AE0F2] to-[#7ACDE0] rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.parent[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-[#000000]">{testimonial.parent}</p>
                      <p className="text-sm text-[#555555]">{testimonial.child}'s Parent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="logo-text text-4xl md:text-5xl font-bold text-[#000000] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="body-text text-xl text-[#555555]">
              Start with a 7-day free trial. No credit card required.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-2 border-[#8AE0F2] shadow-2xl scale-105' : 'border-gray-100'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#8AE0F2] text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="logo-text text-2xl font-bold text-[#000000] mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-[#000000]">{plan.price}</span>
                    <span className="text-[#555555]">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#8AE0F2] flex-shrink-0 mt-0.5" />
                        <span className="body-text text-[#555555]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="https://app.childcarestories.com.au/Setup">
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-[#8AE0F2] hover:bg-[#7ACDE0] text-white' : 'bg-white border-2 border-[#8AE0F2] text-[#000000] hover:bg-[#8AE0F2]/5'}`}
                      size="lg"
                    >
                      Start Free Trial
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="body-text text-center text-[#555555] mt-8">
            All plans include our 7-day free trial. Additional locations available for $11/month each.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-[#8AE0F2] to-[#7ACDE0] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="logo-text text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Trust with Authentic Stories?
          </h2>
          <p className="body-text text-xl mb-8 text-white/90">
            Join hundreds of childcare centres using ChildcareStories to showcase their impact.
          </p>
          <a href="https://app.childcarestories.com.au/Setup">
            <Button size="lg" className="bg-white text-[#8AE0F2] hover:bg-gray-100 text-lg px-8 py-6">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
          <p className="body-text text-sm mt-6 text-white/80">
            No credit card required • 7-day free trial • Setup in 5 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000000] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ed9f71df888d487eb37e90/e38ecc91c_2.png" 
                alt="Childcare Stories" 
                className="h-10 w-auto mb-4 brightness-0 invert"
              />
              <p className="body-text text-white/60 text-sm">
                Turning happy families into powerful social proof for childcare centres across Australia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 body-text text-sm text-white/60">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="https://app.childcarestories.com.au" className="hover:text-white transition-colors">Sign In</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 body-text text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 body-text text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  hello@childcarestories.com.au
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  1300 STORIES
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="body-text text-sm text-white/60">
              © 2024 ChildcareStories. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}