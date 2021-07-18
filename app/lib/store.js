class Store {
  user = null;

  setUser(id) {
    this.user = { id };
  }
}

export let store = new Store();