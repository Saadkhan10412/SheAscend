import React from "react";

export const DashboardStyles = () => (
  <style>{`
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(2deg); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.3); }
      50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.5); }
    }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-float-delayed { animation: float 6s ease-in-out infinite 2s; }
    .animate-shimmer { animation: shimmer 3s ease-in-out infinite; background-size: 200% 100%; }
    .animate-glow { animation: glow 2s ease-in-out infinite; }
    .stagger-1 { animation-delay: 0.1s; }
    .stagger-2 { animation-delay: 0.2s; }
    .stagger-3 { animation-delay: 0.3s; }
    .stagger-4 { animation-delay: 0.4s; }
    @keyframes typewriter {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-typewriter { animation: typewriter 0.3s ease-out forwards; }
    .animate-expand { transition: max-height 0.5s ease-out, opacity 0.3s ease-out; }
    
    @keyframes floatUpTick {
      0% { transform: translateY(0) scale(0); opacity: 0; }
      20% { transform: translateY(-20px) scale(1.2); opacity: 1; }
      40% { transform: translateY(-60px) scale(1); opacity: 1; }
      100% { transform: translateY(-150px) scale(0.8); opacity: 0; }
    }
    @keyframes celebrationPop {
      0% { transform: scale(0) rotate(-180deg); opacity: 0; }
      50% { transform: scale(1.3) rotate(10deg); opacity: 1; }
      70% { transform: scale(0.9) rotate(-5deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes sparkle {
      0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
      50% { transform: scale(1) rotate(180deg); opacity: 1; }
    }
    @keyframes confettiFall {
      0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100px) rotate(720deg); opacity: 0; }
    }
    .animate-float-tick { animation: floatUpTick 1.5s ease-out forwards; }
    .animate-celebration-pop { animation: celebrationPop 0.6s ease-out forwards; }
    .animate-sparkle { animation: sparkle 0.8s ease-out forwards; }
    .animate-confetti { animation: confettiFall 1.5s ease-out forwards; }
    
    @keyframes botMessageIn {
      0% { opacity: 0; transform: translateY(10px) scale(0.95); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes textReveal {
      0% { opacity: 0; filter: blur(4px); }
      100% { opacity: 1; filter: blur(0); }
    }
    .animate-bot-message { animation: botMessageIn 0.4s ease-out forwards; }
    .animate-text-reveal { animation: textReveal 0.6s ease-out forwards; }
    
    .markdown-content h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; color: #1f2937; }
    .markdown-content h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem; color: #374151; }
    .markdown-content h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 0.75rem; color: #4b5563; }
    .markdown-content p { margin-bottom: 0.75rem; line-height: 1.7; }
    .markdown-content ul, .markdown-content ol { margin-left: 1.5rem; margin-bottom: 0.75rem; }
    .markdown-content li { margin-bottom: 0.25rem; }
    .markdown-content strong { font-weight: 600; color: #ec4899; }
    .markdown-content code { background: #fdf2f8; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875rem; color: #be185d; }
    .markdown-content pre { background: #fdf2f8; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 0.75rem; }
    .markdown-content blockquote { border-left: 3px solid #ec4899; padding-left: 1rem; margin-left: 0; color: #6b7280; font-style: italic; }
  `}</style>
);

export const LoadingStyles = () => (
  <style>{`
    @keyframes dropBounce {
      0% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
      60% { transform: translateY(20px) scale(1.1); opacity: 1; }
      80% { transform: translateY(-10px) scale(0.95); }
      100% { transform: translateY(0) scale(1); }
    }
    @keyframes fadeSlideUp {
      0% { transform: translateY(20px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes wiggle {
      0%, 100% { transform: rotate(-5deg); }
      50% { transform: rotate(5deg); }
    }
  `}</style>
);
