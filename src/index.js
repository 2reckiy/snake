import "./style.css";
import { spa } from "./lib/spa.js";
import { api } from "./lib/api.js";

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("hashchange", () => {
    spa.router(window.location.hash);
  });
  api.createConnection().then(() => spa.router(window.location.hash));
});