export class Food {
  x = null;
  y = null;

  constructor() {

  }

  init(x, y) {
    this.x = x;
    this.y = y;
  }

  respawn(x, y) {
    this.x = x;
    this.y = y;
  }

  getPosition() {
    return `x:${this.x}y:${this.y}`;
  }
}