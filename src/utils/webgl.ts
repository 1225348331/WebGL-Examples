import * as twgl from "twgl.js";

/**
 * @description: 初始化canvas,返回gl
 * @param {string} vs 顶点着色器
 * @param {string} fs 片元着色器
 */
const initWebGL = (vs: string, fs: string) => {
  const container = document.querySelector(".ant-layout-content") as HTMLElement;
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  const { width, height } = container.getBoundingClientRect();
  canvas.width = width - 48;
  canvas.height = height - 48;
  canvas.style.borderRadius = "6px";
  const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
  // 创建program
  const programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  // 使用program
  gl.useProgram(programInfo.program);
  // 设置清除颜色
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  return { gl, programInfo };
};

export { initWebGL };
