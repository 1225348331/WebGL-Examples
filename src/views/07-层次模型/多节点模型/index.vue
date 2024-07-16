<script lang="ts" setup>
import { onMounted } from "vue";
import * as twgl from "twgl.js";
import { initWebGL } from "@/utils/webgl";
import VSHADER_SOURCE from "./vertexShader.vs";
import FSHADER_SOURCE from "./fragmentShader.fs";
import { mat4, vec3 } from "gl-matrix";
import { Pane } from "tweakpane";

let arrays: twgl.Arrays = {
  a_Position: {
    numComponents: 3,
    data: [
      0.5,
      1.0,
      0.5,
      -0.5,
      1.0,
      0.5,
      -0.5,
      0.0,
      0.5,
      0.5,
      0.0,
      0.5, // v0-v1-v2-v3 front
      0.5,
      1.0,
      0.5,
      0.5,
      0.0,
      0.5,
      0.5,
      0.0,
      -0.5,
      0.5,
      1.0,
      -0.5, // v0-v3-v4-v5 right
      0.5,
      1.0,
      0.5,
      0.5,
      1.0,
      -0.5,
      -0.5,
      1.0,
      -0.5,
      -0.5,
      1.0,
      0.5, // v0-v5-v6-v1 up
      -0.5,
      1.0,
      0.5,
      -0.5,
      1.0,
      -0.5,
      -0.5,
      0.0,
      -0.5,
      -0.5,
      0.0,
      0.5, // v1-v6-v7-v2 left
      -0.5,
      0.0,
      -0.5,
      0.5,
      0.0,
      -0.5,
      0.5,
      0.0,
      0.5,
      -0.5,
      0.0,
      0.5, // v7-v4-v3-v2 down
      0.5,
      0.0,
      -0.5,
      -0.5,
      0.0,
      -0.5,
      -0.5,
      1.0,
      -0.5,
      0.5,
      1.0,
      -0.5, // v4-v7-v6-v5 back
    ],
  },
  a_Normal: {
    numComponents: 3,
    data: [
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0, // v0-v1-v2-v3 front
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0, // v0-v3-v4-v5 right
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0, // v0-v5-v6-v1 up
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0, // v1-v6-v7-v2 left
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0, // v7-v4-v3-v2 down
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0, // v4-v7-v6-v5 back
    ],
  },
  indices: [
    0,
    1,
    2,
    0,
    2,
    3, // front
    4,
    5,
    6,
    4,
    6,
    7, // right
    8,
    9,
    10,
    8,
    10,
    11, // up
    12,
    13,
    14,
    12,
    14,
    15, // left
    16,
    17,
    18,
    16,
    18,
    19, // down
    20,
    21,
    22,
    20,
    22,
    23, // back
  ],
};

let uniforms = {
  u_Color: [1.0, 0.4, 0, 1],
  u_ModelMatrix: mat4.create(),
  u_ViewMatrix: mat4.lookAt(mat4.create(), vec3.fromValues(20, 10, 30), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0)),
  u_ProjMatrix: mat4.perspective(mat4.create(), (50 * Math.PI) / 180, 1, 2, 100),
  u_NormalMatrix: mat4.create(),
  u_LightColor: [1, 1, 1, 0.5],
  u_LightPosition: [20, 10, 100, 1],
  u_AmbientColor: [0.2, 0.2, 0.2, 1],
};

let pane = new Pane();
let params = {
  g_arm1Angle: 90.0,
  g_joint1Angle: 45.0,
  g_joint2Angle: 0.0,
  g_joint3Angle: 0.0,
};
pane.addBinding(params, "g_arm1Angle", {
  label: "关节1角度",
  min: -180,
  max: 180,
});
pane.addBinding(params, "g_joint1Angle", {
  label: "关节2角度",
  min: -90,
  max: 90,
});
pane.addBinding(params, "g_joint2Angle", {
  label: "关节3角度",
  min: -90,
  max: 90,
});
pane.addBinding(params, "g_joint3Angle", {
  label: "关节4角度",
  min: -90,
  max: 90,
});

let ANGLE_STEP = 3.0; // The increments of rotation angle (degrees)

// 绘制box
const drawBox = (gl: WebGL2RenderingContext, programInfo: twgl.ProgramInfo, width: number, height: number, depth: number) => {
  let currentMatrix = mat4.clone(uniforms.u_ModelMatrix);
  mat4.scale(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, vec3.fromValues(width, height, depth));
  // 创建缓冲区
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  // 设置缓冲区和属性信息
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  // 设置uniform信息
  twgl.setUniforms(programInfo, uniforms);
  // 绘制立方体
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
  uniforms.u_ModelMatrix = currentMatrix;
};
// 绘制图形
const draw = (gl: WebGL2RenderingContext, programInfo: twgl.ProgramInfo) => {
  // 绘制基底
  uniforms.u_ModelMatrix = mat4.create();
  mat4.translate(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, vec3.fromValues(0.0, -12.0, 0.0));
  drawBox(gl, programInfo, 10, 2, 10);
  // 绘制arm1
  mat4.translate(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, vec3.fromValues(0.0, 2.0, 0.0));
  mat4.rotateY(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, (params.g_arm1Angle * Math.PI) / 180.0);
  drawBox(gl, programInfo, 3, 10, 3);
  // 绘制arm2
  mat4.translate(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, vec3.fromValues(0.0, 10.0, 0.0));
  mat4.rotateZ(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, (params.g_joint1Angle * Math.PI) / 180.0);
  drawBox(gl, programInfo, 4, 10, 4);
  // 绘制手掌
  mat4.translate(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, vec3.fromValues(0.0, 10, 0.0));
  mat4.rotateY(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, (params.g_joint2Angle * Math.PI) / 180.0);
  drawBox(gl, programInfo, 2, 2, 6);
  // 移动至手掌中心
  mat4.translate(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, vec3.fromValues(0.0, 2, 0.0));
  // 绘制手指1
  let currentMatrix = mat4.clone(uniforms.u_ModelMatrix);
  mat4.translate(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, vec3.fromValues(0.0, 0, 2));
  mat4.rotateX(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, (params.g_joint3Angle * Math.PI) / 180.0);
  drawBox(gl, programInfo, 1, 2, 1);
  // 绘制手指2
  uniforms.u_ModelMatrix = currentMatrix;
  mat4.translate(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, vec3.fromValues(0.0, 0, -2));
  mat4.rotateX(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, -(params.g_joint3Angle * Math.PI) / 180.0);
  drawBox(gl, programInfo, 1, 2, 1);
};

onMounted(() => {
  // 初始化webgl2
  const { gl, programInfo, clearGL } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  // 绘制关节模型
  draw(gl, programInfo);

  pane.on("change", () => {
    clearGL();
    // 绘制关节模型
    draw(gl, programInfo);
  });
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
