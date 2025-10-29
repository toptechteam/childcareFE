
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import TestimonialCard from "../components/testimonials/TestimonialCard";
import TestimonialModal from "../components/testimonials/TestimonialModal";

export default function Testimonials() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.list('-created_date'),
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Testimonial.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  const filteredTestimonials = testimonials.filter(t => {
    const matchesFilter = filter === "all" || 
      (filter === "new" && t.status === "new") ||
      (filter === "approved" && (t.status === "approved" || t.status === "published")) ||
      (filter === "video" && t.testimonial_type === "video") ||
      (filter === "audio" && t.testimonial_type === "audio") ||
      (filter === "text" && t.testimonial_type === "text");

    const matchesSearch = searchQuery === "" ||
      t.parent_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.child_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (testimonial, newStatus) => {
    updateTestimonialMutation.mutate({
      id: testimonial.id,
      data: { status: newStatus }
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#000000] mb-2">
          All Testimonials
        </h1>
        <p className="text-[#555555]">Manage and review parent testimonials</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#555555]" />
          <Input
            placeholder="Search testimonials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm"
          />
        </div>
      </div>

      {filteredTestimonials.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#555555] text-lg">No testimonials found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              onStatusChange={handleStatusChange}
              onClick={() => setSelectedTestimonial(testimonial)}
            />
          ))}
        </div>
      )}

      {selectedTestimonial && (
        <TestimonialModal
          testimonial={selectedTestimonial}
          onClose={() => setSelectedTestimonial(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
