'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  ShoppingCart, 
  ArrowLeftRight, 
  ShieldCheck, 
  Boxes,
  Database
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard Logístico', href: '/', icon: LayoutDashboard },
  { name: 'Inventario y Almacén', href: '/articulos', icon: Package },
  { name: 'Proveedores', href: '/proveedores', icon: Truck },
  { name: 'Órdenes de Compra', href: '/ordenes', icon: ShoppingCart },
  { name: 'Kardex y Movimientos', href: '/movimientos', icon: ArrowLeftRight },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen sticky top-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl">
          <Boxes className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-base leading-tight tracking-wide text-white">ERP ASEPSIS</h1>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
            Logística DEV
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2 pt-1">
          Módulos de Gestión
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              )}
            >
              <Icon className={clsx('w-4 h-4', isActive ? 'text-white' : 'text-slate-400')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Safety Badge */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/80 border border-emerald-500/30 rounded-xl p-3 text-xs">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Entorno Aislado</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Base de datos <strong className="text-slate-200">SQLite local</strong>. Tus cambios no afectan a producción.
          </p>
          <div className="mt-2 flex items-center space-x-1.5 text-[10px] text-slate-400">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>dev.db (Local)</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
