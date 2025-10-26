import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Eye } from "lucide-react";

export default function TrendingSection({ videos }) {
  if (!videos || videos.length === 0) return null;

  const topVideo = videos[0];
  const otherVideos = videos.slice(1);

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-800">Trending Now</h2>
        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          🔥 Hot
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Featured Video */}
        {topVideo && (
          <Card className="md:col-span-2 overflow-hidden bg-gradient-to-br from-purple-50 to-orange-50 border-2 border-gradient-to-r border-purple-200">
            <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-orange-100">
              {topVideo.thumbnail_url ? (
                <img 
                  src={topVideo.thumbnail_url} 
                  alt={topVideo.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Zap className="w-16 h-16 text-purple-400" />
                </div>
              )}
              <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-orange-500 text-white">
                👑 #1 Trending
              </Badge>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">{topVideo.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{topVideo.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold">{topVideo.trip_count || 0} trips</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{topVideo.view_count || 0} views</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Trending List */}
        <div className="space-y-4">
          {otherVideos.map((video, index) => (
            <Card key={video.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-lg font-bold text-purple-600">
                  #{index + 2}
                </Badge>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{video.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {video.trip_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {video.view_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
