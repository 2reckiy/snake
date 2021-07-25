export const STORE_KEY = {
  PLAYER_ID: 'playerId',
  PLAYER_NAME: 'playerName',
  GAME_ID: 'gameId',
}
class Store {
  set(key, value) {
    localStorage.setItem(key, value);
  }

  get(key) {
    return localStorage.getItem(key);
  }
}

export let store = new Store();