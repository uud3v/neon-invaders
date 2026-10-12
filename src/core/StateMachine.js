export class StateMachine {
  constructor(context) {
    this.context = context;
    this.states = new Map();
    this.currentState = null;
    this.currentStateName = null;
  }

  addState(name, stateInstance) {
    this.states.set(name, stateInstance);
  }

  changeState(name, ...args) {
    if (!this.states.has(name)) {
      console.warn(`StateMachine: El estado "${name}" no está registrado.`);
      return;
    }

    const nextState = this.states.get(name);
    if (this.currentState && typeof this.currentState.exit === 'function') {
      this.currentState.exit(this.context);
    }

    const previousStateName = this.currentStateName;
    this.currentState = nextState;
    this.currentStateName = name;

    if (typeof this.currentState.enter === 'function') {
      this.currentState.enter(this.context, previousStateName, ...args);
    }
  }

  update(dt) {
    if (this.currentState && typeof this.currentState.update === 'function') {
      this.currentState.update(this.context, dt);
    }
  }

  draw(ctx, alpha) {
    if (this.currentState && typeof this.currentState.draw === 'function') {
      this.currentState.draw(this.context, ctx, alpha);
    }
  }

  handleCommand(command) {
    if (this.currentState && typeof this.currentState.handleCommand === 'function') {
      return this.currentState.handleCommand(this.context, command);
    }
    return false;
  }
}

