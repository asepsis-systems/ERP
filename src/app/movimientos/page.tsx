'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { 
  ArrowLeftRight, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  Calendar,
  Layers,
  FileText
} from 'lucide-react';

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchMovimientos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/movimientos');
      const data = await res.json();
      setMovimientos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const filtered = movimientos.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.articulo?.nombre?.toLowerCase().includes(q) ||
      m.articulo?.codigo?.toLowerCase().includes(q) ||
      m.motivo?.toLowerCase().includes(q) ||
      m.documentoRef?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Kardex y Trazabilidad de Almacén"
        subtitle="Historial cronológico de ingresos, salidas, ajustes y responsables"
      />

      <main className="p-8 max-w-7xl space-y-6">
        <div className="flex justify-between items-center max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por artículo, motivo o documento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
            />
          </div>
        </div>

        {/* Tabla Kardex */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Fecha / Hora</th>
                  <th className="px-4 py-3.5">Tipo</th>
                  <th className="px-6 py-3.5">Artículo</th>
                  <th className="px-4 py-3.5 text-right">Cantidad</th>
                  <th className="px-4 py-3.5 text-right">Stock Ant.</th>
                  <th className="px-4 py-3.5 text-right">Nuevo Saldo</th>
                  <th className="px-4 py-3.5">Motivo / Doc. Ref.</th>
                  <th className="px-6 py-3.5">Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">
                      Cargando historial kardex...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">
                      No hay movimientos registrados.
                    </td>
                  </tr>
                ) : (
                  filtered.map((mov) => (
                    <tr key={mov.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-slate-500">
                        {new Date(mov.fecha).toLocaleString('es-PE', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            mov.tipo === 'ENTRADA'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : mov.tipo === 'SALIDA'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {mov.tipo === 'ENTRADA' ? (
                            <ArrowDownLeft className="w-3 h-3" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3" />
                          )}
                          <span>{mov.tipo}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-semibold text-slate-500 mr-1.5">
                          [{mov.articulo?.codigo}]
                        </span>
                        <span className="font-bold text-slate-800">{mov.articulo?.nombre}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span
                          className={`font-black text-sm ${
                            mov.tipo === 'ENTRADA' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {mov.tipo === 'ENTRADA' ? '+' : '-'} {mov.cantidad} {mov.articulo?.unidadMedida}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-xs text-slate-400">
                        {mov.stockAnterior}
                      </td>
                      <td className="px-4 py-4 text-right font-black text-slate-800">
                        {mov.stockNuevo}
                      </td>
                      <td className="px-4 py-4 text-xs">
                        <span className="font-medium text-slate-800 block">{mov.motivo}</span>
                        {mov.documentoRef && (
                          <span className="text-[11px] text-slate-400 block">
                            Ref: {mov.documentoRef}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">
                        {mov.responsable}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
