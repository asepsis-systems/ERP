'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { 
  Package, 
  AlertTriangle, 
  ShoppingCart, 
  Truck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Plus,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <Header 
        title="Panel Principal de Logística" 
        subtitle="Control general de existencias, compras y almacén" 
      />

      <main className="p-8 space-y-8 max-w-7xl">
        {/* Banner de bienvenida y control de cambios */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 shadow-xl border border-emerald-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ambiente Seguro para Tus Propios Cambios</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Bienvenido al Módulo de Logística (Copia Local)</h3>
            <p className="text-slate-300 text-sm max-w-2xl mt-1 leading-relaxed">
              Puedes agregar nuevos campos, cambiar interfaces, crear flujos de compras y almacén sin temor. 
              Toda la base de datos se guarda en tu laptop en <code className="bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded text-xs">dev.db</code>.
            </p>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Artículos</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-800">{loading ? '...' : data?.totalArticulos ?? 0}</div>
            <span className="text-xs text-slate-400 mt-1 block">Insumos y repuestos en catálogo</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between text-amber-600 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Stock Crítico</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-amber-600">{loading ? '...' : data?.articulosBajoStockCount ?? 0}</div>
            <span className="text-xs text-amber-600/80 font-medium mt-1 block">Requieren reposición urgente</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Órdenes de Compra</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-800">{loading ? '...' : data?.totalOrdenes ?? 0}</div>
            <span className="text-xs text-slate-400 mt-1 block">{data?.ordenesPendientes ?? 0} pendientes de recepción</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Valorización Almacén</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-800">
              {loading ? '...' : `S/ ${(data?.valorEstimadoInventario || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            <span className="text-xs text-slate-400 mt-1 block">Estimado en moneda nacional</span>
          </div>
        </div>

        {/* Dos Columnas: Alertas de Stock y Últimos Movimientos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Alertas de Stock */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Alertas de Reposición</h4>
                  <p className="text-xs text-slate-400">Artículos con stock igual o inferior al mínimo</p>
                </div>
              </div>
              <Link
                href="/articulos"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Ver inventario
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Cargando alertas...</div>
            ) : data?.articulosBajoStock?.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                ✨ Todos los niveles de stock están óptimos.
              </div>
            ) : (
              <div className="space-y-3">
                {data?.articulosBajoStock?.map((art: any) => (
                  <div
                    key={art.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-200/60"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-900 block">{art.codigo}</span>
                      <span className="text-sm font-semibold text-slate-800">{art.nombre}</span>
                      <span className="text-[11px] text-slate-500 block">Ubicación: {art.ubicacion}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-amber-700 block">
                        {art.stockActual} {art.unidadMedida}
                      </span>
                      <span className="text-[10px] text-slate-500">Mín: {art.stockMinimo}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Últimos Movimientos Kardex */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Últimos Movimientos (Kardex)</h4>
                  <p className="text-xs text-slate-400">Entradas, salidas y recepciones recientes</p>
                </div>
              </div>
              <Link
                href="/movimientos"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Ver todos
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Cargando movimientos...</div>
            ) : data?.ultimosMovimientos?.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                No hay movimientos registrados aún.
              </div>
            ) : (
              <div className="space-y-3">
                {data?.ultimosMovimientos?.map((mov: any) => (
                  <div
                    key={mov.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          mov.tipo === 'ENTRADA'
                            ? 'bg-emerald-100 text-emerald-700'
                            : mov.tipo === 'SALIDA'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {mov.tipo === 'ENTRADA' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-800 block">
                          {mov.articulo?.nombre}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {mov.motivo} • {new Date(mov.fecha).toLocaleDateString('es-PE')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-sm font-bold ${
                          mov.tipo === 'ENTRADA' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {mov.tipo === 'ENTRADA' ? '+' : '-'} {mov.cantidad}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Saldo: {mov.stockNuevo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
