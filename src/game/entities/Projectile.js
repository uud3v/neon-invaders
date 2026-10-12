import { Entity } from './Entity';
import { COLORS } from '../utils/Constants';

export class Projectile extends Entity {
  constructor() {
    super(0, 0, 4, 16, COLORS.PLAYER_LASER);
    this.vy = -550; // px/s
    this.active = false;
    this.isEnemy = false;
  }

  spawn(x, y, vy = -550, color = COLORS.PLAYER_LASER, isEnemy = false) {
    this.x = x - this.width / 2;
    this.y = y;
    this.vy = vy;
    this.color = color;
    this.isEnemy = isEnemy;
    this.active = true;
  }

  update(dt, canvasHeight = 600) {
    if (!this.active) return;
    this.y += this.vy * dt;

    if (this.y < -30 || this.y > canvasHeight + 30) {
      this.active = false;
    }
  }

  draw(ctx) {
    if (!this.active) return;

    ctx.save();
    // Halo exterior de neón
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x + this.width / 2, this.y + this.height);
    ctx.stroke();

    // Núcleo blanco brillante
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y + 2);
    ctx.lineTo(this.x + this.width / 2, this.y + this.height - 2);
    ctx.stroke();

    ctx.restore();
  }
}