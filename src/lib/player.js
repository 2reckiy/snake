import { genereateId } from "./utils.js";

export class Player {
  id = null;
  name = null;
  isAI = false;
  isMe = false;

  constructor(id, name) {
    this.id = id || genereateId();
    this.name = name;
  }

  init(isAI, isMe) {
    this.isAI = isAI;
    this.isMe = isMe;
  }
}