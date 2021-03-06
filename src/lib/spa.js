import Game from "../game/game.js";
import Dashboard from "../dashboard/dashboard.js";
import Login from "../login/login.js";

class SPA {
  constructor() {}
  async router(hash, params) {
    this.routes = [
      { path: "/", view: Dashboard },
      { path: "/login", view: Login },
      { path: "/game", view: Game },
      { path: "/game/:id", view: Game },
    ];
    const route = hash.substr(1);
    let content = document.getElementById("app-content");

    const potentialMatches = this.routes.map((r) => {
      return {
        route: r,
        result: route.match(this.pathToRegex(r.path)),
      };
    });

    let match = potentialMatches.find(
      (potentialMatch) => potentialMatch.result !== null
    );

    if (!match) {
      match = {
        route: this.routes[0],
        result: [location.hash],
      };
    }

    const view = new match.route.view({ ...this.getParams(match), ...params });

    content.innerHTML = await view.getHtml();

    view.onInit();
  }

  navigateTo = (hash, params) => {
    history.pushState(null, null, hash);
    this.router(hash, params);
  };

  pathToRegex(path) {
    return new RegExp(
      "^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$"
    );
  }

  getParams(match) {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
      (result) => result[1]
    );

    return Object.fromEntries(
      keys.map((key, i) => {
        return [key, values[i]];
      })
    );
  }
}

export let spa = new SPA();
