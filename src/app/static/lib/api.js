export const CLIENT_EVENT = {
  CREATE_GAME: 'creategame',
  JOIN_GAME: 'joingame',
  GAME_TURN: 'gameturn',
  PLAYER_PAUSE: 'playerpause',
}

export const SERVER_EVENT = {
  GAME_LIST: 'gamelist',
  GAME_INIT: 'gameinit',
  GAME_END: 'gameend',
  GAME_TICK: 'gametick',
  GAME_JOINED: 'gamejoined',
  PLAYER_PAUSED: 'playerpaused',
}

class API {
  socket = null;
  url = 'https://snake-api-1.herokuapp.com/';

  createConnection() {
    this.socket = io(this.url);
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