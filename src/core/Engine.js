export class Engine {
  constructor(updateFn, renderFn, fps = 60) {
    this.update = updateFn;
    this.render = renderFn;
    this.fixedDeltaTime = 1 / fps; // segundos por tick físico
    this.fixedDeltaMs = 1000 / fps; // ms por tick físico

    this.lastTime = 0;
    this.accumulatedTime = 0;
    this.animationId = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.accumulatedTime = 0;

    const tick = (currentTime) => {
      if (!this.isRunning) return;

      let frameTime = currentTime - this.lastTime;
      this.lastTime = currentTime;

      // Evita el "spiral of death" cuando la pestaña se minimiza o hay lag spike
      if (frameTime > 250) {
        frameTime = 250;
      }

      this.accumulatedTime += frameTime;

      // Consumir el tiempo acumulado en pasos físicos discretos
      while (this.accumulatedTime >= this.fixedDeltaMs) {
        this.update(this.fixedDeltaTime);
        this.accumulatedTime -= this.fixedDeltaMs;
      }

      // Renderizar con factor de interpolación entre cuadros si se requiere
      const alpha = this.accumulatedTime / this.fixedDeltaMs;
      this.render(alpha);

      this.animationId = requestAnimationFrame(tick);
    };

    this.animationId = requestAnimationFrame(tick);
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

