import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Globe, 
  Monitor, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  Laptop, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface ManualPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualPDFModal: React.FC<ManualPDFModalProps> = ({ isOpen, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const devUrl = window.location.href;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500/20 text-amber-400 p-2 rounded-xl border border-amber-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Manual de Instalación en PDF & Solución a la URL
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Listo para Imprimir / Guardar PDF
                </span>
              </h3>
              <p className="text-xs text-slate-400">Paso a paso ilustrado para instalar la app en Windows y solucionar el error de enlace</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Guardar como PDF / Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="p-4 sm:p-8 bg-slate-950/60 overflow-y-auto flex-1 space-y-8 print:p-0 print:bg-white print:text-black print:overflow-visible">
          
          <div ref={contentRef} className="space-y-8 print:space-y-6">
            
            {/* Header del Manual en Formato Documento */}
            <div className="border-b border-slate-800 print:border-black pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-mono font-bold text-amber-400 print:text-amber-700 uppercase tracking-widest">
                    SIFEN ELITE v14.0 — GUÍA OFICIAL
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white print:text-black">
                  Manual de Instalación de Escritorio y Solución de Enlace
                </h1>
                <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
                  Sistema de Facturación Electrónica SET / DNIT Paraguay • Documento para Usuario y Clientes
                </p>
              </div>

              <div className="bg-slate-900 print:bg-gray-100 border border-slate-800 print:border-gray-300 p-3 rounded-xl text-right text-xs shrink-0">
                <span className="text-slate-400 print:text-gray-500 block">Fecha de Guía</span>
                <span className="font-bold text-slate-200 print:text-black">Agosto 2026</span>
              </div>
            </div>

            {/* SECCIÓN A: SOLUCIÓN AL ERROR "PÁGINA NO ENCONTRADA" */}
            <div className="bg-slate-900/80 print:bg-amber-50 border border-amber-500/40 print:border-amber-400 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center space-x-3 text-amber-400 print:text-amber-800">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h2 className="text-base font-bold text-white print:text-amber-900">
                  1. Solución al Error: "Página no encontrada / URL solicitada no se encontró"
                </h2>
              </div>

              <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
                Este mensaje aparece cuando intentas ingresar al enlace de vista previa compartida (<code className="bg-slate-950 print:bg-amber-100 text-amber-300 print:text-amber-900 px-1.5 py-0.5 rounded font-mono">ais-pre-...</code>) antes de hacer clic en el botón **Compartir / Publicar**.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 print:bg-white p-4 rounded-xl border border-slate-800 print:border-gray-300 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 print:text-emerald-700 block">
                    ✅ Opción A: Usar la URL Activa Actual
                  </span>
                  <p className="text-[11px] text-slate-400 print:text-gray-600">
                    Tu aplicación está funcionando al 100% en esta dirección web directa:
                  </p>
                  <div className="bg-slate-900 print:bg-gray-100 p-2 rounded text-[11px] font-mono text-amber-300 print:text-black break-all select-all">
                    {devUrl}
                  </div>
                </div>

                <div className="bg-slate-950 print:bg-white p-4 rounded-xl border border-slate-800 print:border-gray-300 space-y-2">
                  <span className="text-xs font-bold text-amber-400 print:text-amber-700 block">
                    🚀 Opción B: Habilitar la URL para tus Clientes
                  </span>
                  <p className="text-[11px] text-slate-400 print:text-gray-600">
                    En la esquina superior derecha del panel de AI Studio, haz clic en el botón **"Share" (Compartir)** o **"Deploy" (Desplegar)** para activar la URL pública permanente.
                  </p>
                </div>
              </div>
            </div>

            {/* SECCIÓN B: PASO A PASO PARA ENCONTRAR E INSTALAR EL ÍCONO DE ESCRITORIO */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white print:text-black flex items-center gap-2 border-b border-slate-800 print:border-gray-300 pb-2">
                <Monitor className="w-5 h-5 text-amber-400 print:text-amber-600" />
                2. Paso a Paso: Cómo instalar el ícono en tu Escritorio de Windows (PWA)
              </h2>

              <p className="text-xs text-slate-300 print:text-gray-700">
                La forma más moderna de instalar este sistema en tu computadora es convertir la página web en una **Aplicación de Escritorio Nativa**. No necesitas instalar instaladores complicados ni ser programador.
              </p>

              {/* PASOS ILUSTRADOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* PASO 1 EN CHROME */}
                <div className="bg-slate-900 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-xl p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <h3 className="text-xs font-bold text-white print:text-black">
                      En Google Chrome (Desde la Barra Superior)
                    </h3>
                  </div>

                  <div className="bg-slate-950 print:bg-white border border-slate-800 print:border-gray-300 p-3 rounded-lg text-xs space-y-2">
                    <p className="text-slate-300 print:text-gray-800">
                      Mira arriba a la derecha en la barra de direcciones donde escribes la página web:
                    </p>
                    <div className="bg-slate-900 print:bg-gray-100 p-2 rounded flex items-center justify-between border border-slate-800">
                      <span className="text-[11px] text-slate-400 print:text-gray-500 font-mono">https://ais-dev...</span>
                      <div className="flex items-center space-x-2 text-amber-400 print:text-amber-600 font-bold text-[11px] bg-amber-500/10 px-2 py-1 rounded">
                        <span>🖥️ Instalar SIFEN Elite</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 print:text-gray-600">
                      Haz clic en el pequeño ícono de monitor/pantalla <strong className="text-amber-400 print:text-black">"Instalar"</strong>.
                    </p>
                  </div>
                </div>

                {/* PASO 2 EN MENÚ CHROME / EDGE */}
                <div className="bg-slate-900 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-xl p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <h3 className="text-xs font-bold text-white print:text-black">
                      Si no ves el ícono (Desde el Menú ⠇)
                    </h3>
                  </div>

                  <div className="bg-slate-950 print:bg-white border border-slate-800 print:border-gray-300 p-3 rounded-lg text-xs space-y-2">
                    <ol className="list-decimal list-inside text-slate-300 print:text-gray-800 space-y-1 text-[11px]">
                      <li>Haz clic en los <strong>3 Puntos (⠇)</strong> en la esquina superior derecha del navegador.</li>
                      <li>Selecciona la opción <strong>"Guardar y compartir"</strong> o <strong>"Aplicaciones"</strong>.</li>
                      <li>Haz clic en <strong className="text-emerald-400 print:text-emerald-700">"Instalar SIFEN Elite..."</strong></li>
                    </ol>
                  </div>
                </div>

              </div>

              {/* RESULTADO FINAL */}
              <div className="bg-slate-900 print:bg-emerald-50 border border-emerald-500/30 rounded-xl p-4 flex items-center space-x-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 print:text-emerald-600 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white print:text-emerald-900">
                    ¡Resultado Inmediato en tu Windows!
                  </h4>
                  <p className="text-[11px] text-slate-300 print:text-gray-700">
                    Se creará un acceso directo con el logo de SIFEN Elite directamente en tu <strong>Escritorio de Windows</strong> y en el <strong>Menú Inicio</strong>. Al hacerle doble clic, se abrirá en su propia ventana independiente sin barras de navegador.
                  </p>
                </div>
              </div>
            </div>

            {/* SECCIÓN C: GUÍA DE COMPILACIÓN A EJECUTABLE .EXE TRADICIONAL */}
            <div className="space-y-3 pt-4 border-t border-slate-800 print:border-gray-300">
              <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-2">
                <Laptop className="w-4 h-4 text-amber-400 print:text-amber-600" />
                3. Para Desarrolladores: Crear un Instalador Tradicional (.exe) con Electron
              </h2>

              <p className="text-xs text-slate-400 print:text-gray-600 leading-relaxed">
                Si en el futuro deseas crear un archivo ejecutable tipo <code className="font-mono text-amber-300 print:text-black">SIFEN-Setup.exe</code> para instalar mediante un paquete offline, el proyecto ya incluye los archivos requeridos (<code className="font-mono text-amber-300 print:text-black">electron-main.cjs</code> y <code className="font-mono text-amber-300 print:text-black">DESKTOP_GUIA.md</code>). Solo requieres ejecutar los comandos:
              </p>

              <div className="bg-slate-950 print:bg-gray-100 p-3 rounded-xl border border-slate-800 print:border-gray-300 font-mono text-[11px] text-amber-300 print:text-black space-y-1">
                <p># 1. Instalar dependencias</p>
                <p className="text-slate-300 print:text-black">npm install</p>
                <p># 2. Compilar aplicación</p>
                <p className="text-slate-300 print:text-black">npm run build</p>
                <p># 3. Empaquetar ejecutable para Windows</p>
                <p className="text-slate-300 print:text-black">npx electron-builder --win</p>
              </div>
            </div>

            {/* Pie de Página del Documento */}
            <div className="pt-6 border-t border-slate-800 print:border-gray-300 flex justify-between items-center text-[10px] text-slate-500 print:text-gray-500">
              <span>SIFEN ELITE v14.0 — Sistema de Facturación Electrónica Paraguay (DNIT / SET)</span>
              <span>Página 1 de 1</span>
            </div>

          </div>

        </div>

        {/* Footer Actions (Hidden when printing) */}
        <div className="print:hidden px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Haz clic en <strong>Guardar como PDF</strong> para enviarle este instructivo a tus clientes.</span>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs shadow transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>IMPRIMIR / DESCARGAR MANUAL PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
