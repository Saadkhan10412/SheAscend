import React from "react";

export default function TopicContentSection({
  sections,
  loading,
  onStartLearning,
  onLoadMore,
  onToggleSection,
  topicTitle
}) {
  return (
    <div className="bg-white rounded-2xl border border-pink-100 shadow-lg overflow-hidden">
      <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-pink-100">
        <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-800">
          <span className="text-2xl">📚</span> Learn: {topicTitle}
        </h3>
        <p className="text-sm text-gray-500 mt-1">Expandable content to help you master this topic</p>
      </div>

      <div className="p-6">
        {sections.length === 0 && !loading && (
          <button
            onClick={onStartLearning}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            <span>✨</span> Start Learning This Topic
          </button>
        )}

        {loading && sections.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="flex gap-1">
              <span className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
              <span className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
              <span className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
            </div>
            <span className="text-gray-600">Preparing your learning content...</span>
          </div>
        )}

        {sections.length > 0 && (
          <div className="space-y-4">
            {sections.map((section, idx) => (
              <div key={idx} className="border border-pink-100 rounded-xl overflow-hidden animate-typewriter" style={{ animationDelay: `${idx * 0.1}s` }}>
                <button
                  onClick={() => onToggleSection(idx)}
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
                    <div 
                      className="prose prose-sm prose-pink max-w-none text-gray-700 leading-relaxed"
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

            <button
              onClick={onLoadMore}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-pink-200 text-pink-600 font-medium hover:bg-pink-50 hover:border-pink-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
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
  );
}
