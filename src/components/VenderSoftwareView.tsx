import React, { useState } from 'react';
import { 
  Globe, 
  DollarSign, 
  Share2, 
  Copy, 
  Check, 
  Key, 
  Plus, 
  ShieldCheck, 
  Users, 
  Smartphone, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  CreditCard,
  Building,
  Calendar,
  AlertCircle,
  HelpCircle,
  QrCode,
  Download,
  FileText
} from 'lucide-react';
import { LicenciaSaaS } from '../types';

interface VenderSoftwareViewProps {
  licencias: LicenciaSaaS[];
  onAddLicencia: (lic: LicenciaSaaS) => void;
  onUpdateEstadoLicencia: (id: string, nuevoEstado: LicenciaSaaS['estado']) => void;
  onOpenManualPDF?: () => void;
}

export const VenderSoftwareView: React.FC<VenderSoftwareViewProps> = ({
  licencias,
  onAddLicencia,
  onUpdateEstadoLicencia,
  onOpenManualPDF,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedLicKey, setCopiedLicKey] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // Form para crear nueva licencia de cliente
  const [empresaNombre, setEmpresaNombre] = useState('');
  const [ruc, setRuc] = useState('');
  const [plan, setPlan] = useState<'BÁSICO' | 'PRO SIFEN' | 'ENTERPRISE'>('PRO SIFEN');
  const [montoMensual, setMontoMensual] = useState('250000');
  const [contactoEmail, setContactoEmail] = useState('');
  const [contactoTel, setContactoTel] = useState('');

  const currentWebUrl = window.location.origin;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentWebUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedLicKey(key);
    setTimeout(() => setCopiedLicKey(null), 2000);
  };

  const handleCreateLicencia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresaNombre || !ruc) return;

    const fechaHoy = new Date().toISOString().split('T')[0];
    const fechaVenc = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const randCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const nueva: LicenciaSaaS = {
      id: `LIC-${Date.now().toString().slice(-4)}`,
      empresaNombre,
      ruc,
      plan,
      montoMensual: parseInt(montoMensual) || 250000,
      fechaInicio: fechaHoy,
      fechaVencimiento: fechaVenc,
      estado: 'ACTIVA',
      claveActivacion: `SIFEN-KEY-${randCode}-PYG`,
      contactoEmail,
      contactoTel,
    };

    onAddLicencia(nueva);
    setShowNewModal(false);
    // Reset form
    setEmpresaNombre('');
    setRuc('');
    setContactoEmail('');
    setContactoTel('');
  };

  // Métricas financieras SaaS
  const licenciasActivas = licencias.filter(l => l.estado === 'ACTIVA' || l.estado === 'PRUEBA 15 DÍAS');
  const mrrTotal = licenciasActivas.reduce((acc, curr) => acc + curr.montoMensual, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Banner Principal de Venta Web */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plataforma Cloud Lista para Comercializar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Tu Software SIFEN ELITE está 100% Funcional en la Web
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              No necesitas saber de programación ni compilar archivos. Solo comparte la dirección web de tu sistema con tus clientes. Tus clientes pueden usarlo directamente desde cualquier navegador o instalarlo como programa en su PC con 1 solo clic.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={handleCopyLink}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>¡ENLACE COPIADO AL PORTAPAPELES!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>COPIAR LINK PARA MIS CLIENTES</span>
                </>
              )}
            </button>

            {onOpenManualPDF && (
              <button
                onClick={onOpenManualPDF}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
              >
                <FileText className="w-4 h-4 text-slate-950" />
                <span>VER / DESCARGAR MANUAL EN PDF</span>
              </button>
            )}

            <a
              href={currentWebUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-6 py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
            >
              <ExternalLink className="w-4 h-4 text-amber-400" />
              <span>Abrir App en Nueva Pestaña</span>
            </a>
          </div>
        </div>
      </div>

      {/* Guía Fácil: Cómo Vender este Software en 3 Pasos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center border border-amber-500/30 font-black text-sm">
            1
          </div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            Envía el Enlace Web
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Copia el enlace de arriba y envíaselo por WhatsApp o Email a comercios, farmacias o empresas que necesiten Facturación Electrónica SIFEN.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/30 font-black text-sm">
            2
          </div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            Instalación en 1 Clic (PWA)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tus clientes abren la web en Google Chrome o Edge y presionan <strong className="text-amber-400">"Instalar SIFEN Elite"</strong>. Se crea un ícono en su Escritorio de Windows al instante.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/30 font-black text-sm">
            3
          </div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-400" />
            Cobra una Suscripción Mensual
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cobra una mensualidad (ej: 250.000 PYG/mes) por cliente. Generas ingresos recurrentes mes a mes por ofrecer el servicio de facturación.
          </p>
        </div>

      </div>

      {/* Métricas de Venta & Clientes Activos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center space-x-4">
          <div className="bg-emerald-500/20 text-emerald-400 p-3.5 rounded-xl border border-emerald-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Clientes Activos SIFEN</span>
            <span className="text-2xl font-black text-white">{licenciasActivas.length} Empresas</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center space-x-4">
          <div className="bg-amber-500/20 text-amber-400 p-3.5 rounded-xl border border-amber-500/30">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Ingreso Mensual Recurrente (MRR)</span>
            <span className="text-2xl font-black text-amber-400">
              ₲ {mrrTotal.toLocaleString('es-PY')} /mes
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center space-x-4">
          <div className="bg-blue-500/20 text-blue-400 p-3.5 rounded-xl border border-blue-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Servidor & Estado SET</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              En Línea 24/7 (Cloud Run)
            </span>
          </div>
        </div>

      </div>

      {/* Tabla de Licencias Vendidas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950/60">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              Gestión de Licencias Vendidas a Clientes
            </h3>
            <p className="text-xs text-slate-400">
              Administra qué empresas tienen acceso activo, sus planes y claves de licencia.
            </p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-all shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Nueva Licencia de Cliente</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Empresa / Cliente</th>
                <th className="p-4">RUC / ID</th>
                <th className="p-4">Plan Contratado</th>
                <th className="p-4">Monto Mensual</th>
                <th className="p-4">Clave de Licencia</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {licencias.map((lic) => (
                <tr key={lic.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-slate-100">
                    <div>{lic.empresaNombre}</div>
                    {(lic.contactoTel || lic.contactoEmail) && (
                      <span className="text-[11px] font-normal text-slate-400 block">
                        {lic.contactoTel} {lic.contactoEmail ? `• ${lic.contactoEmail}` : ''}
                      </span>
                    )}
                  </td>

                  <td className="p-4 font-mono text-slate-300">
                    {lic.ruc}
                  </td>

                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      lic.plan === 'ENTERPRISE'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : lic.plan === 'PRO SIFEN'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {lic.plan}
                    </span>
                  </td>

                  <td className="p-4 font-bold text-emerald-400">
                    ₲ {lic.montoMensual.toLocaleString('es-PY')}
                  </td>

                  <td className="p-4 font-mono">
                    <div className="flex items-center space-x-2 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800 w-fit">
                      <span className="text-amber-400 text-[11px]">{lic.claveActivacion}</span>
                      <button
                        onClick={() => handleCopyKey(lic.claveActivacion)}
                        className="text-slate-500 hover:text-slate-200 transition-colors"
                        title="Copiar Clave"
                      >
                        {copiedLicKey === lic.claveActivacion ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      lic.estado === 'ACTIVA'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : lic.estado === 'PRUEBA 15 DÍAS'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {lic.estado}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <select
                      value={lic.estado}
                      onChange={(e) => onUpdateEstadoLicencia(lic.id, e.target.value as LicenciaSaaS['estado'])}
                      className="bg-slate-950 border border-slate-700 text-slate-300 rounded px-2 py-1 text-[11px] outline-none focus:border-amber-500"
                    >
                      <option value="ACTIVA">Marcar ACTIVA</option>
                      <option value="PRUEBA 15 DÍAS">Prueba 15 Días</option>
                      <option value="SUSPENDIDA">SUSPENDER</option>
                      <option value="VENCIDA">VENCIDA</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Nueva Licencia de Cliente */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-400" />
                Registrar Nuevo Cliente SaaS
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLicencia} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nombre de la Empresa o Cliente *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Comercial Don Bosco S.A."
                  value={empresaNombre}
                  onChange={(e) => setEmpresaNombre(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    RUC del Cliente *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 80012345-6"
                    value={ruc}
                    onChange={(e) => setRuc(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Plan Contratado
                  </label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                  >
                    <option value="BÁSICO">Plan Básico (150.000 PYG)</option>
                    <option value="PRO SIFEN">Plan Pro SIFEN (250.000 PYG)</option>
                    <option value="ENTERPRISE">Plan Enterprise (450.000 PYG)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Monto Mensual Acordado (Guaraníes ₲)
                </label>
                <input
                  type="number"
                  value={montoMensual}
                  onChange={(e) => setMontoMensual(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Teléfono WhatsApp (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: +595 981 123456"
                    value={contactoTel}
                    onChange={(e) => setContactoTel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="cliente@empresa.com"
                    value={contactoEmail}
                    onChange={(e) => setContactoEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow transition-all"
                >
                  Generar Licencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
