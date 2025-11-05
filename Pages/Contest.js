
import React, { useState, useEffect, useCallback } from "react";
import { Video, Contest as ContestEntity, Trip } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Zap, Medal, Crown, Timer } from "lucide-react";
import { format, startOfWeek, endOfWeek, addDays } from "date-fns";
import LeaderboardCard from "../components/contest/LeaderboardCard";
import WeeklyWinner from "../components/contest/WeeklyWinner";

export default function Contest() {
  const [currentWeekVideos, setCurrentWeekVideos] = useState([]);
  const [previousWinner, setPreviousWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  const getCurrentWeekInfo = useCallback(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday
    
    return {
      start: weekStart,
      end: weekEnd,
      weekNumber: Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))
    };
  }, []);

  const updateCountdown = useCallback(() => {
    const weekInfo = getCurrentWeekInfo();
    const now = new Date();
    const timeUntilEnd = weekInfo.end.getTime() - now.getTime();
    
    if (timeUntilEnd > 0) {
      const days = Math.floor(timeUntilEnd / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeUntilEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilEnd % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    } else {
      setTimeLeft("Contest ended");
    }
  }, [getCurrentWeekInfo, setTimeLeft]);

  const loadContestData = useCallback(async () => {
    setLoading(true);
    
    try {
      const weekInfo = getCurrentWeekInfo();
      
      // Get all videos from current week
      const allVideos = await Video.list("-created_date", 100);
      const thisWeekVideos = allVideos.filter(video => {
        const videoDate = new Date(video.created_date);
        return videoDate >= weekInfo.start && videoDate <= weekInfo.end && video.is_contest_eligible;
      });

      // Sort by trip count
      const sortedVideos = thisWeekVideos.sort((a, b) => (b.trip_count || 0) - (a.trip_count || 0));
      setCurrentWeekVideos(sortedVideos);

      // Get previous week's winner
      const previousWeekNumber = weekInfo.weekNumber - 1;
      const contests = await ContestEntity.filter({ 
        week_number: previousWeekNumber,
        year: new Date().getFullYear()
      });
      
      if (contests.length > 0 && contests[0].winner_video_id) {
        const winnerVideo = await Video.get(contests[0].winner_video_id);
        setPreviousWinner(winnerVideo);
      }
      
    } catch (error) {
      console.error("Error loading contest data:", error);
    }
    
    setLoading(false);
  }, [getCurrentWeekInfo]);

  useEffect(() => {
    loadContestData();
    updateCountdown();
    
    // Update countdown every minute
    const interval = setInterval(updateCountdown, 60000);
    
    return () => clearInterval(interval);
  }, [loadContestData, updateCountdown]);


  const weekInfo = getCurrentWeekInfo();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-10 h-10 text-yellow-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Weekly Trippin' Contest
          </h1>
          <Trophy className="w-10 h-10 text-yellow-500" />
        </div>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Vote for the wildest videos of the week! The video with the most "trips" wins the weekly crown and bragging rights.
        </p>
      </div>

      {/* Contest Timer */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-orange-50 border-2 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Timer className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">Current Contest Week</h3>
                <p className="text-gray-600">
                  {format(weekInfo.start, "MMM d")} - {format(weekInfo.end, "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{timeLeft}</div>
              <p className="text-sm text-gray-500">remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Medal className="w-6 h-6 text-purple-600" />
                This Week's Leaderboard
                <Badge className="bg-gradient-to-r from-purple-500 to-orange-500 text-white">
                  {currentWeekVideos.length} Entries
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : currentWeekVideos.length > 0 ? (
                <div className="space-y-4">
                  {currentWeekVideos.slice(0, 10).map((video, index) => (
                    <LeaderboardCard
                      key={video.id}
                      video={video}
                      position={index + 1}
                      isLeading={index === 0}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No entries yet</h3>
                  <p className="text-gray-500">Be the first to upload a video this week!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Previous Winner */}
          {previousWinner && (
            <WeeklyWinner video={previousWinner} />
          )}

          {/* Contest Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-yellow-500" />
                Contest Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">1</Badge>
                  <p>Contests run weekly from Monday to Sunday</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">2</Badge>
                  <p>Only videos uploaded during the contest week are eligible</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">3</Badge>
                  <p>Winner is determined by the most "trips" (votes) received</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">4</Badge>
                  <p>Voting closes at midnight Sunday</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">5</Badge>
                  <p>Winners get bragging rights and a special badge</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-orange-500" />
                Week Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Entries:</span>
                  <span className="font-semibold">{currentWeekVideos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Trips:</span>
                  <span className="font-semibold">
                    {currentWeekVideos.reduce((sum, video) => sum + (video.trip_count || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Leading Video:</span>
                  <span className="font-semibold">
                    {currentWeekVideos[0] ? `${currentWeekVideos[0].trip_count || 0} trips` : "None"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
