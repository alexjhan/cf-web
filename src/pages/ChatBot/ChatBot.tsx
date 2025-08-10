// Formatea Markdown para listas con viñetas correctamente
const formateaMarkdown = (texto: string) =>
  texto.replace(/\s*-\s+/g, '\n- ');

import React, { useState, useRef, useEffect } from "react";
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

const API_URL = "https://xdtmvxsb-8000.brs.devtunnels.ms/ask";

const ChatBot = () => {
  const [mensajes, setMensajes] = useState(mensajesIniciales);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes]);

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || cargando) return;
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
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      const data = await res.json();
      setMensajes(prev => [...prev, { autor: "ia", texto: data.respuesta }]);
    } catch (err) {
      setMensajes(prev => [...prev, { autor: "ia", texto: "Ocurrió un error al consultar la IA." }]);
    }
    setCargando(false);
  };

  const handleSugerencia = (texto: string) => {
    setInput(texto);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-2" style={{ background: 'linear-gradient(to bottom, #3a3a4a 0%, #18181b 100%)' }}>
      <div className="w-full max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFD700] drop-shadow mb-2">Asistente de la Carrera</h1>
        <p className="text-gray-200 mb-4">Haz tus preguntas sobre la carrera, requisitos, perfil, empleabilidad y más.</p>
      </div>
      <div className="w-full max-w-2xl flex-1 flex flex-col bg-black/40 rounded-2xl shadow-lg border border-[#FFD700]/20 p-4 md:p-8 mb-6 min-h-[400px] max-h-[70vh]">
        <div ref={chatRef} className="flex flex-col gap-4 overflow-y-auto flex-1 mb-4 pr-1" style={{scrollbarWidth: 'thin'}}>
          {mensajes.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.autor === "user"
                  ? "self-end bg-[#FFD700] text-black rounded-xl px-4 py-2 max-w-[80%] shadow"
                  : "self-start bg-[#FFD700]/10 text-[#FFD700] rounded-xl px-4 py-2 max-w-[80%] shadow"
              }
            >
              {msg.autor === "ia" ? (
                <ReactMarkdown>{formateaMarkdown(msg.texto)}</ReactMarkdown>
              ) : (
                msg.texto
              )}
            </div>
          ))}
          {cargando && (
            <div className="self-start bg-[#FFD700]/10 text-[#FFD700] rounded-xl px-4 py-2 max-w-[80%] shadow animate-pulse">
              Pensando respuesta...
            </div>
          )}
        </div>
        <form className="flex gap-2 mt-auto" onSubmit={handleEnviar}>
          <input
            type="text"
            className="flex-1 rounded-lg px-4 py-2 bg-black/60 text-gray-100 border border-[#FFD700]/30 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            placeholder="Escribe tu pregunta..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={cargando}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-[#FFD700] text-black font-bold shadow hover:bg-[#e6c200] transition"
            disabled={cargando}
          >
            Enviar
          </button>
        </form>
      </div>
      <div className="w-full max-w-2xl flex flex-wrap gap-2 justify-center">
        {sugerencias.map((s, i) => (
          <button
            key={i}
            className="px-3 py-1 rounded bg-[#FFD700]/20 text-[#FFD700] text-sm hover:bg-[#FFD700]/40 transition"
            onClick={() => handleSugerencia(s)}
            disabled={cargando}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatBot;
