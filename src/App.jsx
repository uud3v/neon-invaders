import GameBoard from './components/GameBoard';

function App() {
  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-hidden select-none">
      {/* Resplandor ambiental de fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-fuchsia-600/10 blur-[110px] rounded-full pointer-events-none -z-10" />

      {/* Cabecera Principal */}
      <header className="mb-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-200 to-fuchsia-400 drop-shadow-[0_0_18px_rgba(0,255,204,0.6)]">
          NEON INVADERS
        </h1>
        <p className="text-xs font-mono tracking-widest text-slate-400 mt-1 uppercase">
          Retro Arcade Defense Engine • 60+ FPS
        </p>
      </header>

      {/* Tablero Principal del Juego */}
      <main className="w-full flex justify-center">
        <GameBoard />
      </main>
    </div>
  );
}

export default App;
