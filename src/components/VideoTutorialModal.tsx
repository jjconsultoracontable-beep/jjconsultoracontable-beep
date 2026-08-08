import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Monitor, Terminal, CheckCircle2, Copy, Check, Download, Sparkles, X, ChevronRight, Layers, FileCode } from 'lucide-react';

interface VideoTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoTutorialModal: React.FC<VideoTutorialModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const steps = [
    {
      id: 0,
      title: '1. Método Ultra-Rápido: Instalar como PWA desde Chrome / Edge',
      duration: '0:45 min',
      description: 'Convierte esta aplicación web en un ejecutable de escritorio independiente en tu barra de tareas en 10 segundos.',
      commands: [],
      visualType: 'browser_demo',
      notes: [
        'Abre la aplicación en Google Chrome o Microsoft Edge.',
        'En la esquina superior derecha del navegador, haz clic en el ícono "Instalar SIFEN Elite" o en el menú ⠇ -> "Guardar y compartir" -> "Instalar aplicación".',
        'Se creará automáticamente un acceso directo en tu Escritorio de Windows y en el Menú Inicio.'
      ]
    },
    {
      id: 1,
      title: '2. Requisitos Previos para Compilar el Executable (.exe)',
      duration: '1:00 min',
      description: 'Asegúrate de tener Node.js instalado en tu computadora Windows.',
      commands: [
        '# Verificar si tienes instalado Node.js\nnode -v\nnpm -v'
      ],
      visualType: 'terminal_demo',
      notes: [
        'Descarga Node.js LTS desde https://nodejs.org si aún no lo tienes.',
        'Abre tu consola de comandos de Windows (CMD o PowerShell) o la consola de VS Code.'
      ]
    },
    {
      id: 2,
      title: '3. Probar la Aplicación en Ventana de Escritorio Electron',
      duration: '1:15 min',
      description: 'Crea el paquete ejecutable usando el archivo electron-main.cjs ya configurado en la raíz.',
      commands: [
        '# 1. Instalar dependencias del proyecto\nnpm install\n\n# 2. Compilar la aplicación React para produccion\nnpm run build\n\n# 3. Instalar Electron en tu proyecto\nnpm install --save-dev electron electron-builder\n\n# 4. Probar en ventana de escritorio local\nnpx electron electron-main.cjs'
      ],
      visualType: 'electron_preview',
      notes: [
        'La aplicación se abrirá instantáneamente en una ventana nativa de Windows con todas las funciones de SIFEN v14.0.'
      ]
    },
    {
      id: 3,
      title: '4. Generar el Instalador Executable (.exe) para Clientes',
      duration: '0:50 min',
      description: 'Compila el instalador ejecutable final para distribuirlo e instalarlo en cualquier PC con Windows.',
      commands: [
        '# Generar el instalador .exe de Windows\nnpx electron-builder --win'
      ],
      visualType: 'exe_build',
      notes: [
        'Encontrarás el instalador listo en la carpeta `dist/` llamado `SIFEN-ELITE-Setup-14.0.0.exe`.',
        'Al hacer doble clic en el instalador, la app se instalará en Windows con su acceso directo en el Escritorio.'
      ]
    }
  ];

  // Auto-advance step timer when playing
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return 0;
        });
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const activeStepObj = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500/20 text-amber-400 p-2 rounded-xl border border-amber-500/30">
              <Play className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Video Tutorial Paso a Paso: Instalador de Escritorio (.exe)
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  GUÍA INTERACTIVA
                </span>
              </h3>
              <p className="text-xs text-slate-400">Cómo convertir esta app en un programa .exe o PWA para Windows</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Screen Simulation */}
        <div className="p-6 bg-slate-950/50 flex-1 overflow-y-auto space-y-6">
          
          {/* Virtual Video Canvas */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner aspect-video flex flex-col justify-between p-4 group">
            
            {/* Top Video HUD */}
            <div className="flex items-center justify-between text-xs text-slate-400 z-10 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="font-mono text-amber-400 font-bold">REPRODUCIENDO TUTORIAL</span>
              </div>
              <span className="font-mono text-slate-300">Paso {currentStep + 1} de {steps.length} • {activeStepObj.duration}</span>
            </div>

            {/* Simulated Visual Content inside Video */}
            <div className="my-auto flex flex-col items-center justify-center text-center p-4">
              {activeStepObj.visualType === 'browser_demo' && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full text-left space-y-3 shadow-2xl animate-fade-in">
                  <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <div className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded flex-1 text-center font-mono">
                      https://ais-dev-purhjopggl6zjqgofrb4nj...
                    </div>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs flex items-center justify-between">
                    <span className="font-medium">¿Deseas instalar SIFEN Elite en tu Escritorio?</span>
                    <button className="bg-amber-500 text-slate-950 text-xs px-3 py-1 rounded font-bold shadow hover:bg-amber-400">
                      Instalar
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 text-center pt-1">
                    💡 ¡Haz clic en Instalar en tu navegador para abrirlo sin barras de URL!
                  </p>
                </div>
              )}

              {activeStepObj.visualType === 'terminal_demo' && (
                <div className="bg-slate-950 border border-slate-800 font-mono text-xs rounded-xl p-4 max-w-lg w-full text-left shadow-2xl space-y-2">
                  <div className="text-slate-500 flex justify-between border-b border-slate-800/80 pb-1">
                    <span>Windows PowerShell - C:\Proyectos\sifen-elite</span>
                    <span>v14.0 SET</span>
                  </div>
                  <p className="text-emerald-400">PS C:\Proyectos\sifen-elite&gt; node -v</p>
                  <p className="text-slate-300">v20.11.0</p>
                  <p className="text-emerald-400">PS C:\Proyectos\sifen-elite&gt; npm -v</p>
                  <p className="text-slate-300">10.2.4</p>
                  <p className="text-amber-400 animate-pulse">PS C:\Proyectos\sifen-elite&gt; _</p>
                </div>
              )}

              {activeStepObj.visualType === 'electron_preview' && (
                <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-4 max-w-lg w-full text-left shadow-2xl space-y-3">
                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-xs font-bold text-slate-200">SIFEN ELITE v14.0 - Ventana de Escritorio</span>
                    <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    </div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded text-center border border-slate-800">
                    <p className="text-emerald-400 text-xs font-mono font-semibold">✓ Ejecutando nativamente en Windows vía Electron</p>
                    <p className="text-slate-400 text-[11px] mt-1">Conecta impresoras de tickets USB, lector de código de barras e imite facturas SET.</p>
                  </div>
                </div>
              )}

              {activeStepObj.visualType === 'exe_build' && (
                <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-5 max-w-lg w-full text-center shadow-2xl space-y-3">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <Download className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">¡Instalador Executable Creado!</h4>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-xs text-amber-300">
                    dist/SIFEN-ELITE-Setup-14.0.0.exe
                  </div>
                  <p className="text-xs text-slate-400">
                    Copiar este archivo .exe e instalarlo en cualquier computadora sin conexión adicional.
                  </p>
                </div>
              )}

              <p className="text-sm font-bold text-slate-200 mt-4 max-w-md">
                {activeStepObj.title}
              </p>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                {activeStepObj.description}
              </p>
            </div>

            {/* Video Controls Bar */}
            <div className="z-10 bg-slate-900/90 backdrop-blur p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-1.5 rounded-lg font-bold text-xs transition-all shadow"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-slate-950" />
                    <span>Pausar Tutorial</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Reproducción Automática</span>
                  </>
                )}
              </button>

              {/* Steps Progress Track */}
              <div className="flex-1 flex items-center space-x-1.5">
                {steps.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentStep(idx);
                      setIsPlaying(false);
                    }}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      idx === currentStep
                        ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                        : idx < currentStep
                        ? 'bg-emerald-500'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                    title={s.title}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  setCurrentStep(0);
                  setIsPlaying(true);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="Reiniciar desde el inicio"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Detailed Code / Step Instructions Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              Comandos de la Lección Actual:
            </h4>

            {activeStepObj.commands.length > 0 ? (
              activeStepObj.commands.map((cmd, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-slate-900 px-4 py-2 flex justify-between items-center border-b border-slate-800 text-xs">
                    <span className="font-mono text-slate-400">Terminal (PowerShell / CMD)</span>
                    <button
                      onClick={() => handleCopy(cmd, idx)}
                      className="flex items-center space-x-1 text-slate-400 hover:text-amber-400 text-[11px] font-medium"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Comandos</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-amber-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {cmd}
                  </pre>
                </div>
              ))
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                <span>
                  Este paso no requiere usar la consola de comandos. Se realiza directamente en tu navegador web.
                </span>
              </div>
            )}

            {/* Step Notes Checklist */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">Instrucciones Clave:</span>
              <ul className="space-y-2 text-xs text-slate-400">
                {activeStepObj.notes.map((note, nIdx) => (
                  <li key={nIdx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 hidden sm:block">
            Archivos auxiliares pre-creados en el proyecto: <span className="font-mono text-amber-400">DESKTOP_GUIA.md</span> y <span className="font-mono text-amber-400">electron-main.cjs</span>
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Anterior
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2 rounded-xl font-bold text-xs transition-all shadow"
              >
                <span>Siguiente Paso</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2 rounded-xl font-bold text-xs transition-all shadow"
              >
                ¡Entendido, Entendido!
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
