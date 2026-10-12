import { Entity } from './Entity';
import { COLORS, CONFIG } from '../utils/Constants';

export class Player extends Entity {
  constructor(canvasWidth, canvasHeight) {
    super(0, 0, 44, 26, COLORS.PLAYER);
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.resetPosition();

    this.speed = CONFIG.PLAYER_SPEED;
    this.fireCooldown = 0;
    this.invulnerableTimer = 0;
  }

  resetPosition() {
    this.x = this.canvasWidth / 2 - this.width / 2;
    this.y = this.canvasHeight - this.height - 18;
    this.invulnerableTimer = 1.5; // Breve inmunidad al reaparecer
  }

  update(dt, inputSystem, particleSystem) {
    // Manejo de cooldowns
    if (this.fireCooldown > 0) {
      this.fireCooldown -= dt;
    }
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    // Movimiento
    let moveDir = 0;
    if (inputSystem.isCommandActive('MOVE_LEFT')) moveDir -= 1;
    if (inputSystem.isCommandActive('MOVE_RIGHT')) moveDir += 1;

    this.x += moveDir * this.speed * dt;

    // Confinar a los límites de la pantalla
    if (this.x < 12) this.x = 12;
    if (this.x + this.width > this.canvasWidth - 12) {
      this.x = this.canvasWidth - 12 - this.width;
    }

    // Partículas de los propulsores
    if (particleSystem && Math.random() < 0.6) {
      particleSystem.emitSparks(
        this.x + this.width / 2 + (Math.random() * 8 - 4),
        this.y + this.height + 2,
        COLORS.PLAYER,
        1,
        60
      );
    }
  }

  canFire() {
    return this.fireCooldown <= 0;
  }

  recordShot() {
    this.fireCooldown = CONFIG.PLAYER_COOLDOWN;
  }

  isInvulnerable() {
    return this.invulnerableTimer > 0;
  }

  draw(ctx) {
    // Parpadeo durante frames de inmunidad
    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      return;
    }

    ctx.save();
    ctx.translate(this.x, this.y);

    const w = this.width;
    const h = this.height;

    // Resplandor neón
    ctx.strokeStyle = this.color;
    ctx.fillStyle = '#061a1e';
    ctx.lineWidth = 2;

    // Dibujo geométrico vectorial de la nave interceptora
    ctx.beginPath();
    ctx.moveTo(w / 2, 0); // Vértice frontal
    ctx.lineTo(w, h);     // Ala derecha
    ctx.lineTo(w * 0.7, h * 0.75); // Hendidura ala derecha
    ctx.lineTo(w * 0.5, h * 0.9);  // Propulsor central
    ctx.lineTo(w * 0.3, h * 0.75); // Hendidura ala izquierda
    ctx.lineTo(0, h);     // Ala izquierda
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    // Núcleo / Cabina luminosa
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(w / 2, 4);
    ctx.lineTo(w / 2 + 3, 14);
    ctx.lineTo(w / 2 - 3, 14);
    ctx.closePath();
    ctx.fill();

    // Cañones laterales
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(2, h - 2);
    ctx.lineTo(2, h - 8);
    ctx.moveTo(w - 2, h - 2);
    ctx.lineTo(w - 2, h - 8);
    ctx.stroke();

    ctx.restore();
  }
}