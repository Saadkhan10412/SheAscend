import React from "react";

export default function TopicTutorChat({
  firstName,
  expanded,
  setExpanded,
  messages,
  input,
  setInput,
  loading,
  onSendMessage,
  topicTitle
}) {
  return (
    <>
      <div 
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-all duration-500 ${
          expanded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setExpanded(false)}
      />

      <div className={`transition-all duration-500 ease-out ${
        expanded 
          ? "fixed inset-4 md:inset-8 z-[70]" 
          : "relative hover:scale-[1.01] hover:-translate-y-0.5"
      }`}>
      <div className={`h-full transition-all duration-500 ease-out overflow-hidden ${
        expanded 
          ? "bg-white rounded-3xl shadow-2xl flex flex-col" 
          : "relative rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl"
      }`}>
        {!expanded && (
          <>
            <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-black/10 blur-2xl" />
          </>
        )}

        <div className={`relative z-10 flex flex-col transition-all duration-500 ${
          expanded ? "h-full p-6 md:p-8" : "p-5 space-y-3"
        }`}>
          <div className={`flex items-center justify-between gap-3 ${expanded ? "pb-4 border-b border-gray-100" : ""}`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${
                  expanded 
                    ? "bg-gradient-to-br from-emerald-500 to-teal-500" 
                    : "bg-white/15 border border-white/20"
                }`}>
                  <span className="text-xl">🎓</span>
                </div>
                <span className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse transition-all duration-500 ${
                  expanded ? "ring-2 ring-white" : "ring-2 ring-teal-700"
                }`} />
              </div>
              <div>
                <p className={`text-xs uppercase tracking-[0.15em] transition-colors duration-500 ${
                  expanded ? "text-gray-400" : "text-white/70"
                }`}>Topic Tutor</p>
                <h3 className={`text-base font-semibold transition-colors duration-500 ${
                  expanded ? "text-gray-800" : "text-white"
                }`}>{`${firstName}'s Study Buddy`}</h3>
              </div>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                expanded 
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-600" 
                  : "bg-white/15 hover:bg-white/25 border border-white/20 text-white"
              }`}
              title={expanded ? "Minimize" : "Expand"}
            >
              {expanded ? (
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

          <div className={`rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs text-white/90 transition-all duration-500 overflow-hidden ${
            expanded ? "opacity-0 h-0 py-0 my-0 border-0" : "opacity-100"
          }`}>
            <span className="font-medium">📚 Learning:</span> {topicTitle}
          </div>

          <div className={`rounded-2xl p-4 overflow-y-auto space-y-3 transition-all duration-500 ${
            expanded 
              ? "flex-1 bg-gray-50 border border-gray-100" 
              : "bg-black/10 backdrop-blur-md max-h-48"
          }`}>
            {messages.length === 0 && (
              <div className="flex gap-3">
                <div className={`mt-1 h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full text-sm ${
                  expanded ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white" : "bg-white/15"
                }`}>
                  🎓
                </div>
                <p className={`text-sm leading-relaxed ${expanded ? "text-gray-600" : "text-white/85"}`}>
                  {`Hey ${firstName}! I'm here to help you understand "${topicTitle}". Ask me anything - no question is too simple! 💚`}
                </p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} ${msg.role !== "user" ? "animate-bot-message" : ""}`}
                style={msg.role !== "user" ? { animationDelay: '0.1s' } : {}}
              >
                {msg.role !== "user" && (
                  <div className={`mt-1 mr-2 h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full text-sm animate-bot-message ${
                    expanded ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white" : "bg-white/20"
                  }`}>
                    🎓
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all duration-300 ${msg.role !== "user" ? "animate-bot-message" : ""} ${
                    msg.role === "user"
                      ? expanded 
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-sm"
                        : "bg-white text-teal-800 rounded-br-sm"
                      : expanded
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
                          .replace(/`(.*?)`/g, `<code class="${expanded ? 'bg-emerald-50 text-emerald-600' : 'bg-white/20 text-white'} px-1 rounded">$1</code>`)
                      }}
                    />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className={`flex items-center gap-2 text-xs ${expanded ? "text-gray-500" : "text-white/80"}`}>
                <span className={`h-2 w-2 rounded-full animate-pulse ${expanded ? "bg-emerald-400" : "bg-white/80"}`} />
                Study Buddy is thinking...
              </div>
            )}
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              onSendMessage();
            }}
            className={`flex items-center gap-3 transition-all duration-500 ${expanded ? "pt-4" : "pt-1"}`}
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={`Ask about ${topicTitle}...`}
                className={`w-full rounded-2xl px-4 py-3 pr-10 text-sm transition-all duration-500 focus:outline-none focus:ring-2 ${
                  expanded 
                    ? "bg-gray-100 text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:ring-emerald-300 focus:border-emerald-300" 
                    : "border border-white/20 bg-white/90 text-teal-900 placeholder:text-teal-400 focus:ring-teal-200/80"
                }`}
              />
              <span className={`pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs ${
                expanded ? "text-gray-400" : "text-teal-400"
              }`}>
                ⏎
              </span>
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`inline-flex items-center gap-1 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
                expanded 
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
    </>
  );
}
