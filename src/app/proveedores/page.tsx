'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { 
  Truck, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  X,
  CreditCard
} from 'lucide-react';

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevo, setNuevo] = useState({
    ruc: '',
    razonSocial: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
    condicionPago: 'Contado',
  });

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/proveedores?q=${encodeURIComponent(search)}`);
      const data = await res.json();
      setProveedores(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchProveedores();
    }, 200);
    return () => clearTimeout(t);
  }, [search]);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/proveedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNuevo({
          ruc: '',
          razonSocial: '',
          contacto: '',
          telefono: '',
          email: '',
          direccion: '',
          condicionPago: 'Contado',
        });
        fetchProveedores();
      } else {
        const err = await res.json();
        alert(err.error || 'Error al guardar');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Directorio de Proveedores"
        subtitle="Registro de empresas proveedoras de insumos, químicos y servicios"
      />

      <main className="p-8 max-w-7xl space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por RUC, razón social o contacto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-emerald-700/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Proveedor</span>
          </button>
        </div>

        {/* Listado de tarjetas de proveedores */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Cargando proveedores...</div>
        ) : proveedores.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            No hay proveedores registrados aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {proveedores.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      RUC: {p.ruc}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {p.condicionPago || 'Contado'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base leading-snug mb-3">
                    {p.razonSocial}
                  </h4>

                  <div className="space-y-2 text-xs text-slate-600">
                    {p.contacto && (
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{p.contacto}</span>
                      </div>
                    )}
                    {p.telefono && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{p.telefono}</span>
                      </div>
                    )}
                    {p.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{p.email}</span>
                      </div>
                    )}
                    {p.direccion && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{p.direccion}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{p._count?.ordenes || 0} órdenes asociadas</span>
                  <span className="text-emerald-600 font-semibold">Activo</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Crear Proveedor */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">Registrar Nuevo Proveedor</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCrear} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">RUC *</label>
                    <input
                      type="text"
                      maxLength={11}
                      required
                      placeholder="11 dígitos"
                      value={nuevo.ruc}
                      onChange={(e) => setNuevo({ ...nuevo, ruc: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Condición de Pago</label>
                    <select
                      value={nuevo.condicionPago}
                      onChange={(e) => setNuevo({ ...nuevo, condicionPago: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    >
                      <option value="Contado">Contado</option>
                      <option value="Crédito 15 días">Crédito 15 días</option>
                      <option value="Crédito 30 días">Crédito 30 días</option>
                      <option value="Crédito 60 días">Crédito 60 días</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Razón Social *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo de la empresa"
                    value={nuevo.razonSocial}
                    onChange={(e) => setNuevo({ ...nuevo, razonSocial: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Persona de Contacto</label>
                    <input
                      type="text"
                      placeholder="Ej: Lic. Juan Pérez"
                      value={nuevo.contacto}
                      onChange={(e) => setNuevo({ ...nuevo, contacto: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / Celular</label>
                    <input
                      type="text"
                      placeholder="+51 999 999 999"
                      value={nuevo.telefono}
                      onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="ventas@proveedor.pe"
                    value={nuevo.email}
                    onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dirección Fiscal / Sede</label>
                  <input
                    type="text"
                    placeholder="Av. Principal 123, Distrito"
                    value={nuevo.direccion}
                    onChange={(e) => setNuevo({ ...nuevo, direccion: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
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
                    Guardar Proveedor
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
