
import io from 'socket.io-client'
import { store } from "./store.js";


export const CLIENT_EVENT = {
  GAME_LIST: "gamelist",
  CREATE_GAME: "creategame",
  JOIN_GAME: "joingame",
  GAME_TURN: "gameturn",
  PLAYER_PAUSE: "playerpause",
  PLAYER_RESPAWN: "playerrespawn",
  PREVIOUSE_CONNECTION: "previouseConnection",
};

export const SERVER_EVENT = {
  GAME_LIST: "gamelist",
  GAME_INIT: "gameinit",
  GAME_END: "gameend",
  GAME_TICK: "gametick",
  GAME_JOIN: "gamejoin",
  PLAYER_PAUSE: "playerpause",
  PLAYER_RESPAWN: "playerrespawn",
  PREVIOUSE_GAME: "previousegame",
};

class API {
  socket = null;
  url = IS_DEVELOPMENT
    ? "http://127.0.0.1:3000/"
    : "https://snake-api-1.herokuapp.com/";

  createConnection() {
    return new Promise((res, rej) => {
      const previouseConnection = localStorage.getItem("socketId");
      this.socket = io(this.url, {
        query: {
          previouseConnection: previouseConnection || "",
        },
      });
      this.socket.on("connect", () => {
        localStorage.setItem("socketId", this.socket.id);
        store.setUser(this.socket.id);
        if (previouseConnection) {
          store.set('previouseConnection', previouseConnection);
        }
        res(previouseConnection);
      });
    });
  }

  subscribe(event, listener) {
    this.socket.on(event, (data) => {
      listener(data);
    });
  }
  unsubscribe(event) {
    this.socket.removeAllListeners(event);
  }

  send(clientEvent, params = {}) {
    this.socket.emit(clientEvent, params);
  }
}

export let api = new API();
