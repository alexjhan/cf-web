import { useEffect, useState } from "react";
// @ts-ignore
import noticiasData from "../../data/noticias.json";


const Noticias = () => {
  const adaptCategoria = (arr: any[]) =>
    arr.map((n: any) => ({
      ...n,
      categoria: Array.isArray(n.categoria) ? n.categoria : [n.categoria],
    }));

  // Cargar desde localStorage si existe; fallback a JSON por defecto
  const [noticias, setNoticias] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("noticias");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setNoticias(adaptCategoria(parsed));
          return;
        }
      }
    } catch {}
    // Fallback
    setNoticias(adaptCategoria(noticiasData as any[]));
  }, []);

  // Sin selector de orden, solo ordenar por fecha descendente
  const [selectedIdx, setSelectedIdx] = useState(0);
  // Ordenar y filtrar según selección
  let noticiasOrdenadas = [...noticias];
  noticiasOrdenadas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  const principal = noticiasOrdenadas[selectedIdx] || noticiasOrdenadas[0];
  const secundarias = noticiasOrdenadas.filter((_, idx) => idx !== selectedIdx);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3a3a4a] to-[#18181b] pt-6 md:pt-8 pb-16 flex flex-col items-center">
      {/* Encabezado transparente, solo título y volver */}
      <div className="w-full max-w-5xl mb-4 relative px-8 md:px-16 xl:px-32">
        <div className="flex flex-row items-center justify-center px-0 py-0 bg-transparent gap-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFD700] drop-shadow-lg tracking-tight text-center" style={{letterSpacing: '-0.03em', textShadow: '0 2px 12px #18181b'}}>Noticias</h1>
          <a href="/" className="ml-8 px-4 py-2 rounded bg-white/10 text-[#FFD700] font-semibold shadow-none hover:bg-white/20 transition text-xs text-center" style={{border: 'none'}}>Volver a inicio</a>
        </div>
      </div>
      <div className="w-full max-w-5xl px-4 md:px-16 xl:px-32 flex flex-col md:flex-row gap-8 md:gap-6">
        {/* Noticia principal */}
        <div className="w-full md:w-2/3 bg-transparent rounded-2xl p-4 md:p-20 xl:p-32 flex flex-col min-h-[360px] md:min-h-[640px] xl:min-h-[800px] border-b-2 md:border-b-0 md:border-r-2 border-[#FFD700] max-w-full mx-auto">
          {principal ? (
            <div className="flex flex-col gap-3">
              {principal.imagen && principal.imagen !== "" && (
                <img src={principal.imagen} alt="Imagen noticia" className="mb-2 max-h-56 md:max-h-72 rounded-xl object-cover mx-auto w-full" />
              )}
              <div className="flex flex-wrap gap-2 mb-1">
                {principal.categoria.map((cat: string, i: number) => (
                  <span key={i} className="bg-[#FFD700] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow">{cat}</span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-1">
                <span className="text-xs text-gray-400">{principal.fecha}</span>
                <span className="hidden sm:inline text-xs text-gray-400">|</span>
                <span className="italic text-gray-500 text-xs">{principal.autor}</span>
              </div>
              <h2 className="text-2xl md:text-3xl xl:text-4xl font-semibold text-white leading-tight" style={{textShadow: "0 2px 8px #000"}}>{principal.titulo}</h2>
              <p className="text-[#FFD700] font-semibold italic text-lg md:text-xl mb-2">{principal.descripcionCorta}</p>
              <div className="text-gray-200 text-base md:text-lg xl:text-xl" style={{whiteSpace: 'pre-line'}}>
                {principal.descripcionLarga}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 text-lg">No hay noticias disponibles.</div>
          )}
        </div>
        {/* Noticias secundarias */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 md:gap-6 bg-transparent rounded-2xl p-2 md:p-6 border-0 md:border-0">
          {secundarias.length === 0 ? (
            <div className="text-center text-gray-400 text-lg">No hay más noticias.</div>
          ) : (
            secundarias.map((noticia, idx) => (
              <button
                key={idx}
                className={`bg-transparent rounded-xl border border-gray-700 hover:border-[#FFD700] shadow-lg p-3 md:p-4 flex flex-col transition-all duration-200 text-left ${noticiasOrdenadas.indexOf(noticia) === selectedIdx ? 'border-[#FFD700] ring-2 ring-[#FFD700]' : ''}`}
                onClick={() => setSelectedIdx(noticiasOrdenadas.indexOf(noticia))}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-1">
                  <span className="text-xs text-gray-400">{noticia.fecha}</span>
                  <span className="hidden sm:inline text-xs text-gray-400">|</span>
                  <span className="italic text-gray-500 text-xs">{noticia.autor}</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-white mb-1 truncate">{noticia.titulo}</h3>
                <p className="text-[#FFD700] font-semibold italic mb-1 text-xs md:text-sm truncate">{noticia.descripcionCorta}</p>
                {noticia.imagen && noticia.imagen !== "" && (
                  <img src={noticia.imagen} alt="Imagen noticia" className="mt-2 max-h-28 md:max-h-32 rounded border border-[#FFD700] object-cover w-full" />
                )}
                <span className="text-xs text-gray-400 mt-2 block">Por <span className="italic text-gray-500">{noticia.autor}</span></span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Noticias;
