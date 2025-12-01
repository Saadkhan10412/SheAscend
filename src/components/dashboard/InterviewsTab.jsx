import React from "react";

export default function InterviewsTab({
  interviewPhone,
  setInterviewPhone,
  interviewLoading,
  interviewSuccess,
  onStartInterview
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-100 shadow-xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-3xl">🎤</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI Mock Interviews</h2>
          <p className="text-gray-500">Practice with our AI interviewer via phone call</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</div>
            <input
              type="tel"
              value={interviewPhone}
              onChange={(e) => setInterviewPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit phone number"
              className="w-full pl-14 pr-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-800"
            />
          </div>
          <button
            onClick={onStartInterview}
            disabled={interviewLoading || interviewPhone.length !== 10}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {interviewLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Calling...
              </>
            ) : (
              <>
                <span>📞</span>
                Start Interview
              </>
            )}
          </button>
        </div>
        {interviewSuccess && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
            <span>✅</span>
            Interview call initiated! You'll receive a call shortly.
          </div>
        )}
      </div>
    </div>
  );
}
