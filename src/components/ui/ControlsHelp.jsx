export default function ControlsHelp() {
  return (
    <footer className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
      <div className="flex items-center gap-1.5">
        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-bold">←</span>
        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-bold">→</span>
        <span>o</span>
        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-bold">A</span>
        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-bold">D</span>
        <span className="text-cyan-400 font-medium ml-1">Moverse</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="px-3 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-bold">ESPACIO</span>
        <span>o</span>
        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-bold">W</span>
        <span className="text-cyan-400 font-medium ml-1">Disparar</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-bold">ESC</span>
        <span className="text-amber-400 font-medium ml-1">Pausa</span>
      </div>
    </footer>
  );
}

