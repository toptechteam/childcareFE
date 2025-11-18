import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle, Square, RotateCcw, Send, ArrowLeft, Upload } from "lucide-react";

export default function RecordingInterface({ type, request, center, onSubmit, onBack, isSubmitting }) {
  const apiUrl = process.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const videoRef = useRef(null);

  const startRecording = async () => {
    try {
      const constraints = type === 'video' 
        ? { video: true, audio: true }
        : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (type === 'video' && videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { 
          type: type === 'video' ? 'video/webm' : 'audio/webm'
        });
        setRecordedBlob(blob);
        setRecordedUrl(URL.createObjectURL(blob));

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Could not access camera/microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const { fileUrl } = await response.json();
      setUploadedPhotoUrl(fileUrl);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!recordedBlob) return;

    setUploading(true);
    try {
      const file = new File([recordedBlob], `recording.${type === 'video' ? 'webm' : 'wav'}`, {
        type: type === 'video' ? 'video/webm' : 'audio/wav'
      });
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const { fileUrl } = await response.json();
      onSubmit({
        parent_name: request.parent_name,
        child_name: request.child_name,
        relationship: request.relationship,
        testimonial_type: type,
        file_url: fileUrl,
        photo_url: uploadedPhotoUrl,
        rating: 5,
      });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
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

        <div className="space-y-6">
          {!recordedUrl ? (
            <>
              {type === 'video' && (
                <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {type === 'audio' && isRecording && (
                <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Circle className="w-12 h-12" />
                    </div>
                    <p className="text-xl font-semibold">Recording...</p>
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8"
                  >
                    <Circle className="w-5 h-5 mr-2 fill-current" />
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    size="lg"
                    variant="destructive"
                    className="px-8"
                  >
                    <Square className="w-5 h-5 mr-2 fill-current" />
                    Stop Recording
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden">
                {type === 'video' ? (
                  <video src={recordedUrl} controls className="w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
                    <audio src={recordedUrl} controls className="w-full max-w-md px-8" />
                  </div>
                )}
              </div>

              {type === 'audio' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add a photo (optional)
                  </label>
                  <div className="flex items-center gap-4">
                    {uploadedPhotoUrl && (
                      <img src={uploadedPhotoUrl} alt="Uploaded" className="w-20 h-20 rounded-xl object-cover" />
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
              )}

              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => {
                    setRecordedBlob(null);
                    setRecordedUrl(null);
                    setUploadedPhotoUrl(null);
                  }}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Re-record
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || uploading}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  {isSubmitting || uploading ? "Submitting..." : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Testimonial
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}