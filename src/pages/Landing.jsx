import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

// Custom hook for scroll-triggered animations
const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);
  
  return [ref, isVisible];
};

// Scroll-animated wrapper component
const ScrollReveal = ({ children, className = "", delay = 0, direction = "up" }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);
  
  const directionClasses = {
    up: "translate-y-12",
    down: "-translate-y-12",
    left: "translate-x-12",
    right: "-translate-x-12",
    scale: "scale-90",
  };
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        isVisible 
          ? "opacity-100 translate-y-0 translate-x-0 scale-100" 
          : `opacity-0 ${directionClasses[direction]}`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Animated Feature Card with hover effects and floating elements
const FeatureCard = ({ icon, title, description, gradient, delay }) => (
  <ScrollReveal delay={parseInt(delay) * 1000 || 0} direction="up">
    <div 
      className={`group relative overflow-hidden rounded-3xl p-8 ${gradient} shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] h-full`}
    >
      {/* Animated background circles */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
      
      {/* Sparkle effect on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-2xl animate-ping">✨</span>
      </div>
      
      <div className="relative z-10">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <span className="text-3xl">{icon}</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-white/90 text-sm leading-relaxed">{description}</p>
        
        {/* Learn more indicator */}
        <div className="mt-4 flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
          <span className="text-sm font-medium">Learn more</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </div>
  </ScrollReveal>
);

// Animated stat counter
const AnimatedStat = ({ value, label, icon, delay }) => {
  const [ref, isVisible] = useScrollAnimation(0.2);
  
  return (
    <div 
      ref={ref}
      className={`text-center p-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce-slow">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-gray-600 text-sm mt-1 font-medium">{label}</div>
    </div>
  );
};

// Floating testimonial with animation
const TestimonialBubble = ({ message, delay }) => (
  <div 
    className="bg-white/90 backdrop-blur-md rounded-2xl px-5 py-4 shadow-xl border border-pink-100 animate-float"
    style={{ animationDelay: delay }}
  >
    <p className="text-gray-700 text-sm font-medium">{message}</p>
  </div>
);

// Animated Step Card with scroll reveal
const StepCard = ({ number, icon, title, description, gradient, delay, isAI = false }) => {
  const [ref, isVisible] = useScrollAnimation(0.2);
  
  return (
    <div 
      ref={ref}
      className={`relative text-center group transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${parseInt(delay) * 1000}ms` }}
    >
      {/* Connection line */}
      <div className="hidden md:block absolute top-12 left-1/2 w-full h-1 bg-gradient-to-r from-pink-200 to-purple-200 -z-10" />
      
      <div className={`relative w-24 h-24 ${gradient} rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
        <span className="text-4xl">{icon}</span>
        
        {/* Step number badge */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-pink-200">
          <span className="text-pink-500 font-bold text-sm">{number}</span>
        </div>
        
        {/* AI indicator for Future Self step */}
        {isAI && (
          <div className="absolute -bottom-1 -left-1 w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
            <span className="text-xs">🤖</span>
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">{title}</h3>
      <p className="text-gray-600 text-sm max-w-xs mx-auto leading-relaxed">{description}</p>
      
      {/* AI Badge for Future Self */}
      {isAI && (
        <div className="mt-3 inline-flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full">
          <span className="text-xs">🔮</span>
          <span className="text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI-Powered</span>
        </div>
      )}
    </div>
  );
};

// Animated Journey Path SVG
const JourneyPath = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 1200 400">
    <path
      d="M0,200 Q300,100 600,200 T1200,200"
      fill="none"
      stroke="url(#gradient)"
      strokeWidth="3"
      strokeDasharray="10,10"
      className="animate-dash"
    />
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
  </svg>
);

// Floating decorative elements
const FloatingElements = () => (
  <>
    <div className="absolute top-20 left-[10%] animate-float" style={{ animationDelay: '0s' }}>
      <div className="w-12 h-12 bg-pink-200/50 rounded-full blur-sm" />
    </div>
    <div className="absolute top-40 right-[15%] animate-float" style={{ animationDelay: '1s' }}>
      <div className="w-8 h-8 bg-purple-200/50 rounded-full blur-sm" />
    </div>
    <div className="absolute bottom-20 left-[20%] animate-float" style={{ animationDelay: '2s' }}>
      <div className="w-16 h-16 bg-pink-300/30 rounded-full blur-md" />
    </div>
    <div className="absolute bottom-40 right-[10%] animate-float" style={{ animationDelay: '0.5s' }}>
      <div className="w-10 h-10 bg-purple-300/40 rounded-full blur-sm" />
    </div>
  </>
);

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 text-6xl opacity-20 animate-pulse">✨</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}>🌸</div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100 mb-6">
              <span className="text-pink-500">👑</span>
              <span className="text-sm font-medium text-gray-700">AI-Powered Career Companion for Women</span>
              <span className="text-purple-500">✨</span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gray-800">Your Journey to</span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Becoming Unstoppable
              </span>
              <br />
              <span className="text-gray-800">Starts Here</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Transform your dreams into reality with <span className="font-semibold text-pink-600">personalized AI roadmaps</span>, 
              weekly confidence analysis, and your <span className="font-semibold text-purple-600">future self</span> as your coach.
            </p>

            {/* CTA Button */}
            <Link 
              to="/signup" 
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300"
            >
              Start Your Journey
              <span className="group-hover:translate-x-1 transition-transform">🚀</span>
            </Link>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <span className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium">
                💪 Skill Queen
              </span>
              <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                👑 Boss Lady in Training
              </span>
              <span className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium">
                ✨ Confidence Rising
              </span>
            </div>
          </div>

          {/* Floating testimonials around hero */}
          <div className="hidden lg:block absolute top-32 left-0 max-w-xs">
            <TestimonialBubble 
              message={`"You improved your confidence by 22% this week!" 💖`}
              delay="0s"
            />
          </div>
          <div className="hidden lg:block absolute top-48 right-0 max-w-xs">
            <TestimonialBubble 
              message={`"I am your future self. You made it. Keep going." ✨`}
              delay="0.5s"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section - Elevated with Future Self AI */}
      <section className="px-4 py-24 bg-white/70 backdrop-blur-sm relative overflow-hidden">
        <FloatingElements />
        <JourneyPath />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full mb-4">
                <span className="animate-pulse">🚀</span>
                <span className="text-sm font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  AI-Guided Journey
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
                Your Path to <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Success</span>
              </h2>
              <p className="text-gray-600 mt-4 max-w-xl mx-auto">
                Transform from dreamer to achiever with your Future Self as your guide
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <StepCard 
              number="1"
              icon="🎯"
              title="Share Your Dream"
              description="Tell us your career aspirations, current skills, time availability, and personality type"
              gradient="bg-gradient-to-br from-pink-400 to-pink-500"
              delay="0.1"
            />
            <StepCard 
              number="2"
              icon="🗺️"
              title="Get Your Roadmap"
              description="Receive a personalized 6-month success blueprint with daily tasks and weekly milestones"
              gradient="bg-gradient-to-br from-purple-400 to-purple-500"
              delay="0.2"
            />
            <StepCard 
              number="3"
              icon="🔮"
              title="Meet Future You"
              description="Chat with your AI Future Self — she believes in you, guides you, and knows you'll make it"
              gradient="bg-gradient-to-br from-violet-400 to-purple-500"
              delay="0.3"
              isAI={true}
            />
            <StepCard 
              number="4"
              icon="👑"
              title="Ascend & Shine"
              description="Track your progress, ace mock interviews, and watch yourself transform into your best self"
              gradient="bg-gradient-to-br from-pink-400 to-purple-500"
              delay="0.4"
            />
          </div>

          
        </div>
      </section>

    
      <section className="px-4 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-50/50 to-transparent" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-4 border border-pink-100">
                <span className="text-xl animate-bounce-slow">⚡</span>
                <span className="text-sm font-semibold text-gray-700">Powerful AI Features</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
                Everything You Need to <br />
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                  Succeed & Shine
                </span>
              </h2>
            </div>
          </ScrollReveal>

          {/* Bento Grid Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon="🎯"
              title="AI Roadmap Generator"
              description="Get a personalized 6-month skill-building path with monthly targets, weekly tasks, and daily to-dos with timestamps."
              gradient="bg-gradient-to-br from-pink-400 to-pink-500"
              delay="0"
            />
            <FeatureCard 
              icon="📅"
              title="Daily AI Coach"
              description="Your personal productivity companion tells you exactly what to do and when. Never feel lost again."
              gradient="bg-gradient-to-br from-purple-400 to-purple-500"
              delay="0.1"
            />
            <FeatureCard 
              icon="🎤"
              title="Weekly Mock Interviews"
              description="AI-powered interviews that analyze your voice, detect hesitation, check confidence, and track improvement."
              gradient="bg-gradient-to-br from-pink-500 to-purple-500"
              delay="0.2"
            />
            <FeatureCard 
              icon="📊"
              title="Confidence Analytics"
              description="See your growth with metrics like 'Confidence +22%', 'Strong tone in 7 answers', and personalized feedback."
              gradient="bg-gradient-to-br from-purple-500 to-pink-400"
              delay="0.3"
            />
            <FeatureCard 
              icon="💖"
              title="Appreciation Engine"
              description="Get celebrated for your wins! 'You completed 4/5 tasks – QUEEN ENERGY 👑✨' Because you deserve praise."
              gradient="bg-gradient-to-br from-pink-400 to-rose-500"
              delay="0.4"
            />
            <FeatureCard 
              icon="🔮"
              title="Future Self Chatbot"
              description="Talk to the confident, successful version of YOU. Daily motivation from who you're becoming."
              gradient="bg-gradient-to-br from-violet-500 to-purple-500"
              delay="0.5"
            />
          </div>
        </div>
      </section>

      {/* 🔮 FUTURE SELF AI GUIDE - THE SHOWSTOPPER SECTION */}
      <section className="relative overflow-hidden">
        {/* Full-width immersive gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700" />
        
        {/* Animated starfield background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RhcnMiIHg9IjAiIHk9IjAiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjUpIi8+PGNpcmNsZSBjeD0iMTAiIGN5PSI0MCIgcj0iMC41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMykiLz48Y2lyY2xlIGN4PSI0NSIgY3k9IjE1IiByPSIwLjciIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC40KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzdGFycykiLz48L3N2Zz4=')] animate-twinkle" />
          
          {/* Glowing orbs */}
          <div className="absolute top-20 left-[10%] w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-pink-500/30 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-[120px]" />
        </div>
        
        {/* Floating cosmic elements */}
        <div className="absolute top-16 left-[5%] text-5xl animate-float opacity-40">🌙</div>
        <div className="absolute top-32 right-[8%] text-4xl animate-float opacity-50" style={{ animationDelay: '0.5s' }}>✨</div>
        <div className="absolute top-1/3 left-[15%] text-3xl animate-float opacity-30" style={{ animationDelay: '1s' }}>💫</div>
        <div className="absolute bottom-40 left-[10%] text-4xl animate-float opacity-40" style={{ animationDelay: '1.5s' }}>⭐</div>
        <div className="absolute bottom-24 right-[15%] text-5xl animate-float opacity-50" style={{ animationDelay: '2s' }}>🌟</div>
        <div className="absolute top-1/2 right-[5%] text-3xl animate-float opacity-30" style={{ animationDelay: '0.8s' }}>💜</div>

        <div className="relative z-10 px-4 py-32 md:py-40">
          <div className="max-w-6xl mx-auto">
            
            {/* Section Header */}
            <ScrollReveal direction="up">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20 shadow-xl">
                  <span className="text-2xl animate-pulse">🔮</span>
                  <span className="text-white font-bold text-sm uppercase tracking-widest">Revolutionary AI Feature</span>
                  <span className="text-2xl animate-pulse">✨</span>
                </div>
                
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none">
                  Your Future Self
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 animate-shimmer">
                    AI Guide
                  </span>
                </h2>
                
                <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                  The world's first AI that becomes <span className="text-yellow-300 font-semibold">the successful version of YOU</span> — 
                  coaching, motivating, and celebrating your journey every single day.
                </p>
              </div>
            </ScrollReveal>

            {/* Main Interactive Card */}
            <ScrollReveal direction="scale" delay={200}>
              <div className="relative max-w-4xl mx-auto">
                {/* Glow effect behind card */}
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-[3rem] blur-2xl opacity-50 animate-pulse" />
                
                <div className="relative bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/30 shadow-2xl">
                  
                  {/* AI Avatar Section */}
                  <div className="flex flex-col lg:flex-row items-center gap-10 mb-10">
                    {/* Large animated avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-500 rounded-full blur-2xl opacity-60 animate-pulse scale-110" />
                      <div className="relative w-40 h-40 md:w-48 md:h-48 bg-gradient-to-br from-white/30 to-white/5 rounded-full flex items-center justify-center border-4 border-white/50 shadow-2xl group hover:scale-105 transition-transform duration-500">
                        <span className="text-7xl md:text-8xl">👩‍💼</span>
                        
                        {/* Orbiting elements */}
                        <div className="absolute w-full h-full animate-spin-slow">
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-sm">⭐</span>
                          </div>
                        </div>
                        <div className="absolute w-full h-full animate-spin-slower">
                          <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-xs">✨</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Online status */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-green-500 px-3 py-1 rounded-full border-2 border-white shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-white text-xs font-bold">LIVE</span>
                      </div>
                  </div>
                  
                  {/* AI Introduction */}
                  <div className="text-center lg:text-left">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      "Hello, I'm <span className="text-yellow-300">Future You</span>"
                    </h3>
                    <p className="text-white/80 text-lg leading-relaxed">
                      I'm the confident, successful version of you from 2 years in the future. 
                      I've walked the path you're about to take. Let me guide you there.
                    </p>
                  </div>
                </div>
                
                {/* Chat Interface Preview */}
                <div className="bg-black/20 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                    <span className="text-white/60 text-sm ml-2">Future Self Chat</span>
                  </div>
                  
                  <div className="space-y-4 max-h-64 overflow-hidden">
                    {/* Message 1 */}
                    <div className="flex gap-3 animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">👩‍💼</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl rounded-tl-none px-5 py-3 max-w-md">
                        <p className="text-white">"I know you're feeling overwhelmed right now. I felt the same way. But trust me — in 6 months, you'll look back at this moment as the turning point."</p>
                      </div>
                    </div>
                    
                    {/* Message 2 */}
                    <div className="flex gap-3 justify-end animate-slideInRight" style={{ animationDelay: '0.5s' }}>
                      <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl rounded-tr-none px-5 py-3 max-w-md">
                        <p className="text-white">"How did you stay motivated on hard days?"</p>
                      </div>
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">💭</span>
                      </div>
                    </div>
                    
                    {/* Message 3 */}
                    <div className="flex gap-3 animate-slideInLeft" style={{ animationDelay: '0.8s' }}>
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">👩‍💼</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl rounded-tl-none px-5 py-3 max-w-md">
                        <p className="text-white">"By remembering that every small step compounds. You did the interview practice today even when you didn't feel like it — that's the version of you I'm proud of. 💜"</p>
                      </div>
                    </div>
                    
                    {/* Typing indicator */}
                    <div className="flex gap-3 animate-fadeInUp" style={{ animationDelay: '1.2s' }}>
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">👩‍💼</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl rounded-tl-none px-5 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Feature highlights */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:bg-white/20 transition-all group">
                    <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">🧠</span>
                    <h4 className="text-white font-bold mb-1">Learns Your Journey</h4>
                    <p className="text-white/70 text-sm">Adapts to your goals, fears, and dreams</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:bg-white/20 transition-all group">
                    <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">💬</span>
                    <h4 className="text-white font-bold mb-1">Daily Conversations</h4>
                    <p className="text-white/70 text-sm">Check-ins that feel like talking to a mentor</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:bg-white/20 transition-all group">
                    <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">🎯</span>
                    <h4 className="text-white font-bold mb-1">Keeps You Accountable</h4>
                    <p className="text-white/70 text-sm">Gentle nudges when you drift off track</p>
                  </div>
                </div>
                
                {/* CTA */}
                <div className="text-center">
                  <Link 
                    to="/dashboard"
                    className="group inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-pink-500/50 hover:scale-105 transition-all duration-300"
                  >
                    <span>Meet Your Future Self</span>
                    <span className="text-2xl group-hover:rotate-12 transition-transform">🔮</span>
                  </Link>
                  <p className="mt-4 text-white/60 text-sm">
                    The conversation that could change your life starts here
                  </p>
                </div>
              </div>
            </div>
            </ScrollReveal>
            
            {/* Emotional impact quote */}
            <ScrollReveal direction="up" delay={400}>
              <div className="text-center mt-16">
                <blockquote className="text-2xl md:text-3xl text-white/90 italic max-w-3xl mx-auto leading-relaxed">
                  "Women rarely get external praise. <span className="text-yellow-300 font-semibold not-italic">SheAscend's Future Self AI</span> celebrates your wins, 
                  believes in your potential, and reminds you daily that you're becoming extraordinary."
                </blockquote>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <span className="text-4xl">💖</span>
                  <span className="text-white/60 text-sm">Emotionally Transformational AI</span>
                  <span className="text-4xl">✨</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats Section - Animated Cards */}
      <section className="px-4 py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />
        
        <div className="max-w-5xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Your Journey by the <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Numbers</span>
              </h2>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatedStat value="6-Month" label="Personalized Roadmaps" icon="🗺️" delay={100} />
            <AnimatedStat value="Weekly" label="AI Mock Interviews" icon="🎤" delay={200} />
            <AnimatedStat value="Daily" label="Task Scheduling" icon="📅" delay={300} />
            <AnimatedStat value="24/7" label="Future Self Coach" icon="🔮" delay={400} />
          </div>
          
          {/* Testimonial strip */}
          <ScrollReveal direction="up" delay={200}>
            <div className="mt-16 bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 border border-pink-100 shadow-lg">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex -space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full border-2 border-white flex items-center justify-center text-xl">👩</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-xl">👩‍🦱</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-xl">👩‍🦰</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm">+99</div>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-gray-700 font-medium">"SheAscend helped me land my dream job in just 4 months!"</p>
                  <p className="text-gray-500 text-sm mt-1">Join hundreds of women already ascending 🚀</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA Section - Grand Finale */}
      <section className="px-4 py-28 text-center relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-pink-100 animate-gradient-slow" />
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-[10%] text-6xl opacity-20 animate-float">🌸</div>
        <div className="absolute top-20 right-[15%] text-5xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-20 left-[20%] text-4xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>💖</div>
        <div className="absolute bottom-10 right-[10%] text-5xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>👑</div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <ScrollReveal direction="up">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-6 border border-pink-200">
              <span className="animate-bounce-slow">🌟</span>
              <span className="text-sm font-semibold text-gray-700">Your transformation awaits</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Ready to Become the<br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Woman You're Meant to Be?
              </span>
            </h2>
            
            <p className="text-gray-600 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Join SheAscend and start your transformation journey today. 
              Your future self is waiting. 🌸
            </p>
            
            <Link 
              to="/signup" 
              className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white px-12 py-6 rounded-full font-bold text-xl shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/60 hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <span className="relative z-10">Start Your Journey Now</span>
              <span className="relative z-10 text-3xl group-hover:translate-x-2 group-hover:scale-125 transition-all duration-300">✨</span>
            </Link>

            <p className="mt-8 text-gray-500 text-sm flex items-center justify-center gap-4 flex-wrap">
              <span className="flex items-center gap-1">✓ No credit card required</span>
              <span className="flex items-center gap-1">✓ Free to start</span>
              <span className="flex items-center gap-1">✓ Built with 💖 for women</span>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Enhanced animations and keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes gradient-slow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slower {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
        .animate-gradient-slow {
          background-size: 400% 400%;
          animation: gradient-slow 15s ease infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .animate-dash {
          animation: dash 20s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        .animate-spin-slower {
          animation: spin-slower 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
