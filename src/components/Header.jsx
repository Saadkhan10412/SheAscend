import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <header className="bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 mt-0 pt-0">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">👑</span>
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              SheAscend
            </span>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-pink-500 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-pink-500 font-medium transition-colors"
                >
                  Sign In
                </Link>
                {isLanding && (
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-full font-medium text-sm shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 hover:scale-105 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
