import { api, CLIENT_EVENT, SERVER_EVENT } from "./api.js";
import { audioPlayer } from "./audio-player.js";
import { store, STORE_KEY } from "./store.js";

export const GAME_EVENT = {
  END: 0,
  RESTART: 1,
  JOIN: 2,
  JOIN_AI: 3,
  TICK: 4,
  DEAD: 5,
  RESPAWN: 6,
  NO_GAME: 7,
};

const BG_COLOUR = "#231f20";

export class Game {
  id = null;
  eventListeners = {};
  canvas = null;
  context = null;

  isReady = false;

  constructor(id, canvas, context) {
    this.id = id;
    this.canvas = canvas;
    this.context = context;

    api.subscribe(SERVER_EVENT.GAME_JOIN, (isReady) =>
      this.onPlayerJoin(isReady)
    );
    api.subscribe(SERVER_EVENT.GAME_TICK, (state) => this.tick(state));
    api.subscribe(SERVER_EVENT.GAME_END, (state) => this.onGameEnd(state));
    api.subscribe(SERVER_EVENT.PLAYER_PAUSE, () => this.onPlayerPause());
    api.subscribe(SERVER_EVENT.PLAYER_RESPAWN, () => this.onPlayerRespawn());
    api.subscribe(SERVER_EVENT.NO_GAME, () => this.onNoGame());

    store.set(STORE_KEY.GAME_ID, id);
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

  tick(state) {
    const amIDead = Object.values(state.players).some(
      (player) => player.id === this.player.id && player.isDead
    );
    if (amIDead) {
      this.emit(GAME_EVENT.DEAD);
    }
    requestAnimationFrame(() => this.handleTick(state));
  }

  join(player) {
    if (player.isMe) {
      this.player = player;
    }

    api.send(CLIENT_EVENT.JOIN_GAME, {
      gameId: this.id,
      playerId: player.id,
      playerName: player.name,
      prevPlayerId: store.get("previouseSocketId") || "",
    });

    player.isAI ? this.emit(GAME_EVENT.JOIN_AI) : this.emit(GAME_EVENT.JOIN);
  }

  respawn(player) {
    api.send(CLIENT_EVENT.PLAYER_RESPAWN, {
      gameId: this.id,
      playerId: player.id,
    });
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

  handleTick(state) {
    this.sound(state);
    this.draw(state);
  }

  sound(state) {
    // sounds
    if (state.grownNow.includes(this.player.id)) {
      audioPlayer.play(1);
    }

    if (state.diedNow.includes(this.player.id)) {
      audioPlayer.play(2);
    }
  }

  draw(state) {
    const gridSize = state.gridSize;
    const size = this.canvas.width / gridSize;

    this.context.fillStyle = BG_COLOUR;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawSnakes(state.players, size);
    this.drawFood(state.food, size);
    if (state.difficulty >= 2) {
      this.drawRocks(state.rocks, size);
    }

    this.emit(GAME_EVENT.TICK, this.getPlayerScore(state));
  }

  drawFood(food, size) {
    this.context.fillStyle = food.color;
    this.context.fillRect(food.x * size, food.y * size, size - 1, size - 1);
  }

  drawRocks(rocks, size) {
    this.context.fillStyle = rocks[0].color;
    rocks.forEach((rock) => {
      this.context.fillRect(rock.x * size, rock.y * size, size - 1, size - 1);
    });
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

  getPlayerScore(state) {
    return state.players[this.player.id]?.score || 0;
  }

  onPlayerJoin(isReady) {
    this.isReady = isReady;
  }

  onPlayerPause() {
    this.isReady = !this.isReady;
  }

  onPlayerRespawn() {
    this.isReady = true;
    this.emit(GAME_EVENT.RESPAWN);
  }

  onGameEnd(state) {
    api.unsubscribe(SERVER_EVENT.GAME_JOIN);
    api.unsubscribe(SERVER_EVENT.GAME_TICK);
    api.unsubscribe(SERVER_EVENT.GAME_END);
    api.unsubscribe(SERVER_EVENT.PLAYER_PAUSE);
    api.unsubscribe(SERVER_EVENT.PLAYER_RESPAWN);
    api.unsubscribe(SERVER_EVENT.NO_GAME);

    store.set(STORE_KEY.GAME_ID, "");
    this.emit(GAME_EVENT.END, state);
  }

  onNoGame() {
    api.unsubscribe(SERVER_EVENT.GAME_JOIN);
    api.unsubscribe(SERVER_EVENT.GAME_TICK);
    api.unsubscribe(SERVER_EVENT.GAME_END);
    api.unsubscribe(SERVER_EVENT.PLAYER_PAUSE);
    api.unsubscribe(SERVER_EVENT.PLAYER_RESPAWN);
    api.unsubscribe(SERVER_EVENT.NO_GAME);

    store.set(STORE_KEY.GAME_ID, "");
    this.emit(GAME_EVENT.NO_GAME);
  }
}
