import React, { useState } from 'react';
import { UserCheck, Plus, Save, Key, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Usuario } from '../types';

interface UsuariosViewProps {
  usuarios: Usuario[];
  onAddUsuario: (usuario: Usuario) => void;
}

export const UsuariosView: React.FC<UsuariosViewProps> = ({ usuarios, onAddUsuario }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<'ADMINISTRADOR' | 'CAJERO'>('CAJERO');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const finalPass = password.trim() || '1234';
    onAddUsuario({ user: user.trim(), password: finalPass, rol });
    setSuccessMsg(`Usuario "${user.trim()}" guardado exitosamente con contraseña "${finalPass}"`);
    setUser('');
    setPassword('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const toggleShowPass = (userName: string) => {
    setShowPasswords(prev => ({ ...prev, [userName]: !prev[userName] }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-amber-500" />
            <span>Gestión de Usuarios y Contraseñas de Acceso</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Crea o modifica los usuarios y contraseñas que tus clientes o cajeros utilizarán para iniciar sesión.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs font-bold flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Crear o Actualizar Usuario</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Usuario / ID de Acceso *</label>
            <input
              type="text"
              placeholder="Ej: cajero1, juan, admin..."
              value={user}
              onChange={e => setUser(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Contraseña *</label>
            <input
              type="text"
              placeholder="Ej: 1234, miClave2026..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">Si lo dejas en blanco, la clave será "1234"</span>
          </div>

          <div className="md:col-span-4">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Rol Asignado</label>
            <select
              value={rol}
              onChange={e => setRol(e.target.value as 'ADMINISTRADOR' | 'CAJERO')}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:border-amber-500 outline-none"
            >
              <option value="CAJERO">CAJERO (Acceso a Ventas y Clientes)</option>
              <option value="ADMINISTRADOR">ADMINISTRADOR (Acceso Total)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2 rounded-lg text-xs flex items-center space-x-2 shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>GUARDAR / CREAR USUARIO</span>
          </button>
        </div>
      </form>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            Usuarios Registrados y sus Claves de Acceso
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Usuario</th>
                <th className="p-3">Contraseña de Iniciar Sesión</th>
                <th className="p-3">Rol</th>
                <th className="p-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {usuarios.map(u => {
                const passVal = u.password || '1234';
                const isRevealed = showPasswords[u.user];
                return (
                  <tr key={u.user} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-white">{u.user}</td>
                    
                    <td className="p-3">
                      <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded w-fit">
                        <span className="text-amber-400 font-bold">
                          {isRevealed ? passVal : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleShowPass(u.user)}
                          className="text-slate-500 hover:text-slate-300 ml-1"
                          title={isRevealed ? "Ocultar" : "Ver Contraseña"}
                        >
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.rol === 'ADMINISTRADOR'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {u.rol}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <span className="text-emerald-400 text-[10px] font-bold">Activo</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
