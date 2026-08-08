import React, { useState } from 'react';
import { ShoppingCart, Search, Plus, Trash2, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';
import { Producto, Certificado, Cliente, CartItem, Venta } from '../types';
import { calcularDvRuc, generarCDC } from '../lib/sifenUtils';

interface VentasViewProps {
  emisores: Certificado[];
  clientes: Cliente[];
  productos: Producto[];
  onEmitirVenta: (venta: Venta) => void;
  onAddCliente: (cliente: Cliente) => void;
}

export const VentasView: React.FC<VentasViewProps> = ({
  emisores,
  clientes,
  productos,
  onEmitirVenta,
  onAddCliente,
}) => {
  const [selectedEmisorRuc, setSelectedEmisorRuc] = useState<string>(emisores[0]?.ruc || '');
  const [condicion, setCondicion] = useState<'Contado' | 'Crédito'>('Contado');

  // Cliente form
  const [clienteRucInput, setClienteRucInput] = useState<string>('');
  const [clienteNombre, setClienteNombre] = useState<string>('');
  const [clienteDireccion, setClienteDireccion] = useState<string>('');
  const [clienteEmail, setClienteEmail] = useState<string>('');
  const [clienteTel, setClienteTel] = useState<string>('');
  const [clienteCiudad, setClienteCiudad] = useState<string>('Asunción');
  const [clienteTipoDoc, setClienteTipoDoc] = useState<string>('RUC');

  // Cart state
  const [cantInput, setCantInput] = useState<number>(1);
  const [codInput, setCodInput] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Seleccionar cliente de la lista existente
  const handleSelectClienteExistente = (rucSel: string) => {
    if (!rucSel) {
      setClienteRucInput('');
      setClienteNombre('');
      setClienteDireccion('');
      setClienteEmail('');
      setClienteTel('');
      setClienteCiudad('Asunción');
      setClienteTipoDoc('RUC');
      return;
    }

    const found = clientes.find(c => c.ruc === rucSel);
    if (found) {
      setClienteRucInput(found.ruc);
      setClienteNombre(found.nombre);
      setClienteDireccion(found.direccion || 'ASUNCIÓN - PARAGUAY');
      setClienteEmail(found.email || '');
      setClienteTel(found.telefono || '');
      setClienteCiudad(found.ciudad || 'Asunción');
      setClienteTipoDoc(found.tipo_doc || 'RUC');
      setErrorMsg('');
    }
  };

  // Buscar cliente existente por RUC/CI
  const handleBuscarCliente = () => {
    if (!clienteRucInput) return;
    const cleanDoc = clienteRucInput.trim();
    const found = clientes.find(c => c.ruc.startsWith(cleanDoc) || c.ruc === cleanDoc);
    if (found) {
      setClienteNombre(found.nombre);
      setClienteDireccion(found.direccion || 'ASUNCIÓN - PARAGUAY');
      setClienteRucInput(clienteTipoDoc === 'RUC' ? found.ruc : (found.ruc.includes('-') ? found.ruc.split('-')[0] : found.ruc));
      setClienteEmail(found.email || '');
      setClienteTel(found.telefono || '');
      setClienteCiudad(found.ciudad || 'Asunción');
      setClienteTipoDoc(found.tipo_doc || clienteTipoDoc);
      setErrorMsg('');
    } else {
      if (clienteTipoDoc === 'RUC') {
        // Auto calcular DV RUC solo si es RUC
        const dv = calcularDvRuc(cleanDoc);
        const docConDv = cleanDoc.includes('-') ? cleanDoc : `${cleanDoc}-${dv}`;
        setClienteRucInput(docConDv);
      } else {
        // Para C.I., Pasaporte, DNI, Innominado: no agregar guión ni DV
        if (cleanDoc.includes('-')) {
          setClienteRucInput(cleanDoc.split('-')[0]);
        }
      }
    }
  };

  // Auto-cargar Consumidor Final / Sin Nombre
  const handleConsumidorFinal = () => {
    setClienteRucInput('4444444-0');
    setClienteNombre('CONSUMIDOR FINAL / SIN NOMBRE');
    setClienteDireccion('ASUNCIÓN - PARAGUAY');
    setClienteEmail('sinemail@sifen.gov.py');
    setClienteTel('');
    setClienteCiudad('Asunción');
    setClienteTipoDoc('INNOMINADO');
  };

  // Agregar producto al carrito por código o código corto
  const handleAgregarItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!codInput) return;

    const term = codInput.trim().toUpperCase();
    const prod = productos.find(p => p.codigo.toUpperCase() === term || p.cod_venta.toUpperCase() === term);

    if (!prod) {
      setErrorMsg(`Producto con código "${codInput}" no encontrado.`);
      return;
    }

    if (cantInput <= 0) {
      setErrorMsg('La cantidad debe ser mayor a 0.');
      return;
    }

    setErrorMsg('');
    const sub = Math.round(prod.precio * cantInput);

    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.producto.codigo === prod.codigo);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const newCant = updated[existingIdx].cant + cantInput;
        updated[existingIdx] = {
          ...updated[existingIdx],
          cant: newCant,
          subtotal: Math.round(prod.precio * newCant)
        };
        return updated;
      } else {
        return [...prev, { producto: prod, cant: cantInput, subtotal: sub }];
      }
    });

    setCodInput('');
    setCantInput(1);
  };

  const removeItem = (idx: number) => {
    setCart(prev => prev.filter((_, i) => i !== idx));
  };

  // Totales
  const totalGeneral = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const iva10Total = cart.reduce((acc, item) => item.producto.iva === 10 ? acc + Math.round(item.subtotal / 11) : acc, 0);
  const iva5Total = cart.reduce((acc, item) => item.producto.iva === 5 ? acc + Math.round(item.subtotal / 21) : acc, 0);
  const exentaTotal = cart.reduce((acc, item) => item.producto.iva === 0 ? acc + item.subtotal : acc, 0);

  // Emitir Factura SIFEN
  const handleFacturar = () => {
    if (cart.length === 0) {
      setErrorMsg('El carrito está vacío. Agregue productos antes de facturar.');
      return;
    }
    if (!selectedEmisorRuc) {
      setErrorMsg('Seleccione un emisor certificado.');
      return;
    }

    let finalRuc = clienteRucInput.trim();
    if (clienteTipoDoc === 'RUC') {
      if (finalRuc && !finalRuc.includes('-')) {
        finalRuc = `${finalRuc}-${calcularDvRuc(finalRuc)}`;
      }
    } else {
      if (finalRuc.includes('-') && clienteTipoDoc !== 'INNOMINADO') {
        finalRuc = finalRuc.split('-')[0];
      }
    }

    const emisor = emisores.find(e => e.ruc === selectedEmisorRuc) || emisores[0];

    // Auto id & nro_factura
    const randomNro = Math.floor(1000 + Math.random() * 9000);
    const nroFactura = `001-001-${String(randomNro).padStart(7, '0')}`;
    const cdc = generarCDC('01', emisor.ruc, '001', '001', nroFactura);

    const nuevaVenta: Venta = {
      id: Date.now(),
      fecha: new Date().toLocaleString('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      total: totalGeneral,
      iva10: iva10Total,
      iva5: iva5Total,
      exenta: exentaTotal,
      cdc,
      emisor_ruc: emisor.ruc,
      emisor_nombre: emisor.titular,
      cliente_nom: clienteNombre || 'CONSUMIDOR FINAL / SIN NOMBRE',
      cliente_ruc: finalRuc || '4444444-0',
      cliente_dir: clienteDireccion || 'ASUNCIÓN - PARAGUAY',
      cliente_tel: clienteTel,
      cliente_email: clienteEmail || 'sinemail@sifen.gov.py',
      cliente_tipo_doc: clienteTipoDoc,
      cliente_ciudad: clienteCiudad,
      nro_factura: nroFactura,
      condicion,
      items: cart
    };

    // Guardar cliente nuevo si no existe
    if (finalRuc && clienteNombre) {
      onAddCliente({
        ruc: finalRuc,
        nombre: clienteNombre,
        direccion: clienteDireccion || 'ASUNCIÓN - PARAGUAY',
        telefono: clienteTel,
        email: clienteEmail,
        tipo_doc: clienteTipoDoc as any,
        ciudad: clienteCiudad,
      });
    }

    onEmitirVenta(nuevaVenta);

    // Reset Form
    setCart([]);
    setClienteRucInput('');
    setClienteNombre('');
    setClienteDireccion('');
    setClienteEmail('');
    setClienteTel('');
    setErrorMsg('');
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Emisor selection header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <ShoppingCart className="w-6 h-6 text-amber-500" />
            <span>Facturación Electrónica SIFEN</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Emisión directa con generación de CDC 44 dígitos y comprobante DE v150
          </p>
        </div>

        {/* Selector Emisor */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label className="text-xs font-semibold text-slate-300">Emisor:</label>
          <select
            value={selectedEmisorRuc}
            onChange={e => setSelectedEmisorRuc(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
          >
            {emisores.map(e => (
              <option key={e.ruc} value={e.ruc}>
                {e.titular} ({e.ruc})
              </option>
            ))}
          </select>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl flex items-center space-x-3 text-xs font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Customer section */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
            <UserCheck className="w-4 h-4" />
            <span>Datos Completos del Receptor / Comprador (SIFEN SET)</span>
          </h3>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleConsumidorFinal}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded text-xs font-bold transition-colors"
            >
              ⚡ Consumidor Final / Sin Nombre
            </button>
          </div>
        </div>

        {/* Quick select dropdown */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <span className="text-xs font-medium text-slate-400 whitespace-nowrap">Seleccionar Cliente Guardado:</span>
          <select
            onChange={e => handleSelectClienteExistente(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white font-medium focus:border-amber-500 outline-none"
          >
            <option value="">-- Ingresar cliente manual o buscar por RUC --</option>
            {clientes.map(c => (
              <option key={c.ruc} value={c.ruc}>
                {c.nombre} | {c.ruc} ({c.ciudad || 'Asunción'})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Condición</label>
            <select
              value={condicion}
              onChange={e => setCondicion(e.target.value as 'Contado' | 'Crédito')}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:border-amber-500 outline-none"
            >
              <option value="Contado">Contado</option>
              <option value="Crédito">Crédito</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Tipo Documento</label>
            <select
              value={clienteTipoDoc}
              onChange={e => {
                const newTipo = e.target.value;
                setClienteTipoDoc(newTipo);
                if (newTipo !== 'RUC' && newTipo !== 'INNOMINADO' && clienteRucInput.includes('-')) {
                  setClienteRucInput(clienteRucInput.split('-')[0]);
                }
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:border-amber-500 outline-none"
            >
              <option value="RUC">RUC</option>
              <option value="CI">C.I. Paraguay</option>
              <option value="PASAPORTE">Pasaporte</option>
              <option value="DNI">DNI Extranjero</option>
              <option value="INNOMINADO">Innominado</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="text-xs font-medium text-slate-400 mb-1 block">RUC / C.I.</label>
            <div className="flex space-x-1.5">
              <input
                type="text"
                placeholder="Ej: 4567890 o 80012345-6"
                value={clienteRucInput}
                onChange={e => setClienteRucInput(e.target.value)}
                onBlur={handleBuscarCliente}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-amber-400 font-bold focus:border-amber-500 outline-none"
              />
              <button
                type="button"
                onClick={handleBuscarCliente}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                title="Buscar o calcular DV RUC"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="md:col-span-5">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Nombre / Razón Social *</label>
            <input
              type="text"
              placeholder="Ej: Juan Pérez / Comercial S.A."
              value={clienteNombre}
              onChange={e => setClienteNombre(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold focus:border-amber-500 outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Correo Electrónico (Envío KUDE DE XML)</label>
            <input
              type="email"
              placeholder="cliente@ejemplo.com"
              value={clienteEmail}
              onChange={e => setClienteEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none font-mono"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Teléfono / Celular</label>
            <input
              type="text"
              placeholder="Ej: 0981 123 456"
              value={clienteTel}
              onChange={e => setClienteTel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Ciudad</label>
            <input
              type="text"
              placeholder="Ej: Asunción"
              value={clienteCiudad}
              onChange={e => setClienteCiudad(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Dirección Fiscal</label>
            <input
              type="text"
              placeholder="Ej: Palma 452 c/ 14 de Mayo"
              value={clienteDireccion}
              onChange={e => setClienteDireccion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Item barcode input row */}
      <form onSubmit={handleAgregarItem} className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
          Agregar Productos a la Factura
        </label>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="w-24">
            <label className="text-[10px] text-slate-400 block">Cant.</label>
            <input
              type="number"
              step="any"
              min="0.1"
              value={cantInput}
              onChange={e => setCantInput(parseFloat(e.target.value) || 1)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 text-center font-bold focus:border-amber-500 outline-none"
            />
          </div>

          <div className="flex-1">
            <label className="text-[10px] text-slate-400 block">Código de Barras o Código Corto</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Escanee código de barras o escriba PROD1, PROD2..."
                value={codInput}
                onChange={e => setCodInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-3 pr-24 py-2 text-xs font-mono text-slate-200 focus:border-amber-500 outline-none"
                autoFocus
              />
              <span className="absolute right-2 top-1.5 text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                ENTER
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="sm:mt-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2 rounded-lg text-xs flex items-center justify-center space-x-2 shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>AGREGAR</span>
          </button>
        </div>

        {/* Quick select chips */}
        <div className="pt-2 flex flex-wrap gap-2">
          <span className="text-[11px] text-slate-400 self-center">Rápidos:</span>
          {productos.map(p => (
            <button
              key={p.codigo}
              type="button"
              onClick={() => {
                setCodInput(p.cod_venta);
              }}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 transition-colors font-mono"
            >
              {p.cod_venta} - {p.nombre} (Gs. {p.precio.toLocaleString('es-PY')})
            </button>
          ))}
        </div>
      </form>

      {/* Cart items table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
            Detalle de Comprobante ({cart.length} ítems)
          </span>
          <span className="text-xs text-slate-400 font-mono">
            IVA Incluido (SET Paraguay)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3 text-center">Cant.</th>
                <th className="p-3">Código</th>
                <th className="p-3">Descripción</th>
                <th className="p-3 text-right">P. Unitario</th>
                <th className="p-3 text-center">IVA</th>
                <th className="p-3 text-right">Subtotal Gs.</th>
                <th className="p-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {cart.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                    No hay productos agregados a la factura.
                  </td>
                </tr>
              ) : (
                cart.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 text-center font-bold text-amber-400">{item.cant}</td>
                    <td className="p-3 text-slate-400">{item.producto.cod_venta}</td>
                    <td className="p-3 font-sans font-medium text-white">
                      {item.producto.nombre} <span className="text-slate-500 text-[10px]">({item.producto.unidad})</span>
                    </td>
                    <td className="p-3 text-right">Gs. {item.producto.precio.toLocaleString('es-PY')}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.producto.iva === 10 ? 'bg-amber-500/20 text-amber-400' : item.producto.iva === 5 ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {item.producto.iva}%
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-400">
                      Gs. {item.subtotal.toLocaleString('es-PY')}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Eliminar línea"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Total summary banner & Emit button */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-slate-400 text-xs font-mono">Desglose de Impuestos:</div>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-300">
              <span>Exenta: <strong className="text-white">Gs. {exentaTotal.toLocaleString('es-PY')}</strong></span>
              <span>Liq. IVA 5%: <strong className="text-white">Gs. {iva5Total.toLocaleString('es-PY')}</strong></span>
              <span>Liq. IVA 10%: <strong className="text-white">Gs. {iva10Total.toLocaleString('es-PY')}</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Monto Total</span>
              <span className="text-3xl font-black text-amber-400 font-mono">
                Gs. {totalGeneral.toLocaleString('es-PY')}
              </span>
            </div>

            <button
              onClick={handleFacturar}
              disabled={cart.length === 0}
              className={`px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center space-x-2 shadow-lg transition-all ${
                cart.length > 0
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 cursor-pointer shadow-emerald-950'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>FACTURAR SIFEN</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
