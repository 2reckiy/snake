import "./style.css";
import { spa } from "./lib/spa.js";
import { api } from "./lib/api.js";

window.addEventListener("popstate", spa.router);
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      spa.navigateTo(e.target.href);
    }
  });

  api.createConnection().then((previouseConnection) => spa.router());
});
