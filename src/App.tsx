import React, { useState } from 'react';
import { Header } from './components/Header';
import { VentasView } from './components/VentasView';
import { InventarioView } from './components/InventarioView';
import { EmisorView } from './components/EmisorView';
import { ClientesView } from './components/ClientesView';
import { HistorialView } from './components/HistorialView';
import { UsuariosView } from './components/UsuariosView';
import { FacturaModal } from './components/FacturaModal';
import { VideoTutorialModal } from './components/VideoTutorialModal';
import { ManualPDFModal } from './components/ManualPDFModal';
import { VenderSoftwareView } from './components/VenderSoftwareView';
import {
  Producto,
  Certificado,
  Cliente,
  Usuario,
  Venta,
  LicenciaSaaS,
} from './types';
import {
  initialProductos,
  initialCertificados,
  initialClientes,
  initialUsuarios,
  initialVentas,
} from './lib/sifenUtils';
import { Lock, LogIn } from 'lucide-react';

export default function App() {
  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<Usuario>(initialUsuarios[0]);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab: 0=Ventas, 1=Inventario, 2=Emisor, 3=Usuarios, 4=Clientes, 5=Historial
  const [activeTab, setActiveTab] = useState(0);

  // Data state
  const [productos, setProductos] = useState<Producto[]>(initialProductos);
  const [emisores, setEmisores] = useState<Certificado[]>(initialCertificados);
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [ventas, setVentas] = useState<Venta[]>(initialVentas);

  // Licencias SaaS para vender el software
  const [licencias, setLicencias] = useState<LicenciaSaaS[]>([
    {
      id: 'LIC-001',
      empresaNombre: 'Farmacia San Roque S.A.',
      ruc: '80045678-2',
      plan: 'PRO SIFEN',
      montoMensual: 250000,
      fechaInicio: '2026-08-01',
      fechaVencimiento: '2026-09-01',
      estado: 'ACTIVA',
      claveActivacion: 'SIFEN-KEY-A98F-PYG',
      contactoTel: '+595 981 445566',
      contactoEmail: 'admin@farmaciasanroque.com.py',
    },
    {
      id: 'LIC-002',
      empresaNombre: 'Supermercado El Sol',
      ruc: '80012399-5',
      plan: 'ENTERPRISE',
      montoMensual: 450000,
      fechaInicio: '2026-07-15',
      fechaVencimiento: '2026-08-15',
      estado: 'ACTIVA',
      claveActivacion: 'SIFEN-KEY-B44X-PYG',
      contactoTel: '+595 971 889900',
    },
    {
      id: 'LIC-003',
      empresaNombre: 'Comercial Itaipú',
      ruc: '80099881-1',
      plan: 'BÁSICO',
      montoMensual: 150000,
      fechaInicio: '2026-08-03',
      fechaVencimiento: '2026-08-18',
      estado: 'PRUEBA 15 DÍAS',
      claveActivacion: 'SIFEN-KEY-DEMO-PYG',
    }
  ]);

  const handleAddLicencia = (nuevaLic: LicenciaSaaS) => {
    setLicencias(prev => [nuevaLic, ...prev]);
  };

  const handleUpdateEstadoLicencia = (id: string, nuevoEstado: LicenciaSaaS['estado']) => {
    setLicencias(prev => prev.map(l => l.id === id ? { ...l, estado: nuevoEstado } : l));
  };

  // Modal Factura
  const [selectedVentaModal, setSelectedVentaModal] = useState<Venta | null>(null);
  
  // Modal Video Tutorial & Manual PDF
  const [isVideoTutorialOpen, setIsVideoTutorialOpen] = useState(false);
  const [isManualPDFOpen, setIsManualPDFOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = loginUser.trim().toLowerCase();
    const cleanPass = loginPass.trim();

    const found = usuarios.find(u => u.user.toLowerCase() === cleanUser);
    if (found) {
      const userPass = found.password || '1234';
      if (userPass && cleanPass !== userPass) {
        setLoginError(`Contraseña incorrecta para el usuario "${found.user}".`);
        return;
      }

      setCurrentUser(found);
      setIsLoggedIn(true);
      setLoginError('');
      setActiveTab(0);
    } else {
      setLoginError(`El usuario "${loginUser}" no existe en el sistema.`);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginUser('');
    setLoginPass('');
    setLoginError('');
  };

  const handleEmitirVenta = (nuevaVenta: Venta) => {
    // Actualizar stock de productos
    setProductos(prev =>
      prev.map(p => {
        const itemInCart = nuevaVenta.items.find(i => i.producto.codigo === p.codigo);
        if (itemInCart) {
          return { ...p, stock: Math.max(0, p.stock - itemInCart.cant) };
        }
        return p;
      })
    );

    // Agregar venta al historial
    setVentas(prev => [nuevaVenta, ...prev]);

    // Abrir comprobante en modal
    setSelectedVentaModal(nuevaVenta);
  };

  const handleSaveProducto = (nuevoProd: Producto) => {
    setProductos(prev => {
      const idx = prev.findIndex(p => p.codigo === nuevoProd.codigo);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = nuevoProd;
        return copy;
      }
      return [nuevoProd, ...prev];
    });
  };

  const handleSaveEmisor = (nuevoEmisor: Certificado) => {
    setEmisores([nuevoEmisor]);
  };

  const handleAddCliente = (nuevoCliente: Cliente) => {
    setClientes(prev => {
      if (prev.some(c => c.ruc === nuevoCliente.ruc)) return prev;
      return [nuevoCliente, ...prev];
    });
  };

  const handleAddUsuario = (nuevoUsuario: Usuario) => {
    setUsuarios(prev => {
      const idx = prev.findIndex(u => u.user.toLowerCase() === nuevoUsuario.user.toLowerCase());
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = nuevoUsuario;
        return copy;
      }
      return [...prev, nuevoUsuario];
    });
  };

  const currentEmisor = emisores[0] || initialCertificados[0];
  const systemBrandName = currentEmisor?.nombre_sistema || 'ÑANGAREKO SIFEN';
  const commercialName = currentEmisor?.nombre_fantasia || currentEmisor?.titular || 'MI EMPRENDIMIENTO';

  // If not logged in, show Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            {currentEmisor?.logo_path ? (
              <img
                src={currentEmisor.logo_path}
                alt="Logo Empresa"
                className="w-20 h-20 object-contain mx-auto rounded-xl bg-slate-950 border border-slate-700 p-1.5 shadow-lg"
              />
            ) : (
              <div className="inline-flex bg-gradient-to-tr from-amber-500 to-amber-600 p-3 rounded-xl shadow-lg text-slate-950 mb-2">
                <Lock className="w-8 h-8" />
              </div>
            )}
            <h1 className="text-2xl font-black tracking-wide text-white uppercase">{systemBrandName}</h1>
            <p className="text-xs text-amber-400 font-bold">{commercialName} • SIFEN v14.0 SET Paraguay</p>
          </div>

          {loginError && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-lg text-center font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Usuario</label>
              <input
                type="text"
                value={loginUser}
                onChange={e => setLoginUser(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Contraseña</label>
              <input
                type="password"
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:border-amber-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-amber-950/40"
            >
              <LogIn className="w-4 h-4" />
              <span>INGRESAR AL SISTEMA</span>
            </button>
          </form>

          <div className="text-center text-[11px] text-slate-500 pt-2 border-t border-slate-800">
            Credenciales de prueba: <strong className="text-slate-400">admin / 1234</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* App Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        emisor={currentEmisor}
        onLogout={handleLogout}
        onOpenVideoTutorial={() => setIsVideoTutorialOpen(true)}
        onOpenManualPDF={() => setIsManualPDFOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 0 && (
          <VentasView
            emisores={emisores}
            clientes={clientes}
            productos={productos}
            onEmitirVenta={handleEmitirVenta}
            onAddCliente={handleAddCliente}
          />
        )}

        {activeTab === 1 && (
          <InventarioView
            productos={productos}
            onSaveProducto={handleSaveProducto}
          />
        )}

        {activeTab === 2 && (
          <EmisorView
            emisores={emisores}
            onSaveEmisor={handleSaveEmisor}
          />
        )}

        {activeTab === 3 && (
          <UsuariosView
            usuarios={usuarios}
            onAddUsuario={handleAddUsuario}
          />
        )}

        {activeTab === 4 && (
          <ClientesView
            clientes={clientes}
            onAddCliente={handleAddCliente}
          />
        )}

        {activeTab === 5 && (
          <HistorialView
            ventas={ventas}
            onSelectVenta={v => setSelectedVentaModal(v)}
          />
        )}

        {activeTab === 6 && (
          <VenderSoftwareView
            licencias={licencias}
            onAddLicencia={handleAddLicencia}
            onUpdateEstadoLicencia={handleUpdateEstadoLicencia}
            onOpenManualPDF={() => setIsManualPDFOpen(true)}
          />
        )}
      </main>

      {/* Invoice Modal for PDF A4, Ticket 80mm & SIFEN XML */}
      <FacturaModal
        venta={selectedVentaModal}
        emisor={currentEmisor}
        onClose={() => setSelectedVentaModal(null)}
      />

      {/* Video Tutorial & Interactive Installation Modal */}
      <VideoTutorialModal
        isOpen={isVideoTutorialOpen}
        onClose={() => setIsVideoTutorialOpen(false)}
      />

      {/* Printable Manual PDF Modal */}
      <ManualPDFModal
        isOpen={isManualPDFOpen}
        onClose={() => setIsManualPDFOpen(false)}
      />

    </div>
  );
}
