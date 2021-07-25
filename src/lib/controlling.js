export const CONTROLLING_EVENT = {
  KEY_DOWN: 'keydown'
}

class Controlling {
  eventListeners = {};

  constructor() {
    document.addEventListener(CONTROLLING_EVENT.KEY_DOWN, (e) => {
      this.emit(CONTROLLING_EVENT.KEY_DOWN, e);
    });
  }

  on(event, listener) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }

    this.eventListeners[event].push(listener);
  }

  off(event) {
    this.eventListeners[event] = [];
  }

  emit(event, params) {
    if (!this.eventListeners[event]) {
      return;
    }

    this.eventListeners[event].forEach((listener) => listener(params));
  }
}

export let controlling = new Controlling();