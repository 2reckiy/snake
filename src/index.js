import "./style.css";
import { spa } from "./lib/spa.js";
import { api } from "./lib/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  window.addEventListener("hashchange", () => {
    spa.router(window.location.hash);
  });
  const playerName = await api.createConnection();

  // TODO: api subscribe on events that need to be listen continuously (connect/disconnect players)

  if (!playerName) {
    spa.navigateTo('#/login');
  } else {
    spa.router(window.location.hash);
  }
});