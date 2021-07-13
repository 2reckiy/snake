export class Snake {
  x = null;
  y = null;
  dx = null;
  dy = null;
  direction = null;
  body = [];

  constructor() {
  }

  init(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx || 0;
    this.dy = this.dx ? 0 : dy;
    this.body = [{x, y}];

    this.setDirection(this.dx, this.dy);
  }

  move() {
    this.x = this.x + this.dx;
    this.y = this.y + this.dy;

    this.body.unshift({x: this.x, y: this.y});
    this.body.pop();
  }

  grow() {
    this.body.unshift({x: this.x, y: this.y});
  }

  isVerticalDirection() {
    return ['T', 'B'].includes(this.direction);
  }

  isHorizontalDirection() {
    return ['L', 'R'].includes(this.direction);
  }

  setDirection(dx, dy) {
    this.dx = dx;
    this.dy = dy;

    if (dx > 0) {
      this.direction = 'R';
    }

    if (dx < 0) {
      this.direction = 'L';
    }

    if (dy > 0) {
      this.direction = 'B';
    }

    if (dy < 0) {
      this.direction = 'T';
    }
  }

  getHead() {
    return {x: this.x, y: this.y};
  }

  getPosition() {
    return `x:${this.x}y:${this.y}`;
  }

  getLength() {
    return this.body.length - 1;
  }
}