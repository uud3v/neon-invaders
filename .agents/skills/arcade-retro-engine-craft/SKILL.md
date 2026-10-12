---
name: arcade-retro-engine-craft
description: >-
  Use this skill when auditing, refactoring, or expanding 2D browser games built with
  JavaScript, HTML5 Canvas, React, and Tailwind CSS. Applies senior software architecture
  patterns (State Machine, EventBus, Command, Object Pool), delta-time physics, optimized
  neon canvas rendering, procedural Web Audio API, and high-impact UI/UX.
---

# Arcade Retro Engine Craft - Senior Architecture & Refactoring Skill

## Rol del Agente
Actúa como un **Desarrollador Full Stack Senior y Arquitecto de Software** con dominio en:
* **Ingeniería de Software:** Principios SOLID, Clean Architecture, patrones de diseño GoF (State, Observer, Command, Factory, Object Pool).
* **JavaScript & Game Math:** Fixed-timestep game loops, `performance.now()`, interpolación, álgebra vectorial básica, matrices de colisión AABB y radial.
* **HTML5 Canvas:** Optimización de draw calls, mezclas aditivas (`globalCompositeOperation`), sistemas de partículas, trazado procedural vectorial y efectos de resplandor (evitando cuellos de botella de `shadowBlur`).
* **Tailwind CSS & UI/UX Front-End:** Diseño retro-futurista / synthwave responsivo, HUDs desacoplados, componentes con `backdrop-blur`, retroalimentación visual y micro-interacciones.
* **Audio Web API:** Síntesis sonora nativa por osciladores y ruido blanco procedural (cero dependencias de librerías pesadas).

---

## 1. ¿QUÉ? (Definición y Alcance)
Este skill estandariza el proceso de ingeniería para transformar prototipos de juegos Canvas en aplicaciones robustas, escalables y visualmente atractivas, con calidad visual.

### Capas del Sistema
1. **Core Engine:** Game Loop desacoplado con `deltaTime` y acumulador de física.
2. **Architecture & Events:** Desacoplamiento total entre Canvas y React mediante un `EventBus` (Pub/Sub).
3. **State Machine:** Estados de juego (`MenuState`, `PlayState`, `PausedState`, `GameOverState`) como clases polimórficas.
4. **Systems & Entities:** Descomposición de la *God Class* en subsistemas independientes (`InputSystem`, `PhysicsSystem`, `RenderSystem`, `ParticleSystem`).
5. **Visual FX:** Sistema de partículas para impactos y explosiones, sacudida de cámara (*screen shake*), estelas de proyectiles y sprites vectoriales procedurales.
6. **UI & HUD (Tailwind CSS):** Interfaz desacoplada, responsiva, estilizada con estética Neón/Arcade.
7. **Procedural Audio:** Efectos de sonido sintetizados nativamente, de ser posible utiliza Web Audio API.

---

## 2. ¿CÓMO? (Metodología y Patrones de Implementación)

### 2.1 Game Loop Desacoplado con Delta-Time
Nunca actualizar la física basada en frames fijos o tasas de refresco dependientes del monitor.
```javascript
// En src/core/Engine.js
export class Engine {
  constructor(updateFn, renderFn) {
    this.update = updateFn;
    this.render = renderFn;
    this.lastTime = 0;
    this.accumulatedTime = 0;
    this.timeStep = 1000 / 60; // 60 updates por segundo fijos
    this.animationFrameId = null;
  }

  start() {
    this.lastTime = performance.now();
    const loop = (currentTime) => {
      let delta = currentTime - this.lastTime;
      if (delta > 250) delta = 250; // Evita el "spiral of death" tras perder foco
      this.lastTime = currentTime;
      this.accumulatedTime += delta;

      while (this.accumulatedTime >= this.timeStep) {
        this.update(this.timeStep / 1000); // Pasar segundos
        this.accumulatedTime -= this.timeStep;
      }

      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }
}
```

### 2.2 Desacoplamiento Event-Driven (Observer / EventBus)
React **NO** debe enterarse de cada cuadro del canvas. Solo debe reaccionar a eventos discretos:
```javascript
// En src/core/EventBus.js
export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event, payload) {
    this.listeners.get(event)?.forEach(cb => cb(payload));
  }
}

export const GAME_EVENTS = {
  SCORE_CHANGED: 'SCORE_CHANGED',
  LIVES_CHANGED: 'LIVES_CHANGED',
  LEVEL_UP: 'LEVEL_UP',
  GAME_OVER: 'GAME_OVER',
  STATE_CHANGED: 'STATE_CHANGED',
  COMBO_TRIGGERED: 'COMBO_TRIGGERED'
};
```

### 2.3 Patrón State (Máquina de Estados)
Cada estado encapsula sus propias entradas, actualizaciones y renderizados:
```javascript
// src/game/states/GameState.js (Interfaz base)
export class GameState {
  enter(game) {}
  update(game, dt) {}
  draw(game, ctx) {}
  handleInput(game, input) {}
  exit(game) {}
}
```
Implementar `MenuState`, `PlayState`, `PauseState`, `GameOverState`.

### 2.4 Renderizado y Optimización de Canvas (Glow & Particles)
* **Evitar cuellos de botella:** `ctx.shadowBlur = 15` reiterado en 60 objetos destruye el rendimiento.
* **Alternativa de alto rendimiento:** Usar `ctx.globalCompositeOperation = 'lighter'` para mezclas aditivas luminosas de neón y trazos dobles (núcleo blanco + halo de color).
* **Sistema de Partículas:**
```javascript
// src/game/systems/ParticleSystem.js
export class ParticleSystem {
  constructor(maxParticles = 200) {
    this.particles = [];
  }

  emit(x, y, color, count = 15, speed = 120) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = (Math.random() * 0.8 + 0.2) * speed;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color,
        life: 1.0,
        decay: Math.random() * 1.5 + 1.2
      });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= p.decay * dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
    }
    ctx.restore();
  }
}
```

### 2.5 UI y HUD con Tailwind CSS
* Instalar Tailwind CSS en Vite: `@tailwindcss/vite` o `tailwindcss postcss autoprefixer`.
* Eliminar estilos inline en `GameBoard.jsx`.
* Construir componentes modulares:
  * `<GameHUD />`: Muestra Score, HighScore, Multiplicador, Vidas en formato de iconos neón.
  * `<ScreenOverlay />`: Maneja Menú Principal, Pausa y Game Over con efectos `backdrop-blur-md` y fuentes retro/mono.
  * `<Scanlines />`: Opcional, overlay estético de líneas CRT o viñeta synthwave.

### 2.6 Síntesis de Sonido Nativa (Web Audio API)
```javascript
// src/game/audio/SoundFX.js
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playLaser() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playExplosion() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.25);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }
}
export const soundFX = new SoundFX();
```

---

## 3. ¿CUÁNDO? (Triggers de Activación)
Activar este skill cuando:
1. El usuario solicite refactorizar el código de `Game.js`, `GameBoard.jsx` o las entidades.
2. Se requiera mejorar la arquitectura, escalabilidad o calidad de código del juego.
3. Se añadan nuevas mecánicas (enemigos que disparan, jefes, power-ups, escudos, rachas de combo).
4. El rendimiento se degrade o se necesite compatibilidad fluida con pantallas de alta tasa de refresco (120/144Hz).
5. Se desee modernizar la interfaz visual, migrar a Tailwind CSS o añadir efectos de sonido/partículas.

---

## 4. ¿DÓNDE? (Estructura de Archivos Objetivo)
```text
neon-invaders/
├── .agents/skills/arcade-retro-engine-craft/
│   └── SKILL.md
├── src/
│   ├── core/
│   │   ├── Engine.js             # Fixed-timestep Game Loop
│   │   ├── EventBus.js           # Pub/Sub desacoplado
│   │   └── StateMachine.js       # Gestor de estados de juego
│   ├── game/
│   │   ├── audio/
│   │   │   └── SoundFX.js        # Síntesis Web Audio API
│   │   ├── entities/
│   │   │   ├── Entity.js         # Clase base
│   │   │   ├── Player.js         # Nave con dibujo vectorial procedural
│   │   │   ├── Invader.js        # Tipos de invasores polimórficos
│   │   │   ├── Projectile.js     # Balas de jugador y enemigas
│   │   │   └── Asteroid.js       # Obstáculos espaciales
│   │   ├── states/
│   │   │   ├── MenuState.js
│   │   │   ├── PlayState.js
│   │   │   ├── PauseState.js
│   │   │   └── GameOverState.js
│   │   ├── systems/
│   │   │   ├── InputSystem.js    # Mapeo de teclas desacoplado
│   │   │   ├── CollisionSystem.js# Detección AABB optimizada
│   │   │   ├── ParticleSystem.js # Chispas y explosiones
│   │   │   └── RenderSystem.js   # Dibujo, Screen Shake, Glow
│   │   └── utils/
│   │       ├── Pool.js           # Object Pooling
│   │       └── Constants.js      # Configuraciones y colores
│   ├── components/
│   │   ├── ui/
│   │   │   ├── HUD.jsx           # Marcador y estado en Tailwind
│   │   │   ├── OverlayModal.jsx  # Pantallas de pausa, menú y fin de juego
│   │   │   └── ControlsHelp.jsx  # Barra informativa inferior
│   │   └── GameBoard.jsx         # Contenedor del Canvas y React Bridge
│   ├── App.jsx
│   ├── index.css                 # Directivas Tailwind
│   └── main.jsx
```

---

## 5. Checklist de Validación de Calidad
Antes de dar por completada una refactorización o adición con este skill, verificar:
- [ ] ¿El Game Loop usa `deltaTime` para que la velocidad sea idéntica en 60Hz y 144Hz?
- [ ] ¿React se actualiza únicamente vía eventos del `EventBus` y no en cada frame del render?
- [ ] ¿No hay llamadas innecesarias a `ctx.shadowBlur` en bucles críticos de renderizado?
- [ ] ¿Los objetos frecuentes (proyectiles, partículas, asteroides) provienen de un `Pool` para evitar recolección de basura (*Garbage Collection stutter*)?
- [ ] ¿Los componentes de UI usan clases de Tailwind CSS sin estilos CSS inline dispersos?
- [ ] ¿El audio responde a las interacciones del usuario inicializando el `AudioContext` tras el primer clic/tecla?

