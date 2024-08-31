import * as twgl from "twgl.js";
export class Poly {
  vertices: number[] = [];
  size: number = 2;
  bufferInfo: twgl.BufferInfo;
  gl: WebGL2RenderingContext;
  programInfo: twgl.ProgramInfo;

  get attributeObj() {
    return {
      a_Position: this.vertices,
    };
  }

  constructor({ gl, programInfo }: { gl: WebGL2RenderingContext; programInfo: twgl.ProgramInfo }) {
    this.gl = gl;
    this.programInfo = programInfo;
    this.bufferInfo = twgl.createBufferInfoFromArrays(gl, {});
  }

  init() {}

  // 添加顶点
  addVertices(x: number, y: number) {
    this.vertices.push(x, y);
  }

  // 删除最后一个顶点
  popVertices() {
    this.vertices.slice(this.vertices.length - this.size, this.vertices.length);
  }

  updateBuffer() {
    // twgl.setAttribInfoBufferFromArray();
  }
}
