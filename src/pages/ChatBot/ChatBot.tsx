// Formatea Markdown para listas con viñetas correctamente
const formateaMarkdown = (texto: string) =>
  texto.replace(/\s*-\s+/g, '\n- ');

import React, { useState, useRef, useEffect } from "react";
import faqsRaw from '../../data/faqChatbot.json';
import infoCarrera from '../../data/infoCarrera.json';
import ReactMarkdown from "react-markdown";

const mensajesIniciales = [
  {
    autor: "ia",
    texto: "¡Hola! Soy el asistente de la carrera. ¿En qué puedo ayudarte?"
  }
];

const sugerencias = [
  "¿Qué hace un egresado?",
  "¿Cuánto dura la carrera?",
  "¿Dónde puedo trabajar?",
  "¿Cuáles son los requisitos de ingreso?"
];

const API_URL = (import.meta as any).env?.VITE_API_URL ? `${(import.meta as any).env.VITE_API_URL}/ask` : "http://localhost:8000/ask";

interface FAQItem { pregunta: string; respuesta: string }
const faqs: FAQItem[] = Array.isArray(faqsRaw) ? faqsRaw as FAQItem[] : [];

// Búsqueda muy simple por puntuación (conteo de palabras clave)
function buscarRespuestaLocal(pregunta: string): string | null {
  if (!faqs.length) return null;
  const q = pregunta.toLowerCase();
  let best: { score: number; ans: string } = { score: 0, ans: '' };
  for (const f of faqs) {
    const tokens = f.pregunta.toLowerCase().split(/\s+/);
    let score = 0;
    tokens.forEach(t => { if (q.includes(t)) score++; });
    if (score > best.score) best = { score, ans: f.respuesta };
  }
  if (best.score === 0) return null;
  return best.ans;
}

function construirRespuestaExtendida(base: string | null, pregunta: string): string {
  if (base) return base;
  // Intentar enriquecer con infoCarrera
  const partes: string[] = [];
  if (pregunta.toLowerCase().includes('linea') || pregunta.toLowerCase().includes('formación') || pregunta.toLowerCase().includes('formacion')) {
    if ((infoCarrera as any).lineas_formacion) partes.push('Líneas de formación: ' + (infoCarrera as any).lineas_formacion.join('; '));
  }
  if (pregunta.toLowerCase().includes('trabaj') || pregunta.toLowerCase().includes('salida')) {
    if ((infoCarrera as any).salidas_profesionales) partes.push('Salidas profesionales: ' + (infoCarrera as any).salidas_profesionales.join('; '));
  }
  if (!partes.length) return 'No tengo información suficiente en este modo offline. Reformula tu pregunta o consulta a un representante.';
  return partes.join('\n');
}

const ChatBot = () => {
  const [mensajes, setMensajes] = useState(mensajesIniciales);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const [primeraConsulta, setPrimeraConsulta] = useState(false);
  const [modoOffline, setModoOffline] = useState(false);
  const [mostrarCortina, setMostrarCortina] = useState(true); // Cortina de notificación inicial
  const [diagnostico, setDiagnostico] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes]);

  // Intento de ping inicial (health o detectar backend) para decidir cortina
  useEffect(() => {
    let cancelado = false;
    const base = API_URL.replace(/\/ask$/, "");
    (async () => {
      try {
        const r = await fetch(`${base}/health`, { method: 'GET' });
        if (!r.ok) throw new Error('estado no ok');
  await r.json();
  // Si health responde, asumimos backend vivo. Ocultamos cortina.
        if (!cancelado) {
          setMostrarCortina(false);
          setDiagnostico(null);
        }
      } catch (e:any) {
        if (!cancelado) {
          setDiagnostico('No se pudo conectar con el servicio de IA. Se usará modo offline (FAQs locales).');
          setModoOffline(true);
          // Cortina permanece hasta que usuario decida continuar
        }
      }
    })();
    return () => { cancelado = true; };
  }, []);

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || cargando) return;
    
    // Marcar que se hizo la primera consulta
    setPrimeraConsulta(true);
    
    setMensajes(prev => [...prev, { autor: "user", texto: input }]);
    setCargando(true);
    const pregunta = input;
    setInput("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: pregunta })
      });
      if (res.ok) {
        const data = await res.json();
        // Lista local de placeholders por si el backend no ha sido actualizado
        const localPlaceholders = [
          "No tengo acceso a los datos ahora mismo, se están acomodando… ⛏️",
          "Los datos están en huelga técnica. Intentemos luego. ✊",
          "Archivo vacío por mantenimiento. 📂",
          "Soy solo la carcasa, los datos aún no llegan. 📦",
          "Me escondieron la base de datos. Envíen rescate. 🚁",
          "Reindexando el vacío… 0% completado. 🔄",
          "Los bits fueron a marchar, sigo solo aquí. 🚶",
          "Sin acceso: puerta cerrada con doble candado. 🔐",
          "Modo mantenimiento: sin tablas disponibles. 🧱",
          "Cache frío, sin ingredientes. 🍽️"
        ];
        let textoRespuesta = data.respuesta;
        if (data.reason === 'missing_api_key' && !data.maintenance) {
          // Reemplazamos mensaje plano por uno aleatorio
            textoRespuesta = localPlaceholders[Math.floor(Math.random() * localPlaceholders.length)];
        }
        setMensajes(prev => [...prev, { autor: "ia", texto: textoRespuesta }]);
        if (data.online === false) {
          setModoOffline(true);
          if (data.reason === 'placeholder_mode') {
            // Modo mantenimiento: no forzar cortina cada vez
            if (!diagnostico) setDiagnostico('Modo mantenimiento activo (respuestas temporales).');
            // No reabrir cortina si el usuario ya la cerró
          } else {
            setDiagnostico('El servicio de IA remoto no está configurado (falta API Key). Operando en modo offline.');
            setMostrarCortina(true);
          }
        } else {
          setModoOffline(false);
      setMostrarCortina(false);
      setDiagnostico(null);
        }
      } else {
        throw new Error('bad status');
      }
    } catch (err) {
      // Fallback local
  const base = buscarRespuestaLocal(pregunta);
      const respuesta = construirRespuestaExtendida(base, pregunta);
      setMensajes(prev => [...prev, { autor: "ia", texto: respuesta }]);
      setModoOffline(true);
    if (!diagnostico) setDiagnostico('Conectividad con IA fallida. Estás en modo offline.');
    setMostrarCortina(true);
    }
    setCargando(false);
  };

  const handleSugerencia = (texto: string) => {
    setPrimeraConsulta(true);
    setInput(texto);
  };

  return (
    <div className="h-screen text-white overflow-hidden flex flex-col" style={{ background: 'radial-gradient(ellipse at top, #1a1a1a 0%, #2a2a2a 30%, #0f0f0f 60%, #000000 100%)' }}>

      {mostrarCortina && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="relative max-w-xl w-full bg-[#1a1a1a]/70 border border-[#FFD700]/30 rounded-3xl p-8 shadow-2xl">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#FFD700]/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#C9B037]/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#C9B037] flex items-center justify-center text-2xl shadow-lg">🤖</div>
                <h2 className="text-2xl font-bold text-[#FFD700] tracking-wide">Asistente en Modo Limitado</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4 text-sm">
                {diagnostico || 'El servicio de IA remoto aún no responde. Puedes seguir usando respuestas basadas en FAQs e información local mientras se habilita la integración.'}
              </p>
              <ul className="text-gray-300 text-sm space-y-2 mb-6 list-disc pl-5">
                <li>Sin conexión a modelo Groq (API Key faltante o backend caído).</li>
                <li>Disponible: búsquedas simples en FAQs y datos locales de la carrera.</li>
                <li>Cuando se configure la clave, las respuestas serán más completas.</li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setMostrarCortina(false)} className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#FFF8DC] to-[#C9B037] text-black font-semibold shadow-lg hover:opacity-90 transition">Usar modo offline</button>
                <button onClick={() => { window.location.reload(); }} className="px-5 py-3 rounded-xl bg-[#242424] border border-[#FFD700]/30 text-[#FFD700] font-medium hover:bg-[#2f2f2f] transition">Reintentar conexión</button>
              </div>
              {modoOffline && (
                <div className="mt-4 text-xs text-gray-400 text-center">Operando sin motor IA remoto</div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Efectos de fondo avanzados */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#C9B037]/3"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#C9B037]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B8860B]/6 rounded-full blur-3xl"></div>
        
        {/* Partículas flotantes */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-[#FFD700]/60 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-[#C9B037]/70 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-32 left-20 w-4 h-4 bg-[#FFD700]/50 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-[#B8860B]/80 rounded-full animate-pulse delay-500"></div>
      </div>
      
      {/* Header Compacto */}
  <div className="relative py-4 px-4 flex-shrink-0">
        <div className="relative max-w-4xl mx-auto">
          
          {/* Badge Minimalista */}
          <div className="text-center">
            <div className="inline-flex items-center gap-4 px-6 py-4 bg-[#1a1a1a]/40 backdrop-blur-sm rounded-2xl border border-[#FFD700]/20 shadow-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#C9B037] rounded-full flex items-center justify-center text-lg">
                🤖
              </div>
              <div className="text-left">
                <h3 className="text-[#FFD700] font-semibold text-base">
                  Asistente CFIM
                </h3>
                <p className="text-gray-400 text-sm">
                  Centro Federado de Ing. Metalúrgica
                </p>
              </div>
              <div className={`w-2 h-2 rounded-full animate-pulse ${modoOffline ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
            </div>
          </div>
          {modoOffline && (
            <div className="mt-3 flex justify-center">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40 backdrop-blur-sm">Modo offline (FAQ + info local)</span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Container Estilo ChatGPT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Messages Area */}
        <div 
          ref={chatRef} 
          className="flex-1 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-[#FFD700]/50 scrollbar-track-transparent"
          style={{scrollbarWidth: 'thin'}}
        >
          <div className="max-w-4xl mx-auto py-4 space-y-6">
            {mensajes.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.autor === "user" ? "justify-end" : "justify-start"} group`}
              >
                <div className={`max-w-[75%] relative ${
                  msg.autor === "user"
                    ? "bg-gradient-to-br from-[#FFD700]/90 via-[#FFF8DC]/90 to-[#C9B037]/90 backdrop-blur-sm text-black rounded-3xl rounded-br-lg shadow-xl border border-[#FFD700]/30"
                    : "bg-[#1a1a1a]/60 backdrop-blur-md text-white border border-[#FFD700]/20 rounded-3xl rounded-bl-lg shadow-xl"
                } px-6 py-4 transform transition-all duration-300 group-hover:scale-[1.02]`}>
                  
                  {/* Message Glow */}
                  {msg.autor === "user" && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700]/30 to-[#C9B037]/30 rounded-3xl blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  
                  <div className={`flex items-start ${msg.autor === "user" ? "justify-end" : "gap-3"}`}>
                      {msg.autor !== "user" && (
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 shadow-lg bg-gradient-to-br from-[#FFD700] to-[#C9B037] text-black">
                          🤖
                        </div>
                      )}
                    <div className={msg.autor === "user" ? "w-full" : "flex-1"}>
                      {msg.autor === "ia" ? (
                        <div className="prose prose-lg prose-invert max-w-none">
                          <ReactMarkdown 
                            components={{
                              p: ({children}) => <p className="text-gray-200 leading-relaxed mb-3 last:mb-0">{children}</p>,
                              ul: ({children}) => <ul className="text-gray-200 space-y-2 ml-4">{children}</ul>,
                              li: ({children}) => <li className="text-gray-200 flex items-start"><span className="text-[#FFD700] mr-2 text-lg">▸</span><span className="pt-1">{children}</span></li>,
                              strong: ({children}) => <strong className="text-[#FFD700] font-bold">{children}</strong>
                            }}
                          >
                            {formateaMarkdown(msg.texto)}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-black leading-relaxed font-medium w-full">
                          {msg.texto}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {cargando && (
              <div className="flex justify-start">
                <div className="bg-[#1a1a1a]/60 backdrop-blur-md border border-[#FFD700]/20 rounded-3xl rounded-bl-lg px-6 py-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#C9B037] rounded-2xl flex items-center justify-center text-lg">
                      🤖
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-[#FFD700] rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-[#C9B037] rounded-full animate-pulse delay-150"></div>
                        <div className="w-3 h-3 bg-[#B8860B] rounded-full animate-pulse delay-300"></div>
                      </div>
                      <span className="text-gray-400 ml-3 font-medium">Analizando consulta...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Input Area Fixed Bottom */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-[#FFD700]/10">
          <div className="max-w-4xl mx-auto">
            {/* Quick Actions Horizontal - Solo mostrar si no se ha hecho consulta */}
            {!primeraConsulta && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {sugerencias.map((s, i) => (
                  <button
                    key={i}
                    className="relative group p-3 bg-[#1a1a1a]/40 backdrop-blur-md rounded-xl border border-[#FFD700]/20 hover:border-[#FFD700]/50 transition-all duration-300 transform hover:scale-105 text-left disabled:opacity-50 shadow-xl overflow-hidden"
                    onClick={() => handleSugerencia(s)}
                    disabled={cargando}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-[#C9B037]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center">
                      <span className="text-gray-300 group-hover:text-[#FFD700] transition-colors duration-300 font-medium text-sm flex-1 truncate">
                        {s}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Input Form */}
            <form className="flex gap-3" onSubmit={handleEnviar}>
              <div className="flex-1 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700]/20 to-[#C9B037]/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
                <input
                  type="text"
                  className="relative w-full rounded-2xl px-6 py-4 bg-[#1a1a1a]/60 backdrop-blur-md text-white border border-[#FFD700]/30 focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all duration-300 pr-14 placeholder-gray-400 font-medium shadow-xl"
                  placeholder="Pregúntame sobre la carrera de Metalurgia..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={cargando}
                />
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[#FFD700] text-lg">
                  
                </div>
              </div>
              <button
                type="submit"
                className="relative px-6 py-4 bg-gradient-to-r from-[#FFD700]/90 via-[#FFF8DC]/90 to-[#C9B037]/90 backdrop-blur-sm text-black font-bold rounded-2xl hover:from-[#C9B037] hover:to-[#B8860B] transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 overflow-hidden group border border-[#FFD700]/30"
                disabled={cargando || !input.trim()}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative z-10">Enviar</span>
              </button>
            </form>
            
            {/* Disclaimer */}
            <div className="mt-3 text-center">
              <p className="text-gray-400 text-sm">
                Las respuestas pueden ser imprecisas. Consulte a un miembro del Centro Federado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
