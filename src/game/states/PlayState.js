import { GameState } from './GameState';
import { GAME_STATES, COMMANDS, COLORS, CONFIG } from '../utils/Constants';
import { GAME_EVENTS } from '../../core/EventBus';
import { CollisionSystem } from '../systems/CollisionSystem';
import { soundFX } from '../audio/SoundFX';

export class PlayState extends GameState {
  constructor() {
    super();
    this.comboCount = 0;
    this.comboMultiplier = 1;
    this.comboTimer = 0;
    this.animStepTimer = 0;
    this.asteroidTimer = 0;
  }

  enter(game) {
    game.eventBus.emit(GAME_EVENTS.STATE_CHANGED, { state: GAME_STATES.PLAYING });
    this.resetCombo(game);
  }

  handleCommand(game, command) {
    if (command === COMMANDS.PAUSE) {
      game.stateMachine.changeState(GAME_STATES.PAUSED);
      return true;
    }
    return false;
  }

  update(game, dt) {
    // 1. Manejo del temporizador de combos
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.resetCombo(game);
      }
    }

    // 2. Disparo del jugador
    if (game.inputSystem.isCommandActive('FIRE') && game.player.canFire()) {
      const laser = game.projectilePool.get();
      if (laser) {
        laser.spawn(
          game.player.x + game.player.width / 2,
          game.player.y - 4,
          -600,
          COLORS.PLAYER_LASER,
          false
        );
        game.player.recordShot();
        soundFX.playLaser();
      }
    }

    // 3. Actualizar al jugador
    game.player.update(dt, game.inputSystem, game.particleSystem);

    // 4. Actualizar enjambre de invasores
    this.updateSwarm(game, dt);

    // 5. Spawneo y actualización de asteroides
    this.asteroidTimer += dt;
    const asteroidInterval = Math.max(1.2, 3.5 - game.level * 0.35);
    if (this.asteroidTimer >= asteroidInterval) {
      this.asteroidTimer = 0;
      const ast = game.asteroidPool.get();
      if (ast) ast.spawn(game.canvas.width);
    }

    game.asteroidPool.forEachActive((ast) => {
      ast.update(dt, game.canvas.height);
    });

    // 6. Actualizar proyectiles (jugador y enemigos)
    game.projectilePool.forEachActive((proj) => {
      proj.update(dt, game.canvas.height);
    });

    // 7. Actualizar partículas
    game.particleSystem.update(dt);

    // 8. Detección y resolución de colisiones
    this.handleCollisions(game);

    // 9. Verificar condición de victoria / siguiente nivel
    if (game.invaders.length === 0) {
      this.advanceLevel(game);
    }
  }

  updateSwarm(game, dt) {
    if (game.invaders.length === 0) return;

    // Aceleración dinámica: a menos invasores, mayor velocidad
    const totalInitial = 5 * 10;
    const ratioRemaining = Math.max(0.15, game.invaders.length / totalInitial);
    const speedBoost = (1 - ratioRemaining) * 85;
    const currentSpeed = (game.swarmBaseSpeed + speedBoost) * game.swarmDirection;

    // Animación de los invasores según el paso
    this.animStepTimer += dt;
    const stepDuration = Math.max(0.12, 0.6 * ratioRemaining);
    if (this.animStepTimer >= stepDuration) {
      this.animStepTimer = 0;
      for (let i = 0; i < game.invaders.length; i++) {
        game.invaders[i].toggleAnim();
      }
    }

    // Verificar si tocan bordes
    let hitEdge = false;
    for (let i = 0; i < game.invaders.length; i++) {
      const inv = game.invaders[i];
      if (!inv.active) continue;

      const nextX = inv.x + currentSpeed * dt;
      if (nextX <= 14 || nextX + inv.width >= game.canvas.width - 14) {
        hitEdge = true;
        break;
      }
    }

    if (hitEdge) {
      game.swarmDirection *= -1;
      for (let i = 0; i < game.invaders.length; i++) {
        const inv = game.invaders[i];
        inv.y += CONFIG.INVADER_DROP_AMOUNT;

        // Condición de derrota si tocan la altura del jugador
        if (inv.y + inv.height >= game.player.y) {
          game.triggerGameOver();
          return;
        }
      }
    } else {
      for (let i = 0; i < game.invaders.length; i++) {
        game.invaders[i].x += currentSpeed * dt;
      }
    }

    // Disparos defensivos del enjambre
    const fireChance = CONFIG.INVADER_FIRE_RATE * (1 + game.level * 0.15) * dt * 60;
    if (Math.random() < fireChance) {
      this.triggerEnemyFire(game);
    }
  }

  triggerEnemyFire(game) {
    if (game.invaders.length === 0) return;

    // Agrupar invasores por columna para que solo disparen los frontales
    const bottomInvaders = [];
    const columnMap = new Map();

    for (const inv of game.invaders) {
      if (!inv.active) continue;
      const colKey = Math.round(inv.x / 40);
      const existing = columnMap.get(colKey);
      if (!existing || inv.y > existing.y) {
        columnMap.set(colKey, inv);
      }
    }

    columnMap.forEach((inv) => bottomInvaders.push(inv));

    if (bottomInvaders.length > 0) {
      const shooter = bottomInvaders[Math.floor(Math.random() * bottomInvaders.length)];
      const proj = game.projectilePool.get();
      if (proj) {
        proj.spawn(
          shooter.x + shooter.width / 2,
          shooter.y + shooter.height + 2,
          260 + game.level * 15,
          COLORS.ENEMY_LASER,
          true
        );
        soundFX.playEnemyLaser();
      }
    }
  }

  handleCollisions(game) {
    // 1. Proyectiles del jugador vs Invasores y Asteroides
    game.projectilePool.forEachActive((proj) => {
      if (!proj.active) return;

      if (!proj.isEnemy) {
        // Láser vs Invasores
        for (let i = 0; i < game.invaders.length; i++) {
          const inv = game.invaders[i];
          if (!inv.active) continue;

          if (CollisionSystem.checkAABB(proj, inv)) {
            proj.active = false;
            inv.active = false;

            this.registerKill(game, inv);
            break;
          }
        }

        // Láser vs Asteroides
        if (proj.active) {
          game.asteroidPool.forEachActive((ast) => {
            if (!ast.active) return;
            if (CollisionSystem.checkAABB(proj, ast)) {
              proj.active = false;
              ast.active = false;

              game.particleSystem.emitExplosion(
                ast.x + ast.width / 2,
                ast.y + ast.height / 2,
                COLORS.ASTEROID,
                16,
                140
              );
              soundFX.playExplosion(false);

              const pts = 15 * this.comboMultiplier * game.level;
              game.addScore(pts);
            }
          });
        }

        // Láser vs Láser enemigo (anulación mutua)
        if (proj.active) {
          game.projectilePool.forEachActive((enemyProj) => {
            if (enemyProj.active && enemyProj.isEnemy) {
              if (CollisionSystem.checkAABB(proj, enemyProj)) {
                proj.active = false;
                enemyProj.active = false;
                game.particleSystem.emitSparks(proj.x, proj.y, '#ffffff', 10, 100);
              }
            }
          });
        }
      } else {
        // Proyectil enemigo vs Jugador
        if (CollisionSystem.checkAABB(proj, game.player) && !game.player.isInvulnerable()) {
          proj.active = false;
          this.damagePlayer(game, 'ENEMY_BULLET');
        }
      }
    });

    // 2. Asteroide vs Jugador
    game.asteroidPool.forEachActive((ast) => {
      if (!ast.active) return;
      if (CollisionSystem.checkAABB(ast, game.player) && !game.player.isInvulnerable()) {
        ast.active = false;
        game.particleSystem.emitExplosion(ast.x + ast.width / 2, ast.y + ast.height / 2, COLORS.ASTEROID, 20, 180);
        this.damagePlayer(game, 'ASTEROID');
      }
    });

    // Limpiar invasores inactivos del array
    game.invaders = game.invaders.filter((inv) => inv.active);
  }

  registerKill(game, invader) {
    // Partículas y Sonido
    game.particleSystem.emitExplosion(
      invader.x + invader.width / 2,
      invader.y + invader.height / 2,
      invader.color,
      20,
      170
    );
    soundFX.playExplosion(false);

    // Sistema de Combo
    this.comboCount++;
    this.comboTimer = CONFIG.COMBO_TIMEOUT;
    if (this.comboCount >= 8) this.comboMultiplier = 4;
    else if (this.comboCount >= 5) this.comboMultiplier = 3;
    else if (this.comboCount >= 2) this.comboMultiplier = 2;
    else this.comboMultiplier = 1;

    game.eventBus.emit(GAME_EVENTS.COMBO_UPDATED, {
      combo: this.comboCount,
      multiplier: this.comboMultiplier
    });

    // Puntos
    const pts = (invader.points || 10) * this.comboMultiplier * game.level;
    game.addScore(pts);
  }

  damagePlayer(game, source = 'UNKNOWN') {
    game.lives--;
    game.renderSystem.triggerShake(9, 0.35);
    game.particleSystem.emitExplosion(
      game.player.x + game.player.width / 2,
      game.player.y + game.player.height / 2,
      COLORS.PLAYER,
      28,
      200
    );
    soundFX.playPlayerHit();

    this.resetCombo(game);
    game.player.resetPosition();

    game.eventBus.emit(GAME_EVENTS.LIVES_CHANGED, { lives: game.lives, source });

    if (game.lives <= 0) {
      game.triggerGameOver();
    }
  }

  resetCombo(game) {
    this.comboCount = 0;
    this.comboMultiplier = 1;
    this.comboTimer = 0;
    game.eventBus.emit(GAME_EVENTS.COMBO_UPDATED, {
      combo: 0,
      multiplier: 1
    });
  }

  advanceLevel(game) {
    game.level++;
    soundFX.playLevelUp();
    game.eventBus.emit(GAME_EVENTS.LEVEL_CHANGED, { level: game.level });
    game.initLevel();
  }

  draw(game, ctx) {
    game.drawEntities(ctx);
  }
}

