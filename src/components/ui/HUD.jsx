import { useState } from 'react';
import { soundFX } from '../../game/audio/SoundFX';

export default function HUD({ score, highScore, level, lives, combo, multiplier }) {
  const [isMuted, setIsMuted] = useState(soundFX.muted);

  const toggleSound = () => {
    const next = soundFX.toggleMute();
    setIsMuted(next);
  };

  const formattedScore = score.toString().padStart(6, '0');
  const formattedHighScore = highScore.toString().padStart(6, '0');

  return (
    <header className="w-full flex items-center justify-between py-3 px-4 mb-2 bg-slate-950/80 border border-cyan-500/30 rounded-lg shadow-lg backdrop-blur-md">
      {/* Marcador Principal */}
      <div className="flex flex-col">
        <span className="text-[10px] font-mono tracking-widest text-cyan-400/70 uppercase">Score</span>
        <span className="text-xl md:text-2xl font-mono font-black text-cyan-400 tracking-wider drop-shadow-[0_0_8px_rgba(0,255,204,0.6)]">
          {formattedScore}
        </span>
      </div>

      {/* High Score */}
      <div className="hidden sm:flex flex-col text-center">
        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">High Score</span>
        <span className="text-lg md:text-xl font-mono font-bold text-slate-200 tracking-wider">
          {formattedHighScore}
        </span>
      </div>

      {/* Nivel y Combo Multiplier */}
      <div className="flex items-center gap-3">
        {multiplier > 1 && (
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-fuchsia-950/90 border border-fuchsia-500 text-fuchsia-300 text-xs font-mono font-black animate-pulse shadow-[0_0_12px_rgba(255,0,255,0.5)]">
            <span>🔥 {multiplier}x</span>
            <span className="text-[9px] text-fuchsia-400/80">({combo})</span>
          </div>
        )}

        <div className="px-3 py-1 rounded bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold tracking-widest shadow-[0_0_8px_rgba(0,255,204,0.2)]">
          SECTOR {level}
        </div>
      </div>

      {/* Vidas & Botón de Audio */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5" title={`${lives} vidas restantes`}>
          <span className="text-[10px] font-mono tracking-widest text-cyan-400/70 uppercase mr-1 hidden sm:inline">HULL:</span>
          {Array.from({ length: 3 }).map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 transition-all duration-300 ${
                i < lives
                  ? 'text-cyan-400 drop-shadow-[0_0_6px_#00ffcc] scale-100 opacity-100'
                  : 'text-slate-700 scale-90 opacity-30'
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 22l10-4 10 4L12 2z" />
            </svg>
          ))}
        </div>

        <button
          onClick={toggleSound}
          type="button"
          className="p-1.5 rounded-md border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/60 transition cursor-pointer"
          title={isMuted ? 'Activar Sonido' : 'Silenciar'}
          aria-label="Toggle Audio"
        >
          {isMuted ? (
            <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

