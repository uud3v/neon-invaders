import { Engine } from '../core/Engine';
import { StateMachine } from '../core/StateMachine';
import { GAME_EVENTS, globalEventBus } from '../core/EventBus';
import { InputSystem } from './systems/InputSystem';
import { RenderSystem } from './systems/RenderSystem';
import { ParticleSystem } from './systems/ParticleSystem';
import { Pool } from './utils/Pool';

import { Player } from './entities/Player';
import { Invader } from './entities/Invader';
import { Projectile } from './entities/Projectile';
import { Asteroid } from './entities/Asteroid';

import { GAME_STATES, CONFIG } from './utils/Constants';
import { MenuState } from './states/MenuState';
import { PlayState } from './states/PlayState';
import { PauseState } from './states/PauseState';
import { GameOverState } from './states/GameOverState';

export { GAME_STATES, GAME_CONFIG } from './utils/Constants';

export class Game {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.eventBus = options.eventBus || globalEventBus;
    this.legacyCallbacks = options;

    // Subsistemas
    this.inputSystem = new InputSystem();
    this.renderSystem = new RenderSystem(canvas);
    this.particleSystem = new ParticleSystem(350);

    // Pools de memoria
    this.projectilePool = new Pool(() => new Projectile(), 40);
    this.asteroidPool = new Pool(() => new Asteroid(), 20);

    // Estado del juego
    this.score = 0;
    this.level = 1;
    this.lives = CONFIG.PLAYER_LIVES;
    this.highScore = parseInt(localStorage.getItem('neon_high_score'), 10) || 0;

    // Entidades
    this.player = new Player(canvas.width, canvas.height);
    this.invaders = [];
    this.swarmDirection = 1;
    this.swarmBaseSpeed = CONFIG.INVADER_BASE_SPEED;

    // Máquina de estados
    this.stateMachine = new StateMachine(this);
    this.stateMachine.addState(GAME_STATES.MENU, new MenuState());
    this.stateMachine.addState(GAME_STATES.PLAYING, new PlayState());
    this.stateMachine.addState(GAME_STATES.PAUSED, new PauseState());
    this.stateMachine.addState(GAME_STATES.GAME_OVER, new GameOverState());

    // Motor de bucle con paso de tiempo fijo y delta-time
    this.engine = new Engine(
      (dt) => this.update(dt),
      (alpha) => this.render(alpha)
    );

    this.setupListeners();
    this.initLevel();

    // Iniciar en estado de menú
    this.stateMachine.changeState(GAME_STATES.MENU);
  }

  setupListeners() {
    this.inputDetach = this.inputSystem.onCommand((command, keyCode) => {
      this.stateMachine.handleCommand(command, keyCode);
    });

    // Soporte para bridge react si se usaron callbacks clásicos
    this.eventBus.on(GAME_EVENTS.STATE_CHANGED, (data) => {
      if (this.legacyCallbacks.onStateChange) {
        this.legacyCallbacks.onStateChange({
          state: data.state,
          score: this.score,
          level: this.level,
          lives: this.lives,
          highScore: this.highScore
        });
      }
    });
  }

  initLevel() {
    this.invaders = [];

    const invaderWidth = 32;
    const invaderHeight = 24;
    const gapX = 18;
    const gapY = 16;
    const marginY = 55;
    const rows = 5;

    const availableWidth = this.canvas.width - 60;
    const cols = Math.min(10, Math.floor(availableWidth / (invaderWidth + gapX)));
    const gridWidth = cols * (invaderWidth + gapX) - gapX;
    const offsetX = (this.canvas.width - gridWidth) / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = offsetX + c * (invaderWidth + gapX);
        const y = marginY + r * (invaderHeight + gapY);
        const invader = new Invader(x, y, r);
        invader.active = true;
        this.invaders.push(invader);
      }
    }

    this.swarmDirection = 1;
    this.swarmBaseSpeed = CONFIG.INVADER_BASE_SPEED + (this.level - 1) * CONFIG.INVADER_SPEED_LEVEL_SCALE;
  }

  resetGame() {
    this.score = 0;
    this.level = 1;
    this.lives = CONFIG.PLAYER_LIVES;
    this.player.resetPosition();
    this.projectilePool.reset();
    this.asteroidPool.reset();
    this.particleSystem.clear();
    this.initLevel();

    this.eventBus.emit(GAME_EVENTS.SCORE_CHANGED, { score: this.score });
    this.eventBus.emit(GAME_EVENTS.LIVES_CHANGED, { lives: this.lives });
    this.eventBus.emit(GAME_EVENTS.LEVEL_CHANGED, { level: this.level });
  }

  addScore(pts) {
    this.score += pts;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.eventBus.emit(GAME_EVENTS.HIGH_SCORE_CHANGED, { highScore: this.highScore });
    }
    this.eventBus.emit(GAME_EVENTS.SCORE_CHANGED, { score: this.score, delta: pts });
  }

  saveHighScore() {
    if (this.score >= this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('neon_high_score', this.highScore.toString());
      this.eventBus.emit(GAME_EVENTS.HIGH_SCORE_CHANGED, { highScore: this.highScore });
    }
  }

  triggerGameOver() {
    this.stateMachine.changeState(GAME_STATES.GAME_OVER);
  }

  update(dt) {
    this.renderSystem.update(dt);
    this.stateMachine.update(dt);
  }

  render(alpha) {
    this.renderSystem.beginFrame();
    this.stateMachine.draw(this.ctx, alpha);
    this.renderSystem.endFrame();
  }

  drawEntities(ctx) {
    // Dibujar asteroides
    this.asteroidPool.forEachActive((a) => a.draw(ctx));

    // Dibujar invasores
    for (let i = 0; i < this.invaders.length; i++) {
      if (this.invaders[i].active) {
        this.invaders[i].draw(ctx);
      }
    }

    // Dibujar proyectiles
    this.projectilePool.forEachActive((p) => p.draw(ctx));

    // Dibujar jugador
    this.player.draw(ctx);

    // Dibujar partículas
    this.particleSystem.draw(ctx);
  }

  start() {
    this.inputSystem.attach();
    this.engine.start();
  }

  stop() {
    this.engine.stop();
    this.inputSystem.detach();
    if (this.inputDetach) this.inputDetach();
  }
}