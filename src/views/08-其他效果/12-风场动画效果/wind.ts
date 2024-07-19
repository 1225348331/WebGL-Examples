import * as twgl from "twgl.js";

import drawVert from "./shaders/drawVertexShader.vs";
import drawFrag from "./shaders/drawFragmetnShader.fs";
import quadVert from "./shaders/quadVertexShader.vs";
import screenFrag from "./shaders/screenFragmentShader.fs";
import updateFrag from "./shaders/updateFragmentShader.fs";
import img from "./data/2016112000.png";
// 默认渐变颜色
const defaultRampColors = {
  0.0: "#3288bd",
  0.1: "#66c2a5",
  0.2: "#abdda4",
  0.3: "#e6f598",
  0.4: "#fee08b",
  0.5: "#fdae61",
  0.6: "#f46d43",
  1.0: "#d53e4f",
};

interface WindData {
  width: number;
  height: number;
  uMin: number;
  uMax: number;
  vMin: number;
  vMax: number;
  image: ImageData;
}

export default class WindGL {
  gl: WebGL2RenderingContext;
  fadeOpacity: number;
  speedFactor: number;
  dropRate: number;
  dropRateBump: number;
  drawProgram: twgl.ProgramInfo;
  screenProgram: twgl.ProgramInfo;
  updateProgram: twgl.ProgramInfo;
  quadBuffer: twgl.BufferInfo;
  framebuffer: twgl.FramebufferInfo;
  // resizeFrameBuffer: twgl.FramebufferInfo;
  // particlesFrameBuffer: twgl.FramebufferInfo;
  backgroundTexture?: WebGLTexture; // 背景纹理
  screenTexture?: WebGLTexture; // 离屏纹理
  colorRampTexture?: WebGLTexture; // 渐变色纹理
  particleStateResolution?: number; // 粒子状态分辨率
  _numParticles?: number; // 粒子数量
  particleStateTexture0?: WebGLTexture; // 粒子状态纹理0
  particleStateTexture1?: WebGLTexture; // 粒子状态纹理1
  particleIndexBuffer?: twgl.BufferInfo; // 粒子索引缓冲区
  windData?: WindData;
  windTexture?: WebGLTexture;
  attachments: any;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.fadeOpacity = 0.996; // how fast the particle trails fade on each frame
    this.speedFactor = 0.25; // how fast the particles move
    this.dropRate = 0.003; // how often the particles move to a random place
    this.dropRateBump = 0.01; // drop rate increase relative to individual particle speed
    // 绘制着色器
    this.drawProgram = twgl.createProgramInfo(gl, [drawVert, drawFrag]);
    // 离屏着色器
    this.screenProgram = twgl.createProgramInfo(gl, [quadVert, screenFrag]);
    // 更新着色器
    this.updateProgram = twgl.createProgramInfo(gl, [quadVert, updateFrag]);
    // 长方形缓冲区
    this.quadBuffer = twgl.createBufferInfoFromArrays(gl, {
      a_pos: {
        numComponents: 2,
        data: [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1],
      },
    });

    this.framebuffer = twgl.createFramebufferInfo(gl);
    this.setColorRamp(defaultRampColors);
    this.resize();
  }
  // 重设尺寸
  resize() {
    const gl = this.gl;
    const emptyPixels = new Uint8Array(gl.canvas.width * gl.canvas.height * 4);
    this.backgroundTexture = twgl.createTexture(gl, {
      width: gl.canvas.width,
      height: gl.canvas.height,
      min: gl.NEAREST,
      mag: gl.NEAREST,
      src: emptyPixels,
    });
    this.screenTexture = twgl.createTexture(gl, {
      width: gl.canvas.width,
      height: gl.canvas.height,
      min: gl.NEAREST,
      mag: gl.NEAREST,
      src: emptyPixels,
    });
  }
  // 设置颜色渐变
  setColorRamp(colors: { [key: number]: string }) {
    this.colorRampTexture = twgl.createTexture(this.gl, {
      width: 16,
      height: 16,
      min: this.gl.LINEAR,
      mag: this.gl.LINEAR,
      src: getColorRamp(colors),
    });
  }
  set numParticles(numParticles: number) {
    const gl = this.gl;
    this.particleStateResolution = Math.ceil(Math.sqrt(numParticles));
    // 将会闯将一个正方形纹理，每个像素都会持有一个携带rgba信息的粒子
    const particleRes = this.particleStateResolution;
    // 粒子数量
    this._numParticles = particleRes * particleRes;
    // 粒子状态/位置
    const particleState = new Uint8Array(this._numParticles * 4);
    // 初始化粒子-随机位置
    for (let i = 0; i < particleState.length; i++) {
      particleState[i] = Math.floor(Math.random() * 256); // randomize the initial particle positions
    }
    this.particleStateTexture0 = twgl.createTexture(gl, {
      min: gl.NEAREST,
      mag: gl.NEAREST,
      src: particleState,
      width: particleRes,
      height: particleRes,
    });
    this.particleStateTexture1 = twgl.createTexture(gl, {
      min: gl.NEAREST,
      mag: gl.NEAREST,
      src: particleState,
      width: particleRes,
      height: particleRes,
    });
    // 粒子索引
    const particleIndices = new Float32Array(this._numParticles);
    for (let i = 0; i < this._numParticles; i++) particleIndices[i] = i;
    // 粒子缓冲区
    this.particleIndexBuffer = twgl.createBufferInfoFromArrays(gl, {
      a_index: {
        numComponents: 1,
        data: particleIndices,
      },
    });
  }
  // 获取粒子数量
  get numParticles() {
    return this._numParticles!;
  }
  // 设置风场数据 @1
  setWind(windData: WindData) {
    this.windData = windData;
    // 风场纹理 ==> 风场图像
    this.windTexture = twgl.createTexture(this.gl, {
      min: this.gl.LINEAR,
      mag: this.gl.LINEAR,
      // src: windData.image,
      src: img,
    });
  }
  draw() {
    const gl = this.gl;
    // 关闭深度测试
    gl.disable(gl.DEPTH_TEST);
    // 关闭模板测试
    gl.disable(gl.STENCIL_TEST);
    this.drawScreen();
    this.updateParticles();
  }

  drawScreen() {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer.framebuffer);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // // 绘制纹理
    this.drawTexture(this.backgroundTexture!, this.fadeOpacity);
    // // 绘制粒子
    // this.drawParticles();

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // // 启用混合以支持在现有背景上绘图
    // // enable blending to support drawing on top of an existing background (e.g. a map)
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    this.drawTexture(this.framebuffer.attachments[0], 1.0);
    gl.disable(gl.BLEND);
    // 将当前屏幕保存为下一帧的背景
    // save the current screen as the background for the next frame
    let temp = this.framebuffer.attachments[0];
    // gl.deleteFramebuffer(this.framebuffer.framebuffer);
    // let a = this
    this.framebuffer = twgl.createFramebufferInfo(gl, [
      {
        attachment: temp,
      },
    ]);
  }
  // 绘制纹理
  drawTexture(texture: WebGLTexture, opacity: number) {
    const gl = this.gl;
    const program = this.screenProgram;
    gl.useProgram(program.program);
    let uniforms = {
      u_screen: texture,
      u_opacity: opacity,
    };
    twgl.setBuffersAndAttributes(gl, program, this.quadBuffer);
    twgl.setUniforms(program, uniforms);
    twgl.drawBufferInfo(gl, this.quadBuffer, gl.TRIANGLES);
  }
  // 绘制粒子
  drawParticles() {
    const gl = this.gl;
    const programInfo = this.drawProgram;
    gl.useProgram(programInfo.program);
    let uniforms = {
      u_particles: this.particleStateTexture0,
      u_particles_res: this.particleStateResolution,
      u_wind: this.windTexture,
      u_wind_min: [this.windData?.uMin, this.windData?.vMin],
      u_wind_max: [this.windData?.uMax, this.windData?.vMax],
      u_color_ramp: this.colorRampTexture,
    };
    twgl.setBuffersAndAttributes(gl, programInfo, this.particleIndexBuffer!);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, this.particleIndexBuffer!, gl.POINTS);
  }
  // 更新粒子
  updateParticles() {
    const gl = this.gl;
    // bindFramebuffer(gl, this.framebuffer, this.particleStateTexture1);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer.framebuffer);
    gl.viewport(0, 0, this.particleStateResolution!, this.particleStateResolution!);
    const programInfo = this.updateProgram;
    gl.useProgram(programInfo.program);
    let uniforms = {
      u_particles: this.particleStateTexture0,
      u_particles_res: this.particleStateResolution,
      u_wind: this.windTexture,
      u_wind_min: [this.windData?.uMin, this.windData?.vMin],
      u_wind_max: [this.windData?.uMax, this.windData?.vMax],
      u_color_ramp: this.colorRampTexture,
      u_rand_seed: Math.random(),
      u_wind_res: [this.windData?.width, this.windData?.height],
      u_speed_factor: this.speedFactor,
      u_drop_rate: this.dropRate,
      u_drop_rate_bump: this.dropRateBump,
    };
    twgl.setBuffersAndAttributes(gl, programInfo, this.quadBuffer);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, this.quadBuffer, gl.TRIANGLES);
    // this.particleStateTexture1 = this.framebuffer.attachments[0];
    const temp = this.particleStateTexture0;
    this.particleStateTexture0 = this.particleStateTexture1;
    this.particleStateTexture1 = temp;
    twgl.resizeFramebufferInfo(gl, this.framebuffer, this.attachments);
  }
}

// 获取颜色渐变
function getColorRamp(colors: { [key: string]: string }) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  canvas.width = 256;
  canvas.height = 1;

  const gradient = ctx.createLinearGradient(0, 0, 256, 0);
  for (const stop in colors) {
    gradient.addColorStop(+stop, colors[stop]);
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);

  return new Uint8Array(ctx.getImageData(0, 0, 256, 1).data);
}

// 创建帧缓冲区
const createFramebufferInfo = (gl: WebGL2RenderingContext, attachment?: WebGLTexture) => {
  const attachments: twgl.AttachmentOptions[] = [
    {
      format: gl.RGBA,
      type: gl.UNSIGNED_BYTE,
      min: gl.LINEAR,
      wrap: gl.CLAMP_TO_EDGE,
      attachment: attachment,
    },
  ];
  let fbInfo = twgl.createFramebufferInfo(gl, attachments, gl.canvas.width, gl.canvas.width);
  return fbInfo;
};

function bindFramebuffer(gl: WebGL2RenderingContext, framebuffer: WebGLFramebuffer | null, texture?: WebGLTexture) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  if (texture) {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  }
}
