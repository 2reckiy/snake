import { spa } from "../lib/spa.js";
import { store, STORE_KEY } from "../lib/store.js";
import AbstractView from "../lib/view.js";
import template from "./login.html";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Log in");
  }

  async getHtml() {
    return template;
  }

  onInit() {
    const login = document.getElementById('login-input');
    const submit = document.getElementById('login-submit');

    submit.onclick = () => {
      if (login.value !== '') {
        store.set(STORE_KEY.PLAYER_NAME, login.value);
        spa.navigateTo('#/dashboard');
      }
    }
  }
}
