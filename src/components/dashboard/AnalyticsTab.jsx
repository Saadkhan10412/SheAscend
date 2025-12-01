import React from "react";

export default function AnalyticsTab({
  allTasks,
  weeklyTasks,
  completedTasksCount,
  totalTasksCount,
  completionPercentage,
  getWeekStats,
  formatTaskTitle
}) {
  const calculateStreak = () => {
    const completedDates = allTasks
      .filter(t => t.status === "Completed" && t.date)
      .map(t => {
        const d = new Date(t.date);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      });
    const uniqueDates = [...new Set(completedDates)].sort().reverse();
    
    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    for (let i = 0; i < 365; i++) {
      const dateStr = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
      if (uniqueDates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const generateHeatmapData = () => {
    const weeks = [];
    const today = new Date();
    
    const completedTasks = allTasks.filter(t => t.status === "Completed");
    const completedDates = completedTasks.map(t => {
      const completionDate = t.$updatedAt || t.date || t.$createdAt;
      if (!completionDate) return null;
      const d = new Date(completionDate);
      if (isNaN(d.getTime())) return null;
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }).filter(Boolean);
    
    const dateCounts = {};
    completedDates.forEach(date => {
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });

    for (let w = 11; w >= 0; w--) {
      const weekDays = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + (6 - d)));
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        weekDays.push({ date: dateStr, count: dateCounts[dateStr] || 0 });
      }
      weeks.push(weekDays);
    }
    return weeks;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-pink-100 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-lg">📋</span>
            </div>
            <span className="text-sm font-medium text-gray-500">Total Tasks</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{totalTasksCount}</p>
          <p className="text-xs text-gray-400 mt-1">In your roadmap</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-green-100 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-lg">✅</span>
            </div>
            <span className="text-sm font-medium text-gray-500">Completed</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{completedTasksCount}</p>
          <p className="text-xs text-green-500 mt-1">+{completedTasksCount > 0 ? Math.round((completedTasksCount / Math.max(totalTasksCount, 1)) * 100) : 0}% done</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-orange-100 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-lg">🔥</span>
            </div>
            <span className="text-sm font-medium text-gray-500">Current Streak</span>
          </div>
          <p className="text-3xl font-bold text-orange-500">{calculateStreak()}</p>
          <p className="text-xs text-orange-400 mt-1">days in a row</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-100 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-lg">📈</span>
            </div>
            <span className="text-sm font-medium text-gray-500">Completion Rate</span>
          </div>
          <p className="text-3xl font-bold text-purple-600">{completionPercentage}%</p>
          <p className="text-xs text-purple-400 mt-1">overall progress</p>
        </div>
      </div>

      {/* Progress Ring & Activity Heatmap */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-pink-100 shadow-xl">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🎯</span> Overall Progress
          </h3>
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f3e8ff" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="url(#analytics-gradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * completionPercentage) / 100}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="analytics-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-gray-800">{completionPercentage}%</span>
                <span className="text-xs text-gray-500">Complete</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
                <span className="text-sm text-gray-600">Completed: <strong>{completedTasksCount}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <span className="text-sm text-gray-600">Remaining: <strong>{totalTasksCount - completedTasksCount}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-sm text-gray-600">Total: <strong>{totalTasksCount}</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-pink-100 shadow-xl">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📅</span> Activity Heatmap
          </h3>
          <p className="text-xs text-gray-500 mb-4">Task completions in the last 12 weeks</p>
          <div className="overflow-x-auto">
            <div className="flex gap-1">
              {generateHeatmapData().map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {week.map((day, dayIdx) => {
                    let colorClass = "bg-gray-100";
                    if (day.count === 1) colorClass = "bg-green-200";
                    else if (day.count === 2) colorClass = "bg-green-300";
                    else if (day.count === 3) colorClass = "bg-green-400";
                    else if (day.count >= 4) colorClass = "bg-green-500";
                    
                    return (
                      <div
                        key={dayIdx}
                        className={`w-3 h-3 rounded-sm ${colorClass} hover:ring-2 hover:ring-pink-300 transition-all cursor-pointer`}
                        title={`${day.date}: ${day.count} task${day.count !== 1 ? 's' : ''} completed`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 mt-3 text-xs text-gray-500">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-gray-100" />
              <div className="w-3 h-3 rounded-sm bg-green-200" />
              <div className="w-3 h-3 rounded-sm bg-green-300" />
              <div className="w-3 h-3 rounded-sm bg-green-400" />
              <div className="w-3 h-3 rounded-sm bg-green-500" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Breakdown */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-pink-100 shadow-xl">
        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>📊</span> Weekly Progress Breakdown
        </h3>
        <div className="space-y-4">
          {weeklyTasks.length > 0 ? weeklyTasks.map((week, idx) => {
            const stats = getWeekStats(week);
            const weekPercent = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;
            
            return (
              <div key={week.$id || idx} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                      weekPercent === 100 ? "bg-gradient-to-br from-green-400 to-emerald-500" : "bg-gradient-to-br from-purple-400 to-pink-500"
                    }`}>
                      {weekPercent === 100 ? "✓" : `W${week.week || idx + 1}`}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{week.topic || `Week ${week.week || idx + 1}`}</p>
                      <p className="text-xs text-gray-500">{stats.completedTasks}/{stats.totalTasks} tasks • {stats.completedDays}/{stats.totalDays} days</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${weekPercent === 100 ? "text-green-500" : "text-purple-500"}`}>
                    {weekPercent}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      weekPercent === 100 
                        ? "bg-gradient-to-r from-green-400 to-emerald-500" 
                        : "bg-gradient-to-r from-pink-500 to-purple-500"
                    }`}
                    style={{ width: `${weekPercent}%` }}
                  />
                </div>
              </div>
            );
          }) : (
            <p className="text-center text-gray-400 py-8">No weekly data available yet</p>
          )}
        </div>
      </div>

      {/* Recent Completions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-pink-100 shadow-xl">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>⚡</span> Recent Completions
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {allTasks.filter(t => t.status === "Completed").slice(0, 10).length > 0 ? (
            allTasks
              .filter(t => t.status === "Completed")
              .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
              .slice(0, 10)
              .map((task, idx) => (
                <div key={task.$id || idx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{formatTaskTitle(task, `Task ${idx + 1}`)}</p>
                    {task.date && (
                      <p className="text-xs text-gray-500">{new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    )}
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full flex-shrink-0">Done ✨</span>
                </div>
              ))
          ) : (
            <div className="text-center py-8">
              <span className="text-3xl mb-2 block">🚀</span>
              <p className="text-gray-500 text-sm">No completed tasks yet</p>
              <p className="text-xs text-gray-400">Complete your first task to see it here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
