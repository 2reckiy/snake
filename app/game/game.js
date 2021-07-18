import { GAME_EVENT, Game } from "../lib/game.js";
import { Player } from "../lib/player.js";
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
      <!-- <span id="addai" class="menu-button">Add AI</span> -->
      <!-- <span id="restart" class="menu-button">Restart</span> -->
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

    // const restartBtn = document.getElementById("restart");
    // restartBtn.addEventListener("click", (e) => {
    //   const player = new Player();
    //   player.init(false, true, "green");
    //   this.game.restart(player);
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
    this.game.on(GAME_EVENT.END, () => {
      restartBtn.classList.toggle("active");
    });

    const playerEl = document.getElementById("player");
    playerEl.innerHTML = this.player.id;

    const pausetBtn = document.getElementById("pause");
    pausetBtn.addEventListener("click", (e) => {
      this.game.togglePause();
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
}
