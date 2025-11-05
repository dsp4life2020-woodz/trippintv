
import React, { useState, useEffect } from "react";
import { Video, Trip, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, Video as VideoIcon, Zap, Trophy, Calendar, Crown } from "lucide-react";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [userTrips, setUserTrips] = useState([]);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalTrips: 0,
    totalViews: 0,
    contests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      // Load user's videos
      const videos = await Video.filter({ user_email: user.email }, "-created_date");
      setUserVideos(videos);

      // Load user's trips
      const trips = await Trip.filter({ user_email: user.email }, "-created_date");
      setUserTrips(trips);

      // Calculate stats
      const totalTrips = videos.reduce((sum, video) => sum + (video.trip_count || 0), 0);
      const totalViews = videos.reduce((sum, video) => sum + (video.view_count || 0), 0);

      setStats({
        totalVideos: videos.length,
        totalTrips: totalTrips,
        totalViews: totalViews,
        contests: 0 // TODO: Implement contest wins counting
      });

    } catch (error) {
      console.error("Error loading user data:", error);
    }
    
    setLoading(false);
  };

  const handleLogin = async () => {
    await User.login();
  };

  const handleLogout = async () => {
    await User.logout();
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <UserIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Join Trippin'</h2>
        <p className="text-gray-600 text-lg mb-8">
          Login to upload videos, vote on content, and compete in weekly contests!
        </p>
        <Button
          onClick={handleLogin}
          className="bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white px-8 py-3 text-lg"
        >
          Login with Google
        </Button>
      </div>
    );
  }

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-orange-50 border-0">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {currentUser.full_name ? currentUser.full_name[0].toUpperCase() : "U"}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {currentUser.full_name || "Trippin' User"}
              </h1>
              <p className="text-gray-600 text-lg">{currentUser.email}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge className="bg-purple-100 text-purple-700">
                  Member since {format(new Date(currentUser.created_date), "MMM yyyy")}
                </Badge>
                {stats.totalVideos > 10 && (
                  <Badge className="bg-yellow-100 text-yellow-700">
                    <Crown className="w-3 h-3 mr-1" />
                    Active Creator
                  </Badge>
                )}
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <CardContent className="p-6">
            <VideoIcon className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">{stats.totalVideos}</div>
            <p className="text-gray-600">Videos Posted</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Zap className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">{stats.totalTrips}</div>
            <p className="text-gray-600">Trips Received</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">{stats.contests}</div>
            <p className="text-gray-600">Contest Wins</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">{userTrips.length}</div>
            <p className="text-gray-600">Videos Tripped</p>
          </CardContent>
        </Card>
      </div>

      {/* User's Videos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <VideoIcon className="w-6 h-6 text-purple-600" />
            Your Videos ({userVideos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-orange-100">
                    {video.thumbnail_url ? (
                      <img 
                        src={video.thumbnail_url} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Zap className="w-8 h-8 text-purple-400" />
                      </div>
                    )}
                    <Badge className="absolute top-2 left-2 bg-black/50 text-white">
                      {categoryLabels[video.category]}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate mb-2">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Zap className="w-4 h-4" />
                        <span>{video.trip_count || 0} trips</span>
                      </div>
                      <span className="text-gray-500">
                        {format(new Date(video.created_date), "MMM d")}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <VideoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No videos yet</h3>
              <p className="text-gray-500 mb-4">Upload your first trippin' moment to get started!</p>
              <Button
                onClick={() => window.location.href = createPageUrl("Upload")}
                className="bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white"
              >
                Upload Video
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
