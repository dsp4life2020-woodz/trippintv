import React, { useState, useRef } from "react";
import { Video, User } from "@/entities/all";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload as UploadIcon, Video as VideoIcon, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const categories = [
  { value: "road_rage", label: "Road Rage 🚗", description: "Traffic incidents and road rage moments" },
  { value: "public_freakout", label: "Public Freakout 😱", description: "Public meltdowns and outbursts" },
  { value: "customer_service", label: "Customer Service 🛒", description: "Retail and service industry chaos" },
  { value: "neighbor_drama", label: "Neighbor Drama 🏠", description: "Neighborhood disputes and conflicts" },
  { value: "family_drama", label: "Family Drama 👨‍👩‍👧‍👦", description: "Family arguments and disputes" },
  { value: "workplace_chaos", label: "Workplace Chaos 💼", description: "Office and workplace incidents" },
  { value: "random_meltdown", label: "Random Meltdown 🤯", description: "Unexpected outbursts and breakdowns" },
  { value: "other", label: "Other ❓", description: "Other types of trippin' moments" }
];

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      setError("Please log in to upload videos");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setError("File size must be less than 100MB");
        return;
      }
      setSelectedFile(file);
      setError("");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError("Please log in to upload videos");
      return;
    }

    if (!selectedFile) {
      setError("Please select a video file");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a video title");
      return;
    }

    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    setUploading(true);
    setError("");
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // Upload file
      const { file_url } = await UploadFile({ file: selectedFile });
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Create video record
      await Video.create({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        video_url: file_url,
        user_email: currentUser.email,
        user_name: currentUser.full_name,
        trip_count: 0,
        view_count: 0,
        is_contest_eligible: true
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(createPageUrl("Feed"));
      }, 2000);

    } catch (error) {
      setError("Failed to upload video. Please try again.");
      console.error("Upload error:", error);
    }

    setUploading(false);
  };

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <VideoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to upload videos</p>
        <Button onClick={() => User.login()}>
          Login to Upload
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Video Uploaded Successfully!</h2>
        <p className="text-gray-600 mb-6">Your trippin' moment is now live and ready for votes</p>
        <div className="animate-pulse text-purple-600">Redirecting to feed...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent mb-4">
          Share Your Trippin' Moment
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload a video of someone having a wild moment and let the community vote on it. The best videos compete in weekly contests!
        </p>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <UploadIcon className="w-6 h-6 text-purple-600" />
            Upload Your Video
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="video-file">Video File</Label>
              <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="video-file"
                />
                {selectedFile ? (
                  <div className="space-y-2">
                    <VideoIcon className="w-12 h-12 text-green-500 mx-auto" />
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Different File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <UploadIcon className="w-12 h-12 text-purple-400 mx-auto" />
                    <p className="text-lg font-medium text-gray-700">Click to upload video</p>
                    <p className="text-sm text-gray-500">MP4, MOV, AVI up to 100MB</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Select Video File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Video Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Give your video a catchy title..."
                className="border-purple-200 focus:border-purple-400"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="What's happening in this video? Provide some context..."
                rows={4}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="border-purple-200 focus:border-purple-400">
                  <SelectValue placeholder="Choose the best category for your video" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div>
                        <div className="font-medium">{category.label}</div>
                        <div className="text-sm text-gray-500">{category.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white font-semibold py-3 text-lg"
            >
              {uploading ? (
                <>
                  <UploadIcon className="w-5 h-5 mr-2 animate-spin" />
                  Uploading Video...
                </>
              ) : (
                <>
                  <VideoIcon className="w-5 h-5 mr-2" />
                  Share Your Trippin' Moment
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
