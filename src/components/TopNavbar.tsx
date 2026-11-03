'use client';

import React from 'react';
import { 
  Bell, 
  MapPin, 
  Search, 
  ChevronDown, 
  ShieldCheck 
} from 'lucide-react';

export default function TopNavbar() {
  return (
    <header className="h-14 bg-[#0a1020] border-b border-slate-800/80 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Brand + Sede + Search */}
      <div className="flex items-center space-x-6">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black text-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wide text-white leading-tight">ERP Asepsis</span>
            <span className="text-[10px] font-semibold text-cyan-400 tracking-wider">TODAS</span>
          </div>
        </div>

        {/* Sede selector */}
        <button className="hidden md:flex items-center space-x-2 bg-[#121c33] hover:bg-[#182544] border border-slate-700/60 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition-colors">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-medium text-slate-200">Sede:</span>
          <span className="font-semibold text-white">Todas</span>
        </button>

        {/* Search */}
        <div className="hidden lg:flex items-center bg-[#121c33] border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-400 w-56 justify-between focus-within:border-cyan-500 transition-colors">
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Buscar...</span>
          </div>
          <kbd className="bg-slate-800 text-[10px] text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">Ctrl K</kbd>
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center space-x-4">
        {/* Bell */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#121c33] transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-cyan-600/30">
            WH
          </div>
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-xs font-semibold text-white">Willian Huisa Huallanca</span>
            <span className="text-[10px] text-slate-400">Técnico</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
