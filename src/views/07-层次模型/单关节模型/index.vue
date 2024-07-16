<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
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
      1.5,
      10.0,
      1.5,
      -1.5,
      10.0,
      1.5,
      -1.5,
      0.0,
      1.5,
      1.5,
      0.0,
      1.5, // v0-v1-v2-v3 front
      1.5,
      10.0,
      1.5,
      1.5,
      0.0,
      1.5,
      1.5,
      0.0,
      -1.5,
      1.5,
      10.0,
      -1.5, // v0-v3-v4-v5 right
      1.5,
      10.0,
      1.5,
      1.5,
      10.0,
      -1.5,
      -1.5,
      10.0,
      -1.5,
      -1.5,
      10.0,
      1.5, // v0-v5-v6-v1 up
      -1.5,
      10.0,
      1.5,
      -1.5,
      10.0,
      -1.5,
      -1.5,
      0.0,
      -1.5,
      -1.5,
      0.0,
      1.5, // v1-v6-v7-v2 left
      -1.5,
      0.0,
      -1.5,
      1.5,
      0.0,
      -1.5,
      1.5,
      0.0,
      1.5,
      -1.5,
      0.0,
      1.5, // v7-v4-v3-v2 down
      1.5,
      0.0,
      -1.5,
      -1.5,
      0.0,
      -1.5,
      -1.5,
      10.0,
      -1.5,
      1.5,
      10.0,
      -1.5, // v4-v7-v6-v5 back
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
  u_Color: [1.0, 0, 0, 1],
  u_ModelMatrix: mat4.create(),
  u_ViewMatrix: mat4.lookAt(mat4.create(), vec3.fromValues(20, 20, 30), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0)),
  u_ProjMatrix: mat4.perspective(mat4.create(), (50 * Math.PI) / 180, 1, 2, 100),
  u_NormalMatrix: mat4.create(),
  u_LightColor: [1, 0, 0, 1],
  u_LightPosition: [20, 10, 100, 1],
  u_AmbientColor: [0.2, 0.2, 0.2, 1],
};

let pane = new Pane();
let params = {
  g_arm1Angle: -90.0,
  g_joint1Angle: 0.0,
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

// 绘制box
const drawBox = (gl: WebGL2RenderingContext, programInfo: twgl.ProgramInfo) => {
  // 创建缓冲区
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  // 设置缓冲区和属性信息
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  // 设置uniform信息
  twgl.setUniforms(programInfo, uniforms);
  // 绘制立方体
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
};
// 绘制图形
const draw = (gl: WebGL2RenderingContext, programInfo: twgl.ProgramInfo) => {
  uniforms.u_ModelMatrix = mat4.create();
  mat4.translate(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, vec3.fromValues(0.0, -12.0, 0.0));
  mat4.rotateY(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, (params.g_arm1Angle * Math.PI) / 180.0);
  drawBox(gl, programInfo);
  mat4.translate(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, vec3.fromValues(0.0, 10.0, 0.0));
  mat4.rotateZ(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, (params.g_joint1Angle * Math.PI) / 180.0);
  mat4.scale(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, vec3.fromValues(1.3, 1.0, 1.3));
  drawBox(gl, programInfo);
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

onUnmounted(() => {
  pane.dispose();
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
