'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { 
  ShoppingCart, 
  Plus, 
  Calendar, 
  Truck, 
  CheckCircle, 
  Clock, 
  X, 
  Trash2,
  FileText
} from 'lucide-react';

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [articulos, setArticulos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Nueva Orden
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [items, setItems] = useState<any[]>([
    { articuloId: '', cantidad: 1, precioUnitario: 0 },
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resOrd, resProv, resArt] = await Promise.all([
        fetch('/api/ordenes'),
        fetch('/api/proveedores'),
        fetch('/api/articulos'),
      ]);
      const [dataOrd, dataProv, dataArt] = await Promise.all([
        resOrd.json(),
        resProv.json(),
        resArt.json(),
      ]);
      setOrdenes(dataOrd);
      setProveedores(dataProv);
      setArticulos(dataArt);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { articuloId: '', cantidad: 1, precioUnitario: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, val: any) => {
    const updated = [...items];
    updated[index][field] = val;

    // Si seleccionó artículo, autollenar precio referencial
    if (field === 'articuloId') {
      const art = articulos.find((a) => a.id === val);
      if (art && art.precioReferencia) {
        updated[index].precioUnitario = art.precioReferencia;
      }
    }

    setItems(updated);
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, it) => acc + (parseFloat(it.cantidad) || 0) * (parseFloat(it.precioUnitario) || 0), 0);
  };

  const handleCrearOrden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProveedor) {
      alert('Seleccione un proveedor');
      return;
    }
    const validItems = items.filter((it) => it.articuloId && it.cantidad > 0);
    if (!validItems.length) {
      alert('Agregue al menos un artículo válido');
      return;
    }

    try {
      const res = await fetch('/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proveedorId: selectedProveedor,
          items: validItems,
          observaciones,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setSelectedProveedor('');
        setObservaciones('');
        setItems([{ articuloId: '', cantidad: 1, precioUnitario: 0 }]);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Error al emitir orden');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Órdenes de Compra y Requerimientos"
        subtitle="Emisión, costeo y seguimiento de pedidos a proveedores"
      />

      <main className="p-8 max-w-7xl space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-500">
            Control de requerimientos y órdenes generadas para abastecimiento.
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-emerald-700/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Orden de Compra</span>
          </button>
        </div>

        {/* Listado de Órdenes */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Cargando órdenes de compra...</div>
          ) : ordenes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              No se han emitido órdenes de compra aún.
            </div>
          ) : (
            ordenes.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                      {ord.numero}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        ord.estado === 'RECIBIDA'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ord.estado === 'PENDIENTE'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {ord.estado}
                    </span>
                  </div>

                  <div className="text-right flex items-center space-x-4">
                    <div className="text-xs text-slate-400">
                      Emisión: {new Date(ord.fecha).toLocaleDateString('es-PE')}
                    </div>
                    <div className="text-lg font-black text-emerald-700">
                      S/ {(ord.total || 0).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                      Proveedor
                    </span>
                    <span className="font-bold text-slate-800 text-sm">
                      {ord.proveedor?.razonSocial}
                    </span>
                    <span className="text-slate-500 block">RUC: {ord.proveedor?.ruc}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                      Observaciones / Referencia
                    </span>
                    <span className="text-slate-600">
                      {ord.observaciones || 'Sin observaciones registradas'}
                    </span>
                  </div>
                </div>

                {/* Items de la Orden */}
                <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Detalle de Artículos ({ord.items?.length || 0})
                  </div>
                  <div className="divide-y divide-slate-200/60">
                    {ord.items?.map((it: any) => (
                      <div key={it.id} className="py-2 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-mono text-[11px] text-slate-500 font-semibold mr-2">
                            [{it.articulo?.codigo}]
                          </span>
                          <span className="font-medium text-slate-800">{it.articulo?.nombre}</span>
                        </div>
                        <div className="space-x-4">
                          <span className="text-slate-500">
                            {it.cantidad} {it.articulo?.unidadMedida} x S/ {(it.precioUnitario || 0).toFixed(2)}
                          </span>
                          <span className="font-bold text-slate-800">
                            S/ {(it.subtotal || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Nueva Orden de Compra */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">Emitir Nueva Orden de Compra</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCrearOrden} className="mt-4 space-y-4 flex-1 overflow-y-auto pr-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Proveedor *</label>
                  <select
                    required
                    value={selectedProveedor}
                    onChange={(e) => setSelectedProveedor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">-- Seleccione un proveedor --</option>
                    {proveedores.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.ruc} - {p.razonSocial}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Observaciones</label>
                  <input
                    type="text"
                    placeholder="Ej: Entrega en planta central, atención urgente..."
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                {/* Items Dinámicos */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700">Artículos Requeridos</label>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar Item</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                      >
                        <select
                          required
                          value={it.articuloId}
                          onChange={(e) => handleItemChange(idx, 'articuloId', e.target.value)}
                          className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                        >
                          <option value="">Seleccione artículo...</option>
                          {articulos.map((a) => (
                            <option key={a.id} value={a.id}>
                              [{a.codigo}] {a.nombre}
                            </option>
                          ))}
                        </select>

                        <div className="w-24">
                          <input
                            type="number"
                            min="0.1"
                            step="any"
                            placeholder="Cant."
                            required
                            value={it.cantidad}
                            onChange={(e) => handleItemChange(idx, 'cantidad', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-center bg-white"
                          />
                        </div>

                        <div className="w-28">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="P. Unit"
                            required
                            value={it.precioUnitario}
                            onChange={(e) => handleItemChange(idx, 'precioUnitario', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-right bg-white"
                          />
                        </div>

                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumen de Totales */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-xs space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>Subtotal estimado:</span>
                    <span className="font-semibold">S/ {calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IGV (18%):</span>
                    <span className="font-semibold">S/ {(calculateSubtotal() * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-emerald-800 pt-1 border-t border-emerald-200">
                    <span>TOTAL:</span>
                    <span>S/ {(calculateSubtotal() * 1.18).toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-3">
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
                    Emitir Orden
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
