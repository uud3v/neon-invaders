import { COLORS } from '../utils/Constants';

export class RenderSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeTime = 0;

    // Fondo procedural de estrellas synthwave
    this.stars = [];
    this.initStars(60);
  }

  initStars(count) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 1.8 + 0.5,
        speed: Math.random() * 30 + 15,
        brightness: Math.random() * 0.7 + 0.3
      });
    }
  }

  triggerShake(intensity = 6, duration = 0.25) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeTime = duration;
  }

  update(dt) {
    // Actualizar estrellas de fondo
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      s.y += s.speed * dt;
      if (s.y > this.canvas.height) {
        s.y = 0;
        s.x = Math.random() * this.canvas.width;
      }
    }

    // Actualizar screen shake
    if (this.shakeTime > 0) {
      this.shakeTime -= dt;
      if (this.shakeTime <= 0) {
        this.shakeIntensity = 0;
      }
    }
  }

  beginFrame() {
    this.ctx.save();

    // Aplicar temblor de cámara
    if (this.shakeTime > 0) {
      const progress = this.shakeTime / this.shakeDuration;
      const currentIntensity = this.shakeIntensity * progress;
      const offsetX = (Math.random() * 2 - 1) * currentIntensity;
      const offsetY = (Math.random() * 2 - 1) * currentIntensity;
      this.ctx.translate(offsetX, offsetY);
    }

    // Limpiar canvas con tono espacial oscuro
    this.ctx.fillStyle = COLORS.BG_DARK;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibujar estrellas
    this.drawStars();
  }

  drawStars() {
    this.ctx.fillStyle = '#ffffff';
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      this.ctx.globalAlpha = s.brightness;
      this.ctx.fillRect(s.x, s.y, s.size, s.size);
    }
    this.ctx.globalAlpha = 1.0;
  }

  endFrame() {
    this.ctx.restore();
  }
}

