import React, { useState, useRef } from 'react';

// Simple local multi-viewport preview similar to "Am I Responsive?"
// Allows entering any relative or absolute URL (defaults to current origin) and renders in iframes with preset sizes.

const PRESETS = [
  { name: 'Mobile (375x667)', w: 375, h: 667, scale: 0.6 },
  { name: 'Tablet (768x1024)', w: 768, h: 1024, scale: 0.45 },
  { name: 'Laptop (1366x768)', w: 1366, h: 768, scale: 0.32 },
  { name: 'Desktop (1920x1080)', w: 1920, h: 1080, scale: 0.24 }
];

const clampUrl = (input: string) => {
  if (!input) return window.location.origin;
  // If it's a relative path, prepend origin
  if (/^https?:\/\//i.test(input)) return input;
  if (input.startsWith('/')) return window.location.origin + input;
  return window.location.origin + '/' + input;
};

const ResponsivePreview: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [url, setUrl] = useState(clampUrl('/'));
  const [reloadNonce, setReloadNonce] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = clampUrl(urlInput.trim());
    setUrl(finalUrl);
    setReloadNonce(n => n + 1); // Force iframes to reload
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <header className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row gap-3 sm:items-center justify-between bg-neutral-900/60 backdrop-blur">
        <h1 className="text-lg font-semibold text-amber-400">Responsive Preview</h1>
        <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
          <input
            className="flex-1 sm:w-80 px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm"
            placeholder="/inicio o https://..."
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 rounded-md bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-semibold text-sm shadow hover:opacity-90">Mostrar</button>
          <button type="button" onClick={() => { setReloadNonce(n => n + 1); }} className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-600 text-xs hover:bg-neutral-700">↻</button>
        </form>
      </header>
      <div className="p-4 flex-1 overflow-auto" ref={containerRef}>
        <div className="grid gap-8 xl:grid-cols-2 2xl:grid-cols-3">
          {PRESETS.map(preset => {
            const scaledW = Math.round(preset.w * preset.scale);
            const scaledH = Math.round(preset.h * preset.scale);
            return (
              <div key={preset.name} className="bg-neutral-900/60 rounded-lg border border-neutral-800 shadow-lg p-4 flex flex-col">
                <div className="flex items-center justify-between mb-2 text-xs text-neutral-400">
                  <span>{preset.name}</span>
                  <span>{preset.w}x{preset.h}</span>
                </div>
                <div className="relative mx-auto border border-neutral-700 rounded-md overflow-hidden bg-black" style={{ width: scaledW, height: scaledH }}>
                  <iframe
                    key={reloadNonce + preset.name}
                    src={url}
                    title={preset.name}
                    style={{ width: preset.w, height: preset.h, transform: `scale(${preset.scale})`, transformOrigin: 'top left', border: '0' }}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-neutral-500">
                  <span className="px-2 py-0.5 rounded bg-neutral-800/70">scale {preset.scale}</span>
                  <button
                    onClick={() => {
                      // center scroll to this frame
                      const el = containerRef.current?.querySelector(`iframe[title='${preset.name}']`)?.parentElement;
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    }}
                    className="px-2 py-0.5 rounded bg-neutral-800/70 hover:bg-neutral-700"
                  >Ir</button>
                  <button
                    onClick={() => window.open(url, '_blank')}
                    className="px-2 py-0.5 rounded bg-neutral-800/70 hover:bg-neutral-700"
                  >Abrir</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-10 text-center text-xs text-neutral-600">
          Vista interna local. Para capturar una imagen puedes usar la herramienta de captura de tu sistema.
        </div>
      </div>
    </div>
  );
};

export default ResponsivePreview;
