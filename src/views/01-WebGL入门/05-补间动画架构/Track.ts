import { Compose } from "./Compose";

/** 时间轨 */
export class Track {
  parent?: Compose;
  /** 时间轨上的目标对象 */
  target: any;
  /** 开始时间 */
  start: Date = new Date();
  /** 时间长度 */
  timeLen = 2000;
  /** 是否循环 */
  loop = true;
  /** 关键帧合集 */
  keyMap = new Map<string, number[][]>(); // [[时间1,属性]，[时间2,属性],[时间2,属性]]

  constructor(target: any) {
    this.target = target;
  }
  /** 更新目标状态 */
  update(currentTime: Date) {
    const { target, start, timeLen, loop, keyMap } = this;
    let time = currentTime.getTime() - start.getTime();
    if (loop) {
      time = time % timeLen;
    }
    for (const [key, value] of keyMap.entries()) {
      const last = value.length - 1;
      let startTime = value[0][0];
      let endTime = value[last][0];
      if (time < startTime) {
        target[key] = value[0][1];
      } else if (time > endTime) {
        target[key] = value[last][1];
      } else {
        target[key] = this.getInterpolation(time, value);
      }
    }
  }

  /** 补间插值计算 */
  getInterpolation(time: number, value: number[][]) {
    const last = value.length;
    for (let i = 0; i < last - 1; i++) {
      const indexTime = value[i][0];
      const indexValue = value[i][1];
      const nextTime = value[i + 1][0];
      const nextValue = value[i + 1][1];
      if (time > indexTime && time < nextTime) {
        return ((time - indexTime) / (nextTime - indexTime)) * (nextValue - indexValue) + indexValue;
      }
    }
  }
}
