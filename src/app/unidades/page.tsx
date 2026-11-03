'use client';

import React, { useEffect, useState } from 'react';
import { 
  Truck, 
  RotateCw, 
  Plus, 
  Wrench, 
  History, 
  Pencil, 
  Trash2,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Unidad {
  id: string;
  codigo: number;
  tipo: string;
  placa: string;
  marca: string;
  chofer: string;
  estado: string;
}

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    tipo: 'H 100',
    placa: '',
    marca: 'HYUNDAI',
    chofer: '',
    estado: 'Activo',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchUnidades = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/unidades');
      const data = await res.json();
      if (Array.isArray(data)) {
        setUnidades(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnidades();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch('/api/unidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({
          codigo: '',
          tipo: 'H 100',
          placa: '',
          marca: 'HYUNDAI',
          chofer: '',
          estado: 'Activo',
        });
        fetchUnidades();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">Unidades</h1>
            <p className="text-xs text-slate-400">Flota de vehículos</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchUnidades}
            className="p-2.5 rounded-xl border border-slate-700/60 text-slate-400 hover:text-white hover:bg-[#121c33]/80 transition-all"
            title="Recargar datos"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-400' : ''}`} />
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Unidad</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#0e1628]/90 border border-slate-800/80 rounded-2xl p-4 lg:p-6 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">CÓDIGO</th>
                <th className="py-3 px-4">TIPO</th>
                <th className="py-3 px-4">PLACA</th>
                <th className="py-3 px-4">MARCA</th>
                <th className="py-3 px-4">CHOFER</th>
                <th className="py-3 px-4">ESTADO</th>
                <th className="py-3 px-4 text-right pr-6">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <RotateCw className="w-5 h-5 animate-spin mx-auto mb-2 text-orange-400" />
                    Cargando flota de vehículos...
                  </td>
                </tr>
              ) : unidades.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No hay unidades registradas en la base local.
                  </td>
                </tr>
              ) : (
                unidades.map((u) => {
                  const isH100 = u.tipo.includes('H 100') || u.tipo.includes('H100');
                  return (
                    <tr 
                      key={u.id}
                      className="hover:bg-[#121c33]/50 transition-colors"
                    >
                      {/* Código */}
                      <td className="py-3.5 px-4">
                        <span className="w-6 h-6 rounded-full bg-amber-950/40 text-amber-400 border border-amber-900/60 inline-flex items-center justify-center font-bold text-xs">
                          {u.codigo}
                        </span>
                      </td>

                      {/* Tipo */}
                      <td className="py-3.5 px-4">
                        {isH100 ? (
                          <span className="bg-[#3b2416] text-[#f97316] border border-[#ea580c]/40 font-semibold px-2.5 py-1 rounded-full text-[11px] inline-flex items-center space-x-1.5 shadow-sm">
                            <Truck className="w-3 h-3 text-[#f97316]" />
                            <span>H 100</span>
                          </span>
                        ) : (
                          <span className="bg-[#2e124d] text-[#c084fc] border border-[#7e22ce]/50 font-semibold px-2.5 py-1 rounded-full text-[11px] inline-flex items-center space-x-1.5 shadow-sm">
                            <Truck className="w-3 h-3 text-[#c084fc]" />
                            <span>X 30</span>
                          </span>
                        )}
                      </td>

                      {/* Placa */}
                      <td className="py-3.5 px-4 font-semibold text-slate-200 tracking-wider">
                        {u.placa}
                      </td>

                      {/* Marca */}
                      <td className="py-3.5 px-4 text-slate-300 font-medium">
                        {u.marca}
                      </td>

                      {/* Chofer */}
                      <td className="py-3.5 px-4 text-slate-200">
                        {u.chofer}
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4">
                        <span className="bg-[#062e18] text-[#4ade80] border border-[#166534] font-medium px-2.5 py-0.5 rounded-full text-[11px] inline-flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                          <span>{u.estado}</span>
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right pr-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            className="p-1.5 rounded-lg text-teal-400 hover:text-teal-300 hover:bg-slate-800 transition-colors"
                            title="Mantenimiento"
                          >
                            <Wrench className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                            title="Historial"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-1.5 rounded-lg text-sky-400 hover:text-sky-300 hover:bg-slate-800 transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-slate-800 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nueva Unidad */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Registrar Nueva Unidad</h3>
                <p className="text-xs text-slate-400">Guarda en dev.db local</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">CÓDIGO</label>
                  <input 
                    type="number"
                    required
                    placeholder="10"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="w-full bg-[#121c33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">TIPO</label>
                  <select 
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full bg-[#121c33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="H 100">H 100</option>
                    <option value="X 30">X 30</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">PLACA</label>
                  <input 
                    type="text"
                    required
                    placeholder="ABC-123"
                    value={formData.placa}
                    onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                    className="w-full bg-[#121c33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">MARCA</label>
                  <input 
                    type="text"
                    required
                    placeholder="HYUNDAI"
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    className="w-full bg-[#121c33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">CHOFER ASIGNADO</label>
                <input 
                  type="text"
                  required
                  placeholder="Nombre y Apellidos"
                  value={formData.chofer}
                  onChange={(e) => setFormData({ ...formData, chofer: e.target.value })}
                  className="w-full bg-[#121c33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-orange-500/20"
                >
                  {submitting ? 'Guardando...' : 'Guardar Unidad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
