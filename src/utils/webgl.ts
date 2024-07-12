import * as twgl from "twgl.js";
import { onUnmounted } from "vue";

/**
 * @description: 初始化canvas,返回gl
 * @param {string} vs 顶点着色器
 * @param {string} fs 片元着色器
 */
const initWebGL = (vs: string, fs: string) => {
  const container = document.querySelector(".ant-layout-content") as HTMLElement;
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  const { height } = container.getBoundingClientRect();
  canvas.width = height - 48;
  canvas.height = height - 48;
  canvas.style.borderRadius = "6px";
  const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
  // 创建program
  const programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  // 使用program
  gl.useProgram(programInfo.program);
  twgl.resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // 设置清除颜色

  gl.clearColor(0, 0, 0, 1.0);
  gl.enable(gl.DEPTH_TEST)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // 清除GL,并设置清除颜色
  const clearGL = () => {
    gl.clearColor(0, 0, 0, 1.0);
    gl.enable(gl.DEPTH_TEST)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  };

  // 在组件销毁时，动态销毁WebGL context对象
  onUnmounted(() => {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  });

  return { gl, programInfo, clearGL };
};

export { initWebGL };
