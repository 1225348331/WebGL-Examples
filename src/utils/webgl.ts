import * as twgl from "twgl.js";
import { onUnmounted } from "vue";

/**
 * @description: 初始化canvas,返回gl
 * @param {string} vs 顶点着色器
 * @param {string} fs 片元着色器
 */
const initWebGL = (vs: string, fs: string, isFullScreen: boolean = false) => {
  const { gl, canvas } = getContext(isFullScreen);
  // 创建program
  const programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  // 使用program
  gl.useProgram(programInfo.program);

  // 设置清除颜色
  gl.clearColor(22 / 255, 37 / 255, 97 / 255, 1.0);
  // 开启深度测试
  gl.enable(gl.DEPTH_TEST);
  // 开启颜色混合度透明
  gl.enable(gl.BLEND);
  // 设置片元的合成方式
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA);
  // 清空颜色缓冲区和深度缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // 清除GL,并设置清除颜色
  const clearGL = () => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  };

  // 在组件销毁时，动态销毁WebGL context对象
  onUnmounted(() => {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  });

  return { gl, programInfo, clearGL, width: canvas.width, height: canvas.height, canvas };
};

// 获取canvas context 默认webgl2
const getContext = (isFullScreen: Boolean = false) => {
  const container = document.querySelector(".ant-layout-content") as HTMLElement;
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  const { height, width } = container.getBoundingClientRect();
  isFullScreen ? (canvas.width = width - 48) : (canvas.width = height - 48);
  canvas.height = height - 48;
  canvas.style.borderRadius = "6px";
  const gl = twgl.getContext(canvas) as WebGL2RenderingContext;
  twgl.resizeCanvasToDisplaySize(canvas);
  return { gl, canvas };
};

const canvasPositionToGL = (e: MouseEvent) => {
  // 鼠标点击处的位置
  const { clientX, clientY } = e;
  // canvas 位置 宽高
  const { left, top, width, height } = (e.target as HTMLElement).getBoundingClientRect();
  // 鼠标点击的canvas坐标
  const [clickX, clickY] = [clientX - left, clientY - top];
  // 解决坐标原点位置的差异
  const [xbaseCenter, ybaseCenter] = [clickX - width / 2, clickY - height / 2];
  // 解决坐标基底的差异 和 y方向上的差异
  const [x, y] = [(xbaseCenter / width) * 2, (-ybaseCenter / height) * 2];
  return [x, y];
};

export { initWebGL, getContext, canvasPositionToGL };
