import React, { useState, useEffect } from "react";
import { Video, Trip, User } from "../entities/all";
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

      const videos = await Video.filter({ user_email: user.email }, "-created_date");
      setUserVideos(videos);

      const trips = await Trip.filter({ user_email: user.email }, "-created_date");
      setUserTrips(trips);

      const totalTrips = videos.reduce((sum, video) => sum + (video.trip_count || 0), 0);
      const totalViews = videos.reduce((sum, video) => sum + (video.view_count || 0), 0);

      setStats({
        totalVideos: videos.length,
        totalTrips: totalTrips,
        totalViews: totalViews,
        contests: 0 
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
    return <h1>Loading Profile Data...</h1>;
  }

  if (!currentUser) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <UserIcon size={50} style={{ margin: '0 auto', color: '#666' }} />
        <h2>Login Required</h2>
        <p>Login to proceed.</p>
        <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Welcome, {currentUser.full_name || "Trippin' User"}!</h1>
      <p>Email: {currentUser.email}</p>
      <p>Member since: {format(new Date(currentUser.created_date), "MMM yyyy")}</p>
      
      <button onClick={handleLogout} style={{ marginTop: '10px', padding: '5px 10px' }}>
        Logout
      </button>

      <h2>Your Stats</h2>
      <ul>
        <li>Videos Posted: {stats.totalVideos}</li>
        <li>Trips Received: {stats.totalTrips}</li>
        <li>Contest Wins: {stats.contests}</li>
        <li>Videos Tripped: {userTrips.length}</li>
      </ul>

      <h2>Your Videos ({userVideos.length})</h2>
      {userVideos.length > 0 ? (
        userVideos.map((video) => (
          <div key={video.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>{video.title}</h3>
            <p>Trips: {video.trip_count || 0}</p>
            <p>Posted: {format(new Date(video.created_date), "MMM d")}</p>
            {video.thumbnail_url && <img src={video.thumbnail_url} alt={video.title} style={{ width: '100px' }} />}
          </div>
        ))
      ) : (
        <div style={{ border: '1px solid #ccc', padding: '20px', textAlign: 'center' }}>
          <p>No videos yet. Upload your first moment!</p>
          <button onClick={() => window.location.href = createPageUrl("Upload")}>
            Upload Video
          </button>
        </div>
      )}
    </div>
  );
}
