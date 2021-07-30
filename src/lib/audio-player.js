import bgSound from "../sounds/bg_music.mp3";
import eatSound from "../sounds/eat.mp3";
import dieSound from "../sounds/die.wav";

export const SOUND = {
  BG: 0,
  EAT: 1,
  DIE: 2,
}
class AudioPlayer {
  sounds = [];
  player = null;
  constructor() {
    const bgAudio = new Audio(bgSound);
    bgAudio.loop = true;
    const eatAudio = new Audio(eatSound);
    const dieAudio = new Audio(dieSound);
    this.sounds[SOUND.BG] = bgAudio;
    this.sounds[SOUND.EAT] = eatAudio;
    this.sounds[SOUND.DIE] = dieAudio;
  }

  add(sound, id) {
    const audio = new Audio(sound);
    this.sounds.push(audio);
  }

  play(id) {
    this.sounds[id].currentTime = 0;
    this.sounds[id].play();
  }

  stop(id) {
    this.sounds[id].pause();
  }
}

export let audioPlayer = new AudioPlayer();
