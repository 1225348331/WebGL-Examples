<script lang="ts" setup>
import { initWebGL } from "@/utils/webgl";
import * as twgl from "twgl.js";
import { onMounted } from "vue";
import FSHADER_SOURCE from "./fragmentShader.fs";
import VSHADER_SOURCE from "./vertexShader.vs";
import img from "@/assets/square.png";
import { mat4, vec3 } from "gl-matrix";

// 离屏渲染屏幕大小
var OFFSCREEN_WIDTH = 256;
var OFFSCREEN_HEIGHT = 256;

// 创建帧缓冲区
const createFramebufferInfo = (gl: WebGL2RenderingContext) => {
  const attachments: twgl.AttachmentOptions[] = [
    {
      format: gl.RGBA,
      type: gl.UNSIGNED_BYTE,
      min: gl.LINEAR,
      wrap: gl.CLAMP_TO_EDGE,
    },
  ];
  let fbInfo = twgl.createFramebufferInfo(gl, attachments, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
  return fbInfo;
};
// plane unifoms变量
let uniforms = {
  u_ModelMatrix: mat4.scale(mat4.create(), mat4.create(), vec3.fromValues(1, 1, 1)),
  u_ViewMatrix: mat4.lookAt(mat4.create(), vec3.fromValues(0, 2, -2), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0)),
  u_ProjMatrix: mat4.perspective(mat4.create(), (40 * Math.PI) / 180, 1, 1, 1000),
  u_Texture: null,
};
// FBO unifoms变量
let FBOuniforms = {
  u_ModelMatrix: mat4.translate(mat4.create(), mat4.create(), vec3.fromValues(0, 1, -0.5)),
  u_ViewMatrix: mat4.lookAt(mat4.create(), vec3.fromValues(2.5, 6.5, 3.5), vec3.fromValues(0, 2, 0), vec3.fromValues(0, 1, 0)),
  u_ProjMatrix: mat4.perspective(mat4.create(), (40 * Math.PI) / 180, 1, 1, 1000),
  u_Texture: null,
};

onMounted(() => {
  const { gl, programInfo, clearGL, canvas } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  let cubeBufferInfo = twgl.primitives.createCubeBufferInfo(gl, 2);
  let planeBufferInfo = twgl.primitives.createPlaneBufferInfo(gl);
  let tex = twgl.createTexture(gl, {
    src: img,
    flipY: 1,
  });
  // @ts-ignore
  FBOuniforms.u_Texture = tex;
  // 创建帧缓冲区
  const FBO = createFramebufferInfo(gl);

  gl.enable(gl.CULL_FACE); // 开启面剔除

  const tick = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, FBO.framebuffer);
    gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
    gl.clearColor(0.2, 0.2, 0.4, 1.0); // Set clear color (the color is slightly changed)
    clearGL(); // Clear FBO
    twgl.setBuffersAndAttributes(gl, programInfo, cubeBufferInfo);
    mat4.rotateY(FBOuniforms.u_ModelMatrix, FBOuniforms.u_ModelMatrix, Math.PI / 1800);
    twgl.setUniforms(programInfo, FBOuniforms);
    twgl.drawBufferInfo(gl, cubeBufferInfo);

    // 颜色缓冲区
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    clearGL(); // Clear the color buffer
    twgl.setBuffersAndAttributes(gl, programInfo, planeBufferInfo);
    // @ts-ignore
    uniforms.u_Texture = FBO.attachments[0];
    mat4.rotateY(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, Math.PI / 1800);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, planeBufferInfo);

    requestAnimationFrame(tick);
  };
  tick();
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
