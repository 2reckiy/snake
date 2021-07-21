import Game from '../game/game.js';
import Dashboard from '../dashboard/dashboard.js';

class SPA {
  pathToRegex = (path) =>
    new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
  getParams = (match) => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
      (result) => result[1]
    );

    return Object.fromEntries(
      keys.map((key, i) => {
        return [key, values[i]];
      })
    );
  };
  navigateTo = (url) => {
    history.pushState(null, null, url);
    this.router();
  };
  router = async () => {
    const routes = [
      { path: "/", view: Dashboard },
      { path: "/game/:id", view: Game },
    ];

    // Test each route for potential match
    const potentialMatches = routes.map((route) => {
      return {
        route: route,
        result: location.pathname.match(this.pathToRegex(route.path)),
      };
    });

    let match = potentialMatches.find(
      (potentialMatch) => potentialMatch.result !== null
    );

    if (!match) {
      match = {
        route: routes[0],
        result: [location.pathname],
      };
    }

    const view = new match.route.view(this.getParams(match));

    document.querySelector("#app").innerHTML = await view.getHtml();

    view.onInit();
  };
}

export let spa = new SPA();