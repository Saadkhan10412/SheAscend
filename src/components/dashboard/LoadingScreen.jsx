import React from "react";
import { LoadingStyles } from "./DashboardStyles";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-fuchsia-200/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center">
        <div className="animate-[dropBounce_1s_ease-out_forwards]">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-pink-500/40">
            <span className="text-4xl animate-[wiggle_1s_ease-in-out_infinite]">👑</span>
          </div>
        </div>
        
        <div className="animate-[fadeSlideUp_0.6s_ease-out_0.4s_forwards] opacity-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
            SheAscend
          </h1>
        </div>
      </div>

      <LoadingStyles />
    </div>
  );
}
