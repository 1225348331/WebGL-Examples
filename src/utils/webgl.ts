/**
 * @description: 初始化canvas,返回gl
 */
const initCanvas = () => {
  const container = document.querySelector(".ant-layout-content") as HTMLElement;
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  const { width, height } = container.getBoundingClientRect();
  canvas.width = width - 48;
  canvas.height = height - 48;
  const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
  return gl;
};

export { initCanvas };
