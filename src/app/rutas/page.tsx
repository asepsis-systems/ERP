'use client';

import React, { useEffect, useState } from 'react';
import { 
  Truck, 
  RotateCw, 
  Plus, 
  Zap, 
  Trash2, 
  FileText, 
  X, 
  Tv, 
  Layers, 
  Clock, 
  ChevronDown,
  Edit2
} from 'lucide-react';

interface Unidad {
  id: string;
  codigo: number;
  tipo: string;
  placa: string;
  chofer: string;
}

interface Ruta {
  id: string;
  numeroRuta: number;
  horaSalida: string;
  horaRetorno: string;
  unidadCodigo: number | null;
  chofer: string;
  ayudante?: string;
  destinos: string[];
  unidad?: Unidad;
}

export default function RutasPage() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hoy' | '3dias' | 'fecha'>('hoy');
  const [activeView, setActiveView] = useState<'destinos' | 'contenedores' | 'notas'>('destinos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDestino, setEditingDestino] = useState<{ rutaId: string; colIndex: number; currentValue: string } | null>(null);
  const [newDestinoText, setNewDestinoText] = useState('');

  // Form new route
  const [newRuta, setNewRuta] = useState({
    numeroRuta: '',
    horaSalida: '06:00',
    horaRetorno: '--:--',
    unidadCodigo: '3',
    chofer: 'Edwin John Poma Pituy',
    ayudante: '',
    destinos: ['', '', '', '', '', '', '', ''],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rutasRes, unidadesRes] = await fetchRutasAndUnidades();
      setRutas(rutasRes);
      setUnidades(unidadesRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRutasAndUnidades = async () => {
    const [rRes, uRes] = await Promise.all([
      fetch('/api/rutas'),
      fetch('/api/unidades'),
    ]);
    const rutasData = await rRes.json();
    const unidadesData = await uRes.json();
    return [
      Array.isArray(rutasData) ? rutasData : [],
      Array.isArray(unidadesData) ? unidadesData : [],
    ];
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateDestino = async () => {
    if (!editingDestino) return;
    const ruta = rutas.find((r) => r.id === editingDestino.rutaId);
    if (!ruta) return;

    const updatedDestinos = [...ruta.destinos];
    // Fill up to 8 slots if needed
    while (updatedDestinos.length <= editingDestino.colIndex) {
      updatedDestinos.push('');
    }
    updatedDestinos[editingDestino.colIndex] = newDestinoText.trim().toUpperCase();

    try {
      await fetch('/api/rutas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ruta.id,
          destinos: updatedDestinos,
        }),
      });
      setEditingDestino(null);
      setNewDestinoText('');
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateRuta = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanDestinos = newRuta.destinos.filter(Boolean).map(d => d.trim().toUpperCase());
      await fetch('/api/rutas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numeroRuta: newRuta.numeroRuta ? parseInt(newRuta.numeroRuta) : undefined,
          horaSalida: newRuta.horaSalida,
          horaRetorno: newRuta.horaRetorno,
          unidadCodigo: newRuta.unidadCodigo ? parseInt(newRuta.unidadCodigo) : null,
          chofer: newRuta.chofer,
          ayudante: newRuta.ayudante,
          destinos: cleanDestinos,
        }),
      });
      setShowAddModal(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-[1920px] mx-auto select-none">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a1020] p-3 rounded-2xl border border-slate-800/80">
        {/* Left: Title + Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-white tracking-wider uppercase">
              PROYECCIÓN DE RUTAS
            </span>
          </div>

          <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-800">
            <button
              onClick={() => setActiveTab('hoy')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'hoy'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-[#121c33] text-slate-300 hover:text-white border border-slate-700/60'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setActiveTab('3dias')}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                activeTab === '3dias'
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#121c33] text-slate-300 hover:text-white border border-slate-700/60'
              }`}
            >
              3 Días
            </button>
            <button
              onClick={() => setActiveTab('fecha')}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'fecha'
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#121c33] text-slate-300 hover:text-white border border-slate-700/60'
              }`}
            >
              Fecha
            </button>
            <span className="bg-amber-950/60 text-amber-400 border border-amber-800/80 text-xs px-2.5 py-1 rounded-md font-semibold">
              {rutas.length} rutas
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveView('destinos')}
            className={`text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-all ${
              activeView === 'destinos'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-[#121c33] text-slate-400 hover:text-white border border-slate-700/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Destinos (1 - 8)</span>
          </button>

          <button
            onClick={() => setActiveView('contenedores')}
            className={`text-xs font-medium px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-all ${
              activeView === 'contenedores'
                ? 'bg-blue-600 text-white'
                : 'bg-[#121c33] text-slate-400 hover:text-white border border-slate-700/60'
            }`}
          >
            <span>Contenedores (Vapor & ETO)</span>
          </button>

          <button
            onClick={() => setActiveView('notas')}
            className={`text-xs font-medium px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-all ${
              activeView === 'notas'
                ? 'bg-blue-600 text-white'
                : 'bg-[#121c33] text-slate-400 hover:text-white border border-slate-700/60'
            }`}
          >
            <span>Bloc Notas</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Ruta</span>
          </button>

          <button className="bg-[#121c33] text-slate-300 hover:text-white text-xs px-3 py-2 rounded-xl border border-slate-700/60 flex items-center space-x-1.5 transition-all">
            <Tv className="w-3.5 h-3.5" />
            <span>Salir de Vista TV</span>
          </button>
        </div>
      </div>

      {/* Bloc de Notas Banner */}
      <div className="bg-[#19150d] border border-amber-800/60 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5 text-amber-400 font-bold tracking-wide">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>BLOC DE NOTAS — RECORDATORIOS Y PENDIENTES</span>
          <span className="bg-amber-950 text-amber-400 border border-amber-800 text-[10px] px-1.5 py-0.5 rounded font-mono">
            0 notas
          </span>
        </div>
        <div className="text-slate-400 text-xs hidden sm:block">
          No hay notas activas.{' '}
          <button className="text-amber-400 hover:underline font-semibold">
            + Agregar una nota
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
            + Nueva Nota
          </button>
          <button className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Routes Matrix Table */}
      <div className="bg-[#0b1021] border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-[#090e1d]">
                <th className="py-3 px-3 text-left w-48">SALIDA / RETORNO</th>
                <th className="py-3 px-2 text-center w-16">UND</th>
                <th className="py-3 px-3 text-left w-52">CHOFER / AYUDANTE</th>
                <th colSpan={8} className="py-2.5 px-3 text-center border-l border-slate-800 bg-[#0c1429] text-cyan-400 font-extrabold tracking-widest text-[11px]">
                  CLIENTES (DESTINOS 1 - 8)
                </th>
              </tr>
              <tr className="border-b border-slate-800/80 text-[10px] font-bold text-slate-400 bg-[#090e1d]">
                <th colSpan={3}></th>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <th key={num} className="py-1.5 px-2 text-center border-l border-slate-800/70 font-mono text-slate-400">
                    #{num}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-slate-500">
                    <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-400" />
                    Cargando proyección de rutas...
                  </td>
                </tr>
              ) : rutas.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-slate-500">
                    No hay rutas programadas.
                  </td>
                </tr>
              ) : (
                rutas.map((r) => {
                  return (
                    <tr 
                      key={r.id}
                      className="hover:bg-[#0e162f]/60 transition-colors"
                    >
                      {/* Col 1: Salida / Retorno */}
                      <td className="py-3 px-3 align-middle">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 space-y-1">
                            {/* Salida */}
                            <div className="bg-teal-950/60 border border-teal-500/50 text-teal-300 px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center justify-between">
                              <span>S: {r.horaSalida}</span>
                              <Clock className="w-3 h-3 text-teal-400" />
                            </div>
                            {/* Retorno */}
                            <div className="bg-amber-950/60 border border-amber-500/50 text-amber-300 px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center justify-between">
                              <span>R: {r.horaRetorno}</span>
                              <Clock className="w-3 h-3 text-amber-400" />
                            </div>
                            {/* Numero Ruta */}
                            <span className="text-[10px] font-mono text-slate-500 block">
                              #{r.numeroRuta}
                            </span>
                          </div>

                          {/* Quick action buttons */}
                          <div className="flex flex-col space-y-1 text-slate-500">
                            <button className="p-1 rounded bg-[#121c33] text-cyan-400 hover:text-cyan-300">
                              <Zap className="w-3 h-3" />
                            </button>
                            <button className="p-1 rounded bg-[#121c33] text-slate-400 hover:text-rose-400">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Col 2: UND */}
                      <td className="py-3 px-2 text-center align-middle">
                        <div className="w-9 h-9 rounded-lg bg-[#3d2314] border border-[#ea580c]/50 text-orange-400 font-black text-sm flex items-center justify-center shadow-inner mx-auto">
                          {r.unidadCodigo ? r.unidadCodigo : '-'}
                        </div>
                      </td>

                      {/* Col 3: Chofer / Ayudante */}
                      <td className="py-3 px-3 align-middle">
                        <div className="space-y-1.5">
                          {/* Chofer */}
                          <div className="bg-[#121c33] border border-slate-700/70 text-slate-200 text-xs px-2 py-1.5 rounded-lg flex items-center justify-between">
                            <span className="truncate max-w-[140px] font-medium">
                              C: {r.chofer}
                            </span>
                            <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          </div>
                          {/* Ayudante */}
                          <div className="bg-[#121c33] border border-slate-700/50 text-slate-400 text-xs px-2 py-1.5 rounded-lg flex items-center justify-between">
                            <span className="truncate max-w-[140px]">
                              A: {r.ayudante ? r.ayudante : '-- Ayudante...'}
                            </span>
                            <ChevronDown className="w-3 h-3 text-slate-500 flex-shrink-0" />
                          </div>
                        </div>
                      </td>

                      {/* Col 4 to 11: Destinos 1 - 8 */}
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((colIdx) => {
                        const destino = r.destinos && r.destinos[colIdx];
                        return (
                          <td 
                            key={colIdx}
                            className="py-2.5 px-2 text-center align-middle border-l border-slate-800/60 min-w-[120px] max-w-[140px]"
                          >
                            {destino ? (
                              <button
                                onClick={() => {
                                  setEditingDestino({ rutaId: r.id, colIndex: colIdx, currentValue: destino });
                                  setNewDestinoText(destino);
                                }}
                                className="w-full bg-[#2dd4bf] hover:bg-[#14b8a6] text-slate-950 font-extrabold text-[11px] px-2 py-2 rounded-lg text-center shadow font-sans tracking-wide leading-tight flex items-center justify-center min-h-[36px] transition-all"
                                title="Click para editar destino"
                              >
                                <span className="line-clamp-2">{destino}</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingDestino({ rutaId: r.id, colIndex: colIdx, currentValue: '' });
                                  setNewDestinoText('');
                                }}
                                className="w-full text-slate-600 hover:text-cyan-400 hover:bg-[#121c33]/40 rounded-lg py-2 font-mono text-center flex items-center justify-center min-h-[36px] transition-colors"
                                title="Click para asignar destino"
                              >
                                --
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Editar Destino */}
      {editingDestino && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-slate-700/80 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
            <button 
              onClick={() => setEditingDestino(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-white mb-2">
              Editar Destino #{editingDestino.colIndex + 1}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Ingresa el nombre de la clínica o cliente destino.
            </p>
            <input 
              type="text"
              autoFocus
              value={newDestinoText}
              onChange={(e) => setNewDestinoText(e.target.value)}
              placeholder="Ej. CLINICA ANGLO, SAN BORJA, etc."
              className="w-full bg-[#121c33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-teal-400 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setEditingDestino(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={handleUpdateDestino}
                className="bg-[#2dd4bf] hover:bg-[#14b8a6] text-slate-950 font-bold px-4 py-1.5 text-xs rounded-lg shadow"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva Ruta */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">Programar Nueva Ruta</h3>
            </div>

            <form onSubmit={handleCreateRuta} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">N° RUTA</label>
                  <input 
                    type="number"
                    placeholder="750"
                    value={newRuta.numeroRuta}
                    onChange={(e) => setNewRuta({ ...newRuta, numeroRuta: e.target.value })}
                    className="w-full bg-[#121c33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">HORA SALIDA</label>
                  <input 
                    type="text"
                    placeholder="06:00"
                    value={newRuta.horaSalida}
                    onChange={(e) => setNewRuta({ ...newRuta, horaSalida: e.target.value })}
                    className="w-full bg-[#121c33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">HORA RETORNO</label>
                  <input 
                    type="text"
                    placeholder="10:00 o --:--"
                    value={newRuta.horaRetorno}
                    onChange={(e) => setNewRuta({ ...newRuta, horaRetorno: e.target.value })}
                    className="w-full bg-[#121c33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">UNIDAD (UND)</label>
                  <select 
                    value={newRuta.unidadCodigo}
                    onChange={(e) => {
                      const uCod = e.target.value;
                      const selectedU = unidades.find(u => u.codigo === parseInt(uCod));
                      setNewRuta({ 
                        ...newRuta, 
                        unidadCodigo: uCod, 
                        chofer: selectedU ? selectedU.chofer : newRuta.chofer 
                      });
                    }}
                    className="w-full bg-[#121c33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="">Sin Asignar</option>
                    {unidades.map((u) => (
                      <option key={u.id} value={u.codigo}>
                        Unidad {u.codigo} - {u.placa} ({u.tipo})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">CHOFER</label>
                  <input 
                    type="text"
                    value={newRuta.chofer}
                    onChange={(e) => setNewRuta({ ...newRuta, chofer: e.target.value })}
                    className="w-full bg-[#121c33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">AYUDANTE (OPCIONAL)</label>
                <input 
                  type="text"
                  placeholder="Ej. Kenji"
                  value={newRuta.ayudante}
                  onChange={(e) => setNewRuta({ ...newRuta, ayudante: e.target.value })}
                  className="w-full bg-[#121c33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  PRIMEROS DESTINOS (Separados por coma)
                </label>
                <input 
                  type="text"
                  placeholder="MEDAVAN, RISSO, DR. LLANOS"
                  onChange={(e) => {
                    const parts = e.target.value.split(',').map(s => s.trim());
                    const d = [...parts];
                    while (d.length < 8) d.push('');
                    setNewRuta({ ...newRuta, destinos: d });
                  }}
                  className="w-full bg-[#121c33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  Guardar Ruta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
