import { GAME_STATES } from '../../game/utils/Constants';

export default function OverlayModal({ state, score, highScore, onAction }) {
  if (state === GAME_STATES.PLAYING) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="max-w-md w-full p-6 text-center rounded-xl bg-slate-950/90 border border-cyan-500/40 shadow-[0_0_30px_rgba(0,255,204,0.25)] flex flex-col items-center gap-4">
        {state === GAME_STATES.MENU && (
          <>
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-200 to-fuchsia-500 tracking-wider drop-shadow-[0_0_15px_#00ffcc]">
                NEON INVADERS
              </h2>
              <p className="text-xs font-mono tracking-widest text-cyan-400/80 uppercase">
                Arcade Defense Protocol v2.0
              </p>
            </div>

            <div className="py-2 text-sm text-slate-300 font-mono space-y-1">
              <p>Defiende el cuadrante estelar de las oleadas invasoras.</p>
              <p className="text-xs text-fuchsia-400">Encadena impactos consecutivos para activar combos de puntuación.</p>
            </div>

            <button
              onClick={() => onAction('START')}
              type="button"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-mono font-extrabold text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(0,255,204,0.5)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              Iniciar Misión [ENTER]
            </button>
          </>
        )}

        {state === GAME_STATES.PAUSED && (
          <>
            <div className="space-y-1">
              <h2 className="text-3xl font-mono font-black text-amber-400 tracking-widest drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]">
                PAUSA
              </h2>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                Sistemas en Espera
              </p>
            </div>

            <button
              onClick={() => onAction('RESUME')}
              type="button"
              className="px-6 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-extrabold text-sm tracking-widest uppercase transition shadow-[0_0_15px_rgba(251,191,36,0.4)] cursor-pointer"
            >
              Continuar [ESC]
            </button>
          </>
        )}

        {state === GAME_STATES.GAME_OVER && (
          <>
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-mono font-black text-fuchsia-500 tracking-widest drop-shadow-[0_0_15px_#ff00ff]">
                GAME OVER
              </h2>
              <p className="text-xs font-mono text-rose-400 uppercase tracking-widest">
                Defensa de Cuadrante Comprometida
              </p>
            </div>

            <div className="w-full py-3 my-1 rounded-lg bg-fuchsia-950/30 border border-fuchsia-500/30 grid grid-cols-2 gap-2 text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Score Final</span>
                <span className="text-xl font-bold text-fuchsia-300">{score}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">High Score</span>
                <span className="text-xl font-bold text-slate-100">{highScore}</span>
              </div>
            </div>

            <button
              onClick={() => onAction('RESTART')}
              type="button"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-500 hover:to-pink-400 text-white font-mono font-extrabold text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,0,255,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              Reintentar [ENTER]
            </button>
          </>
        )}
      </div>
    </div>
  );
}

