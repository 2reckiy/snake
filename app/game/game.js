import { GAME_EVENT, Game } from "../lib/game.js";
import { Player } from "../lib/player.js";
import { spa } from "../lib/spa.js";
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
          <span id="restart" class="menu-button">Restart</span>
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

    // const addaiBtn = document.getElementById("addai");
    // addaiBtn.addEventListener("click", (e) => {
    //   const player = new Player();
    //   player.init(true, false, "blue");
    //   this.game.join(player);
    // });

    this.gameInit(canvas, context);
    this.createPlayer();
    this.joinGame(this.player);

    this.game.on(GAME_EVENT.TICK, (score) => this.updateScore(score));
    this.game.on(GAME_EVENT.JOIN_AI, () => {
      addaiBtn.classList.toggle("inactive");
    });
    this.game.on(GAME_EVENT.RESTART, () => {
      restartBtn.classList.toggle("active");
    });
    this.game.on(GAME_EVENT.END, (state) => this.onGameEnd(state));

    const playerEl = document.getElementById("player");
    playerEl.innerHTML = this.player.id;

    const pausetBtn = document.getElementById("pause");
    pausetBtn.addEventListener("click", (e) => {
      this.game.togglePause();
    });

    const restartBtn = document.getElementById("restart");
    restartBtn.addEventListener("click", (e) => {
      this.game.join(this.player);
    });
  }

  gameInit(canvas, context) {
    this.game = new Game(this.params.id, canvas, context);

    document.addEventListener("keydown", (e) => {
      this.game.controlling(e);
    });
  }

  createPlayer() {
    this.player = new Player();
    this.player.init(false, true, "green");
  }

  joinGame(player) {
    this.game.join(player);
  }

  updateScore(score) {
    const scoreElement = document.getElementById("score");
    scoreElement.innerHTML = score;
  }

  onGameEnd(state) {
    const popupEL = document.getElementById("end-game-notification-popup");
    popupEL.classList.toggle('active', true);

    const winnerNameEL = document.getElementById("winner-name");
    winnerNameEL.innerHTML = state.winnerName;
    const winnerScoreEl = document.getElementById("winner-score");
    winnerScoreEl.innerHTML = state.winnerScore;

    const backBtn = document.getElementById("end-game-notification-popup-back");
    backBtn.addEventListener("click", (e) => {
      spa.navigateTo('/');
    });
  }
}
