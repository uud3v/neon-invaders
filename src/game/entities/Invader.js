import { Entity } from './Entity';
import { COLORS } from '../utils/Constants';

export class Invader extends Entity {
  constructor(x, y, row = 0) {
    super(x, y, 32, 24, COLORS.INVADER_RAIDER);
    this.row = row;
    this.animFrame = 0;

    // Configurar tipo y puntos por fila
    if (row === 0) {
      this.type = 'SCOUT';
      this.color = COLORS.INVADER_SCOUT;
      this.points = 30;
    } else if (row <= 2) {
      this.type = 'RAIDER';
      this.color = COLORS.INVADER_RAIDER;
      this.points = 20;
    } else {
      this.type = 'HEAVY';
      this.color = COLORS.INVADER_HEAVY;
      this.points = 10;
    }
  }

  toggleAnim() {
    this.animFrame = this.animFrame === 0 ? 1 : 0;
  }

  draw(ctx) {
    if (!this.active) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    const w = this.width;
    const h = this.height;

    ctx.strokeStyle = this.color;
    ctx.fillStyle = '#14051a';
    ctx.lineWidth = 1.8;

    if (this.type === 'SCOUT') {
      // Nave Scout (Fila superior - Ágil y afilada)
      ctx.beginPath();
      ctx.moveTo(w / 2, 2);
      ctx.lineTo(w - 2, h * 0.4);
      ctx.lineTo(w, h - 2);
      ctx.lineTo(w * 0.7, h * 0.7);
      ctx.lineTo(w / 2, h - (this.animFrame ? 2 : 5));
      ctx.lineTo(w * 0.3, h * 0.7);
      ctx.lineTo(0, h - 2);
      ctx.lineTo(2, h * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Ojos Neón
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(w * 0.35, h * 0.4, 2.5, 2.5);
      ctx.fillRect(w * 0.65 - 2.5, h * 0.4, 2.5, 2.5);

    } else if (this.type === 'RAIDER') {
      // Invasor Clásico Raider (Filas intermedias - Antenas y pinzas móviles)
      ctx.beginPath();
      // Antenas
      ctx.moveTo(w * 0.3, 0);
      ctx.lineTo(w * 0.35, h * 0.3);
      ctx.moveTo(w * 0.7, 0);
      ctx.lineTo(w * 0.65, h * 0.3);

      // Cuerpo
      ctx.rect(w * 0.2, h * 0.3, w * 0.6, h * 0.4);

      // Brazos/Tentáculos según frame
      if (this.animFrame === 0) {
        ctx.moveTo(w * 0.2, h * 0.5);
        ctx.lineTo(0, h * 0.2);
        ctx.lineTo(0, h * 0.8);

        ctx.moveTo(w * 0.8, h * 0.5);
        ctx.lineTo(w, h * 0.2);
        ctx.lineTo(w, h * 0.8);
      } else {
        ctx.moveTo(w * 0.2, h * 0.5);
        ctx.lineTo(0, h * 0.8);
        ctx.lineTo(w * 0.15, h);

        ctx.moveTo(w * 0.8, h * 0.5);
        ctx.lineTo(w, h * 0.8);
        ctx.lineTo(w * 0.85, h);
      }
      ctx.stroke();

      // Núcleo
      ctx.fillStyle = this.color;
      ctx.fillRect(w * 0.35, h * 0.45, 3, 3);
      ctx.fillRect(w * 0.65 - 3, h * 0.45, 3, 3);

    } else {
      // Invasor Pesado Heavy (Filas inferiores - Blindado)
      ctx.beginPath();
      ctx.moveTo(4, h * 0.2);
      ctx.lineTo(w - 4, h * 0.2);
      ctx.lineTo(w, h * 0.6);
      ctx.lineTo(w * 0.8, h);
      ctx.lineTo(w * 0.2, h);
      ctx.lineTo(0, h * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Ranura visor
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(w * 0.25, h * 0.4, w * 0.5, 2.5);
    }

    ctx.restore();
  }
}
