export class ParticleSystem {
  constructor(maxParticles = 300) {
    this.maxParticles = maxParticles;
    this.particles = [];
  }

  emitExplosion(x, y, color, count = 24, speed = 180) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift(); // Reemplazar más antigua si alcanzamos límite
      }
      const angle = Math.random() * Math.PI * 2;
      const velocity = (Math.random() * 0.8 + 0.2) * speed;
      const size = Math.random() * 3 + 1.5;
      const life = Math.random() * 0.4 + 0.4;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color,
        size,
        life,
        maxLife: life,
        decay: 1 / life
      });
    }
  }

  emitSparks(x, y, color, count = 8, speed = 120) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift();
      }
      const angle = Math.random() * Math.PI * 2;
      const velocity = (Math.random() * 0.6 + 0.4) * speed;
      const life = Math.random() * 0.25 + 0.15;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color,
        size: Math.random() * 2 + 1,
        life,
        maxLife: life,
        decay: 1 / life
      });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.96; // fricción sutil
      p.vy *= 0.96;
      p.life -= dt;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    if (this.particles.length === 0) return;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const progress = p.life / p.maxLife;
      ctx.globalAlpha = Math.max(0, Math.min(1, progress));
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * progress, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  clear() {
    this.particles.length = 0;
  }
}

