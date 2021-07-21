import { api, CLIENT_EVENT } from "../lib/api.js";
import { GAME_EVENT, Game } from "../lib/game.js";
import { Player } from "../lib/player.js";
import { spa } from "../lib/spa.js";
import { store } from "../lib/store.js";
import AbstractView from "../lib/view.js";

export default class extends AbstractView {
  player = null;
  game = null;
  constructor(params) {
    super(params);

    this.setTitle("Game");
  }

  async getHtml() {
    return `
      <div id="game">
        <div id="header">
          <span><span class="header-title">Player: </span><span id="player" class="header-value"></span></span>
          <span><span class="header-title">Score: </span><span id="score" class="header-value"></span></span>
        </div>
        <canvas id="gameborad" width="400" height="400"></canvas>
        <div id="menu">
          <span id="pause" class="menu-button">Pause</span>
          <span id="respawn" class="menu-button">Respawn</span>
          <!-- <span id="addai" class="menu-button">Add AI</span> -->
        </div>
      </div>

      <div id="end-game-notification-popup" class="popup">
        <div id="end-game-notification-conatainer" class="popup-container">
          <span class="popup-title">Game is over!</span>
          <div class="popup-content">
            <span class="popup-caption">Winner</span><span id="winner-name" class="winner-text"></span>
            <span class="popup-caption">Score</span><span id="winner-score" class="winner-text"></span>
          </div>
          <div class="popup-bottom">
            <span id="end-game-notification-popup-back" class="popup-button">Back</span>
          </div>
        </div>
      </div>`;
  }

  onInit() {
    const canvas = document.getElementById("gameborad");
    canvas.setAttribute("tabindex", "0");
    canvas.focus();
    const context = canvas.getContext("2d");
    
    this.gameInit(canvas, context);
    this.createPlayer();

    const previouseConnection = store.get("previouseConnection");
    if (previouseConnection) {
      api.send(CLIENT_EVENT.PREVIOUSE_CONNECTION, {
        clientId: previouseConnection,
        cb: (isPreviouseGame) => {
          if (isPreviouseGame) {

          } else {
            this.joinGame(this.player);
          }
        },
      });
    } else {
      
    }

    const playerEl = document.getElementById("player");
    playerEl.innerHTML = this.player.id;

    const pausetBtn = document.getElementById("pause");
    pausetBtn.addEventListener("click", (e) => {
      this.game.togglePause();
    });

    const respawnBtn = document.getElementById("respawn");
    respawnBtn.addEventListener("click", (e) => {
      this.game.respawn(this.player);
    });
  }

  gameInit(canvas, context) {
    this.game = new Game(this.params.id, canvas, context);

    this.game.on(GAME_EVENT.TICK, (score) => this.updateScore(score));
    this.game.on(GAME_EVENT.DEAD, () => this.onPlayerDead());
    this.game.on(GAME_EVENT.RESPAWN, () => this.onPlayerRespawn());
    this.game.on(GAME_EVENT.END, (state) => this.onGameEnd(state));

    document.addEventListener("keydown", (e) => {
      this.game.controlling(e);
    });
  }

  createPlayer() {
    this.player = new Player(store.user.id);
    this.player.init(false, true, "green");
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

    const pausetBtn = document.getElementById("pause");
    pausetBtn.classList.toggle("active", false);
  }

  onPlayerRespawn() {
    const respawnBtn = document.getElementById("respawn");
    respawnBtn.classList.toggle("active", false);

    const pausetBtn = document.getElementById("pause");
    pausetBtn.classList.toggle("active", true);
  }

  onGameEnd(state) {
    const popupEL = document.getElementById("end-game-notification-popup");
    popupEL.classList.toggle("active", true);

    const winnerNameEL = document.getElementById("winner-name");
    winnerNameEL.innerHTML = state.winnerName;
    const winnerScoreEl = document.getElementById("winner-score");
    winnerScoreEl.innerHTML = state.winnerScore;

    const backBtn = document.getElementById("end-game-notification-popup-back");
    backBtn.addEventListener("click", (e) => {
      // TODO: shopuld clear game instane?
      spa.navigateTo("/");
    });
  }
}
