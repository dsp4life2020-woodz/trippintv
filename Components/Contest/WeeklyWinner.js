import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, Trophy, Zap, User, Eye } from "lucide-react";
import { format } from "date-fns";

const positionIcons = {
  1: Crown,
  2: Trophy,
  3: Medal
};

const positionColors = {
  1: "from-yellow-400 to-orange-500",
  2: "from-gray-300 to-gray-500", 
  3: "from-orange-400 to-orange-600"
};

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

export default function LeaderboardCard({ video, position, isLeading }) {
  const PositionIcon = positionIcons[position] || Medal;
  const isTopThree = position <= 3;

  return (
    <Card className={`p-4 transition-all duration-300 hover:shadow-lg ${
      isLeading ? "ring-2 ring-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50" : "hover:shadow-md"
    }`}>
      <div className="flex items-center gap-4">
        {/* Position */}
        <div className="flex-shrink-0">
          {isTopThree ? (
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${positionColors[position]} flex items-center justify-center`}>
              <PositionIcon className="w-6 h-6 text-white" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-600">#{position}</span>
            </div>
          )}
        </div>

        {/* Video Thumbnail */}
        <div className="w-16 h-12 bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {video.thumbnail_url ? (
            <img 
              src={video.thumbnail_url} 
              alt={video.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Zap className="w-6 h-6 text-purple-400" />
          )}
        </div>

        {/* Video Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{video.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <User className="w-3 h-3" />
              <span>{video.user_name}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {categoryLabels[video.category]}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {format(new Date(video.created_date), "MMM d, h:mm a")}
          </p>
        </div>

        {/* Stats */}
        <div className="flex-shrink-0 text-right">
          <div className="flex items-center gap-1 mb-1">
            <Zap className={`w-4 h-4 ${isLeading ? "text-yellow-500" : "text-purple-500"}`} />
            <span className={`font-bold text-lg ${isLeading ? "text-yellow-600" : "text-purple-600"}`}>
              {video.trip_count || 0}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye className="w-3 h-3" />
            <span>{video.view_count || 0}</span>
          </div>
        </div>

        {/* Leading Badge */}
        {isLeading && (
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            🏆 Leading
          </Badge>
        )}
      </div>
    </Card>
  );
}
