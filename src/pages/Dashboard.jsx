import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserRoadmaps, getWeeklyTasks, getDailyTasks, getAllTasks, updateTaskStatus, AISlave, getCurrentUserProfile, getInterviews, startInterview } from "../services/appwriteAuth";
import {
  DashboardStyles,
  LoadingScreen,
  CelebrationOverlay,
  FutureSelfChat,
  TopicTutorChat,
  AnalyticsTab,
  InterviewsTab,
  LearningResources,
  TopicContentSection
} from "../components/dashboard";

// Feature data for the dashboard
const features = [
  { emoji: "🗓️", title: "Daily AI Coach", desc: "Get your personalized time-stamped tasks and focus reminders.", gradient: "from-pink-400 to-pink-500", action: "View Today's Tasks" },
  { emoji: "🎤", title: "Mock Interviews", desc: "Practice with AI-powered interviews that analyze your confidence.", gradient: "from-purple-400 to-purple-500", action: "Start Interview" },
  { emoji: "🔮", title: "Future Self Chat", desc: "Chat with the confident, successful version of yourself.", gradient: "from-violet-400 to-purple-500", action: "Chat Now" },
  { emoji: "📊", title: "Progress Analytics", desc: "Track your confidence growth and skill improvements.", gradient: "from-pink-500 to-rose-500", action: "View Stats" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, userProfile, logout } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [expandedDays, setExpandedDays] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [aiInstruction, setAiInstruction] = useState("");
  const [aiData, setAiData] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [userDoc, setUserDoc] = useState(null);
  const [contentReady, setContentReady] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [interviewPhone, setInterviewPhone] = useState("");
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewSuccess, setInterviewSuccess] = useState(false);
  const [taskDetails, setTaskDetails] = useState("");
  const [taskDetailsLoading, setTaskDetailsLoading] = useState(false);
  const [taskResources, setTaskResources] = useState([]);
  const [taskResourcesLoading, setTaskResourcesLoading] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showCompletionCelebration, setShowCompletionCelebration] = useState(false);
  const [taskContentSections, setTaskContentSections] = useState([]);
  const [taskContentLoading, setTaskContentLoading] = useState(false);
  const [taskDoubtMessages, setTaskDoubtMessages] = useState([]);
  const [taskDoubtInput, setTaskDoubtInput] = useState("");
  const [taskDoubtLoading, setTaskDoubtLoading] = useState(false);
  const [taskDoubtExpanded, setTaskDoubtExpanded] = useState(false);

  // Get user's first name for greeting
  const firstName = userProfile?.name?.split(" ")[0] || user?.name?.split(" ")[0] || "Queen";

  useEffect(() => {
    if (user?.$id) {
      fetchDashboardData();
      fetchUserDoc();
      fetchInterviewsData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard data for user:', user.$id);
      const [roadmapsData, weeklyTasksData, dailyTasksData, allTasksData] = await Promise.all([
        getUserRoadmaps(user.$id),
        getWeeklyTasks(user.$id),
        getDailyTasks(user.$id),
        getAllTasks(user.$id),
      ]);
      console.log('Roadmaps fetched:', roadmapsData);

      console.log('Weekly tasks fetched:', weeklyTasksData);
      // Log weekly task structure in detail
      if (weeklyTasksData.length > 0) {
        console.log('First weekly task full structure:', JSON.stringify(weeklyTasksData[0], null, 2));
      }
      console.log('Daily tasks fetched:', dailyTasksData);
      console.log('All tasks fetched:', allTasksData);

      const filteredRoadmaps = roadmapsData.filter(r => r.users?.$id === user.$id);
      setRoadmaps(filteredRoadmaps);

      // Get all weekly tasks for the user's roadmap
      const filteredWeeklyTasks = weeklyTasksData.filter(wt => wt.roadmaps?.$id === filteredRoadmaps[0]?.$id);
      setWeeklyTasks(filteredWeeklyTasks);
      console.log('Weekly tasks state set:', filteredWeeklyTasks);

      // Get all daily tasks across ALL weekly tasks (not just the first one)
      const weeklyTaskIds = filteredWeeklyTasks.map(wt => wt.$id);
      const filteredDailyTasks = dailyTasksData.filter(dt => weeklyTaskIds.includes(dt.weeklyTasks?.$id));
      setDailyTasks(filteredDailyTasks);

      // Get all tasks across ALL daily tasks (not just the first one)
      const dailyTaskIds = filteredDailyTasks.map(dt => dt.$id);
      const filteredAllTasks = allTasksData.filter(t => dailyTaskIds.includes(t.dailyTasks?.$id));
      setAllTasks(filteredAllTasks);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
      // Trigger content reveal animation after a short delay
      setTimeout(() => setContentReady(true), 100);
    }
  };

  const fetchUserDoc = async () => {
    try {
      const doc = await getCurrentUserProfile(user.$id);
      if (doc) {
        setUserDoc(doc);
      }
    } catch (err) {
      console.error("Failed to fetch user doc for dashboard:", err);
    }
  };

  const fetchInterviewsData = async () => {
    try {
      const data = await getInterviews(user.$id);
      setInterviews(data);
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
    }
  };

  const handleStartInterview = async () => {
    if (!interviewPhone.trim() || interviewPhone.length !== 10) return;
    setInterviewLoading(true);
    setInterviewSuccess(false);
    try {
      await startInterview(interviewPhone.trim());
      setInterviewSuccess(true);
      setInterviewPhone("");
      // Refresh interviews list
      await fetchInterviewsData();
    } catch (err) {
      console.error("Failed to start interview:", err);
    } finally {
      setInterviewLoading(false);
    }
  };

  const toggleWeekExpand = (weekId) => {
    setExpandedWeeks(prev => ({ ...prev, [weekId]: !prev[weekId] }));
  };

  const toggleDayExpand = (dayId) => {
    setExpandedDays(prev => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const handleTaskToggle = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";

    // Save previous state for possible rollback
    const prevAllTasks = allTasks;
    const prevWeeklyTasks = weeklyTasks;
    const prevDailyTasks = dailyTasks;
    const prevSelectedTask = selectedTask;

    try {
      // Optimistically update allTasks
      setAllTasks((prev) => prev.map((t) => (t.$id === taskId ? { ...t, status: newStatus } : t)));

      // Optimistically update nested dailyTasks inside weeklyTasks
      const updatedWeekly = weeklyTasks.map((w) => {
        const newDailyTasks = Array.isArray(w.dailyTasks)
          ? w.dailyTasks.map((d) => {
              const newTasks = Array.isArray(d.tasks)
                ? d.tasks.map((t) => (t.$id === taskId ? { ...t, status: newStatus } : t))
                : d.tasks;
              return { ...d, tasks: newTasks };
            })
          : w.dailyTasks;
        return { ...w, dailyTasks: newDailyTasks };
      });
      setWeeklyTasks(updatedWeekly);

      // Optimistically update flat dailyTasks list
      const updatedDaily = dailyTasks.map((d) => {
        const newTasks = Array.isArray(d.tasks)
          ? d.tasks.map((t) => (t.$id === taskId ? { ...t, status: newStatus } : t))
          : d.tasks;
        return { ...d, tasks: newTasks };
      });
      setDailyTasks(updatedDaily);

      // Update selectedTask if it's the same task
      if (selectedTask && (selectedTask.$id === taskId || selectedTask.id === taskId)) {
        setSelectedTask((prev) => ({ ...prev, status: newStatus }));
      }

      // Show celebration animation when completing a task
      if (newStatus === "Completed") {
        setShowCompletionCelebration(true);
        setTimeout(() => setShowCompletionCelebration(false), 2000);
      }

      // Persist change to server
      await updateTaskStatus(taskId, newStatus);

      // Background refresh to reconcile server state; don't block UI
      fetchDashboardData().catch((err) => console.error("Failed background refresh:", err));
    } catch (error) {
      console.error("Failed to update task:", error);
      // Revert optimistic changes on error
      setAllTasks(prevAllTasks);
      setWeeklyTasks(prevWeeklyTasks);
      setDailyTasks(prevDailyTasks);
      setSelectedTask(prevSelectedTask);
    }
  };

  const formatTaskTitle = (task, fallback) => {
    if (task.taskName) return task.taskName;
    if (task.topic) return task.topic;
    return fallback;
  };

  const formatTaskDescription = (task, fallback) => {
    if (task.taskDescription) return task.taskDescription;
    if (task.overview) return task.overview;
    return fallback;
  };

  // Helper to check if all tasks in a day are completed
  const isDayCompleted = (day) => {
    const dayTasks = Array.isArray(day.tasks) ? day.tasks : [];
    if (dayTasks.length === 0) return false;
    return dayTasks.every(task => task.status === "Completed");
  };

  // Helper to get day completion stats
  const getDayStats = (day) => {
    const dayTasks = Array.isArray(day.tasks) ? day.tasks : [];
    const completed = dayTasks.filter(task => task.status === "Completed").length;
    return { completed, total: dayTasks.length };
  };

  // Helper to check if all daily tasks in a week are completed
  const isWeekCompleted = (week) => {
    const weekDailyTasks = Array.isArray(week.dailyTasks) ? week.dailyTasks : [];
    if (weekDailyTasks.length === 0) return false;
    return weekDailyTasks.every(day => isDayCompleted(day));
  };

  // Helper to get week completion stats
  const getWeekStats = (week) => {
    const weekDailyTasks = Array.isArray(week.dailyTasks) ? week.dailyTasks : [];
    let completedTasks = 0;
    let totalTasks = 0;
    weekDailyTasks.forEach(day => {
      const dayTasks = Array.isArray(day.tasks) ? day.tasks : [];
      completedTasks += dayTasks.filter(task => task.status === "Completed").length;
      totalTasks += dayTasks.length;
    });
    const completedDays = weekDailyTasks.filter(day => isDayCompleted(day)).length;
    return { completedTasks, totalTasks, completedDays, totalDays: weekDailyTasks.length };
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    const personalityPrompt =
      userDoc?.personalityPrompt ||
      (userProfile?.goals?.goal
        ? `You are the future, confident version of ${firstName}. Her main goal is: ${userProfile.goals.goal}. Be warm, empowering, and practical.`
        : `You are the future, confident version of ${firstName}. Be warm, empowering, and practical.`);

    // Optimistically add user message
    setChatMessages(prev => [...prev, { role: "user", content: userText }]);
    setChatInput("");
    setChatLoading(true);
    
    // Auto-expand chat on first message
    if (chatMessages.length === 0) {
      setChatExpanded(true);
    }

    try {
      const res = await fetch(
        "https://saadkhan1004.app.n8n.cloud/webhook/2e0a63f4-863a-43df-b9bb-4d0316aa9998",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userText,
            personalityPrompt,
          }),
        }
      );

      let replyText = "";
      try {
        const data = await res.json();
        console.log("Chat webhook response data:", data);
        replyText =
          data?.reply ||
          data?.message || data?.output ||
          (typeof data === "string" ? data : `Future ${firstName} is thinking...`);
      } catch (parseErr) {
        replyText = `Future ${firstName} replied, but I couldn't read it clearly. Try again in a moment.`;
      }

      setChatMessages(prev => [
        ...prev,
        { role: "assistant", content: replyText },
      ]);
    } catch (err) {
      console.error("Chat webhook error:", err);
      setChatMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "Hmm, I couldn't reach our AI right now. Try again in a moment, love. 💜",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleAiSlaveTest = async () => {
    if (!aiInstruction.trim() || !aiData.trim()) return;
    setAiLoading(true);
    setAiOutput("");
    try {
      const out = await AISlave(aiInstruction.trim(), aiData.trim());
      setAiOutput(out);
    } catch (err) {
      console.error("AISlave test error:", err);
      setAiOutput(`Error: ${err.message || err}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Helper to sanitize JSON strings with control characters
  const sanitizeJSON = (str) => {
    // Remove control characters that break JSON parsing
    return str
      .replace(/[\x00-\x1F\x7F]/g, (char) => {
        // Keep newlines and tabs as escaped versions
        if (char === '\n') return '\\n';
        if (char === '\r') return '\\r';
        if (char === '\t') return '\\t';
        return ''; // Remove other control characters
      })
      .replace(/\n/g, ' ') // Replace actual newlines in content with spaces
      .replace(/\s+/g, ' '); // Normalize whitespace
  };

  // Helper to parse AI JSON response safely
  const parseAIJSON = (result) => {
    // First try direct parse
    try {
      return JSON.parse(result);
    } catch {
      // Try to extract JSON array
      const match = result.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          // Try parsing the extracted array
          return JSON.parse(match[0]);
        } catch {
          // Sanitize and try again
          const sanitized = sanitizeJSON(match[0]);
          try {
            return JSON.parse(sanitized);
          } catch {
            // Last resort: try to fix common issues
            const fixed = sanitized
              .replace(/,\s*]/g, ']') // Remove trailing commas
              .replace(/([{,])\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":'); // Quote unquoted keys
            return JSON.parse(fixed);
          }
        }
      }
    }
    return null;
  };

  // Calculate stats from actual data
  const completedTasksCount = allTasks.filter(t => t.status === "Completed").length;
  const totalTasksCount = allTasks.length;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Show loading state on initial load
  if (loading && roadmaps.length === 0 && weeklyTasks.length === 0 && allTasks.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 transition-all duration-700 ${contentReady ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
      <DashboardStyles />

      {showCompletionCelebration && <CelebrationOverlay />}

      {/* Focused Task - Fullscreen View */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-float-delayed" />

          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-pink-100 px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedTask(null);
                    setTaskDetails("");
                    setTaskResources([]);
                    setShowTaskDetails(false);
                    setTaskContentSections([]);
                    setTaskDoubtMessages([]);
                    setTaskDoubtInput("");
                    setTaskDoubtExpanded(false);
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors group"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="font-medium">Back to Dashboard</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
                    selectedTask.status === "Completed"
                      ? "bg-green-50 text-green-600 border border-green-200"
                      : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {selectedTask.status || "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="h-[calc(100vh-73px)] overflow-y-auto">
            <div className="max-w-6xl mx-auto px-6 py-8">
              {/* Task Header */}
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-500 mb-2">Focused Task</p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {typeof selectedTask.index === "number" ? `${selectedTask.index}. ` : ""}
                  {formatTaskTitle(selectedTask, "Selected Task")}
                </h1>

                {/* Meta info */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedTask.week && (
                    <span className="rounded-full bg-pink-100 px-4 py-2 text-sm text-pink-700 font-medium">
                      📆 Week {selectedTask.week}
                    </span>
                  )}
                  {selectedTask.day && (
                    <span className="rounded-full bg-purple-100 px-4 py-2 text-sm text-purple-700 font-medium">
                      📅 Day {selectedTask.day}
                    </span>
                  )}
                  {typeof selectedTask.duration === "number" && (
                    <span className="rounded-full bg-rose-100 px-4 py-2 text-sm text-rose-700 font-medium">
                      ⏱️ {selectedTask.duration} mins
                    </span>
                  )}
                  <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 font-medium">
                    📊 {completionPercentage}% roadmap complete
                  </span>
                </div>

                {/* Description */}
                {formatTaskDescription(selectedTask) && (
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {formatTaskDescription(selectedTask, "")}
                  </p>
                )}
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Topic Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Topic Content Section */}
                  <div className="bg-white rounded-2xl border border-pink-100 shadow-lg overflow-hidden">
                    <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-pink-100">
                      <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-800">
                        <span className="text-2xl">📚</span> Learn: {formatTaskTitle(selectedTask, "This Topic")}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Expandable content to help you master this topic</p>
                    </div>

                    {/* Content Sections */}
                    <div className="p-6">
                      {taskContentSections.length === 0 && !taskContentLoading && (
                        <button
                          onClick={async () => {
                            setTaskContentLoading(true);
                            try {
                              const taskTitle = formatTaskTitle(selectedTask, "Topic");
                              const instruction = `You are an expert teacher. Provide educational content about "${taskTitle}" in exactly this JSON format. Make it comprehensive and beginner-friendly.

Return ONLY valid JSON array:
[
  {"title": "Introduction", "content": "2-3 paragraphs introducing the topic..."},
  {"title": "Core Concepts", "content": "Explain the fundamental concepts with examples..."},
  {"title": "How It Works", "content": "Detailed explanation of how things work..."}
]

Use **bold** for important terms. Keep each section 150-250 words. NO markdown code blocks, ONLY the JSON array.`;
                              const data = `Topic: ${taskTitle}\nDescription: ${formatTaskDescription(selectedTask, "")}`;
                              const result = await AISlave(instruction, data);
                              const parsed = parseAIJSON(result);
                              if (Array.isArray(parsed)) {
                                setTaskContentSections(parsed.slice(0, 3).map(s => ({ ...s, expanded: false })));
                              }
                            } catch (err) {
                              console.error("Failed to load content:", err);
                              // Fallback: create a simple section from raw text
                              setTaskContentSections([{
                                title: "About This Topic",
                                content: "We couldn't generate structured content. Please try the Load More button or use the chat to ask questions about this topic.",
                                expanded: true
                              }]);
                            } finally {
                              setTaskContentLoading(false);
                            }
                          }}
                          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                        >
                          <span>✨</span> Start Learning This Topic
                        </button>
                      )}

                      {taskContentLoading && (
                        <div className="flex flex-col items-center gap-4 py-12">
                          <div className="flex gap-1">
                            <span className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                            <span className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                            <span className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                          </div>
                          <span className="text-gray-600">Preparing your learning content...</span>
                        </div>
                      )}

                      {taskContentSections.length > 0 && (
                        <div className="space-y-4">
                          {taskContentSections.map((section, idx) => (
                            <div key={idx} className="border border-pink-100 rounded-xl overflow-hidden animate-typewriter" style={{ animationDelay: `${idx * 0.1}s` }}>
                              <button
                                onClick={() => {
                                  setTaskContentSections(prev => prev.map((s, i) => 
                                    i === idx ? { ...s, expanded: !s.expanded } : s
                                  ));
                                }}
                                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-pink-50 hover:from-pink-50 hover:to-purple-50 transition-all"
                              >
                                <span className="flex items-center gap-3 font-medium text-gray-800">
                                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-white text-sm flex items-center justify-center">
                                    {idx + 1}
                                  </span>
                                  {section.title}
                                </span>
                                <svg
                                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${section.expanded ? "rotate-180" : ""}`}
                                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              <div className={`transition-all duration-300 ease-out ${section.expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                                <div className="p-4 bg-white border-t border-pink-100">
                                  <div className="prose prose-sm prose-pink max-w-none text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ 
                                      __html: section.content
                                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-pink-600">$1</strong>')
                                        .replace(/\n/g, '<br/>')
                                    }} 
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Load More Button */}
                          <button
                            onClick={async () => {
                              setTaskContentLoading(true);
                              try {
                                const taskTitle = formatTaskTitle(selectedTask, "Topic");
                                const existingTitles = taskContentSections.map(s => s.title).join(", ");
                                const instruction = `You are an expert teacher continuing to teach about "${taskTitle}". 
The student has already learned: ${existingTitles}

Now provide 2 MORE advanced sections. Return ONLY valid JSON array:
[
  {"title": "Advanced Concept Title", "content": "Detailed content about advanced aspects..."},
  {"title": "Practical Applications", "content": "Real-world applications and examples..."}
]

Make it progressively more advanced. Use **bold** for important terms. 150-250 words per section. NO markdown, ONLY JSON.`;
                                const data = `Topic: ${taskTitle}`;
                                const result = await AISlave(instruction, data);
                                const parsed = parseAIJSON(result);
                                if (Array.isArray(parsed)) {
                                  setTaskContentSections(prev => [...prev, ...parsed.map(s => ({ ...s, expanded: false }))]);
                                }
                              } catch (err) {
                                console.error("Failed to load more:", err);
                              } finally {
                                setTaskContentLoading(false);
                              }
                            }}
                            disabled={taskContentLoading}
                            className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-pink-200 text-pink-600 font-medium hover:bg-pink-50 hover:border-pink-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {taskContentLoading ? (
                              <>
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Loading...
                              </>
                            ) : (
                              <>
                                <span>📖</span> Load More Content
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Complete Task Button */}
                  {selectedTask.$id && (
                    <button
                      onClick={() => {
                        handleTaskToggle(selectedTask.$id, selectedTask.status);
                        setSelectedTask(null);
                        setTaskDetails("");
                        setTaskResources([]);
                        setShowTaskDetails(false);
                        setTaskContentSections([]);
                        setTaskDoubtMessages([]);
                        setTaskDoubtExpanded(false);
                      }}
                      className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 text-lg ${
                        selectedTask.status === "Completed"
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:scale-[1.02]"
                      }`}
                    >
                      {selectedTask.status === "Completed" ? (
                        <>
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Mark as Incomplete
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Mark as Complete ✨
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Right Column - Doubt Chat & Resources */}
                <div className="space-y-6">
                  {/* Fullscreen overlay backdrop for expanded chat */}
                  <div 
                    className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-all duration-500 ${
                      taskDoubtExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    onClick={() => setTaskDoubtExpanded(false)}
                  />

                  {/* Topic Tutor Chat - Future Self Style */}
                  <div className={`transition-all duration-500 ease-out ${
                    taskDoubtExpanded 
                      ? "fixed inset-4 md:inset-8 z-[70]" 
                      : "relative hover:scale-[1.01] hover:-translate-y-0.5"
                  }`}>
                  <div className={`h-full transition-all duration-500 ease-out overflow-hidden ${
                    taskDoubtExpanded 
                      ? "bg-white rounded-3xl shadow-2xl flex flex-col" 
                      : "relative rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl"
                  }`}>
                    {/* Glow layers - only show in card mode */}
                    {!taskDoubtExpanded && (
                      <>
                        <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
                        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-black/10 blur-2xl" />
                      </>
                    )}

                    <div className={`relative z-10 flex flex-col transition-all duration-500 ${
                      taskDoubtExpanded ? "h-full p-6 md:p-8" : "p-5 space-y-3"
                    }`}>
                      {/* Header */}
                      <div className={`flex items-center justify-between gap-3 ${taskDoubtExpanded ? "pb-4 border-b border-gray-100" : ""}`}>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className={`h-11 w-11 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${
                              taskDoubtExpanded 
                                ? "bg-gradient-to-br from-emerald-500 to-teal-500" 
                                : "bg-white/15 border border-white/20"
                            }`}>
                              <span className="text-xl">🎓</span>
                            </div>
                            <span className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse transition-all duration-500 ${
                              taskDoubtExpanded ? "ring-2 ring-white" : "ring-2 ring-teal-700"
                            }`} />
                          </div>
                          <div>
                            <p className={`text-xs uppercase tracking-[0.15em] transition-colors duration-500 ${
                              taskDoubtExpanded ? "text-gray-400" : "text-white/70"
                            }`}>Topic Tutor</p>
                            <h3 className={`text-base font-semibold transition-colors duration-500 ${
                              taskDoubtExpanded ? "text-gray-800" : "text-white"
                            }`}>{`${firstName}'s Study Buddy`}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Expand/Minimize button */}
                          <button
                            onClick={() => setTaskDoubtExpanded(!taskDoubtExpanded)}
                            className={`p-2 rounded-xl transition-all duration-300 ${
                              taskDoubtExpanded 
                                ? "bg-gray-100 hover:bg-gray-200 text-gray-600" 
                                : "bg-white/15 hover:bg-white/25 border border-white/20 text-white"
                            }`}
                            title={taskDoubtExpanded ? "Minimize" : "Expand"}
                          >
                            {taskDoubtExpanded ? (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Topic Context Badge - only in card mode */}
                      <div className={`rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs text-white/90 transition-all duration-500 overflow-hidden ${
                        taskDoubtExpanded ? "opacity-0 h-0 py-0 my-0 border-0" : "opacity-100"
                      }`}>
                        <span className="font-medium">📚 Learning:</span> {formatTaskTitle(selectedTask, "This Topic")}
                      </div>

                      {/* Chat history */}
                      <div className={`rounded-2xl p-4 overflow-y-auto space-y-3 transition-all duration-500 ${
                        taskDoubtExpanded 
                          ? "flex-1 bg-gray-50 border border-gray-100" 
                          : "bg-black/10 backdrop-blur-md max-h-48"
                      }`}>
                        {taskDoubtMessages.length === 0 && (
                          <div className="flex gap-3">
                            <div className={`mt-1 h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full text-sm ${
                              taskDoubtExpanded ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white" : "bg-white/15"
                            }`}>
                              🎓
                            </div>
                            <p className={`text-sm leading-relaxed ${taskDoubtExpanded ? "text-gray-600" : "text-white/85"}`}>
                              {`Hey ${firstName}! I'm here to help you understand "${formatTaskTitle(selectedTask, "this topic")}". Ask me anything - no question is too simple! 💚`}
                            </p>
                          </div>
                        )}
                        {taskDoubtMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} ${msg.role !== "user" ? "animate-bot-message" : ""}`}
                            style={msg.role !== "user" ? { animationDelay: '0.1s' } : {}}
                          >
                            {msg.role !== "user" && (
                              <div className={`mt-1 mr-2 h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full text-sm animate-bot-message ${
                                taskDoubtExpanded ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white" : "bg-white/20"
                              }`}>
                                🎓
                              </div>
                            )}
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all duration-300 ${msg.role !== "user" ? "animate-bot-message" : ""} ${
                                msg.role === "user"
                                  ? taskDoubtExpanded 
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-sm"
                                    : "bg-white text-teal-800 rounded-br-sm"
                                  : taskDoubtExpanded
                                    ? "bg-white text-gray-700 rounded-bl-sm border border-gray-200"
                                    : "bg-white/18 text-white rounded-bl-sm border border-white/15"
                              }`}
                              style={msg.role !== "user" ? { animationDelay: '0.2s' } : {}}
                            >
                              {msg.role !== "user" ? (
                                <span 
                                  className="animate-text-reveal" 
                                  style={{ animationDelay: '0.3s' }}
                                  dangerouslySetInnerHTML={{ 
                                    __html: msg.content
                                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                      .replace(/`(.*?)`/g, `<code class="${taskDoubtExpanded ? 'bg-emerald-50 text-emerald-600' : 'bg-white/20 text-white'} px-1 rounded">$1</code>`)
                                  }}
                                />
                              ) : (
                                msg.content
                              )}
                            </div>
                          </div>
                        ))}
                        {taskDoubtLoading && (
                          <div className={`flex items-center gap-2 text-xs ${taskDoubtExpanded ? "text-gray-500" : "text-white/80"}`}>
                            <span className={`h-2 w-2 rounded-full animate-pulse ${taskDoubtExpanded ? "bg-emerald-400" : "bg-white/80"}`} />
                            Study Buddy is thinking...
                          </div>
                        )}
                      </div>

                      {/* Input */}
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!taskDoubtInput.trim() || taskDoubtLoading) return;
                          
                          const userMessage = taskDoubtInput.trim();
                          setTaskDoubtInput("");
                          setTaskDoubtMessages(prev => [...prev, { role: "user", content: userMessage }]);
                          setTaskDoubtLoading(true);
                          
                          // Auto-expand on first message
                          if (taskDoubtMessages.length === 0) {
                            setTaskDoubtExpanded(true);
                          }
                          
                          try {
                            const taskTitle = formatTaskTitle(selectedTask, "Topic");
                            const taskDesc = formatTaskDescription(selectedTask, "");
                            const weekInfo = selectedTask.week ? `Week ${selectedTask.week}` : "";
                            const dayInfo = selectedTask.day ? `Day ${selectedTask.day}` : "";
                            
                            // Build context about the current task/topic
                            const context = {
                              topic: taskTitle,
                              description: taskDesc,
                              week: weekInfo,
                              day: dayInfo,
                              roadmapProgress: `${completionPercentage}% complete`,
                              taskStatus: selectedTask.status || "Pending",
                              contentLearned: taskContentSections.map(s => s.title).join(", ") || "Not started yet"
                            };
                            
                            const personalityPrompt = `You are ${firstName}'s friendly study buddy and tutor, helping her learn about "${taskTitle}". 
You're knowledgeable, patient, encouraging, and explain things clearly with examples.
Keep answers concise (2-4 sentences) but helpful. Use **bold** for key terms and \`code\` for technical terms.
If she asks something unrelated, gently guide her back to the topic.
Celebrate her progress and curiosity!`;

                            const chatHistory = taskDoubtMessages.map(m => `${m.role}: ${m.content}`).join("\n");
                            
                            // Send to webhook with context
                            const res = await fetch(
                              "https://saadkhan1004.app.n8n.cloud/webhook/2e0a63f4-863a-43df-b9bb-4d0316aa9998",
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  message: userMessage,
                                  personalityPrompt,
                                  context,
                                  chatHistory
                                }),
                              }
                            );

                            let replyText = "";
                            try {
                              const data = await res.json();
                              replyText = data?.reply || data?.message || data?.output || 
                                (typeof data === "string" ? data : "Let me think about that...");
                            } catch {
                              replyText = "I'm having trouble responding right now. Try again!";
                            }
                            
                            setTaskDoubtMessages(prev => [...prev, { role: "assistant", content: replyText }]);
                          } catch (err) {
                            console.error("Doubt chat error:", err);
                            setTaskDoubtMessages(prev => [...prev, { role: "assistant", content: "Oops! Something went wrong. Please try again! 💚" }]);
                          } finally {
                            setTaskDoubtLoading(false);
                          }
                        }}
                        className={`flex items-center gap-3 transition-all duration-500 ${taskDoubtExpanded ? "pt-4" : "pt-1"}`}
                      >
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={taskDoubtInput}
                            onChange={(e) => setTaskDoubtInput(e.target.value)}
                            placeholder={`Ask about ${formatTaskTitle(selectedTask, "this topic")}...`}
                            className={`w-full rounded-2xl px-4 py-3 pr-10 text-sm transition-all duration-500 focus:outline-none focus:ring-2 ${
                              taskDoubtExpanded 
                                ? "bg-gray-100 text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:ring-emerald-300 focus:border-emerald-300" 
                                : "border border-white/20 bg-white/90 text-teal-900 placeholder:text-teal-400 focus:ring-teal-200/80"
                            }`}
                          />
                          <span className={`pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs ${
                            taskDoubtExpanded ? "text-gray-400" : "text-teal-400"
                          }`}>
                            ⏎
                          </span>
                        </div>
                        <button
                          type="submit"
                          disabled={taskDoubtLoading || !taskDoubtInput.trim()}
                          className={`inline-flex items-center gap-1 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
                            taskDoubtExpanded 
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-xl hover:scale-105" 
                              : "bg-white/95 text-teal-700 shadow-teal-900/30 hover:bg-white"
                          }`}
                        >
                          <span>Ask</span>
                          <span>💬</span>
                        </button>
                      </form>
                    </div>
                  </div>
                  </div>

                  {/* Learning Resources */}
                  <div className="bg-white rounded-2xl border border-pink-100 shadow-lg p-5">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                      <span>🔗</span> Learning Resources
                    </h3>

                    {!taskResourcesLoading && taskResources.length === 0 && (
                      <button
                        onClick={async () => {
                          setTaskResourcesLoading(true);
                          try {
                            const taskTitle = formatTaskTitle(selectedTask, "Task");
                            const instruction = `I need REAL, WORKING URLs for learning "${taskTitle}". 

Provide resource with VERIFIED working link from:
- YouTube (https://www.youtube.com/results?search_query=TOPIC)

Return ONLY valid JSON array:
[{"title": "Learn X - YouTube", "url": "https://www.youtube.com/results?search_query=learn+x+tutorial"}]

Replace spaces with + in URLs. NO markdown, ONLY JSON.`;
                            const data = `Topic: ${taskTitle}`;
                            const result = await AISlave(instruction, data);
                            try {
                              const parsed = JSON.parse(result);
                              if (Array.isArray(parsed)) {
                                setTaskResources(parsed.filter(r => r.url && r.url.startsWith('http')));
                              }
                            } catch {
                              const match = result.match(/\[[\s\S]*\]/);
                              if (match) {
                                const parsed = JSON.parse(match[0]);
                                setTaskResources(parsed.filter(r => r.url && r.url.startsWith('http')));
                              }
                            }
                          } catch (err) {
                            console.error("Failed to fetch resources:", err);
                          } finally {
                            setTaskResourcesLoading(false);
                          }
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                      >
                        <span>✨</span> Find Resources
                      </button>
                    )}

                    {taskResourcesLoading && (
                      <div className="flex flex-col items-center gap-3 py-6">
                        <svg className="w-6 h-6 animate-spin text-pink-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span className="text-sm text-gray-600">Finding resources...</span>
                      </div>
                    )}

                    {taskResources.length > 0 && (
                      <div className="space-y-2">
                        {taskResources.map((res, idx) => (
                          <a
                            key={idx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 rounded-xl bg-gradient-to-r from-gray-50 to-pink-50 hover:from-pink-50 hover:to-purple-50 border border-transparent hover:border-pink-200 transition-all hover:shadow-md group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-200 transition-colors">
                                <svg className="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </div>
                              <p className="text-sm font-medium text-gray-800 group-hover:text-pink-600 transition-colors truncate">{res.title}</p>
                            </div>
                          </a>
                        ))}
                        <button
                          onClick={() => setTaskResources([])}
                          className="w-full mt-2 py-2 text-xs text-gray-500 hover:text-pink-500 transition-colors"
                        >
                          🔄 Find Different Resources
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Welcome */}
      <section className="relative overflow-hidden px-4 py-6">
        {/* Decorative backgrounds with animation */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-fuchsia-200/20 rounded-full blur-3xl animate-pulse" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-4">
            {/* Welcome Message */}
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-pink-100 mb-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-600">Welcome back, {firstName}! 👑</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Your <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent animate-shimmer">Ascend Dashboard</span>
              </h1>
              <p className="text-gray-600 max-w-lg">
                {userProfile?.goals?.goal ? (
                  <>Goal: <strong>{userProfile.goals.goal}</strong> in {userProfile.goals.durationWeeks} weeks ✨</>
                ) : (
                  <>Track your progress, complete daily tasks, and become the woman you're meant to be. ✨</>
                )}
              </p>
            </div>

            {/* Compact Stats Row to the right */}
            <div className="flex flex-wrap gap-3 text-xs md:text-sm lg:justify-end w-full lg:w-auto">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 border border-pink-100 shadow-sm hover:shadow-lg hover:scale-105 hover:border-pink-200 transition-all duration-300 cursor-default group">
                <span className="text-lg group-hover:animate-bounce">✅</span>
                <div>
                  <p className="font-semibold text-gray-800">{completedTasksCount}</p>
                  <p className="text-[11px] text-gray-500">Completed</p>
                </div>
                {totalTasksCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-pink-50 text-pink-500 font-medium text-[10px]">
                    {completionPercentage}%
                  </span>
                )}
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 border border-pink-100 shadow-sm hover:shadow-lg hover:scale-105 hover:border-orange-200 transition-all duration-300 cursor-default group">
                <span className="text-lg group-hover:animate-bounce">🔥</span>
                <div>
                  <p className="font-semibold text-gray-800">{weeklyTasks.length}</p>
                  <p className="text-[11px] text-gray-500">Weekly tasks</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 border border-pink-100 shadow-sm hover:shadow-lg hover:scale-105 hover:border-purple-200 transition-all duration-300 cursor-default group">
                <span className="text-lg group-hover:animate-bounce">🗺️</span>
                <div>
                  <p className="font-semibold text-gray-800">{roadmaps.length}</p>
                  <p className="text-[11px] text-gray-500">Roadmaps</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 border border-pink-100 shadow-sm hover:shadow-lg hover:scale-105 hover:border-blue-200 transition-all duration-300 cursor-default group">
                <span className="text-lg group-hover:animate-spin">⏱️</span>
                <div>
                  <p className="font-semibold text-gray-800">{totalTasksCount - completedTasksCount}</p>
                  <p className="text-[11px] text-gray-500">Remaining</p>
                </div>
                {roadmaps[0]?.duration && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-500 font-medium text-[10px]">
                    {roadmaps[0].duration}w
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {["overview", "roadmap", "interviews", "analytics"].map((tab, idx) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 hover:scale-[1.02] ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white shadow-lg shadow-pink-500/30 animate-glow"
                    : "bg-white/60 text-gray-600 hover:bg-white hover:shadow-md hover:text-pink-600"
                }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content - Overview */}
          {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Daily Focused Weekly Tasks Section */}
              {weeklyTasks.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-100 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
                        <span className="text-2xl animate-pulse">📅</span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">Today&apos;s Focus</h2>
                        <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("roadmap")}
                      className="text-sm font-medium text-pink-600 hover:text-pink-700 underline-offset-4 hover:underline flex items-center gap-1 group"
                    >
                      View full roadmap <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>

                  {/* Daily-focused list: show only today's tasks based on date field */}
                  <div className="space-y-3">
                    {(() => {
                      const todaysTasks = allTasks.filter(t => {
                        if (t.status === "Completed") return false;
                        if (!t.date) return false;
                        const taskDate = new Date(t.date);
                        if (Number.isNaN(taskDate.getTime())) return false;
                        const today = new Date();
                        return (
                          taskDate.getFullYear() === today.getFullYear() &&
                          taskDate.getMonth() === today.getMonth() &&
                          taskDate.getDate() === today.getDate()
                        );
                      });

                      if (todaysTasks.length === 0) {
                        return (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">All Tasks Completed! 🎉</h3>
                            <p className="text-sm text-gray-500">You&apos;re all caught up for today. Great work, Queen!</p>
                          </div>
                        );
                      }

                      return todaysTasks.slice(0, 6).map((task, idx) => (
                          <div
                            key={task.$id || idx}
                            className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-pink-50 rounded-2xl border border-pink-100 hover:shadow-lg hover:scale-[1.01] hover:border-pink-200 transition-all duration-300 cursor-pointer group"
                            onClick={() => setSelectedTask(task)}
                            style={{ animationDelay: `${idx * 0.1}s` }}
                          >
                            <div
                              className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                                task.status === "Completed"
                                  ? "bg-gradient-to-r from-pink-500 to-purple-500 border-pink-500"
                                  : "border-gray-300 group-hover:border-pink-400"
                              }`}
                            >
                              {task.status === "Completed" && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h5 className="font-medium text-gray-800 text-sm">
                                  {formatTaskTitle(task, `Task ${idx + 1}`)}
                                </h5>
                                {task.day && (
                                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/80 text-pink-600">
                                    Day {task.day}
                                  </span>
                                )}
                              </div>
                              {formatTaskDescription(task) && (
                                <p className="text-xs mt-1 line-clamp-2 text-gray-600">
                                  {formatTaskDescription(task, "")}
                                </p>
                              )}
                            </div>
                          </div>
                        ));
                    })()}
                  </div>
                </div>
              )}

              {/* Roadmap Details Section */}
              {roadmaps.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-100 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🗺️</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Your Roadmap</h2>
                      <p className="text-sm text-gray-500">{roadmaps[0]?.duration || 0} weeks journey</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {roadmaps.map((roadmap, idx) => (
                      <div key={roadmap.$id} className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg mb-2">Roadmap #{idx + 1}</h3>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-white/60 rounded-full text-xs font-medium text-purple-600">
                                📅 {roadmap.duration} weeks
                              </span>
                              <span className="px-3 py-1 bg-white/60 rounded-full text-xs font-medium text-pink-600">
                                Created {new Date(roadmap.$createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold text-purple-600">{completionPercentage}%</span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                              style={{ width: `${completionPercentage}%` }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveTab("roadmap")}
                          className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                          View Full Roadmap →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Roadmap Generation in Progress - shown if no roadmap */}
              {roadmaps.length === 0 && !loading && (
                <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 border border-pink-200 shadow-xl relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-200/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                  
                  <div className="relative z-10 text-center">
                    {/* Animated icon */}
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl animate-pulse" />
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                        <span className="text-4xl animate-bounce">🎯</span>
                      </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                      Crafting Your Perfect Roadmap ✨
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                      Our AI is designing a personalized journey specially tailored for you. 
                      This will help you achieve <span className="font-semibold text-pink-600">{userProfile?.goals?.goal || "your goals"}</span>!
                    </p>

                    {/* Progress indicators */}
                    <div className="space-y-4 mb-8 max-w-md mx-auto">
                      <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">Analyzing your goals</span>
                      </div>

                      <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <span className="text-gray-700 font-medium">Creating weekly milestones</span>
                      </div>

                      <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-xl p-4 opacity-60">
                        <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex-shrink-0" />
                        <span className="text-gray-500 font-medium">Personalizing daily tasks</span>
                      </div>
                    </div>

                    {/* Animated progress bar */}
                    <div className="max-w-md mx-auto mb-8">
                      <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full animate-pulse bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]" style={{ width: '66%' }} />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">This usually takes a few moments...</p>
                    </div>

                    {/* Refresh button */}
                    <button
                      onClick={fetchDashboardData}
                      className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300"
                    >
                      <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Check Status
                    </button>

                    <p className="text-xs text-gray-400 mt-4">
                      💡 Tip: You'll be notified once your roadmap is ready!
                    </p>
                  </div>

                  {/* Add shimmer animation */}
                  <style>{`
                    @keyframes shimmer {
                      0% { background-position: 200% 0; }
                      100% { background-position: -200% 0; }
                    }
                  `}</style>
                </div>
              )}

              {/* Features Grid removed per user request */}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <FutureSelfChat
                firstName={firstName}
                chatExpanded={chatExpanded}
                setChatExpanded={setChatExpanded}
                chatMessages={chatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                chatLoading={chatLoading}
                onSendChat={handleSendChat}
              />

              {/* Progress Ring */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-pink-100 shadow-xl text-center hover:shadow-2xl hover:border-pink-200 transition-all duration-300 group">
                <h3 className="font-bold text-gray-800 mb-4 group-hover:text-pink-600 transition-colors">Weekly Progress</h3>
                <div className="relative w-32 h-32 mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f3e8ff" strokeWidth="12" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="url(#progress-gradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * completionPercentage) / 100}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <span className="text-2xl font-bold text-gray-800">{completionPercentage}%</span>
                      <p className="text-xs text-gray-500">Complete</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {completionPercentage > 0 ? `${completedTasksCount} of ${totalTasksCount} tasks done!` : "Start your journey to see progress!"}
                </p>
              </div>
            </div>
          </div>
          )}

          {/* Tab Content - Roadmap */}
          {activeTab === "roadmap" && (
            <div className="space-y-6">
              {/* Back button */}
              <button
                onClick={() => setActiveTab("overview")}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Overview
              </button>

              {roadmaps.length > 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-100 shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-3xl">🗺️</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">Your Complete Roadmap</h2>
                        <p className="text-gray-500">{roadmaps[0]?.duration || 0} weeks journey to success</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                        {completionPercentage}%
                      </div>
                      <p className="text-sm text-gray-500">Complete</p>
                    </div>
                  </div>

                  {/* Overall Progress Bar */}
                  <div className="mb-8">
                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <span>{completedTasksCount} tasks completed</span>
                      <span>{totalTasksCount - completedTasksCount} tasks remaining</span>
                    </div>
                  </div>

                  {/* Weekly -> Daily -> Tasks hierarchy */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly breakdown</h3>

                    {weeklyTasks.length > 0 ? (
                      <div className="space-y-4">
                        {weeklyTasks.map((week, weekIdx) => {
                          const isWeekExpanded = expandedWeeks[week.$id];
                          const weekDailyTasks = Array.isArray(week.dailyTasks) ? week.dailyTasks : [];
                          const weekCompleted = isWeekCompleted(week);
                          const weekStats = getWeekStats(week);

                          return (
                            <div key={week.$id || weekIdx} className={`border rounded-2xl overflow-hidden ${weekCompleted ? "border-green-200" : "border-purple-100"}`}>
                              {/* Week Header */}
                              <button
                                onClick={() => toggleWeekExpand(week.$id || weekIdx)}
                                className={`w-full flex items-center justify-between p-4 transition-all ${
                                  weekCompleted 
                                    ? "bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100" 
                                    : "bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                                    weekCompleted 
                                      ? "bg-gradient-to-br from-green-400 to-emerald-500" 
                                      : "bg-gradient-to-br from-purple-400 to-pink-500"
                                  }`}>
                                    {weekCompleted ? (
                                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    ) : (
                                      <span className="text-white font-bold text-sm">W{week.week || weekIdx + 1}</span>
                                    )}
                                  </div>
                                  <div className="text-left">
                                    <h3 className={`font-bold ${weekCompleted ? "text-green-700" : "text-gray-800"}`}>{week.topic || `Week ${week.week || weekIdx + 1}`}</h3>
                                    <p className="text-xs text-gray-500">{weekStats.completedDays}/{weekStats.totalDays} days • {weekStats.completedTasks}/{weekStats.totalTasks} tasks</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    weekCompleted 
                                      ? "bg-green-100 text-green-600" 
                                      : "bg-white/60 text-purple-600"
                                  }`}>
                                    {weekCompleted ? "✓ Completed" : `${Math.round((weekStats.completedTasks / Math.max(weekStats.totalTasks, 1)) * 100)}% Done`}
                                  </span>
                                  <svg
                                    className={`w-5 h-5 text-gray-400 transition-transform ${isWeekExpanded ? "rotate-180" : ""}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </button>

                              {/* Daily dropdowns */}
                              {isWeekExpanded && (
                                <div className="p-4 bg-white/50 space-y-3">
                                  {week.overview && (
                                    <p className="text-sm text-gray-600 mb-4 p-3 bg-purple-50 rounded-xl">{week.overview}</p>
                                  )}

                                  {weekDailyTasks.length > 0 ? (
                                    weekDailyTasks.map((day, dayIdx) => {
                                      const dayId = day.$id || day.id || `day-${weekIdx}-${dayIdx}`;
                                      const isDayExpanded = expandedDays[dayId];
                                      const dayTasks = Array.isArray(day.tasks) ? day.tasks : [];
                                      const dayCompleted = isDayCompleted(day);
                                      const dayStats = getDayStats(day);

                                      return (
                                        <div key={dayId} className={`border rounded-xl overflow-hidden ${dayCompleted ? "border-green-200" : "border-pink-100"}`}>
                                          <button
                                            onClick={() => toggleDayExpand(dayId)}
                                            className={`w-full flex items-center justify-between p-3 transition-all ${
                                              dayCompleted 
                                                ? "bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100" 
                                                : "bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100"
                                            }`}
                                          >
                                            <div className="flex items-center gap-3">
                                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${
                                                dayCompleted 
                                                  ? "bg-gradient-to-br from-green-400 to-emerald-400" 
                                                  : "bg-gradient-to-br from-pink-400 to-purple-400"
                                              }`}>
                                                {dayCompleted ? (
                                                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                  </svg>
                                                ) : (
                                                  <span className="text-white font-bold text-xs">D{day.day || dayIdx + 1}</span>
                                                )}
                                              </div>
                                              <div className="text-left">
                                                <h4 className={`font-semibold text-sm ${dayCompleted ? "text-green-700" : "text-gray-800"}`}>{day.topic || `Day ${day.day || dayIdx + 1}`}</h4>
                                                <p className="text-xs text-gray-500">{dayStats.completed}/{dayStats.total} tasks</p>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                dayCompleted ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                                              }`}>
                                                {dayCompleted ? "✓ Completed" : `${dayStats.completed}/${dayStats.total} done`}
                                              </span>
                                              <svg
                                                className={`w-4 h-4 text-gray-400 transition-transform ${isDayExpanded ? "rotate-180" : ""}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                              </svg>
                                            </div>
                                          </button>

                                          {isDayExpanded && (
                                            <div className="p-3 bg-white/80 space-y-2">
                                              {day.overview && (
                                                <p className="text-xs text-gray-600 mb-3 p-2 bg-pink-50 rounded-lg">{day.overview}</p>
                                              )}

                                              {dayTasks.length > 0 ? (
                                                dayTasks.map((task, taskIdx) => {
                                                  const taskId = task.$id || task.id || `task-${dayIdx}-${taskIdx}`;
                                                  return (
                                                    <div
                                                      key={taskId}
                                                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-pink-50 rounded-lg border border-pink-100 hover:shadow-md transition-all cursor-pointer"
                                                      onClick={() => setSelectedTask(task)}
                                                    >
                                                      <div
                                                        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                                          task.status === "Completed"
                                                            ? "bg-gradient-to-r from-pink-500 to-purple-500 border-pink-500"
                                                            : "border-gray-300"
                                                        }`}
                                                      >
                                                        {task.status === "Completed" && (
                                                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                          </svg>
                                                        )}
                                                      </div>
                                                      <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                          <h5 className={`font-medium text-gray-800 text-sm ${task.status === "Completed" ? "line-through text-gray-400" : ""}`}>
                                                            {typeof task.index === "number" ? `${task.index}. ` : ""}
                                                            {formatTaskTitle(task, `Task ${taskIdx + 1}`)}
                                                          </h5>
                                                        </div>
                                                        {formatTaskDescription(task) && (
                                                          <p className={`text-xs mt-1 line-clamp-2 ${task.status === "Completed" ? "text-gray-400" : "text-gray-600"}`}>
                                                            {formatTaskDescription(task, "")}
                                                          </p>
                                                        )}
                                                      </div>
                                                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                                                        task.status === "Completed"
                                                          ? "bg-green-100 text-green-600"
                                                          : "bg-yellow-100 text-yellow-600"
                                                      }`}>
                                                        {task.status || "Pending"}
                                                      </span>
                                                    </div>
                                                  );
                                                })
                                              ) : (
                                                <p className="text-xs text-gray-400 text-center py-2">No tasks for this day</p>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <p className="text-sm text-gray-400 text-center py-4">No daily tasks for this week</p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-2xl">
                        <span className="text-4xl mb-4 block">📋</span>
                        <p className="text-gray-500">No weekly tasks found yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Your weekly and daily breakdown will appear here.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl border border-pink-100 shadow-xl">
                  <span className="text-6xl mb-4 block">🗺️</span>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Roadmap Yet</h3>
                  <p className="text-gray-500 mb-6">Your personalized roadmap is being crafted. Check back soon!</p>
                  <button
                    onClick={() => { setActiveTab("overview"); fetchDashboardData(); }}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Back to Overview
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab Content - Interviews */}
          {activeTab === "interviews" && (
            <InterviewsTab
              interviewPhone={interviewPhone}
              setInterviewPhone={setInterviewPhone}
              interviewLoading={interviewLoading}
              interviewSuccess={interviewSuccess}
              onStartInterview={handleStartInterview}
            />
          )}

          {/* Tab Content - Analytics */}
          {activeTab === "analytics" && (
            <AnalyticsTab
              allTasks={allTasks}
              weeklyTasks={weeklyTasks}
              completedTasksCount={completedTasksCount}
              totalTasksCount={totalTasksCount}
              completionPercentage={completionPercentage}
              getWeekStats={getWeekStats}
              formatTaskTitle={formatTaskTitle}
            />
          )}
        </div>
      </section>
    </div>
  );
}
