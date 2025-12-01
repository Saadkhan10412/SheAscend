import React from "react";

export default function LearningResources({
  resources,
  resourcesLoading,
  onFindResources,
  onRefresh
}) {
  return (
    <div className="bg-white rounded-2xl border border-pink-100 shadow-lg p-5">
      <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <span>🔗</span> Learning Resources
      </h3>

      {!resourcesLoading && resources.length === 0 && (
        <button
          onClick={onFindResources}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          <span>✨</span> Find Resources
        </button>
      )}

      {resourcesLoading && (
        <div className="flex flex-col items-center gap-3 py-6">
          <svg className="w-6 h-6 animate-spin text-pink-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm text-gray-600">Finding resources...</span>
        </div>
      )}

      {resources.length > 0 && (
        <div className="space-y-2">
          {resources.map((res, idx) => (
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
            onClick={onRefresh}
            className="w-full mt-2 py-2 text-xs text-gray-500 hover:text-pink-500 transition-colors"
          >
            🔄 Find Different Resources
          </button>
        </div>
      )}
    </div>
  );
}
