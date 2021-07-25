import { api, CLIENT_EVENT, SERVER_EVENT } from "../lib/api.js";
import { controlling, CONTROLLING_EVENT } from "../lib/controlling.js";
import { GAME_EVENT, Game } from "../lib/game.js";
import { Player } from "../lib/player.js";
import { spa } from "../lib/spa.js";
import { store, STORE_KEY } from "../lib/store.js";
import AbstractView from "../lib/view.js";
import template from "./game.html";
import { audioPlayer } from "../lib/audio-player.js";

export default class extends AbstractView {
  player = null;
  game = null;
  constructor(params) {
    super(params);

    this.setTitle("Game");
  }

  async getHtml() {
    return template;
  }

  onInit() {
    const canvas = document.getElementById("gameborad");
    canvas.setAttribute("tabindex", "0");
    canvas.focus();
    const context = canvas.getContext("2d");

    this.createPlayer();

    const playerEl = document.getElementById("player");
    playerEl.innerHTML = store.get(STORE_KEY.PLAYER_NAME);

    const gameId = this.params.id || store.get(STORE_KEY.GAME_ID) || "";
    const gameDifficulty = this.params.difficulty;
    if (gameId) {
      this.gameInit(canvas, context, gameId);
      this.joinGame(this.player);
    } else {
      api.subscribe(SERVER_EVENT.GAME_INIT, (gameId) => {
        this.gameInit(canvas, context, gameId);
        this.joinGame(this.player);
      });
      api.send(CLIENT_EVENT.CREATE_GAME, { difficulty: gameDifficulty });
    }

    const respawnBtn = document.getElementById("respawn");
    respawnBtn.addEventListener("click", (e) => {
      this.game.respawn(this.player);
    });
  }

  gameInit(canvas, context, gameId) {
    this.game = new Game(gameId, canvas, context);

    this.game.on(GAME_EVENT.TICK, (score) => this.updateScore(score));
    this.game.on(GAME_EVENT.DEAD, () => this.onPlayerDead());
    this.game.on(GAME_EVENT.RESPAWN, () => this.onPlayerRespawn());
    this.game.on(GAME_EVENT.END, (state) => this.onGameEnd(state));
    this.game.on(GAME_EVENT.NO_GAME, (stte) => this.onNoGame());

    controlling.on(CONTROLLING_EVENT.KEY_DOWN, (e) => {
      if (e.keyCode === 32) {
        this.game.togglePause();
      } else {
        this.game.controlling(e);
      }
    });

    audioPlayer.play(0);
  }

  createPlayer() {
    const playerId = store.get(STORE_KEY.PLAYER_ID);
    const playerName = store.get(STORE_KEY.PLAYER_NAME);
    this.player = new Player(playerId, playerName);
    this.player.init(false, true);
  }

  joinGame(player) {
    this.game.join(player);
  }

  updateScore(score) {
    const scoreElement = document.getElementById("score");
    scoreElement.innerHTML = score;
  }

  onPlayerDead() {
    const respawnBtn = document.getElementById("respawn");
    respawnBtn.classList.toggle("active", true);
  }

  onPlayerRespawn() {
    const respawnBtn = document.getElementById("respawn");
    respawnBtn.classList.toggle("active", false);
  }

  onGameEnd(state) {
    audioPlayer.stop();
    controlling.off(CONTROLLING_EVENT.KEY_DOWN);
    api.unsubscribe(SERVER_EVENT.GAME_INIT);

    const popupEL = document.getElementById("notification-popup");
    popupEL.classList.toggle("active", true);

    const winnerNameEL = document.getElementById("winner-name");
    winnerNameEL.innerHTML = state.winnerName;
    const winnerScoreEl = document.getElementById("winner-score");
    winnerScoreEl.innerHTML = state.winnerScore;

    const backBtn = document.getElementById("notification-popup-back");
    backBtn.addEventListener("click", (e) => {
      // TODO: shopuld clear game instane?
      spa.navigateTo("/#");
    });
  }

  onNoGame() {
    controlling.off(CONTROLLING_EVENT.KEY_DOWN);
    api.unsubscribe(SERVER_EVENT.GAME_INIT);
    const popupEL = document.getElementById("notification-popup");
    popupEL.classList.toggle("active", true);

    const popupContentEL = document.getElementById("popup-content");
    popupContentEL.innerHTML = "";

    const backBtn = document.getElementById("notification-popup-back");
    backBtn.addEventListener("click", (e) => {
      // TODO: shopuld clear game instane?
      spa.navigateTo("/#");
    });
  }
}
