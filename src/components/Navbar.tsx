"use client";

import { Bell, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#08152d] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-white">Crack</span>
              <span className="text-orange-500">lix</span>
            </h1>
            <p className="text-xs text-gray-300 font-medium">
              Punjab Exam Preparation
            </p>
          </div>

          <nav className="hidden lg:flex gap-10 text-white font-medium text-sm">
            <a href="#" className="hover:text-orange-500 transition-colors">Home</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Exams</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Mocks</a>
            <a href="#" className="hover:text-orange-500 transition-colors">PYQs</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Current Affairs</a>
          </nav>

          <div className="flex items-center gap-6">
            <button className="relative text-white hover:text-orange-500 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-orange-500" />
            </button>

            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20">
              Login
            </button>

            <button className="lg:hidden text-white p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
