import { api, CLIENT_EVENT, SERVER_EVENT } from "./api.js";

export const GAME_EVENT = {
  END: 0,
  RESTART: 1,
  JOIN: 2,
  JOIN_AI: 3,
  TICK: 4,
};

const BG_COLOUR = "#231f20";

export class Game {
  static GAME_SPEED = 30;

  id = null;
  eventListeners = {};
  canvas = null;
  context = null;

  isReady = false;
  state = null;

  constructor(id, canvas, context) {
    this.id = id;
    this.canvas = canvas;
    this.context = context;

    api.subscribe(SERVER_EVENT.GAME_JOINED, () => this.joined());
    api.subscribe(SERVER_EVENT.GAME_TICK, (state) => this.tick(state));
    api.subscribe(SERVER_EVENT.GAME_END, (playerId) => this.onGameEnd(playerId));
    api.subscribe(SERVER_EVENT.PLAYER_PAUSED, (playerId) => this.onPlayerPaused(playerId));
  }

  on(event, listener) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }

    this.eventListeners[event].push(listener);
  }

  emit(event, params) {
    if (!this.eventListeners[event]) {
      return;
    }

    this.eventListeners[event].forEach((listener) => listener(params));
  }

  join(player) {
    if (player.isMe) {
      this.player = player;
    }

    api.send(CLIENT_EVENT.JOIN_GAME, { gameId: this.id, playerId: player.id });

    player.isAI ? this.emit(GAME_EVENT.JOIN_AI) : this.emit(GAME_EVENT.JOIN);
  }

  joined() {
    this.isReady = true;
  }

  controlling(event) {
    if (!this.isReady) {
      return;
    }
    const keyPressed = event.keyCode;

    api.send(CLIENT_EVENT.GAME_TURN, {
      gameId: this.id,
      playerId: this.player.id,
      directionCode: keyPressed,
    });
  }

  tick(gameState) {
    this.state = gameState;

    requestAnimationFrame(() => this.draw(gameState));
  }

  draw(gameState) {
    const gridSize = gameState.gridSize;
    const size = this.canvas.width / gridSize;

    this.context.fillStyle = BG_COLOUR;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawSnakes(gameState.players, size);
    this.drawFood(gameState.food, size);

    this.emit(GAME_EVENT.TICK, this.getPlayerScore(gameState));
  }

  drawFood(food, size) {
    this.context.fillStyle = "red";
    this.context.fillRect(food.x * size, food.y * size, size - 1, size - 1);
  }

  drawSnakes(players, size) {
    Object.values(players).forEach((player) => {
      const snake = player.snake;
      this.drawSnake(snake, size);
    });
  }

  drawSnake(snake, size) {
    this.context.fillStyle = snake.color;
    snake.body.forEach((part) => {
      this.context.fillRect(part.x * size, part.y * size, size - 1, size - 1);
    });
  }

  togglePause() {
    api.send(CLIENT_EVENT.PLAYER_PAUSE, {
      gameId: this.id,
      playerId: this.player.id,
    });
  }

  getPlayerScore(gameState) {
    return gameState.players[this.player.id]?.score || 0;
  }

  onPlayerPaused() {
    this.isReady = !this.isReady;
  }
}
