import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Eye, Calendar, User } from "lucide-react";
import { format } from "date-fns";

const categoryLabels = {
  road_rage: "Road Rage",
  public_freakout: "Public Freakout",
  customer_service: "Customer Service",
  neighbor_drama: "Neighbor Drama",
  family_drama: "Family Drama",
  workplace_chaos: "Workplace Chaos",
  random_meltdown: "Random Meltdown",
  other: "Other"
};

const categoryColors = {
  road_rage: "bg-red-100 text-red-700 border-red-200",
  public_freakout: "bg-orange-100 text-orange-700 border-orange-200",
  customer_service: "bg-purple-100 text-purple-700 border-purple-200",
  neighbor_drama: "bg-blue-100 text-blue-700 border-blue-200",
  family_drama: "bg-pink-100 text-pink-700 border-pink-200",
  workplace_chaos: "bg-yellow-100 text-yellow-700 border-yellow-200",
  random_meltdown: "bg-indigo-100 text-indigo-700 border-indigo-200",
  other: "bg-gray-100 text-gray-700 border-gray-200"
};

export default function VideoCard({ video, onTrip, isTripped, currentUser }) {
  const handleTripClick = () => {
    onTrip(video.id);
  };

  return (
    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
      {/* Video Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-orange-100">
        {video.thumbnail_url ? (
          <img 
            src={video.thumbnail_url} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Zap className="w-12 h-12 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Video Preview</p>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        <Badge className={`absolute top-3 left-3 ${categoryColors[video.category]} border font-medium`}>
          {categoryLabels[video.category]}
        </Badge>

        {/* Stats Overlay */}
        <div className="absolute bottom-3 right-3 bg-black/50 rounded-lg px-2 py-1 flex items-center gap-2">
          <Eye className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">
            {video.view_count || 0}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800">
          {video.title}
        </h3>
        
        {video.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {video.description}
          </p>
        )}

        {/* User Info */}
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
          <User className="w-4 h-4" />
          <span>{video.user_name}</span>
          <span>•</span>
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(video.created_date), "MMM d")}</span>
        </div>

        {/* Trip Button */}
        <Button
          onClick={handleTripClick}
          disabled={!currentUser}
          className={`w-full flex items-center justify-center gap-2 transition-all duration-200 ${
            isTripped
              ? "bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white transform scale-105"
              : "bg-gray-100 hover:bg-gradient-to-r hover:from-purple-500 hover:to-orange-500 hover:text-white text-gray-700"
          }`}
        >
          <Zap className={`w-5 h-5 ${isTripped ? "fill-current" : ""}`} />
          <span className="font-semibold">
            {isTripped ? "Tripped!" : "Trip This"} ({video.trip_count || 0})
          </span>
        </Button>
      </div>
    </Card>
  );
}
