import React, { useState } from 'react';
import { History, Search, Eye, FileText, Download } from 'lucide-react';
import { Venta } from '../types';

interface HistorialViewProps {
  ventas: Venta[];
  onSelectVenta: (venta: Venta) => void;
}

export const HistorialView: React.FC<HistorialViewProps> = ({ ventas, onSelectVenta }) => {
  const [filtro, setFiltro] = useState('');

  const filteredVentas = ventas.filter(
    v =>
      v.cliente_nom.toLowerCase().includes(filtro.toLowerCase()) ||
      v.cliente_ruc.includes(filtro) ||
      v.nro_factura.includes(filtro) ||
      v.cdc.includes(filtro) ||
      (v.cliente_email && v.cliente_email.toLowerCase().includes(filtro.toLowerCase())) ||
      (v.cliente_ciudad && v.cliente_ciudad.toLowerCase().includes(filtro.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <History className="w-6 h-6 text-amber-500" />
            <span>Historial de Facturas Emitidas (SIFEN)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Registro de comprobantes electrónicos con CDC, totales, impuestos y opciones de reimpresión
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por cliente, RUC, factura o CDC..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            className="w-full sm:w-80 bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Fecha</th>
                <th className="p-3">Nº Factura</th>
                <th className="p-3">Comprador / Receptor</th>
                <th className="p-3">Doc / RUC</th>
                <th className="p-3">Email KUDE</th>
                <th className="p-3 text-right">Total Gs.</th>
                <th className="p-3">CDC SIFEN</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredVentas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 italic">
                    No se encontraron facturas registradas.
                  </td>
                </tr>
              ) : (
                filteredVentas.map(v => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 text-slate-400">{v.fecha}</td>
                    <td className="p-3 font-bold text-amber-400">{v.nro_factura}</td>
                    <td className="p-3 font-sans font-medium text-white">
                      {v.cliente_nom}
                      {v.cliente_ciudad && <span className="text-slate-500 text-[10px] block font-sans">📍 {v.cliente_ciudad}</span>}
                    </td>
                    <td className="p-3 text-slate-300 font-bold">{v.cliente_ruc}</td>
                    <td className="p-3 text-emerald-400 text-[11px]">{v.cliente_email || 'sinemail@sifen.gov.py'}</td>
                    <td className="p-3 text-right font-bold text-emerald-400">
                      Gs. {v.total.toLocaleString('es-PY')}
                    </td>
                    <td className="p-3 text-[10px] text-slate-400 max-w-xs truncate" title={v.cdc}>
                      {v.cdc}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onSelectVenta(v)}
                        className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-3 py-1.5 rounded text-[11px] font-bold inline-flex items-center space-x-1.5 border border-amber-500/30 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Comprobante</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
