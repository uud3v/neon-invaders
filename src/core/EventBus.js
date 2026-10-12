export const GAME_EVENTS = {
  STATE_CHANGED: 'STATE_CHANGED',
  SCORE_CHANGED: 'SCORE_CHANGED',
  LIVES_CHANGED: 'LIVES_CHANGED',
  LEVEL_CHANGED: 'LEVEL_CHANGED',
  HIGH_SCORE_CHANGED: 'HIGH_SCORE_CHANGED',
  COMBO_UPDATED: 'COMBO_UPDATED',
  SCREEN_SHAKE: 'SCREEN_SHAKE',
  GAME_OVER: 'GAME_OVER',
  GAME_RESET: 'GAME_RESET',
  SFX_TRIGGERED: 'SFX_TRIGGERED'
};

export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(callback);
      if (handlers.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit(event, payload) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      });
    }
  }

  clear() {
    this.listeners.clear();
  }
}

// Instancia singleton para desacoplar el core y React
export const globalEventBus = new EventBus();

