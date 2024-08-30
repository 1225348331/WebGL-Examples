import { Track } from "./Track";

/** 合成对象 */
export class Compose {
  parent: null | Compose;
  children: (Compose | Track)[];

  constructor() {
    this.parent = null;
    this.children = [];
  }

  add(target: Compose | Track) {
    target.parent = this;
    this.children.push(target);
  }

  update(time: Date) {
    this.children.forEach((item) => {
      item.update(time);
    });
  }
}
