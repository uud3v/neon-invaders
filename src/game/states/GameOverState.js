import { GameState } from './GameState';
import { GAME_STATES, COMMANDS } from '../utils/Constants';
import { GAME_EVENTS } from '../../core/EventBus';
import { soundFX } from '../audio/SoundFX';

export class GameOverState extends GameState {
  enter(game) {
    soundFX.playGameOver();
    game.saveHighScore();
    game.eventBus.emit(GAME_EVENTS.STATE_CHANGED, {
      state: GAME_STATES.GAME_OVER,
      finalScore: game.score,
      highScore: game.highScore
    });
  }

  handleCommand(game, command) {
    if (command === COMMANDS.START || command === COMMANDS.RESTART) {
      game.resetGame();
      game.stateMachine.changeState(GAME_STATES.PLAYING);
      return true;
    }
    return false;
  }

  update(game, dt) {
    // Las partículas de la última explosión terminan de dispersarse
    game.particleSystem.update(dt);
  }

  draw(game, ctx) {
    // Dibujar partículas restantes
    game.particleSystem.draw(ctx);

    // Velo dramático magenta oscuro
    ctx.save();
    ctx.fillStyle = 'rgba(20, 5, 25, 0.75)';
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    ctx.restore();
  }
}

