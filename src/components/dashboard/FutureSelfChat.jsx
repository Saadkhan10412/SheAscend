import React from "react";

export default function FutureSelfChat({
  firstName,
  chatExpanded,
  setChatExpanded,
  chatMessages,
  chatInput,
  setChatInput,
  chatLoading,
  onSendChat
}) {
  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-500 ${
          chatExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setChatExpanded(false)}
      />
      
      <div className={`transition-all duration-500 ease-out ${
        chatExpanded 
          ? "fixed inset-4 md:inset-8 z-50" 
          : "relative hover:scale-[1.02] hover:-translate-y-1"
      }`}>
      <div className={`h-full transition-all duration-500 ease-out overflow-hidden ${
        chatExpanded 
          ? "bg-white rounded-3xl shadow-2xl flex flex-col" 
          : "relative rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 text-white shadow-2xl"
      }`}>
        {!chatExpanded && (
          <>
            <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-black/10 blur-2xl" />
          </>
        )}

        <div className={`relative z-10 flex flex-col transition-all duration-500 ${
          chatExpanded ? "h-full p-6 md:p-8" : "p-6 space-y-4"
        }`}>
          <div className={`flex items-center justify-between gap-3 ${chatExpanded ? "pb-4 border-b border-gray-100" : ""}`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${
                  chatExpanded 
                    ? "bg-gradient-to-br from-purple-500 to-pink-500" 
                    : "bg-white/15 border border-white/20"
                }`}>
                  <span className="text-2xl">🔮</span>
                </div>
                <span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 animate-pulse transition-all duration-500 ${
                  chatExpanded ? "ring-2 ring-white" : "ring-2 ring-purple-700"
                }`} />
              </div>
              <div>
                <p className={`text-xs uppercase tracking-[0.18em] transition-colors duration-500 ${
                  chatExpanded ? "text-gray-400" : "text-white/70"
                }`}>AI Time Capsule</p>
                <h3 className={`text-lg font-semibold transition-colors duration-500 ${
                  chatExpanded ? "text-gray-800" : "text-white"
                }`}>{`Future ${firstName}`}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`text-right text-xs mr-2 transition-colors duration-500 ${
                chatExpanded ? "text-gray-400" : "text-white/70"
              }`}>
                <p className="font-medium">Today</p>
                <p>{new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
              </div>
              <button
                onClick={() => setChatExpanded(!chatExpanded)}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  chatExpanded 
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-600" 
                    : "bg-white/15 hover:bg-white/25 border border-white/20 text-white"
                }`}
                title={chatExpanded ? "Minimize" : "Expand"}
              >
                {chatExpanded ? (
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

          <div className={`rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-xs text-white/80 italic transition-all duration-500 overflow-hidden ${
            chatExpanded ? "opacity-0 h-0 py-0 my-0 border-0" : "opacity-100"
          }`}>
            "Every message you send here is a note from the woman you're becoming."
          </div>

          <div className={`rounded-2xl p-4 overflow-y-auto space-y-3 transition-all duration-500 ${
            chatExpanded 
              ? "flex-1 bg-gray-50 border border-gray-100" 
              : "bg-black/10 backdrop-blur-md max-h-64"
          }`}>
            {chatMessages.length === 0 && (
              <div className="flex gap-3">
                <div className={`mt-1 h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full text-sm ${
                  chatExpanded ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white" : "bg-white/15"
                }`}>
                  👑
                </div>
                <p className={`text-sm leading-relaxed ${chatExpanded ? "text-gray-600" : "text-white/85"}`}>
                  {`Hey beautiful, I'm your Future ${firstName}. Tell me what you're dreaming about or struggling with today, and I'll guide you from the other side of your glow-up.`}
                </p>
              </div>
            )}
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} ${msg.role !== "user" ? "animate-bot-message" : ""}`}
                style={msg.role !== "user" ? { animationDelay: '0.1s' } : {}}
              >
                {msg.role !== "user" && (
                  <div className={`mt-1 mr-2 h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full text-sm animate-bot-message ${
                    chatExpanded ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white" : "bg-white/20"
                  }`}>
                    👑
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all duration-300 ${msg.role !== "user" ? "animate-bot-message" : ""} ${
                    msg.role === "user"
                      ? chatExpanded 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-sm"
                        : "bg-white text-purple-800 rounded-br-sm"
                      : chatExpanded
                        ? "bg-white text-gray-700 rounded-bl-sm border border-gray-200"
                        : "bg-white/18 text-white rounded-bl-sm border border-white/15"
                  }`}
                  style={msg.role !== "user" ? { animationDelay: '0.2s' } : {}}
                >
                  {msg.role !== "user" ? (
                    <span className="animate-text-reveal" style={{ animationDelay: '0.3s' }}>
                      {msg.content}
                    </span>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className={`flex items-center gap-2 text-xs ${chatExpanded ? "text-gray-500" : "text-white/80"}`}>
                <span className={`h-2 w-2 rounded-full animate-pulse ${chatExpanded ? "bg-purple-400" : "bg-white/80"}`} />
                {`Future ${firstName} is typing...`}
              </div>
            )}
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              onSendChat();
            }}
            className={`flex items-center gap-3 transition-all duration-500 ${chatExpanded ? "pt-4" : "pt-1"}`}
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder={`Ask Future ${firstName} for guidance...`}
                className={`w-full rounded-2xl px-4 py-3 pr-10 text-sm transition-all duration-500 focus:outline-none focus:ring-2 ${
                  chatExpanded 
                    ? "bg-gray-100 text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:ring-purple-300 focus:border-purple-300" 
                    : "border border-white/20 bg-white/90 text-purple-900 placeholder:text-purple-400 focus:ring-pink-200/80"
                }`}
              />
              <span className={`pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs ${
                chatExpanded ? "text-gray-400" : "text-purple-400"
              }`}>
                ⏎
              </span>
            </div>
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className={`inline-flex items-center gap-1 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
                chatExpanded 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl hover:scale-105" 
                  : "bg-white/95 text-purple-700 shadow-purple-900/30 hover:bg-white"
              }`}
            >
              <span>Send</span>
              <span>✨</span>
            </button>
          </form>
        </div>
      </div>
      </div>
    </>
  );
}
