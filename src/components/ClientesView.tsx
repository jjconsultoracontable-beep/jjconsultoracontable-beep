import React, { useState } from 'react';
import { Users, Plus, Save, Mail, Phone, MapPin, Building2, FileText, CheckCircle2 } from 'lucide-react';
import { Cliente } from '../types';
import { calcularDvRuc } from '../lib/sifenUtils';

interface ClientesViewProps {
  clientes: Cliente[];
  onAddCliente: (cliente: Cliente) => void;
}

export const ClientesView: React.FC<ClientesViewProps> = ({ clientes, onAddCliente }) => {
  const [ruc, setRuc] = useState('');
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [tipoDoc, setTipoDoc] = useState<'RUC' | 'CI' | 'PASAPORTE' | 'DNI' | 'INNOMINADO'>('RUC');
  const [tipoContribuyente, setTipoContribuyente] = useState<'FÍSICA' | 'JURÍDICA' | 'NO_CONTRIBUYENTE'>('FÍSICA');
  const [ciudad, setCiudad] = useState('Asunción');
  const [departamento, setDepartamento] = useState('Capital');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruc || !nombre) return;

    let finalRuc = ruc.trim();
    if (tipoDoc === 'RUC') {
      if (!finalRuc.includes('-')) {
        finalRuc = `${finalRuc}-${calcularDvRuc(finalRuc)}`;
      }
    } else {
      if (finalRuc.includes('-') && tipoDoc !== 'INNOMINADO') {
        finalRuc = finalRuc.split('-')[0];
      }
    }

    onAddCliente({
      ruc: finalRuc,
      nombre: nombre.trim(),
      direccion: direccion.trim() || 'ASUNCIÓN - PARAGUAY',
      telefono: telefono.trim(),
      email: email.trim(),
      tipo_doc: tipoDoc,
      tipo_contribuyente: tipoContribuyente,
      ciudad: ciudad.trim() || 'Asunción',
      departamento: departamento.trim() || 'Central',
    });

    setRuc('');
    setNombre('');
    setDireccion('');
    setTelefono('');
    setEmail('');
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-amber-500" />
            <span>Directorio de Receptores / Clientes SIFEN</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestión integral de compradores de facturas electrónicas exigida por la SET (RUC, C.I., Correo Electrónico para envío de KUDE XML, Tipo de Contribuyente y Domicilio Fiscal).
          </p>
        </div>
      </div>

      {savedMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl flex items-center space-x-3 text-xs font-medium">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Cliente guardado exitosamente en el directorio de SIFEN.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Registrar Datos Completos del Comprador</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Tipo Documento */}
          <div className="md:col-span-3">
            <label className="text-xs font-medium text-slate-300 mb-1 block">Tipo Documento Receptor *</label>
            <select
              value={tipoDoc}
              onChange={e => {
                const val = e.target.value as any;
                setTipoDoc(val);
                if (val === 'INNOMINADO') {
                  setRuc('4444444-0');
                  setNombre('CONSUMIDOR FINAL / SIN NOMBRE');
                  setTipoContribuyente('NO_CONTRIBUYENTE');
                }
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:border-amber-500 outline-none"
            >
              <option value="RUC">RUC (Contribuyente SET)</option>
              <option value="CI">Cédula de Identidad (C.I. Paraguay)</option>

              <option value="PASAPORTE">Pasaporte (Extranjero)</option>
              <option value="DNI">DNI / Documento Extranjero</option>
              <option value="INNOMINADO">Sin Nombre / Consumidor Final</option>
            </select>
          </div>

          {/* RUC / CI */}
          <div className="md:col-span-3">
            <label className="text-xs font-medium text-slate-300 mb-1 block">
              {tipoDoc === 'RUC' ? 'RUC (Sin DV / Con DV)' : 'Número de Documento'} *
            </label>
            <input
              type="text"
              placeholder={tipoDoc === 'RUC' ? 'Ej: 80012345 o 4567890' : 'Ej: 1234567'}
              value={ruc}
              onChange={e => setRuc(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-amber-400 font-bold focus:border-amber-500 outline-none"
            />
          </div>

          {/* Tipo Contribuyente */}
          <div className="md:col-span-3">
            <label className="text-xs font-medium text-slate-300 mb-1 block">Tipo Naturaleza Contribuyente</label>
            <select
              value={tipoContribuyente}
              onChange={e => setTipoContribuyente(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:border-amber-500 outline-none"
            >
              <option value="FÍSICA">Persona Física</option>
              <option value="JURÍDICA">Persona Jurídica (Empresa/Sociedad)</option>
              <option value="NO_CONTRIBUYENTE">No Contribuyente / Consumidor</option>
            </select>
          </div>

          {/* Nombre completo */}
          <div className="md:col-span-3">
            <label className="text-xs font-medium text-slate-300 mb-1 block">Nombre / Razón Social *</label>
            <input
              type="text"
              placeholder="Ej: Juan Pérez / Comercial S.A."
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold focus:border-amber-500 outline-none"
            />
          </div>

          {/* Email */}
          <div className="md:col-span-4">
            <label className="text-xs font-medium text-slate-300 mb-1 block flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Correo Electrónico (Para KUDE DE XML) *</span>
            </label>
            <input
              type="email"
              placeholder="comprador@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none font-mono"
            />
          </div>

          {/* Telefono */}
          <div className="md:col-span-4">
            <label className="text-xs font-medium text-slate-300 mb-1 block flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Teléfono / Celular WhatsApp</span>
            </label>
            <input
              type="text"
              placeholder="Ej: 0981 123 456"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none font-mono"
            />
          </div>

          {/* Ciudad */}
          <div className="md:col-span-4">
            <label className="text-xs font-medium text-slate-300 mb-1 block">Ciudad / Municipio</label>
            <input
              type="text"
              placeholder="Ej: Asunción, San Lorenzo, CDE..."
              value={ciudad}
              onChange={e => setCiudad(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
            />
          </div>

          {/* Departamento */}
          <div className="md:col-span-4">
            <label className="text-xs font-medium text-slate-300 mb-1 block">Departamento</label>
            <select
              value={departamento}
              onChange={e => setDepartamento(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
            >
              <option value="Capital">Capital (Asunción)</option>
              <option value="Central">Central</option>
              <option value="Alto Paraná">Alto Paraná</option>
              <option value="Itapúa">Itapúa</option>
              <option value="Caaguazú">Caaguazú</option>
              <option value="San Pedro">San Pedro</option>
              <option value="Cordillera">Cordillera</option>
              <option value="Guairá">Guairá</option>
              <option value="Paraguarí">Paraguarí</option>
              <option value="Amambay">Amambay</option>
              <option value="Canindeyú">Canindeyú</option>
              <option value="Concepción">Concepción</option>
              <option value="Misiones">Misiones</option>
              <option value="Ñeembucú">Ñeembucú</option>
              <option value="Presidente Hayes">Presidente Hayes</option>
              <option value="Boquerón">Boquerón</option>
              <option value="Alto Paraguay">Alto Paraguay</option>
            </select>
          </div>

          {/* Dirección */}
          <div className="md:col-span-8">
            <label className="text-xs font-medium text-slate-300 mb-1 block flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Dirección Fiscal del Comprador</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Palma 452 c/ 14 de Mayo"
              value={direccion}
              onChange={e => setDireccion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
            />
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>GUARDAR RECEPTOR SIFEN</span>
          </button>
        </div>
      </form>

      {/* Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Receptores Registrados ({clientes.length})
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            SET Paraguay DE v150
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Doc / RUC</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Nombre / Razón Social</th>
                <th className="p-3">Email (KUDE DE)</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Ciudad / Ubicación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {clientes.map(c => (
                <tr key={c.ruc} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-amber-400 font-bold">{c.ruc}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {c.tipo_doc || 'RUC'}
                    </span>
                  </td>
                  <td className="p-3 font-sans font-medium text-white">{c.nombre}</td>
                  <td className="p-3 text-emerald-400 font-mono text-[11px]">{c.email || 'sinemail@sifen.gov.py'}</td>
                  <td className="p-3 text-slate-400">{c.telefono || '-'}</td>
                  <td className="p-3 text-slate-400 font-sans">
                    {c.ciudad || 'Asunción'} {c.departamento ? `(${c.departamento})` : ''} - <span className="text-slate-500 text-[11px]">{c.direccion}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

