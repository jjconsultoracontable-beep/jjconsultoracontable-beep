import React, { useState } from 'react';
import { Package, Plus, Save, Layers } from 'lucide-react';
import { Producto } from '../types';

interface InventarioViewProps {
  productos: Producto[];
  onSaveProducto: (prod: Producto) => void;
}

export const InventarioView: React.FC<InventarioViewProps> = ({ productos, onSaveProducto }) => {
  const [codigo, setCodigo] = useState('');
  const [codVenta, setCodVenta] = useState('');
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [iva, setIva] = useState<0 | 5 | 10>(10);
  const [unidad, setUnidad] = useState('UN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo || !nombre || precio <= 0) return;

    onSaveProducto({
      codigo: codigo.trim(),
      cod_venta: (codVenta || codigo).trim().toUpperCase(),
      nombre: nombre.trim(),
      precio: Math.round(precio),
      stock: parseFloat(String(stock)) || 0,
      iva,
      unidad,
    });

    setCodigo('');
    setCodVenta('');
    setNombre('');
    setPrecio(0);
    setStock(0);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Package className="w-6 h-6 text-amber-500" />
            <span>Gestión de Inventario y Productos</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Catálogo con clasificación de IVA (10%, 5%, Exenta) y unidades de medida SET
          </p>
        </div>
      </div>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Registrar / Modificar Producto</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-3">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Código de Barras</label>
            <input
              type="text"
              placeholder="Ej: 7840001234"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Código Corto (Venta)</label>
            <input
              type="text"
              placeholder="Ej: PROD6"
              value={codVenta}
              onChange={e => setCodVenta(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="md:col-span-6">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Descripción del Producto</label>
            <input
              type="text"
              placeholder="Ej: Leche Entera 1 Litro"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Precio Venta (Gs.)</label>
            <input
              type="number"
              min="1"
              placeholder="Ej: 15000"
              value={precio || ''}
              onChange={e => setPrecio(parseInt(e.target.value) || 0)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Stock Inicial</label>
            <input
              type="number"
              step="any"
              placeholder="Ej: 100"
              value={stock || ''}
              onChange={e => setStock(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Tasa IVA SET</label>
            <select
              value={iva}
              onChange={e => setIva(parseInt(e.target.value) as 0 | 5 | 10)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:border-amber-500 outline-none"
            >
              <option value={10}>10% (General)</option>
              <option value={5}>5% (Diferencial)</option>
              <option value={0}>0% (Exenta)</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Unidad de Medida</label>
            <select
              value={unidad}
              onChange={e => setUnidad(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:border-amber-500 outline-none"
            >
              <option value="UN">Unidad (UN)</option>
              <option value="KG">Kilogramo (KG)</option>
              <option value="LT">Litro (LT)</option>
              <option value="MTR">Metro (MTR)</option>
              <option value="BOX">Caja (BOX)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs flex items-center space-x-2 transition-colors shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>GUARDAR PRODUCTO</span>
          </button>
        </div>
      </form>

      {/* Product List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
            Productos Registrados ({productos.length})
          </span>
          <div className="flex items-center space-x-1 text-slate-400 text-xs">
            <Layers className="w-4 h-4" />
            <span>Filtro activo: Todos</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Barras</th>
                <th className="p-3">Corto</th>
                <th className="p-3">Descripción</th>
                <th className="p-3 text-right">Precio Gs.</th>
                <th className="p-3 text-center">Stock</th>
                <th className="p-3 text-center">IVA</th>
                <th className="p-3 text-center">Medida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {productos.map(p => (
                <tr key={p.codigo} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-slate-400">{p.codigo}</td>
                  <td className="p-3 font-bold text-amber-400">{p.cod_venta}</td>
                  <td className="p-3 font-sans font-medium text-white">{p.nombre}</td>
                  <td className="p-3 text-right font-bold text-emerald-400">
                    Gs. {p.precio.toLocaleString('es-PY')}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      p.stock > 10 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[10px]">
                      {p.iva}%
                    </span>
                  </td>
                  <td className="p-3 text-center text-slate-400">{p.unidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
