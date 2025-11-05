import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Upload, Trophy, User, Zap, Mail } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navItems = [
    { name: "Feed", url: createPageUrl("Feed"), icon: Home },
    { name: "Upload", url: createPageUrl("Upload"), icon: Upload },
    { name: "Contest", url: createPageUrl("Contest"), icon: Trophy },
    { name: "Profile", url: createPageUrl("Profile"), icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Feed")} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
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
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                      : "text-gray-400 hover:bg-gray-800 hover:text-purple-400"
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
      <main className="flex-1 pb-20 md:pb-8">
        {children}
      </main>

      {/* Footer - Desktop */}
      <footer className="hidden md:block bg-gray-900/80 border-t border-gray-800 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Mail className="w-4 h-4" />
            <span className="text-sm">Need help?</span>
            <a 
              href="mailto:adam@trippintv.com"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Contact Support
            </a>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-lg border-t border-gray-800">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.url}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === item.url
                  ? "text-purple-400"
                  : "text-gray-500"
              }`}
            >
              <item.icon className={`w-5 h-5 ${
                location.pathname === item.url ? "text-purple-400" : "text-gray-500"
              }`} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
        {/* Mobile Support Link */}
        <div className="border-t border-gray-800 py-2 px-4">
          <a 
            href="mailto:adam@trippintv.com"
            className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-purple-400 transition-colors"
          >
            <Mail className="w-3 h-3" />
            <span>Contact Support</span>
          </a>
        </div>
      </nav>

      <style>
        {`
          :root {
            --gradient-primary: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
            --shadow-purple: 0 10px 25px -5px rgba(147, 51, 234, 0.5);
          }
        `}
      </style>
    </div>
  );
}
