import { COMMANDS } from '../utils/Constants';

export class InputSystem {
  constructor() {
    this.keyMap = {
      ArrowLeft: COMMANDS.MOVE_LEFT,
      KeyA: COMMANDS.MOVE_LEFT,
      ArrowRight: COMMANDS.MOVE_RIGHT,
      KeyD: COMMANDS.MOVE_RIGHT,
      Space: COMMANDS.FIRE,
      KeyW: COMMANDS.FIRE,
      ArrowUp: COMMANDS.FIRE,
      Escape: COMMANDS.PAUSE,
      KeyP: COMMANDS.PAUSE,
      Enter: COMMANDS.START
    };

    this.activeKeys = new Set();
    this.commandListeners = [];

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  attach() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  detach() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.activeKeys.clear();
  }

  onCommand(callback) {
    this.commandListeners.push(callback);
    return () => {
      this.commandListeners = this.commandListeners.filter(cb => cb !== callback);
    };
  }

  handleKeyDown(e) {
    if (this.keyMap[e.code]) {
      // Prevenir scroll de la ventana
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      const isFirstPress = !this.activeKeys.has(e.code);
      this.activeKeys.add(e.code);

      if (isFirstPress) {
        const command = this.keyMap[e.code];
        this.commandListeners.forEach(listener => listener(command, e.code));
      }
    }
  }

  handleKeyUp(e) {
    this.activeKeys.delete(e.code);
  }

  isCommandActive(command) {
    for (const code of this.activeKeys) {
      if (this.keyMap[code] === command) return true;
    }
    return false;
  }
}

