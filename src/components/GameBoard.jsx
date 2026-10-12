import { useRef, useEffect, useState } from 'react';
import { Game } from '../game/Game';
import { GAME_STATES, COMMANDS } from '../game/utils/Constants';
import { globalEventBus, GAME_EVENTS } from '../core/EventBus';
import HUD from './ui/HUD';
import OverlayModal from './ui/OverlayModal';
import ControlsHelp from './ui/ControlsHelp';

export default function GameBoard() {
  const canvasRef = useRef(null);
  const gameInstanceRef = useRef(null);

  const [gameState, setGameState] = useState({
    state: GAME_STATES.MENU,
    score: 0,
    level: 1,
    lives: 3,
    highScore: parseInt(localStorage.getItem('neon_high_score'), 10) || 0,
    combo: 0,
    multiplier: 1
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 800;
    canvas.height = 600;

    const game = new Game(canvas, { eventBus: globalEventBus });
    gameInstanceRef.current = game;

    // Suscripción desacoplada a eventos del juego
    const unsubs = [
      globalEventBus.on(GAME_EVENTS.STATE_CHANGED, (data) => {
        setGameState((prev) => ({ ...prev, state: data.state }));
      }),
      globalEventBus.on(GAME_EVENTS.SCORE_CHANGED, (data) => {
        setGameState((prev) => ({ ...prev, score: data.score }));
      }),
      globalEventBus.on(GAME_EVENTS.LIVES_CHANGED, (data) => {
        setGameState((prev) => ({ ...prev, lives: data.lives }));
      }),
      globalEventBus.on(GAME_EVENTS.LEVEL_CHANGED, (data) => {
        setGameState((prev) => ({ ...prev, level: data.level }));
      }),
      globalEventBus.on(GAME_EVENTS.HIGH_SCORE_CHANGED, (data) => {
        setGameState((prev) => ({ ...prev, highScore: data.highScore }));
      }),
      globalEventBus.on(GAME_EVENTS.COMBO_UPDATED, (data) => {
        setGameState((prev) => ({ ...prev, combo: data.combo, multiplier: data.multiplier }));
      })
    ];

    game.start();

    return () => {
      unsubs.forEach((unsub) => unsub());
      game.stop();
    };
  }, []);

  const handleModalAction = (action) => {
    const game = gameInstanceRef.current;
    if (!game) return;

    if (action === 'START' || action === 'RESTART') {
      game.stateMachine.handleCommand(COMMANDS.START);
    } else if (action === 'RESUME') {
      game.stateMachine.handleCommand(COMMANDS.PAUSE);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* HUD del Juego */}
      <HUD
        score={gameState.score}
        highScore={gameState.highScore}
        level={gameState.level}
        lives={gameState.lives}
        combo={gameState.combo}
        multiplier={gameState.multiplier}
      />

      {/* Contenedor del Canvas y Overlays */}
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border-2 border-cyan-400/80 shadow-[0_0_25px_rgba(0,255,204,0.25)] bg-[#050508]">
        <canvas
          ref={canvasRef}
          className="w-full h-full block object-contain"
        />

        {/* Efecto sutil de líneas scanline estilo monitor arcade */}
        <div className="absolute inset-0 pointer-events-none scanlines opacity-30" />

        {/* Capa de modales superpuestos */}
        <OverlayModal
          state={gameState.state}
          score={gameState.score}
          highScore={gameState.highScore}
          onAction={handleModalAction}
        />
      </div>

      {/* Barra de ayuda con controles */}
      <ControlsHelp />
    </div>
  );
}