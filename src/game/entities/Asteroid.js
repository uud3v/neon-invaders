import { Entity } from './Entity';
import { COLORS } from '../utils/Constants';

export class Asteroid extends Entity {
  constructor() {
    super(0, 0, 36, 36, COLORS.ASTEROID);
    this.active = false;
    this.vy = 180;
    this.vx = 0;
    this.rotation = 0;
    this.rotationSpeed = 1.5;
    this.vertices = [];
    this.radius = 18;
  }

  spawn(canvasWidth) {
    this.radius = Math.floor(Math.random() * 10) + 14;
    this.width = this.radius * 2;
    this.height = this.radius * 2;

    this.x = Math.random() * (canvasWidth - this.width);
    this.y = -this.height - 10;
    this.vy = Math.random() * 100 + 130;
    this.vx = (Math.random() - 0.5) * 50;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 3;

    // Generar forma irregular única de asteroide
    const pointsCount = 8;
    this.vertices = [];
    for (let i = 0; i < pointsCount; i++) {
      const angle = (i / pointsCount) * Math.PI * 2;
      const dist = this.radius * (0.75 + Math.random() * 0.45);
      this.vertices.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist
      });
    }

    this.active = true;
  }

  update(dt, canvasHeight = 600) {
    if (!this.active) return;

    this.y += this.vy * dt;
    this.x += this.vx * dt;
    this.rotation += this.rotationSpeed * dt;

    if (this.y > canvasHeight + 50) {
      this.active = false;
    }
  }

  draw(ctx) {
    if (!this.active || this.vertices.length === 0) return;

    ctx.save();
    ctx.translate(this.x + this.radius, this.y + this.radius);
    ctx.rotate(this.rotation);

    ctx.strokeStyle = this.color;
    ctx.fillStyle = '#1c0a02';
    ctx.lineWidth = 1.8;

    ctx.beginPath();
    ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
    for (let i = 1; i < this.vertices.length; i++) {
      ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Detalle de fractura interna neón
    ctx.strokeStyle = '#ffa200';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.vertices[1].x * 0.5, this.vertices[1].y * 0.5);
    ctx.lineTo(0, 0);
    ctx.lineTo(this.vertices[4].x * 0.6, this.vertices[4].y * 0.6);
    ctx.stroke();

    ctx.restore();
  }
}