import React from 'react';
import { ShoppingCart, Package, Building2, Users, History, UserCheck, LogOut, Video, DollarSign, Globe, FileText } from 'lucide-react';
import { Usuario, Certificado } from '../types';

interface HeaderProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  currentUser: Usuario;
  emisor?: Certificado | null;
  onLogout: () => void;
  onOpenVideoTutorial?: () => void;
  onOpenManualPDF?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  emisor,
  onLogout,
  onOpenVideoTutorial,
  onOpenManualPDF,
}) => {
  const tabs = [
    { id: 0, label: 'VENTAS', icon: ShoppingCart, roles: ['ADMINISTRADOR', 'CAJERO'] },
    { id: 1, label: 'INVENTARIO', icon: Package, roles: ['ADMINISTRADOR'] },
    { id: 2, label: 'EMISOR SIFEN', icon: Building2, roles: ['ADMINISTRADOR'] },
    { id: 3, label: 'USUARIOS', icon: UserCheck, roles: ['ADMINISTRADOR'] },
    { id: 4, label: 'CLIENTES', icon: Users, roles: ['ADMINISTRADOR', 'CAJERO'] },
    { id: 5, label: 'HISTORIAL', icon: History, roles: ['ADMINISTRADOR', 'CAJERO'] },
    { id: 6, label: 'VENDER SOFTWARE (SAAS)', icon: DollarSign, roles: ['ADMINISTRADOR'] },
  ];

  const visibleTabs = tabs.filter(t => t.roles.includes(currentUser.rol));

  const systemBrandName = emisor?.nombre_sistema || 'SIFEN ELITE';
  const commercialName = emisor?.nombre_fantasia || emisor?.titular || 'MI EMPRENDIMIENTO';
  const logoUrl = emisor?.logo_path;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo Empresa"
                className="w-10 h-10 object-contain rounded-lg bg-slate-950 border border-slate-700 p-0.5"
              />
            ) : (
              <div className="bg-gradient-to-tr from-amber-500 to-amber-600 p-2 rounded-lg shadow-md text-slate-950 font-black tracking-widest text-lg">
                SIFEN
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-wide text-white uppercase truncate max-w-[200px] sm:max-w-xs">
                  {systemBrandName}
                </span>
                <span className="bg-amber-500/20 text-amber-400 text-[10px] sm:text-xs px-2 py-0.5 rounded border border-amber-500/30 font-mono shrink-0">
                  v14.0 SET
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-xs">
                {commercialName} {emisor?.ruc ? `• RUC: ${emisor.ruc}` : ''}
              </p>
            </div>
          </div>

          {/* User info, Video Tutorial, Manual PDF & Logout */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {onOpenManualPDF && (
              <button
                onClick={onOpenManualPDF}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm"
                title="Descargar / Imprimir Manual PDF de Instalación"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Manual PDF</span>
              </button>
            )}

            {onOpenVideoTutorial && (
              <button
                onClick={onOpenVideoTutorial}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-md transition-all"
                title="Ver Video Tutorial de Instalación Escritorio (.exe)"
              >
                <Video className="w-4 h-4" />
                <span className="hidden md:inline">Video Tutorial</span>
              </button>
            )}

            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-400 block">Usuario Actual</span>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-semibold text-slate-200">{currentUser.user}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-mono tracking-wider ${
                  currentUser.rol === 'ADMINISTRADOR'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {currentUser.rol}
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

