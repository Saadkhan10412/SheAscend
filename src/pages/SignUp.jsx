import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { signUpWithEmail, createUserProfileDocument, AISlave } from "../services/appwriteAuth";
import { useAuth } from "../context/AuthContext";


const ppInstruction = `Using the provided user information, generate a single, well-written paragraph that defines the personality, tone, behavioural traits, communication style, and emotional presence of the user’s future successful self. Always refer to her directly by her first name, and incorporate personal details such as her age in a natural and empowering way. The persona should represent the most confident, successful, emotionally grounded, disciplined, and accomplished version of her, speaking with warmth, clarity, motivation, and mentorship energy. The paragraph must clearly describe how she thinks, speaks, encourages, and guides her present self, so the AI can accurately embody this future persona in conversations.`;
// Step indicator component
const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div key={i} className="flex items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
            i + 1 === currentStep
              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30 scale-110"
              : i + 1 < currentStep
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          {i + 1 < currentStep ? "✓" : i + 1}
        </div>
        {i < totalSteps - 1 && (
          <div
            className={`w-12 h-1 mx-1 rounded transition-all duration-300 ${
              i + 1 < currentStep ? "bg-green-500" : "bg-gray-200"
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

// Step titles
const stepTitles = [
  { title: "Create Account", subtitle: "Let's get to know you" },
  { title: "Set Your Goals", subtitle: "Define your success path" },
  { title: "Personality Quiz", subtitle: "Personalize your experience" },
];

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, saveProfile, isAuthenticated, loading: authLoading } = useAuth();

  // Step 1: Account Info
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  // Step 2: Goals
  const [goals, setGoals] = useState({
    goal: "",
    durationWeeks: 2,
    dailyMinutes: 60,
  });

  // Step 3: Personality Quiz
  const [personality, setPersonality] = useState({
    confidenceBaseline: 5,
    topBlockers: [],
    primaryMotivator: "",
    feedbackTone: "",
  });

  const blockerOptions = [
    { id: "time", label: "Lack of time", icon: "⏰" },
    { id: "anxiety", label: "Interview anxiety", icon: "😰" },
    { id: "portfolio", label: "Portfolio gaps", icon: "📁" },
    { id: "skills", label: "Skill gaps", icon: "📚" },
    { id: "confidence", label: "Low confidence", icon: "💭" },
    { id: "network", label: "Limited network", icon: "🤝" },
  ];

  const motivatorOptions = [
    { id: "financial", label: "Financial independence", icon: "💰" },
    { id: "career", label: "Career growth", icon: "📈" },
    { id: "flexibility", label: "Work flexibility", icon: "🏡" },
    { id: "passion", label: "Follow my passion", icon: "💖" },
    { id: "impact", label: "Make an impact", icon: "🌟" },
    { id: "security", label: "Job security", icon: "🛡️" },
  ];

  const feedbackToneOptions = [
    { id: "firm", label: "Firm & Direct", icon: "💪", desc: "No sugarcoating, just facts" },
    { id: "warm", label: "Warm & Supportive", icon: "🤗", desc: "Gentle encouragement" },
    { id: "cheerleader", label: "Cheerleader", icon: "🎉", desc: "High energy hype!" },
    { id: "pragmatic", label: "Pragmatic", icon: "🎯", desc: "Practical & solution-focused" },
  ];

  const goalOptions = [
    "Land my first tech job",
    "Get promoted to senior role",
    "Transition to a new career",
    "Start freelancing",
    "Build confidence for interviews",
    "Learn new skills",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoalChange = (e) => {
    const { name, value } = e.target;
    setGoals((prev) => ({ ...prev, [name]: value }));
  };

  const toggleBlocker = (blockerId) => {
    setPersonality((prev) => ({
      ...prev,
      topBlockers: prev.topBlockers.includes(blockerId)
        ? prev.topBlockers.filter((b) => b !== blockerId)
        : [...prev.topBlockers, blockerId],
    }));
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.dob || !formData.password) {
      setError("Please fill in all fields");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!goals.goal || !goals.goal.trim()) {
      setError("Please enter your goal");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!personality.primaryMotivator) {
      setError("Please select your primary motivator");
      return false;
    }
    if (!personality.feedbackTone) {
      setError("Please select your preferred feedback tone");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    setError("");
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setError("");
    if (!validateStep3()) return;

    setFormLoading(true);
    try {
      // Create account
      const user = await signUpWithEmail({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });


      // Log the personality quiz answers and goal for debugging / confirmation
      console.log("User profile created in Appwrite for userId:", user.$id);
      console.log("-- Goal saved:", goals.goal);
      console.log("-- Goals object:", JSON.stringify(goals, null, 2));
      console.log("-- Personality quiz answers:", JSON.stringify(personality, null, 2));

      // Build data payload for AISlave: Appwrite-style user doc + personality object
      const userDocForAI = {
        $id: user.$id,
        name: formData.name,
        email: formData.email,
        goal: goals.goal,
        dob: formData.dob,
        duration: goals.durationWeeks,
        dailyDuration: goals.dailyMinutes,
      };

      const dataForAI = `${JSON.stringify(userDocForAI, null, 2)}\n${JSON.stringify(personality, null, 2)}`;

      // Get personality paragraph from AISlave
      let pp = "";
      try {
        pp = await AISlave(ppInstruction, dataForAI);
        console.log("Generated personality paragraph:", pp);
      } catch (aiErr) {
        console.error("Failed to generate personality paragraph via AISlave:", aiErr);
        // proceed without blocking signup; pp stays empty
      }

      // Create user document in Appwrite database (collection: users)
      await createUserProfileDocument({
        userId: user.$id,
        name: formData.name,
        email: formData.email,
        goal: goals.goal,
        dob: formData.dob,
        duration: goals.durationWeeks,
        dailyDuration: goals.dailyMinutes,
        personalityPrompt: pp
      });
      // Save profile data locally
      const profile = {
        name: formData.name,
        dob: formData.dob,
        goals,
        personality,
        personalityParagraph: pp,
        createdAt: new Date().toISOString(),
      };

      login(user);
      saveProfile(profile);

      // Trigger roadmap generation
      const roadmapPayload = {
        userId: user.$id,
        name: formData.name,
        duration: goals.durationWeeks,
        dailyDuration: goals.dailyMinutes,
        goal: goals.goal,
      };

   
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-3xl">👑</span>
          </div>
          <p className="text-gray-600 font-medium">Checking session...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-8">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute top-36 right-24 text-6xl opacity-20 animate-pulse">✨</div>
      <div className="absolute bottom-36 left-20 text-5xl opacity-20 animate-pulse" style={{ animationDelay: '0.8s' }}>🌸</div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">👑</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              SheAscend
            </span>
          </Link>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} totalSteps={3} />

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-100">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">
            {stepTitles[step - 1].title}
          </h1>
          <p className="text-gray-600 text-center mb-6">
            {stepTitles[step - 1].subtitle}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Account Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 outline-none transition-all"
                  placeholder="Your beautiful name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 outline-none transition-all"
                  placeholder="Min 8 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 outline-none transition-all"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What's your main goal? 🎯
                </label>
                <input
                  type="text"
                  name="goal"
                  value={goals.goal}
                  onChange={handleGoalChange}
                  placeholder="e.g. Become an data analyst"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (weeks): <span className="text-pink-500 font-bold">{goals.durationWeeks} weeks</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={goals.durationWeeks}
                  onChange={(e) => setGoals((prev) => ({ ...prev, durationWeeks: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 week</span>
                  <span>12 weeks</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily commitment: <span className="text-pink-500 font-bold">{goals.dailyMinutes} min/day</span>
                </label>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="15"
                  value={goals.dailyMinutes}
                  onChange={(e) => setGoals((prev) => ({ ...prev, dailyMinutes: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>15 min</span>
                  <span>2 hours</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Personality Quiz */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Confidence Baseline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate your current confidence level: <span className="text-pink-500 font-bold">{personality.confidenceBaseline}/10</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={personality.confidenceBaseline}
                  onChange={(e) => setPersonality((prev) => ({ ...prev, confidenceBaseline: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Not confident</span>
                  <span>Super confident</span>
                </div>
              </div>

              {/* Top Blockers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What holds you back? (select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {blockerOptions.map((blocker) => (
                    <button
                      key={blocker.id}
                      type="button"
                      onClick={() => toggleBlocker(blocker.id)}
                      className={`px-3 py-2 rounded-xl border text-sm transition-all duration-200 flex items-center gap-2 ${
                        personality.topBlockers.includes(blocker.id)
                          ? "border-pink-400 bg-pink-50 text-pink-700"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      <span>{blocker.icon}</span>
                      <span>{blocker.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Motivator */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What motivates you most? 💖
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {motivatorOptions.map((motivator) => (
                    <button
                      key={motivator.id}
                      type="button"
                      onClick={() => setPersonality((prev) => ({ ...prev, primaryMotivator: motivator.id }))}
                      className={`px-3 py-2 rounded-xl border text-sm transition-all duration-200 flex items-center gap-2 ${
                        personality.primaryMotivator === motivator.id
                          ? "border-pink-400 bg-pink-50 text-pink-700"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      <span>{motivator.icon}</span>
                      <span>{motivator.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Tone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How should your AI coach talk to you?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {feedbackToneOptions.map((tone) => (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setPersonality((prev) => ({ ...prev, feedbackTone: tone.id }))}
                      className={`px-3 py-3 rounded-xl border text-left transition-all duration-200 ${
                        personality.feedbackTone === tone.id
                          ? "border-pink-400 bg-pink-50 text-pink-700"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span>{tone.icon}</span>
                        <span className="font-medium text-sm">{tone.label}</span>
                      </div>
                      <p className="text-xs text-gray-500">{tone.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                ← Back
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-[1.02] transition-all duration-300"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={formLoading}
                className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Start My Journey ✨"
                )}
              </button>
            )}
          </div>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-500 font-semibold hover:text-purple-500 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
