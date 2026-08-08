import React, { useState } from 'react';
import { X, Printer, FileCode, FileText, Receipt, Download, Check } from 'lucide-react';
import { Venta, Certificado } from '../types';
import { numeroALetras } from '../lib/sifenUtils';

interface FacturaModalProps {
  venta: Venta | null;
  emisor: Certificado | null;
  onClose: () => void;
}

export const FacturaModal: React.FC<FacturaModalProps> = ({ venta, emisor, onClose }) => {
  const [viewFormat, setViewFormat] = useState<'A4' | 'TICKET' | 'XML'>('A4');
  const [copied, setCopied] = useState(false);

  if (!venta || !emisor) return null;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    `https://sifen.set.gov.py/consulta/qr?cdc=${venta.cdc}`
  )}`;

  // Generate XML v150 representation
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rDE xmlns="http://ekuatia.set.gov.py/sifen/xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dVerFor>150</dVerFor>
  <dId>${venta.cdc}</dId>
  <dFecFirma>${new Date().toISOString()}</dFecFirma>
  <gDatGstru>
    <gTimb>
      <iTiDE>1</iTiDE>
      <dDesTiDE>Factura Electrónica</dDesTiDE>
      <dNumTim>${emisor.timbrado}</dNumTim>
      <dEst>001</dEst>
      <dPunExp>001</dPunExp>
      <dNumDoc>${venta.nro_factura.split('-')[2]}</dNumDoc>
      <dIniVig>${emisor.inicio_vigencia}</dIniVig>
    </gTimb>
    <gEmis>
      <dRucEm>${emisor.ruc.split('-')[0]}</dRucEm>
      <dDVEmi>${emisor.ruc.split('-')[1] || '0'}</dDVEmi>
      <iTipCont>1</iTipCont>
      <dNomEmi>${emisor.titular}</dNomEmi>
      <dDirEmi>${emisor.direccion}</dDirEmi>
      <dTelEmi>${emisor.telefono}</dTelEmi>
      <dActEco>${emisor.actividad}</dActEco>
    </gEmis>
    <gDatRec>
      <iNatRec>1</iNatRec>
      <iTiOpe>1</iTiOpe>
      <dRucRec>${venta.cliente_ruc.split('-')[0]}</dRucRec>
      <dDVRec>${venta.cliente_ruc.split('-')[1] || '0'}</dDVRec>
      <dNomRec>${venta.cliente_nom}</dNomRec>
      <dDirRec>${venta.cliente_dir}</dDirRec>
    </gDatRec>
    <gDtopGral>
      <iCondOpe>${venta.condicion === 'Contado' ? '1' : '2'}</iCondOpe>
    </gDtopGral>
    <gCamItem>
${venta.items
  .map(
    (it, idx) => `      <gItem id="${idx + 1}">
        <dCodInt>${it.producto.codigo}</dCodInt>
        <dDesPro>${it.producto.nombre}</dDesPro>
        <cUniMed>${it.producto.unidad}</cUniMed>
        <dCantItem>${it.cant}</dCantItem>
        <dPrcUni>${it.producto.precio}</dPrcUni>
        <dTotBruValItem>${it.subtotal}</dTotBruValItem>
        <gCamIVA>
          <iAfecIVA>${it.producto.iva === 0 ? '3' : '1'}</iAfecIVA>
          <dPropIVA>${it.producto.iva}</dPropIVA>
        </gCamIVA>
      </gItem>`
  )
  .join('\n')}
    </gCamItem>
    <gTotSub>
      <dSubExe>${venta.exenta}</dSubExe>
      <dSubExo>0</dSubExo>
      <dSub5>${venta.iva5}</dSub5>
      <dSub10>${venta.iva10}</dSub10>
      <dTotOpe>${venta.total}</dTotOpe>
      <dTotGralOpe>${venta.total}</dTotGralOpe>
    </gTotSub>
  </gDatGstru>
  <dCDC>${venta.cdc}</dCDC>
</rDE>`;

  const copyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${venta.cdc}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
        
        {/* Header toolbar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg border border-emerald-500/30">
              <Receipt className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-lg text-white">Comprobante SIFEN Generado</h3>
              <p className="text-xs text-slate-400 font-mono">CDC: {venta.cdc}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setViewFormat('A4')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  viewFormat === 'A4' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Factura A4</span>
              </button>
              <button
                onClick={() => setViewFormat('TICKET')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  viewFormat === 'TICKET' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Ticket 80mm</span>
              </button>
              <button
                onClick={() => setViewFormat('XML')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  viewFormat === 'XML' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>XML SIFEN</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950/50">
          
          {/* FORMAT A4 */}
          {viewFormat === 'A4' && (
            <div className="bg-white text-slate-900 rounded-lg p-8 shadow-xl max-w-3xl mx-auto border border-slate-300 font-sans text-xs leading-relaxed">
              {/* Header Grid */}
              <div className="grid grid-cols-12 gap-4 border-b border-slate-300 pb-4 mb-4">
                <div className="col-span-8 flex items-start space-x-3">
                  {emisor.logo_path && (
                    <img
                      src={emisor.logo_path}
                      alt="Logo"
                      className="w-16 h-16 object-contain rounded border border-slate-200"
                    />
                  )}
                  <div>
                    {emisor.nombre_fantasia && (
                      <h1 className="text-lg font-black text-amber-700 uppercase tracking-tight leading-tight">
                        {emisor.nombre_fantasia}
                      </h1>
                    )}
                    <h2 className="text-sm font-bold text-slate-950 uppercase">{emisor.titular}</h2>
                    <p className="text-[10px] text-slate-600">{emisor.actividad}</p>
                    <p className="text-[11px] text-slate-700 mt-1">{emisor.direccion}</p>
                    <p className="text-[11px] text-slate-700">Tel: {emisor.telefono}</p>
                  </div>
                </div>

                <div className="col-span-4 border border-slate-900 p-3 rounded text-center bg-slate-50 flex flex-col justify-between">
                  <div className="font-bold text-sm tracking-wide text-slate-900">FACTURA ELECTRÓNICA</div>
                  <div className="font-semibold text-slate-800">RUC: {emisor.ruc}</div>
                  <div className="text-[11px] text-slate-700">TIMBRADO: {emisor.timbrado}</div>
                  <div className="text-[10px] text-slate-500">Inic. Vigencia: {emisor.inicio_vigencia}</div>
                  <div className="font-bold text-sm text-slate-950 mt-1">{venta.nro_factura}</div>
                </div>
              </div>

              {/* Client Info */}
              <div className="border border-slate-300 p-3 rounded mb-4 bg-slate-50 grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-800 text-xs">
                <div>
                  <strong>FECHA DE EMISIÓN:</strong> {venta.fecha}
                </div>
                <div>
                  <strong>CONDICIÓN DE VENTA:</strong> {venta.condicion.toUpperCase()}
                </div>
                <div>
                  <strong>TIPO DOCUMENTO:</strong> {venta.cliente_tipo_doc || 'RUC'}
                </div>
                <div className="col-span-2 sm:col-span-3 border-t border-slate-200 pt-1">
                  <strong>RAZÓN SOCIAL / CLIENTE:</strong> {venta.cliente_nom}
                </div>
                <div>
                  <strong>RUC / CI:</strong> <span className="font-mono font-bold text-slate-900">{venta.cliente_ruc}</span>
                </div>
                <div>
                  <strong>CORREO (KUDE XML):</strong> <span className="font-mono text-slate-900">{venta.cliente_email || 'sinemail@sifen.gov.py'}</span>
                </div>
                <div>
                  <strong>TELÉFONO:</strong> {venta.cliente_tel || 'N/A'}
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <strong>DIRECCIÓN FISCAL:</strong> {venta.cliente_dir} {venta.cliente_ciudad ? `(${venta.cliente_ciudad})` : ''}
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse border border-slate-300 mb-4 text-left">
                <thead>
                  <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-300 text-[11px]">
                    <th className="p-2 border-r border-slate-300 text-center w-12">CANT</th>
                    <th className="p-2 border-r border-slate-300 text-center w-20">COD</th>
                    <th className="p-2 border-r border-slate-300">DESCRIPCIÓN</th>
                    <th className="p-2 border-r border-slate-300 text-right w-24">EXENTA</th>
                    <th className="p-2 border-r border-slate-300 text-right w-24">5%</th>
                    <th className="p-2 text-right w-24">10%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {venta.items.map((item, idx) => {
                    const ex = item.producto.iva === 0 ? item.subtotal : 0;
                    const i5 = item.producto.iva === 5 ? item.subtotal : 0;
                    const i10 = item.producto.iva === 10 ? item.subtotal : 0;
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 border-r border-slate-200 text-center font-mono">{item.cant}</td>
                        <td className="p-2 border-r border-slate-200 text-center font-mono">{item.producto.cod_venta}</td>
                        <td className="p-2 border-r border-slate-200 font-medium">
                          {item.producto.nombre} ({item.producto.unidad})
                        </td>
                        <td className="p-2 border-r border-slate-200 text-right font-mono">{ex > 0 ? ex.toLocaleString('es-PY') : '-'}</td>
                        <td className="p-2 border-r border-slate-200 text-right font-mono">{i5 > 0 ? i5.toLocaleString('es-PY') : '-'}</td>
                        <td className="p-2 text-right font-mono">{i10 > 0 ? i10.toLocaleString('es-PY') : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Totals Section */}
              <div className="border border-slate-300 p-3 rounded mb-4 bg-slate-100 flex items-center justify-between font-bold text-sm">
                <span>SUBTOTALES:</span>
                <div className="space-x-4 font-mono text-xs">
                  <span>EXENTA: Gs. {venta.exenta.toLocaleString('es-PY')}</span>
                  <span>5%: Gs. {venta.iva5.toLocaleString('es-PY')}</span>
                  <span>10%: Gs. {venta.iva10.toLocaleString('es-PY')}</span>
                </div>
              </div>

              <div className="border-2 border-slate-900 p-3 rounded mb-4 bg-amber-50 flex items-center justify-between text-slate-950 font-bold text-base">
                <span>TOTAL A PAGAR:</span>
                <span className="text-xl font-mono">Gs. {venta.total.toLocaleString('es-PY')}</span>
              </div>

              <p className="text-xs font-semibold italic text-slate-800 mb-4 bg-slate-50 p-2 rounded border border-slate-200">
                {numeroALetras(venta.total)}
              </p>

              {/* CDC & QR Code Footer */}
              <div className="border-t-2 border-slate-900 pt-4 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-8 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Código de Control (CDC SIFEN Paraguay)</div>
                  <div className="font-mono text-[10px] break-all bg-slate-100 p-2 rounded border border-slate-300 font-semibold tracking-wider text-slate-900">
                    {venta.cdc}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Consulte la validez de esta Factura Electrónica en sifen.set.gov.py o escaneando el código QR.
                  </p>
                </div>

                <div className="col-span-4 flex justify-end">
                  <div className="text-center">
                    <img src={qrUrl} alt="QR SIFEN" className="w-28 h-28 border border-slate-300 p-1 rounded bg-white" />
                    <span className="text-[9px] text-slate-500 block mt-1">Consulta SET QR</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORMAT TICKET 80mm */}
          {viewFormat === 'TICKET' && (
            <div className="bg-amber-50 text-slate-900 rounded p-6 shadow-xl w-80 mx-auto font-mono text-[11px] border border-slate-300 space-y-3">
              <div className="text-center border-b border-slate-400 pb-2">
                {emisor.logo_path && (
                  <img src={emisor.logo_path} alt="Logo" className="w-12 h-12 object-contain mx-auto mb-1" />
                )}
                {emisor.nombre_fantasia && (
                  <h2 className="font-black text-sm uppercase text-amber-800">{emisor.nombre_fantasia}</h2>
                )}
                <h3 className="font-bold text-xs uppercase">{emisor.titular}</h3>
                <p className="text-[10px]">RUC: {emisor.ruc}</p>
                <p className="text-[10px]">Timbrado: {emisor.timbrado}</p>
                <p className="text-[10px]">{emisor.direccion}</p>
              </div>

              <div className="border-b border-slate-400 pb-2 text-[10px] space-y-0.5">
                <div>FAC: {venta.nro_factura}</div>
                <div>FEC: {venta.fecha}</div>
                <div className="font-bold">CLI: {venta.cliente_nom}</div>
                <div>RUC/DOC: {venta.cliente_ruc} ({venta.cliente_tipo_doc || 'RUC'})</div>
                {venta.cliente_email && <div>EMAIL: {venta.cliente_email}</div>}
                {venta.cliente_tel && <div>TEL: {venta.cliente_tel}</div>}
                <div>DIR: {venta.cliente_dir}</div>
                <div>COND: {venta.condicion.toUpperCase()}</div>
              </div>

              <div className="border-b border-slate-400 pb-2 space-y-1">
                {venta.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[10px]">
                    <div>
                      {it.cant}x {it.producto.nombre.slice(0, 18)}
                    </div>
                    <div>Gs. {it.subtotal.toLocaleString('es-PY')}</div>
                  </div>
                ))}
              </div>

              <div className="border-b border-slate-400 pb-2 text-right">
                <div className="text-sm font-bold">TOTAL: Gs. {venta.total.toLocaleString('es-PY')}</div>
              </div>

              <div className="text-center pt-1 space-y-2">
                <img src={qrUrl} alt="QR" className="w-24 h-24 mx-auto border border-slate-300 bg-white p-1" />
                <div className="text-[8px] break-all text-slate-600 font-sans">CDC: {venta.cdc}</div>
                <div className="text-[9px] font-bold">GRACIAS POR SU COMPRA</div>
              </div>
            </div>
          )}

          {/* FORMAT XML */}
          {viewFormat === 'XML' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-900 p-2 px-4 rounded border border-slate-800">
                <span className="text-xs text-slate-400 font-mono">Documento Electrónico SIFEN (XML v150)</span>
                <div className="flex space-x-2">
                  <button
                    onClick={copyXml}
                    className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileCode className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar XML'}</span>
                  </button>
                  <button
                    onClick={downloadXml}
                    className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3 py-1.5 rounded transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar .xml</span>
                  </button>
                </div>
              </div>

              <pre className="bg-slate-950 text-emerald-400 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800 max-h-96">
                {xmlContent}
              </pre>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Comprobante firmado digitalmente con PKCS#12 (.p12)
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2 rounded-lg text-xs transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
