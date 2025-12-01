import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-50 text-gray-700 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-500 rounded-md flex items-center justify-center text-white">👑</div>
          <span className="font-semibold text-gray-800">SheAscend</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/privacy" className="hover:text-pink-500">Privacy</Link>
          <Link to="/contact" className="hover:text-pink-500">Contact</Link>
        </div>

        <div className="text-xs text-gray-500">© {year} SheAscend. All rights reserved.</div>
      </div>
    </footer>
  );
}
