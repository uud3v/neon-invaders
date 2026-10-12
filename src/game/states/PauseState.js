import { GameState } from './GameState';
import { GAME_STATES, COMMANDS } from '../utils/Constants';
import { GAME_EVENTS } from '../../core/EventBus';

export class PauseState extends GameState {
  enter(game) {
    game.eventBus.emit(GAME_EVENTS.STATE_CHANGED, { state: GAME_STATES.PAUSED });
  }

  handleCommand(game, command) {
    if (command === COMMANDS.PAUSE || command === COMMANDS.START) {
      game.stateMachine.changeState(GAME_STATES.PLAYING);
      return true;
    }
    return false;
  }

  update() {
    // El juego está en pausa: no avanza la física del mundo
  }

  draw(game, ctx) {
    // Dibujamos el último frame de las entidades
    game.drawEntities(ctx);

    // Velo translúcido oscuro
    ctx.save();
    ctx.fillStyle = 'rgba(5, 5, 8, 0.7)';
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    ctx.restore();
  }
}

