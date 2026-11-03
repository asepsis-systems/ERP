'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText,
  BarChart2,
  DollarSign,
  ShoppingCart,
  Boxes,
  ShoppingBag,
  Truck,
  Compass,
  Repeat,
  Gauge,
  ClipboardList,
  Users,
  ShieldCheck,
  Settings,
  BookOpen,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ChevronsLeft
} from 'lucide-react';
import clsx from 'clsx';

interface MenuItem {
  name: string;
  icon: any;
  href?: string;
  subItems?: { name: string; href: string; icon: any }[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const [logisticaOpen, setLogisticaOpen] = useState(true);

  const mainModules = [
    { name: 'Facturación', icon: FileText, hasSub: true },
    { name: 'Gestión', icon: BarChart2, hasSub: true },
    { name: 'Costos', icon: DollarSign, hasSub: true },
    { name: 'Ventas', icon: ShoppingCart, hasSub: true },
    { name: 'Almacén', icon: Boxes, hasSub: true },
    { name: 'Compras', icon: ShoppingBag, hasSub: true },
  ];

  const logisticaSubItems = [
    { name: 'Mapa en Vivo', href: '/mapa', icon: Compass },
    { name: 'Rutas', href: '/rutas', icon: Repeat },
    { name: 'Flota', href: '/flota', icon: Gauge },
    { name: 'Unidades', href: '/unidades', icon: Truck },
    { name: 'Guías', href: '/guias', icon: ClipboardList },
  ];

  const bottomModules = [
    { name: 'CRM', icon: Users, hasSub: true },
    { name: 'Auditoría', icon: ShieldCheck },
    { name: 'Configuración', icon: Settings, hasSub: true },
    { name: 'Manual', icon: BookOpen },
    { name: 'Soporte', icon: HelpCircle },
  ];

  return (
    <aside className="w-60 bg-[#090e1a] text-slate-300 flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 border-r border-slate-800/80 select-none overflow-y-auto">
      <div className="flex-1 py-3 px-2 space-y-1">
        {/* Upper modules */}
        {mainModules.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-[#121c33]/70 cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <item.icon className="w-4 h-4 text-slate-400" />
              <span>{item.name}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
        ))}

        {/* Logística Accordion (Active Section) */}
        <div className="pt-1 pb-1">
          <button
            onClick={() => setLogisticaOpen(!logisticaOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-cyan-400 hover:bg-[#121c33]/70 transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Logística</span>
            </div>
            {logisticaOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {logisticaOpen && (
            <div className="mt-1 ml-2 pl-2 border-l border-slate-800 space-y-0.5">
              {logisticaSubItems.map((sub) => {
                const isActive = pathname === sub.href;
                const Icon = sub.icon;
                return (
                  <Link
                    key={sub.name}
                    href={sub.href}
                    className={clsx(
                      'flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs transition-all duration-150',
                      isActive
                        ? 'bg-[#1b2545] text-white font-semibold relative shadow-inner'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#121c33]/50'
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-400 rounded-r-full" />
                    )}
                    <Icon
                      className={clsx(
                        'w-3.5 h-3.5',
                        isActive ? 'text-cyan-400' : 'text-slate-500'
                      )}
                    />
                    <span>{sub.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Lower modules */}
        {bottomModules.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-[#121c33]/70 cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <item.icon className="w-4 h-4 text-slate-400" />
              <span>{item.name}</span>
            </div>
            {item.hasSub && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
          </div>
        ))}
      </div>

      {/* Footer info & collapse */}
      <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex flex-col space-y-2">
        <button className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
          <ChevronsLeft className="w-3.5 h-3.5" />
          <span>Colapsar</span>
        </button>
        <span className="text-[10px] text-slate-600">v1.2.0 — ERP Asepsis</span>
      </div>
    </aside>
  );
}
