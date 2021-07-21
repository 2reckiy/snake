export class AI {
  snake = null;
  limitX = null;
  limitY = null;
  step = null;

  constructor() {
  }

  init(snake, step, limitX, limitY) {
    this.snake = snake;
    this.limitX = limitX;
    this.limitY = limitY;
    this.step = step;
  }

  turn() {
    const {x, y} = this.snake.getHead();
    const direction = this.snake.getDirection();
    const isAvaialableR = x + this.step < this.limitX;
    const isAvaialableL = x - this.step > 0;
    const isAvaialableT = y - this.step > 0;
    const isAvaialableB = y + this.step < this.limitY;

    switch (direction) {
      case 'R':
        if(isAvaialableR) {
          return;
        }

        if(isAvaialableT) {
          this.snake.setDirection(0, -this.step);
        } else {
          this.snake.setDirection(0, this.step);
        }
      break;
      case 'L':
        if(isAvaialableL) {
          return;
        }

        if(isAvaialableT) {
          this.snake.setDirection(0, -this.step);
        } else {
          this.snake.setDirection(0, this.step);
        }
      break;
      case 'T':
        if(isAvaialableT) {
          return;
        }

        if(isAvaialableR) {
          this.snake.setDirection(this.step, 0);
        } else {
          this.snake.setDirection(-this.step, 0);
        }
      break;
      case 'B':
        if(isAvaialableB) {
          return;
        }

        if(isAvaialableR) {
          this.snake.setDirection(this.step, 0);
        } else {
          this.snake.setDirection(-this.step, 0);
        }
      break;
    }
  }

  reset() {
    this.snake = null;
  }
}