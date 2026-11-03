'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Boxes, 
  X, 
  Filter,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';

export default function ArticulosPage() {
  const [articulos, setArticulos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('TODAS');
  
  // Modal Crear
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoArticulo, setNuevoArticulo] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: 'Insumo',
    unidadMedida: 'UND',
    stockActual: 0,
    stockMinimo: 5,
    precioReferencia: 0,
    ubicacion: 'Almacén Principal',
  });

  // Modal Movimiento Rápido (Entrada/Salida)
  const [movModalOpen, setMovModalOpen] = useState(false);
  const [selectedArticulo, setSelectedArticulo] = useState<any>(null);
  const [movData, setMovData] = useState({
    tipo: 'ENTRADA',
    cantidad: 1,
    motivo: 'Compra directa / Ingreso almacén',
    documentoRef: '',
    observaciones: '',
  });

  const fetchArticulos = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (search) query.set('q', search);
      if (categoria !== 'TODAS') query.set('categoria', categoria);
      
      const res = await fetch(`/api/articulos?${query.toString()}`);
      const data = await res.json();
      setArticulos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchArticulos();
    }, 200);
    return () => clearTimeout(t);
  }, [search, categoria]);

  const handleCrearArticulo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/articulos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoArticulo),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNuevoArticulo({
          codigo: '',
          nombre: '',
          descripcion: '',
          categoria: 'Insumo',
          unidadMedida: 'UND',
          stockActual: 0,
          stockMinimo: 5,
          precioReferencia: 0,
          ubicacion: 'Almacén Principal',
        });
        fetchArticulos();
      } else {
        const err = await res.json();
        alert(err.error || 'Error al crear');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMovimiento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticulo) return;
    try {
      const res = await fetch('/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articuloId: selectedArticulo.id,
          ...movData,
        }),
      });
      if (res.ok) {
        setMovModalOpen(false);
        fetchArticulos();
      } else {
        const err = await res.json();
        alert(err.error || 'Error al registrar movimiento');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Inventario y Almacén"
        subtitle="Gestión de insumos médicos, repuestos y control de stock"
      />

      <main className="p-8 max-w-7xl space-y-6">
        {/* Barra superior de acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="flex-1 flex gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por código, nombre o descripción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
              />
            </div>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
            >
              <option value="TODAS">Todas las categorías</option>
              <option value="Control de Calidad">Control de Calidad</option>
              <option value="Empaque">Empaque</option>
              <option value="Lavado y Desinfección">Lavado y Desinfección</option>
              <option value="Repuestos">Repuestos</option>
              <option value="Insumo">Insumo General</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-emerald-700/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Artículo</span>
          </button>
        </div>

        {/* Tabla de Artículos */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Código / Nombre</th>
                  <th className="px-4 py-3.5">Categoría</th>
                  <th className="px-4 py-3.5">Ubicación</th>
                  <th className="px-4 py-3.5 text-center">U.M.</th>
                  <th className="px-4 py-3.5 text-right">Stock Actual</th>
                  <th className="px-4 py-3.5 text-right">Precio Ref.</th>
                  <th className="px-4 py-3.5 text-center">Estado</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">
                      Cargando inventario...
                    </td>
                  </tr>
                ) : articulos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">
                      No se encontraron artículos con ese criterio.
                    </td>
                  </tr>
                ) : (
                  articulos.map((art) => {
                    const isBajoStock = art.stockActual <= art.stockMinimo;
                    return (
                      <tr key={art.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {art.codigo}
                          </span>
                          <span className="block font-semibold text-slate-900 mt-1">
                            {art.nombre}
                          </span>
                          {art.descripcion && (
                            <span className="block text-xs text-slate-400 truncate max-w-xs">
                              {art.descripcion}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-slate-100 font-medium text-slate-700">
                            {art.categoria}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500">
                          {art.ubicacion || '—'}
                        </td>
                        <td className="px-4 py-4 text-center text-xs font-semibold text-slate-600">
                          {art.unidadMedida}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span
                            className={`font-black text-base ${
                              isBajoStock ? 'text-amber-600' : 'text-slate-800'
                            }`}
                          >
                            {art.stockActual}
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            Mín: {art.stockMinimo}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right font-medium text-slate-700">
                          S/ {(art.precioReferencia || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {isBajoStock ? (
                            <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span>Bajo</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>OK</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedArticulo(art);
                              setMovData({
                                tipo: 'ENTRADA',
                                cantidad: 1,
                                motivo: 'Ingreso rápido de almacén',
                                documentoRef: '',
                                observaciones: '',
                              });
                              setMovModalOpen(true);
                            }}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors inline-flex items-center space-x-1"
                          >
                            <span>Movimiento</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Nuevo Artículo */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Package className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">Crear Nuevo Artículo</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCrearArticulo} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Código *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: INS-004"
                      value={nuevoArticulo.codigo}
                      onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, codigo: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm uppercase font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
                    <select
                      value={nuevoArticulo.categoria}
                      onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, categoria: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="Control de Calidad">Control de Calidad</option>
                      <option value="Empaque">Empaque</option>
                      <option value="Lavado y Desinfección">Lavado y Desinfección</option>
                      <option value="Repuestos">Repuestos</option>
                      <option value="Insumo">Insumo General</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Artículo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Guantes de Nitrilo Talla M"
                    value={nuevoArticulo.nombre}
                    onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Descripción / Especificaciones</label>
                  <input
                    type="text"
                    placeholder="Detalles técnicos, marca, presentación..."
                    value={nuevoArticulo.descripcion}
                    onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, descripcion: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Unidad Medida</label>
                    <input
                      type="text"
                      placeholder="UND, CJA, RLL"
                      value={nuevoArticulo.unidadMedida}
                      onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, unidadMedida: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Stock Inicial</label>
                    <input
                      type="number"
                      step="any"
                      value={nuevoArticulo.stockActual}
                      onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, stockActual: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Stock Mínimo</label>
                    <input
                      type="number"
                      step="any"
                      value={nuevoArticulo.stockMinimo}
                      onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, stockMinimo: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Precio Referencial (S/)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={nuevoArticulo.precioReferencia}
                      onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, precioReferencia: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ubicación Almacén</label>
                    <input
                      type="text"
                      placeholder="Ej: Estante C-3"
                      value={nuevoArticulo.ubicacion}
                      onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, ubicacion: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-700/20"
                  >
                    Guardar Artículo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Movimiento Rápido */}
        {movModalOpen && selectedArticulo && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Registrar Movimiento</h3>
                  <p className="text-xs text-slate-500">{selectedArticulo.codigo} - {selectedArticulo.nombre}</p>
                </div>
                <button
                  onClick={() => setMovModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleMovimiento} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Movimiento</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMovData({ ...movData, tipo: 'ENTRADA' })}
                      className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center space-x-1.5 ${
                        movData.tipo === 'ENTRADA'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      <span>ENTRADA (Ingreso)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMovData({ ...movData, tipo: 'SALIDA' })}
                      className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center space-x-1.5 ${
                        movData.tipo === 'SALIDA'
                          ? 'bg-rose-50 border-rose-500 text-rose-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>SALIDA (Despacho)</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Cantidad *</label>
                    <input
                      type="number"
                      step="any"
                      min="0.1"
                      required
                      value={movData.cantidad}
                      onChange={(e) => setMovData({ ...movData, cantidad: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Stock Actual</label>
                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600">
                      {selectedArticulo.stockActual} {selectedArticulo.unidadMedida}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Motivo</label>
                  <input
                    type="text"
                    required
                    value={movData.motivo}
                    onChange={(e) => setMovData({ ...movData, motivo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Documento de Referencia (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej: Guía Remisión GR-001-234, Factura F001-44"
                    value={movData.documentoRef}
                    onChange={(e) => setMovData({ ...movData, documentoRef: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setMovModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-700/20"
                  >
                    Confirmar Movimiento
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
