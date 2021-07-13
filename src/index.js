import { Game } from './game.js';

// Attach an event, and call resetLoginForm when the document is done loading.
document.addEventListener("DOMContentLoaded", init);

function init() {
  const canvas = document.getElementById('gameborad');
  canvas.setAttribute('tabindex','0');
  canvas.focus();
  const context = canvas.getContext('2d');

  const game = new Game(
    canvas,
    context,
    onScoreUpdate
  );

  document.addEventListener('keydown', (e) => {
    console.log(e);
    game.controlling(e);
  });

  game.start();
}

function onScoreUpdate(score) {
  const scoreElement = document.getElementById('score');
  scoreElement.innerHTML = score;
}