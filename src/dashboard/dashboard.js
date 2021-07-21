import AbstractView from "../lib/view.js";
import { spa } from "../lib/spa.js";
import { SERVER_EVENT, api, CLIENT_EVENT } from "../lib/api.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Dashboard");
  }

  async getHtml() {
    return `
      <div id="dashboard">
        <div id="list-container">
          <div id="game-list-container">
            <div id="game-list-menu">
              <span id="no-game-title">No active Games for now...</span>
              <span id="create-game" class="menu-button">Create Game</span>
            </div>
            <div id="game-list"></div>
          </div>
          <div id="player-list"><span>Player1</span></div>
        </div>
        <div id="menu"></div>
      </div>`;
  }

  onInit() {
    api.subscribe(SERVER_EVENT.GAME_LIST, (games) => this.gameList(games));
    api.subscribe(SERVER_EVENT.GAME_INIT, (gameId) => this.gameInit(gameId));

    const createGameBtn = document.getElementById("create-game");
    createGameBtn.addEventListener("click", () =>
      api.send(CLIENT_EVENT.CREATE_GAME)
    );

    api.send(CLIENT_EVENT.GAME_LIST);
  }

  gameList(games) {
    const noGameTitle = document.getElementById("no-game-title");
    const gameList = document.getElementById("game-list");

    gameList.innerHTML = "";
    noGameTitle.classList.toggle("show", !games.length);

    games.forEach((game, i) => {
      const btn = document.createElement("div");
      btn.id = "current-game";
      btn.className = "menu-button";
      btn.innerHTML = `Game ${i}`;
      btn.onclick = () => {
        api.unsubscribe(SERVER_EVENT.GAME_LIST);
        api.unsubscribe(SERVER_EVENT.GAME_INIT);
        spa.navigateTo(`/game/${game}`);
      };
      gameList.appendChild(btn);
    });
  }

  gameInit(gameId) {
    api.unsubscribe(SERVER_EVENT.GAME_LIST);
    api.unsubscribe(SERVER_EVENT.CREATE_GAME);
    spa.navigateTo(`/game/${gameId}`);
  }
}