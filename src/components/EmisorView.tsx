import React, { useState } from 'react';
import { Building2, Key, Image as ImageIcon, CheckCircle, FileCheck, Upload, Sparkles } from 'lucide-react';
import { Certificado } from '../types';

interface EmisorViewProps {
  emisores: Certificado[];
  onSaveEmisor: (emisor: Certificado) => void;
}

export const EmisorView: React.FC<EmisorViewProps> = ({ emisores, onSaveEmisor }) => {
  const current = emisores[0] || {
    titular: '',
    nombre_fantasia: '',
    nombre_sistema: 'ÑANGAREKO SIFEN',
    ruc: '',
    timbrado: '',
    inicio_vigencia: '',
    direccion: '',
    telefono: '',
    actividad: '',
    cert_path: '',
    logo_path: '',
  };

  const [titular, setTitular] = useState(current.titular);
  const [nombreFantasia, setNombreFantasia] = useState(current.nombre_fantasia || '');
  const [nombreSistema, setNombreSistema] = useState(current.nombre_sistema || 'ÑANGAREKO SIFEN');
  const [ruc, setRuc] = useState(current.ruc);
  const [timbrado, setTimbrado] = useState(current.timbrado);
  const [inicioVigencia, setInicioVigencia] = useState(current.inicio_vigencia);
  const [direccion, setDireccion] = useState(current.direccion);
  const [telefono, setTelefono] = useState(current.telefono);
  const [actividad, setActividad] = useState(current.actividad);
  const [certPath, setCertPath] = useState(current.cert_path || '');
  const [logoPath, setLogoPath] = useState(current.logo_path || '');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLogoPath(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEmisor({
      titular: titular.trim(),
      nombre_fantasia: nombreFantasia.trim(),
      nombre_sistema: nombreSistema.trim() || 'ÑANGAREKO SIFEN',
      ruc: ruc.trim(),
      timbrado: timbrado.trim(),
      inicio_vigencia: inicioVigencia.trim(),
      direccion: direccion.trim(),
      telefono: telefono.trim(),
      actividad: actividad.trim(),
      cert_path: certPath.trim(),
      logo_path: logoPath.trim(),
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-amber-500" />
            <span>Configuración de Emisor, Nombre Comercial y Logo</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Personaliza el nombre de tu emprendimiento, tu logotipo y tus datos fiscales oficiales de la SET.
          </p>
        </div>
      </div>

      {savedMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl flex items-center space-x-3 text-xs font-medium">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>¡Identidad Comercial y Configuración SIFEN guardadas exitosamente!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-6">
        
        {/* Section 0: Nombre Comercial y Logo (Identidad de Marca) */}
        <div className="bg-slate-950/60 border border-amber-500/30 p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>1. Identidad Comercial de tu Emprendimiento (Visible en la app y en Facturas)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="text-xs font-medium text-amber-300 mb-1 block">
                Nombre Comercial del Sistema / Marca del Software *
              </label>
              <input
                type="text"
                placeholder="Ej: ÑANGAREKO SIFEN, Ñangareko Facturación..."
                value={nombreSistema}
                onChange={e => setNombreSistema(e.target.value)}
                className="w-full bg-slate-900 border border-amber-500/50 rounded-lg px-3 py-2.5 text-xs text-amber-300 font-bold focus:border-amber-400 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Este es el nombre del software que le muestras a tus usuarios y clientes en la pantalla de inicio y la barra superior.
              </span>
            </div>

            <div className="md:col-span-6">
              <label className="text-xs font-medium text-slate-300 mb-1 block">
                Nombre Comercial / Marca de Fantasía del Negocio *
              </label>
              <input
                type="text"
                placeholder="Ej: JJ Consultora, Bodega Don Juan, Comercial El Sol..."
                value={nombreFantasia}
                onChange={e => setNombreFantasia(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white font-bold focus:border-amber-500 outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Nombre comercial impreso en la factura/ticket (Ej: "JJ CONSULTORA").
              </span>
            </div>

            <div className="md:col-span-12 space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-medium text-slate-300 block">
                Logotipo del Emprendimiento (Subir archivo o pegar enlace URL)
              </label>
              
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                
                {/* Logo Preview */}
                <div className="w-16 h-16 rounded-xl border border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                  {logoPath ? (
                    <img src={logoPath} alt="Logo Prev" className="w-full h-full object-contain p-1" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 space-y-2 w-full">
                  {/* File Upload Input */}
                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-colors w-full sm:w-auto inline-flex">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir imagen de tu computadora</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Or URL input */}
                  <input
                    type="text"
                    placeholder="o pega una URL de imagen (https://...)"
                    value={logoPath}
                    onChange={e => setLogoPath(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 focus:border-amber-500 outline-none"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Datos Fiscales */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>2. Datos Fiscales Oficiales (Razón Social SET Paraguay)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="text-xs font-medium text-slate-400 mb-1 block">Razón Social Legal / Titular *</label>
              <input
                type="text"
                value={titular}
                onChange={e => setTitular(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-medium text-slate-400 mb-1 block">RUC (Con DV)</label>
              <input
                type="text"
                value={ruc}
                onChange={e => setRuc(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-medium text-slate-400 mb-1 block">Timbrado SIFEN</label>
              <input
                type="text"
                value={timbrado}
                onChange={e => setTimbrado(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-medium text-slate-400 mb-1 block">Inicio Vigencia Timbrado</label>
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                value={inicioVigencia}
                onChange={e => setInicioVigencia(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-medium text-slate-400 mb-1 block">Teléfono de Contacto</label>
              <input
                type="text"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="md:col-span-6">
              <label className="text-xs font-medium text-slate-400 mb-1 block">Actividad Económica Principal</label>
              <input
                type="text"
                value={actividad}
                onChange={e => setActividad(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="md:col-span-12">
              <label className="text-xs font-medium text-slate-400 mb-1 block">Dirección Matriz</label>
              <input
                type="text"
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Certificado Digital */}
        <div className="space-y-4 border-t border-slate-800 pt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
            <Key className="w-4 h-4" />
            <span>3. Firma Digital PKCS#12 (.p12)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-12">
              <label className="text-xs font-medium text-slate-400 mb-1 block">Ruta / Archivo Certificado Digital (.p12)</label>
              <input
                type="text"
                placeholder="C:\sifen\certificados\firma.p12"
                value={certPath}
                onChange={e => setCertPath(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-lg transition-colors"
          >
            <FileCheck className="w-4 h-4" />
            <span>GUARDAR NOMBRE, LOGO Y DATOS SIFEN</span>
          </button>
        </div>

      </form>

    </div>
  );
};
