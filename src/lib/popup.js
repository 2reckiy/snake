import popupTemplate from "../popup.html";

export class Popup {
  constructor(content, params) {
    const popupEl = document.getElementById("popup");
    popupEl.innerHTML = popupTemplate;

    if (params.title) {
      const title = document.getElementById("popup-title");
      title.innerHTML = params.title;
    }

    const contentEl = document.getElementById("popup-content");
    contentEl.innerHTML = params.variables
      ? this.parameterize(content, params.variables)
      : content;

    if (params.buttons) {
      const buttons = document.getElementById("popup-buttons");
      params.buttons.forEach((button) => {
        const buttonEl = document.createElement("span");
        buttonEl.className = "popup-button";
        buttonEl.innerHTML = button.title;
        buttonEl.onclick = button.isClose
          ? this.close
          : this.buttonClick.bind(this, button.listener);

        buttons.appendChild(buttonEl);
      });
    }
  }

  parameterize(content, variables) {
    const matches = content.match(/{{.*?}}/gi) || [];

    return matches.reduce((result, variable) => {
      const key = variable.substring(2, variable.length - 2);
      return result.replace(variable, variables[key] || "");
    }, content);
  }

  buttonClick(listener) {
    listener?.();

    this.close();
  }

  close() {
    const popupEl = document.getElementById("popup");
    popupEl.innerHTML = "";
  }
}
