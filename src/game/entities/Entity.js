export class Entity {
  constructor(x = 0, y = 0, width = 20, height = 20, color = '#ffffff') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.active = true;
  }

  update(/* dt */) {
    // Implementado por subclases
  }

  draw(/* ctx */) {
    // Implementado por subclases
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}

