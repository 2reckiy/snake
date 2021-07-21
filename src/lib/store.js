class Store {
  user = null;
  store = {};

  set(key, value) {
    this.store[key] = value;
  }

  get(key) {
    return this.store[key];
  }

  setUser(id) {
    this.user = { id };
  }
}

export let store = new Store();