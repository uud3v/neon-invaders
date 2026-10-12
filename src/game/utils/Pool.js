export class Pool {
  constructor(factoryMethod, size = 30) {
    this.factoryMethod = factoryMethod;
    this.pool = Array.from({ length: size }, factoryMethod);
  }

  get() {
    for (let i = 0; i < this.pool.length; i++) {
      if (!this.pool[i].active) {
        return this.pool[i];
      }
    }
    // Si la piscina se agota, duplicamos su capacidad para absorber picos sin fallar
    const newItem = this.factoryMethod();
    this.pool.push(newItem);
    return newItem;
  }

  forEachActive(callback) {
    for (let i = 0; i < this.pool.length; i++) {
      if (this.pool[i].active) {
        callback(this.pool[i], i);
      }
    }
  }

  getActiveItems() {
    return this.pool.filter(item => item.active);
  }

  reset() {
    for (let i = 0; i < this.pool.length; i++) {
      this.pool[i].active = false;
    }
  }
}