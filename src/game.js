import {Snake} from './snake.js';
import {Food} from './food.js';

export class Game {
  canvas = null;
  context = null;

  mode = 'hard';
  tickCount = 0;
  step = 16;

  snake = null;
  food = null;

  constructor(
    canvas,
    context,
    onScoreUpdate,
  ) {
    this.canvas = canvas;
    this.context = context;

    this.onScoreUpdate = onScoreUpdate;
  }

  start() {
    this.snake = new Snake();
    this.food = new Food();

    const snakeCoordinates = this.generateCoordinates();
    const foodCoordinates = this.generateCoordinates();

    this.snake.init(snakeCoordinates.x, snakeCoordinates.y, this.step, 0);
    this.food.init(foodCoordinates.x, foodCoordinates.y);

    requestAnimationFrame(() => this.gameTick());
  }

  controlling(event) {
    const keyPressed = event.keyCode;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (keyPressed === LEFT_KEY && this.snake.isVerticalDirection()) {
      return this.snake.setDirection(-this.step, 0);
    }

    if (keyPressed === RIGHT_KEY && this.snake.isVerticalDirection()) {
      return this.snake.setDirection(this.step, 0);
    }

    if (keyPressed === UP_KEY && this.snake.isHorizontalDirection()) {
      return this.snake.setDirection(0, -this.step);
    }

    if (keyPressed === DOWN_KEY && this.snake.isHorizontalDirection()) {
      return this.snake.setDirection(0, this.step);
    }
  }
  
  gameTick() {
    requestAnimationFrame(() => this.gameTick());
  
    // slow game loop to 15 fps instead of 60 (60/15 = 4)
    if (++this.tickCount < 4) {
      return;
    }

    this.tickCount = 0;

    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);

    this.snake.move();

    this.draw();

    this.checkSnakeMove();
  }

  draw() {
    this.drawSnake();
    this.drawFood();
  }

  drawSnake() {
    this.context.fillStyle = 'green';
    this.snake.body.forEach((part) => {
      this.context.fillRect(part.x, part.y, this.step-1, this.step-1);  
    });
  }

  drawFood() {
    this.context.fillStyle = 'red';
    this.context.fillRect(this.food.x, this.food.y, this.step-1, this.step-1);
  }

  checkSnakeMove() {
    const {x, y} = this.snake.getHead();

    if (x < 0 || x >= this.canvas.width) {
      return this.restart();
    }

    if (y < 0 || y >= this.canvas.height) {
      return this.restart();
    }

    // todo: check selfcollision

    if (this.snake.getPosition() === this.food.getPosition()) {
      this.snake.grow();
      const {x, y} = this.generateCoordinates();
      this.food.respawn(x, y);

      this.updateScore(this.snake.getLength());
    }
  }

  restart() {
    const snakeCoordinates = this.generateCoordinates();
    const foodCoordinates = this.generateCoordinates();

    this.updateScore(0);

    this.snake.init(snakeCoordinates.x, snakeCoordinates.y, this.step, 0);
    this.food.init(foodCoordinates.x, foodCoordinates.y);
  }

  generateCoordinates() {
    while (true) {
      const x = Math.floor(Math.random() * (this.canvas.width / this.step)) * this.step;
      const y = Math.floor(Math.random() * (this.canvas.height / this.step)) * this.step;

      return {x, y};
    }
  }

  updateScore(score) {
    this.onScoreUpdate(score);
  }
} 