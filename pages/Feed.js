
import React, { useState, useEffect, useCallback } from "react";
import { Video, Trip, User } from "@/entities/all";
import VideoCard from "../components/feed/VideoCard";
import CategoryFilter from "../components/feed/CategoryFilter";
import TrendingSection from "../components/feed/TrendingSection";
import { Flame } from "lucide-react";

export default function Feed() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);
  const [userTrips, setUserTrips] = useState(new Set());

  const loadVideos = useCallback(async () => {
    setLoading(true);
    let fetchedVideos;
    
    if (selectedCategory === "all") {
      fetchedVideos = await Video.list("-created_date", 50);
    } else {
      fetchedVideos = await Video.filter({ category: selectedCategory }, "-created_date", 50);
    }
    
    setVideos(fetchedVideos);
    setLoading(false);
  }, [selectedCategory]);

  const loadData = useCallback(async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const trips = await Trip.filter({ user_email: user.email });
      setUserTrips(new Set(trips.map(trip => trip.video_id)));
    } catch (error) {
      console.log("User not logged in");
    }
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    loadData();
    loadVideos();
  }, [loadData, loadVideos]); // These functions are now stable due to useCallback, and change only when their dependencies change

  const handleTrip = async (videoId) => {
    if (!currentUser) {
      alert("Please log in to trip videos!");
      return;
    }

    try {
      if (userTrips.has(videoId)) {
        // Remove trip (unlike)
        const existingTrips = await Trip.filter({ 
          video_id: videoId, 
          user_email: currentUser.email 
        });
        
        if (existingTrips.length > 0) {
          await Trip.delete(existingTrips[0].id);
          setUserTrips(prev => {
            const newSet = new Set(prev);
            newSet.delete(videoId);
            return newSet;
          });

          // Update video trip count
          const video = videos.find(v => v.id === videoId);
          if (video) {
            await Video.update(videoId, { 
              trip_count: Math.max(0, (video.trip_count || 0) - 1)
            });
            loadVideos(); // Refresh to show updated count
          }
        }
      } else {
        // Add trip (like)
        await Trip.create({
          video_id: videoId,
          user_email: currentUser.email
        });
        
        setUserTrips(prev => new Set([...prev, videoId]));

        // Update video trip count
        const video = videos.find(v => v.id === videoId);
        if (video) {
          await Video.update(videoId, { 
            trip_count: (video.trip_count || 0) + 1
          });
          loadVideos(); // Refresh to show updated count
        }
      }
    } catch (error) {
      console.error("Error handling trip:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Flame className="w-8 h-8 text-orange-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Latest Trippin' Moments
          </h2>
          <Flame className="w-8 h-8 text-orange-500" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the wildest, most chaotic moments caught on camera. Vote for your favorites and help decide this week's champion!
        </p>
      </div>

      {/* Trending Section */}
      <TrendingSection videos={videos.slice(0, 3)} />

      {/* Category Filter */}
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-80"></div>
            </div>
          ))
        ) : videos.length > 0 ? (
          videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onTrip={handleTrip}
              isTripped={userTrips.has(video.id)}
              currentUser={currentUser}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <Flame className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No videos found</h3>
            <p className="text-gray-500">Be the first to share a trippin' moment!</p>
          </div>
        )}
      </div>
    </div>
  );
}
