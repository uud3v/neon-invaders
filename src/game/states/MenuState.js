import { GameState } from './GameState';
import { GAME_STATES, COMMANDS, COLORS } from '../utils/Constants';
import { GAME_EVENTS } from '../../core/EventBus';
import { soundFX } from '../audio/SoundFX';

export class MenuState extends GameState {
  constructor() {
    super();
    this.demoTime = 0;
  }

  enter(game) {
    game.eventBus.emit(GAME_EVENTS.STATE_CHANGED, { state: GAME_STATES.MENU });
  }

  handleCommand(game, command) {
    if (command === COMMANDS.START || command === COMMANDS.FIRE) {
      soundFX.init();
      game.resetGame();
      game.stateMachine.changeState(GAME_STATES.PLAYING);
      return true;
    }
    return false;
  }

  update(game, dt) {
    this.demoTime += dt;
    // Efecto sutil en estrellas o partículas decorativas
    if (Math.random() < 0.05) {
      game.particleSystem.emitSparks(
        Math.random() * game.canvas.width,
        game.canvas.height - 40,
        COLORS.PLAYER,
        2,
        40
      );
    }
  }

  draw(game, ctx) {
    // El renderizado de menú principal corre en combinación con el overlay React
    // Dibujamos un marco sutil en el canvas
    ctx.save();
    ctx.strokeStyle = '#00ffcc22';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, game.canvas.width - 40, game.canvas.height - 40);
    ctx.restore();
  }
}

