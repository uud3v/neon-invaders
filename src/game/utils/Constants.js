export const GAME_STATES = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER'
};

export const COMMANDS = {
  MOVE_LEFT: 'MOVE_LEFT',
  MOVE_RIGHT: 'MOVE_RIGHT',
  FIRE: 'FIRE',
  PAUSE: 'PAUSE',
  START: 'START',
  RESTART: 'RESTART'
};

export const COLORS = {
  PLAYER: '#00ffcc',
  PLAYER_LASER: '#38bdf8',
  INVADER_SCOUT: '#ff007f', // Fila superior (ágil)
  INVADER_RAIDER: '#ff00ff', // Filas medias
  INVADER_HEAVY: '#bf00ff',  // Fila inferior (pesada)
  ENEMY_LASER: '#ff2a2a',
  ASTEROID: '#ff7700',
  SHIELD: '#00e5ff',
  PARTICLE_SPARK: '#ffff55',
  BG_DARK: '#050508'
};

export const CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  
  PLAYER_SPEED: 340, // px/s
  PLAYER_COOLDOWN: 0.22, // segundos entre disparos
  PLAYER_LIVES: 3,

  INVADER_BASE_SPEED: 45, // px/s
  INVADER_SPEED_LEVEL_SCALE: 12,
  INVADER_DROP_AMOUNT: 18,
  INVADER_FIRE_RATE: 0.008, // probabilidad por frame de que un invasor frontal dispare

  ASTEROID_BASE_RATE: 0.25, // asteroides por segundo
  ASTEROID_SPEED_MIN: 140,
  ASTEROID_SPEED_MAX: 260,

  COMBO_TIMEOUT: 2.0 // segundos para resetear multiplicador
};

export const GAME_CONFIG = CONFIG;
