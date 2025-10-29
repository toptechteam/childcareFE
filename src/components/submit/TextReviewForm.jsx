
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Send, ArrowLeft, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function TextReviewForm({ request, onSubmit, onBack, isSubmitting }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setPhotoUrl(file_url);
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      parent_name: request.parent_name,
      child_name: request.child_name,
      relationship: request.relationship,
      testimonial_type: 'text',
      content: content,
      rating: rating,
      photo_url: photoUrl,
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/60 shadow-xl mt-8">
      <CardContent className="p-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-lg mb-3 block">How would you rate your experience?</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="content" className="text-lg mb-3 block">
              Share your experience
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell us about your experience with our centre..."
              className="h-48 text-base"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              {content.length} / 500 characters
            </p>
          </div>

          <div>
            <Label className="text-lg mb-3 block">Add a photo (optional)</Label>
            <div className="flex items-center gap-4">
              {photoUrl && (
                <img src={photoUrl} alt="Uploaded" className="w-32 h-32 rounded-xl object-cover" />
              )}
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('photo').click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Upload Photo"}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !content}
            size="lg"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            {isSubmitting ? "Submitting..." : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Testimonial
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
