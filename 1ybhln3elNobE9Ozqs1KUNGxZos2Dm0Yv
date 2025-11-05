import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Upload, Trophy, User, Zap } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navItems = [
    { name: "Feed", url: createPageUrl("Feed"), icon: Home },
    { name: "Upload", url: createPageUrl("Upload"), icon: Upload },
    { name: "Contest", url: createPageUrl("Contest"), icon: Trophy },
    { name: "Profile", url: createPageUrl("Profile"), icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Feed")} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-orange-500 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                  Trippin'
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Catch the chaos</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    location.pathname === item.url
                      ? "bg-gradient-to-r from-purple-500 to-orange-500 text-white shadow-lg"
                      : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-purple-100">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.url}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === item.url
                  ? "text-purple-600"
                  : "text-gray-500"
              }`}
            >
              <item.icon className={`w-5 h-5 ${
                location.pathname === item.url ? "text-purple-600" : "text-gray-500"
              }`} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      <style>
        {`
          :root {
            --gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%);
            --shadow-purple: 0 10px 25px -5px rgba(139, 92, 246, 0.3);
            --shadow-orange: 0 10px 25px -5px rgba(249, 115, 22, 0.3);
          }
        `}
      </style>
    </div>
  );
}
