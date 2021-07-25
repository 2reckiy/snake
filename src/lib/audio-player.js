import bgSound from "../sounds/bg_music.mp3";
import eatSound from "../sounds/eat.mp3";
import dieSound from "../sounds/die.wav";

class AudioPlayer {
  sounds = [];
  player = null;
  constructor() {
    const bgAudio = new Audio(bgSound);
    const eatAudio = new Audio(eatSound);
    const dieAudio = new Audio(dieSound);
    this.sounds.push(bgAudio, eatAudio, dieAudio);
  }

  add(sound, id) {
    const audio = new Audio(sound);
    this.sounds.push(audio);
  }

  play(id) {
    this.sounds[id].currentTime = 0;
    this.sounds[id].play();
  }

  stop() {
    this.sounds[0].pause();
  }
}

export let audioPlayer = new AudioPlayer();
