import { genereateId } from "./utils.js";

export class Player {
  id = null;
  color = null;
  isAI = false;
  isMe = false;

  constructor(id) {
    this.id = id || genereateId();
  }

  init(isAI, isMe, color) {
    this.isAI = isAI;
    this.isMe = isMe;
    this.color = color;
  }
}