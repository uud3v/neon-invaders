# Contexto del juego
Es un pequeño juego de tipo Invaders que incluye las siguientes caracteristicas:
a. Manejo de diferentes niveles.
b. Acumulacion de puntos segun el avance del juego indicando maximo score logrado.
c. Incremento de velocidad de acercamiento de enemigos mientras se vanza de nivel.

# Tecnologia usada en la creacion del juego
a. Javascript
b. React
c. Canvas

# Ejecucion del juego
Cargar el proyecto React con vite
a. Ejecutar npm install
b. Ejecutar npm run dev
c. Ir a url http://localhost:5173/

##  Evidencia de vibecoding (prompts)
Se adjunta link del prompt y refinamiento ejecutado: https://share.gemini.google/TSPxQ9HMAa2n

Se pidió a la IA inicialmente lo siguiente: Actúa como mi arquitecto de software y mentor. Vamos a desarrollar el juego Neon Invaders en un sprint de 3 horas utilizando React y HTML5 Canvas. Ya tengo el proyecto creado con npm create vite@latest neon-invaders -- --template react.

Requiero que me proporciones:
La estructura de carpetas sugerida.
El código de las clases base (Game, Player, Invader) separadas como módulos ES6.
El componente React que monta el Canvas y ejecuta el Game Loop usando useRef y useEffect. 

Como idea principal se ha buscado crear un juego sencillo pero practico que fuese facil de desarrollar y ajustar.
Poco a poco se fueron realizando ajustes ya que se fueron identificando necesidades para que el juego fuese mas interesante, interactivo y se ajustara a la pantalla visualmente. Al principio el juego no tenia mucho dinamismo y se requirió agregar funciones como subir de nivel, conteo de puntos acumulados, y objetos cayendo para que fuera mas desafiante.

# Iteración y mejora
Se puede encontrar en el link del prompt compartido.

# Validacion del resultado
El codigo se probó inicialmente mediante la ejecución del proyecto:
Instalando las dependencias (siendo necesario la primera vez)
    npm install

Levantando el servidor de desarrollo
    npm run dev

Se fueron observando errores y deficiencias a nivel de funcionamiento que se fueron corrigiendo desde el editor con apoyo de Gemini AI.

Se identificó que era necesario limpiar el código por defecto que genera Vite en el archivo principal para que solo iniciara el tablero de juego.
Se ajustaron fragmentos de codigo que Gemimi proporcionó incompletos y por ende inicialmente no funcionaba bien.
Como limitación se identificó que el no conocer a profundidad el framework hace que se omitan elementos importantes que contribuyen a proporcionar un mejor contexto a la IA.

# Reflexión final
a. La IA es una excelente herramienta que nos permite ser más productivos en el desarrollo de software, disminuyendo horas de esfuerzo .
b. Como ventajas se identifican:
    1. Creacion automatica de codigo repetitivo.
    2. Recibir sugerencias a nivel de codigo para saber que secciones modificar ante una solicitud específica.
    3. Bajo un enfoque amplio se traduce en ahorro de tiempo al poder obtener un MVP en corto tiempo comparado si no tuviesemos esta herrmienta.
    
c. Comprendo la mayoría de bloques de codigo Javascript y HTML pero tengo claridad en que debo mejorar y reforzar el entendimiento de React.

---

# Fase 2: Arquitectura y Refactorización Avanzada (Con Skills)

En esta fase, asumiendo el rol de **Desarrollador Full Stack Senior y Arquitecto de Software**, se diseñó e implementó un skill propio dentro del entorno: [`.agents/skills/arcade-retro-engine-craft/SKILL.md`](.agents/skills/arcade-retro-engine-craft/SKILL.md). Con este skill se ejecutó una refactorización integral del proyecto para elevar la calidad del código, el rendimiento, la escalabilidad, la interfaz visual y la interactividad del juego.

## 1. Definición del Skill Propio (`arcade-retro-engine-craft`)
* **¿Qué?**: Estándar de ingeniería de software para refactorizar y escalar videojuegos web 2D con Canvas, React y Tailwind CSS aplicando principios SOLID y patrones de diseño GoF.
* **¿Cómo?**: Mediante arquitectura por capas (`core`, `systems`, `entities`, `states`, `ui`), desacoplamiento orientado a eventos con `EventBus`, Game Loop desacoplado con `deltaTime`, mezcla aditiva de Canvas (`globalCompositeOperation`), síntesis procedural con Web Audio API y diseño responsivo en Tailwind CSS.
* **¿Cuándo?**: Al auditar la arquitectura, optimizar el rendimiento (60-144 FPS estables), añadir nuevas mecánicas de combate o modernizar la interfaz.
* **¿Dónde?**: Ubicado en `.agents/skills/arcade-retro-engine-craft/SKILL.md` impactando de forma modular la estructura de `src/`.

---

## 2. Diagnóstico Arquitectónico y Necesidad de Refactor
Antes del uso del skill, el proyecto presentaba limitaciones técnicas comunes en prototipos rápidos:
1. **Falta de Delta-Time en el Game Loop**: La velocidad física dependía de la tasa de refresco del monitor (en pantallas de 144Hz corría a más del doble de velocidad que en 60Hz).
2. **God Class (`Game.js`)**: Una sola clase concentraba ~290 líneas manejando eventos de teclado del DOM, dibujado directo en canvas, colisiones $O(N \times M)$, ciclo de vida y puntuación, violando el Principio de Responsabilidad Única (SRP).
3. **Pérdida de rendimiento en Canvas**: Uso reiterado de `ctx.shadowBlur` en cada frame para cada entidad, penalizando la GPU.
4. **Acoplamiento React-Canvas**: El canvas dependía de callbacks directos (`onStateChange`) que forzaban renders innecesarios.
5. **Estilos CSS Inline**: Dimensiones rígidas (`800x600`), sin diseño responsivo ni efectos modernos acordes a la temática neón.
6. **Mecánicas e Interactividad Básicas**: Enemigos estáticos que solo descendían, sin proyectiles de respuesta, sin sistema de combos, sin efectos de partículas y sin audio.

---

## 3. Patrones de Diseño de Software Aplicados

| Patrón / Principio | Archivos Clave | Propósito y Beneficio |
| :--- | :--- | :--- |
| **State Pattern** | `src/core/StateMachine.js`<br>`src/game/states/GameState.js`<br>`MenuState.js`, `PlayState.js`, `PauseState.js`, `GameOverState.js` | Desacopla los estados del juego en clases polimórficas independientes, eliminando condicionales masivos (`switch/case`). |
| **Observer (Pub/Sub)** | `src/core/EventBus.js` | Desacoplamiento total entre el Canvas y React. React solo escucha eventos discretos (`SCORE_CHANGED`, `LIVES_CHANGED`, `COMBO_UPDATED`) sin intervenir en el render loop. |
| **Command Pattern** | `src/game/systems/InputSystem.js` | Mapea las teclas del teclado (`e.code`) a comandos lógicos del juego (`FIRE`, `MOVE_LEFT`, `PAUSE`), facilitando soporte para futuros controles táctiles o gamepad. |
| **Object Pool Pattern** | `src/game/utils/Pool.js` | Reutilización de proyectiles, asteroides y partículas con iteración sin asignación de arrays (`forEachActive`), erradicando tirones por Garbage Collection. |
| **Layered Architecture** | `src/core/`, `src/game/systems/`, `src/game/entities/`, `src/game/audio/`, `src/components/ui/` | Separación estricta de responsabilidades bajo principios SOLID. |

---

## 4. Mejoras de Jugabilidad y Experiencia ("Juice" & Game Feel)

### a. Fixed-Timestep Game Loop (`src/core/Engine.js`)
* Motor de bucle desacoplado con paso de tiempo fijo (60 Hz exactos) y acumulador de física con `deltaTime`.
* Detección de lag spikes y protección contra *spiral of death* si la pestaña se suspende.

### b. Síntesis de Audio Nativa con Web Audio API (`src/game/audio/SoundFX.js`)
* Generación de sonido analógico procedural en tiempo real sin librerías externas ni archivos pesados `.mp3` o `.wav`.
* Sonidos sintetizados:
  * Disparo láser del jugador con oscilador tipo sierra y rampa exponencial.
  * Disparo enemigo con oscilador triangular.
  * Explosiones con buffer de ruido blanco (*white noise*) y filtro pasa-bajo (*lowpass filter*).
  * Impacto al jugador con onda cuadrada y distorsión.
  * Fanfarria de victoria de nivel y escala de Game Over.
  * Control de silenciar/activar audio (*Mute*) integrado en el HUD.

### c. Sistema de Partículas y Efectos Visuales Neón (`src/game/systems/`)
* **Mezcla Aditiva:** Sustitución de `shadowBlur` por `ctx.globalCompositeOperation = 'lighter'`, permitiendo halos neón brillantes con alto rendimiento de GPU.
* **Explosiones de Partículas:** Chispas que heredan el color neón exacto del enemigo destruido.
* **Screen Shake:** Temblor cinemático de cámara con amortiguación al recibir daño.
* **Campo de Estrellas:** Fondo espacial animado con estrellas procedurales parpadeantes.

### d. Dinámica de Combate y Nuevas Mecánicas
* **Contrataque Invasor:** Los enemigos del frente disparan proyectiles láser rojos hacia el jugador.
* **Intercepción Láser vs Láser:** El jugador puede anular los disparos enemigos interceptándolos con sus propios láseres.
* **Enjambre Acelerado:** Conforme menos invasores quedan vivos, mayor es su velocidad de desplazamiento y animación.
* **Sistema de Racha y Combos:** Impactos consecutivos antes de 2 segundos activan multiplicadores de puntuación (`🔥 2x, 3x, 4x`).
* **Entidades Vectoriales Procedurales:**
  * **Player:** Caza espacial con cabina luminosa, cañones y partículas en propulsores.
  * **Invaders:** 3 clases con sprites vectoriales y animación de marcha (Scout, Raider, Heavy).
  * **Asteroides:** Polígonos irregulares con rotación continua y fracturas neón.

---

## 5. Modernización de Interfaz con Tailwind CSS

Se integró `@tailwindcss/vite` eliminando por completo los estilos inline y construyendo una UI profesional synthwave:

* **HUD Neón (`src/components/ui/HUD.jsx`):** Marcador digital formateado (`001420`), High Score persistente en `localStorage`, indicador de Sector, iconos vectoriales del casco (*Hull*) y control de sonido.
* **Modales Translúcidos (`src/components/ui/OverlayModal.jsx`):** Pantallas de Menú, Pausa y Game Over con `backdrop-blur-md`, tipografía monospace/arcade y botones interactivos (soporte tanto para teclado como para ratón/táctil).
* **Canvas Responsivo (`src/components/GameBoard.jsx`):** Relación de aspecto `4:3` adaptativa con marco brillante y filtro estético de líneas de escaneo CRT (*scanlines*).
* **Layout Principal (`src/App.jsx`):** Iluminación ambiental y estructura responsiva.

---

## 6. Nueva Estructura Modular del Proyecto

```text
neon-invaders/
├── .agents/
│   └── skills/
│       └── arcade-retro-engine-craft/
│           └── SKILL.md              <-- Definición formal del Skill aplicado
├── src/
│   ├── core/                         <-- Núcleo de Arquitectura
│   │   ├── Engine.js                 <-- Fixed-timestep loop con deltaTime
│   │   ├── EventBus.js               <-- Bus de eventos desacoplado (Pub/Sub)
│   │   └── StateMachine.js           <-- Gestor de ciclo de vida de estados
│   ├── game/
│   │   ├── audio/
│   │   │   └── SoundFX.js            <-- Síntesis procedural con Web Audio API
│   │   ├── entities/                 <-- Entidades vectoriales del juego
│   │   │   ├── Entity.js             <-- Clase base con bounds AABB
│   │   │   ├── Player.js             <-- Nave interceptora con propulsores
│   │   │   ├── Invader.js            <-- Invasores (Scout, Raider, Heavy)
│   │   │   ├── Projectile.js         <-- Láseres con núcleo y halo
│   │   │   └── Asteroid.js           <-- Asteroides con rotación poligonal
│   │   ├── states/                   <-- Estados de juego (State Pattern)
│   │   │   ├── GameState.js          <-- Interfaz abstracta
│   │   │   ├── MenuState.js          <-- Menú principal
│   │   │   ├── PlayState.js          <-- Mecánica de combate y oleadas
│   │   │   ├── PauseState.js         <-- Pausa con congelamiento de física
│   │   │   └── GameOverState.js      <-- Pantalla de derrota y high scores
│   │   ├── systems/                  <-- Subsistemas especializados
│   │   │   ├── InputSystem.js        <-- Command pattern de teclado
│   │   │   ├── CollisionSystem.js    <-- Detección matemática de impactos
│   │   │   ├── ParticleSystem.js     <-- Chispas y explosiones aditivas
│   │   │   └── RenderSystem.js       <-- Screen shake y campo de estrellas
│   │   └── utils/
│   │       ├── Constants.js          <-- Paleta neón, multiplicadores y config
│   │       └── Pool.js               <-- Object Pooling libre de GC allocations
│   ├── components/
│   │   ├── ui/                       <-- Componentes de interfaz Tailwind
│   │   │   ├── HUD.jsx               <-- Marcador superior y estado del jugador
│   │   │   ├── OverlayModal.jsx      <-- Diálogos de menú, pausa y fin de juego
│   │   │   └── ControlsHelp.jsx      <-- Barra inferior de controles
│   │   └── GameBoard.jsx             <-- Puente React-Canvas responsivo
│   ├── App.jsx                       <-- Layout principal con iluminación ambiental
│   ├── index.css                     <-- Directivas Tailwind y utilidades Neón
│   └── main.jsx
├── package.json                      <-- Scripts y dependencias actualizadas
├── vite.config.js                    <-- Configuración Vite + Tailwind CSS plugin
└── README.md                         <-- Documentación integral del proyecto
```

---

## 7. Verificación de Calidad y Rendimiento
* **ESLint:** `npm run lint` ejecutado con **0 errores y 0 advertencias**.
* **Vite Build:** Compilación de producción en **< 200 ms**.
* **Framerate:** 60 FPS estables sin degradación de rendimiento.

---

## 8. Comparativa: Fase 1 (Sin Skills) vs Fase 2 (Con Skills)

| Criterio | Fase 1: Sin Skills (Vibecoding Convencional) | Fase 2: Con Skills (`arcade-retro-engine-craft`) |
| :--- | :--- | :--- |
| **Arquitectura** | Monolítica, lógica acoplada en un único archivo `Game.js`. | Arquitectura limpia por capas (Core, Systems, States, Entities, UI). |
| **Game Loop** | Asíncrono dependiente del refresco del monitor. | *Fixed-timestep* desacoplado con `deltaTime` uniforme en cualquier pantalla. |
| **Acoplamiento React-Canvas** | `onStateChange` forzando re-renders sin control. | Arquitectura orientada a eventos con `EventBus` pub/sub. |
| **Rendimiento Gráfico** | `shadowBlur` recursivo con alto costo de GPU. | Mezcla aditiva con `globalCompositeOperation = 'lighter'` y Object Pooling. |
| **Inmersión & Audio** | Sin sonido, rectángulos planos estáticos. | Audio procedural en tiempo real, explosiones de partículas, combos y screen shake. |
| **Mantenibilidad** | Modificar mecánicas requería alterar la God Class completa. | Principio Abierto/Cerrado (OCP): añadir nuevos enemigos o estados sin tocar el núcleo. |