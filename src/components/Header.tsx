'use client';

import React from 'react';
import { Bell, Sparkles, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Espacio de Trabajo: William</span>
        </div>

        <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow">
            W
          </div>
          <div className="text-left text-xs">
            <span className="block font-bold text-slate-700">William</span>
            <span className="block text-[10px] text-slate-400">Jefe de Logística (DEV)</span>
          </div>
        </div>
      </div>
    </header>
  );
}
