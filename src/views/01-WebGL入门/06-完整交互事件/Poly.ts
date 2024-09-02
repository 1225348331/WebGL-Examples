import * as twgl from "twgl.js";

interface IPoint {
  x: number;
  y: number;
  alpha: number;
}

interface IPoly {
  gl: WebGL2RenderingContext;
  programInfo: twgl.ProgramInfo;
  type: string[];
}

export class Poly {
  vertices: IPoint[] = [];
  bufferInfo?: twgl.BufferInfo;
  gl: WebGL2RenderingContext;
  programInfo: twgl.ProgramInfo;
  type: string[];

  constructor({ gl, programInfo, type }: IPoly) {
    this.gl = gl;
    this.programInfo = programInfo;
    this.type = type;
  }

  init() {}

  // 添加顶点
  addVertices(targetPoint: IPoint) {
    this.vertices.push(targetPoint);
    this.updateBuffer();
  }

  // 删除最后一个顶点
  popVertices() {
    this.vertices.slice(this.vertices.length - 1, this.vertices.length);
    this.updateBuffer();
  }

  // 更新buffer
  updateBuffer() {
    const { gl, programInfo, vertices } = this;
    let attributeObj = {
      a_Position: {
        numComponents: 3,
        data: [],
      },
    };
    vertices.forEach((item) => {
      (attributeObj["a_Position"].data as number[]).push(item.x, item.y, item.alpha);
    });

    this.bufferInfo = twgl.createBufferInfoFromArrays(gl, attributeObj);
    twgl.setBuffersAndAttributes(gl, programInfo, this.bufferInfo);
  }

  // 绘制图形
  draw() {
    const { gl, bufferInfo, type } = this;
    if (!bufferInfo) return;
    this.updateBuffer();
    type.forEach((item) => {
      // @ts-ignore
      twgl.drawBufferInfo(gl, bufferInfo, gl[item]);
    });
  }
}
