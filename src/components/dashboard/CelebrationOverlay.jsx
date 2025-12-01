import React from "react";

export default function CelebrationOverlay() {
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
      <div className="relative">
        <div className="animate-celebration-pop">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50">
            <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-sparkle"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 45}deg) translateY(-70px)`,
              animationDelay: `${i * 0.1}s`
            }}
          >
            <span className="text-2xl">✨</span>
          </div>
        ))}
      </div>

      {[...Array(6)].map((_, i) => (
        <div
          key={`tick-${i}`}
          className="absolute animate-float-tick"
          style={{
            bottom: '20%',
            left: `${15 + i * 14}%`,
            animationDelay: `${i * 0.15}s`
          }}
        >
          <div className={`w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg ${i % 2 === 0 ? 'opacity-80' : 'opacity-60'}`}>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      ))}

      {[...Array(12)].map((_, i) => (
        <div
          key={`confetti-${i}`}
          className="absolute animate-confetti"
          style={{
            top: '40%',
            left: `${10 + i * 7}%`,
            animationDelay: `${i * 0.08}s`
          }}
        >
          <div className={`w-3 h-3 rounded-sm ${['bg-green-400', 'bg-emerald-400', 'bg-pink-400', 'bg-purple-400', 'bg-yellow-400'][i % 5]}`} />
        </div>
      ))}

      <div className="absolute top-1/2 mt-20 animate-celebration-pop" style={{ animationDelay: '0.3s' }}>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
          Task Completed! 🎉
        </p>
      </div>
    </div>
  );
}
