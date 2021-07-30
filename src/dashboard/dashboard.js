import AbstractView from "../lib/view.js";
import { spa } from "../lib/spa.js";
import { SERVER_EVENT, api, CLIENT_EVENT } from "../lib/api.js";
import { store, STORE_KEY } from "../lib/store.js";
import { Popup } from "../lib/popup.js";
import template from "./dashboard.html";
import createGamePopup from "./create-game-popup.html";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Dashboard");
  }

  async getHtml() {
    return template;
  }

  onInit() {
    api.subscribe(SERVER_EVENT.GAME_LIST, (games) => this.gameList(games));
    const playerName = store.get(STORE_KEY.PLAYER_NAME);
    const greetingsEl = document.getElementById("greetings");
    greetingsEl.innerHTML = `Hello, ${playerName}`;

    api.send(CLIENT_EVENT.GAME_LIST);
  }

  gameList(games) {
    const gameList = document.getElementById("game-list");
    gameList.innerHTML = "";

    const newGameEl = this.createGamePreview();
    gameList.appendChild(newGameEl);

    games.forEach((gameId, i) => {
      const gameEl = this.createGamePreview(gameId);
      gameList.appendChild(gameEl);
    });
  }

  createGamePreview(gameId) {
    const previewEl = document.createElement("div");
    const previewTitleEl = document.createElement("span");

    previewTitleEl.innerHTML = gameId ? "Join Game" : "New Game";
    previewEl.className = "game-preview";
    previewEl.appendChild(previewTitleEl);
    previewEl.onclick = () => {
      if (gameId) {
        this.navigateToGame(gameId);
      } else {
        const popup = new Popup(createGamePopup, {
          title: 'Game Settings',
          buttons: [
            {
              title: 'Back',
              isClose: true,
            },
            {
              title: 'Start',
              listener: () => {
                const radios = document.getElementsByName("difficulty-option");
  
                let difficulty = 0;
                for (var i = 0, length = radios.length; i < length; i++) {
                  if (radios[i].checked) {
                    difficulty = radios[i].value;
                    break;
                  }
                }
        
                this.navigateToGame(gameId, { difficulty });
              }
            }
          ],
        });

        // const snakeExamples = document.getElementsByClassName("snake-body-example");
        // for (var i = 0, length = snakeExamples.length; i < length; i++) {
        //   snakeExamples[i].style.background = 
        // }
      }
    };
    return previewEl;
  }

  navigateToGame(gameId, params) {
    api.unsubscribe(SERVER_EVENT.GAME_LIST);
    gameId
      ? spa.navigateTo(`#/game/${gameId}`, params)
      : spa.navigateTo(`#/game`, params);
  }
}
