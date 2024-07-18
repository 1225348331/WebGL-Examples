<script lang="ts" setup>
import * as twgl from "twgl.js";
import VSHADER_SOURCE from "./vertexShader.vs";
import FSHADER_SOURCE from "./fragmentShader.fs";
import { onMounted } from "vue";
import { mat4, vec3, vec4 } from "gl-matrix";
import { initWebGL } from "@/utils/webgl";
import { Pane } from "tweakpane";

const pane = new Pane({
  title: "雾化距离控制",
});
let params = {
  dist: 80,
};

pane.addBinding(params, "dist", {
  min: 55,
  max: 110,
  label: "能见距离",
});

// 顶点坐标、纹理坐标、绘制索引
let arrays: twgl.Arrays = {
  // 顶点坐标
  a_Position: {
    numComponents: 3,
    data: [
      // Vertex coordinates
      1,
      1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      1, // v0-v1-v2-v3 front
      1,
      1,
      1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      -1, // v0-v3-v4-v5 right
      1,
      1,
      1,
      1,
      1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1, // v0-v5-v6-v1 up
      -1,
      1,
      1,
      -1,
      1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      1, // v1-v6-v7-v2 left
      -1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      -1,
      1,
      -1,
      -1,
      1, // v7-v4-v3-v2 down
      1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1, // v4-v7-v6-v5 back
    ],
  },
  // 顶点颜色
  a_Color: {
    numComponents: 3,
    data: [
      // Colors
      0.4,
      0.4,
      1.0,
      0.4,
      0.4,
      1.0,
      0.4,
      0.4,
      1.0,
      0.4,
      0.4,
      1.0, // v0-v1-v2-v3 front
      0.4,
      1.0,
      0.4,
      0.4,
      1.0,
      0.4,
      0.4,
      1.0,
      0.4,
      0.4,
      1.0,
      0.4, // v0-v3-v4-v5 right
      1.0,
      0.4,
      0.4,
      1.0,
      0.4,
      0.4,
      1.0,
      0.4,
      0.4,
      1.0,
      0.4,
      0.4, // v0-v5-v6-v1 up
      1.0,
      1.0,
      0.4,
      1.0,
      1.0,
      0.4,
      1.0,
      1.0,
      0.4,
      1.0,
      1.0,
      0.4, // v1-v6-v7-v2 left
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0, // v7-v4-v3-v2 down
      0.4,
      1.0,
      1.0,
      0.4,
      1.0,
      1.0,
      0.4,
      1.0,
      1.0,
      0.4,
      1.0,
      1.0, // v4-v7-v6-v5 back
    ],
  },
  // 法线向量
  a_Normal: {
    numComponents: 3,
    data: [
      // Normal
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
  // 绘制索引
  indices: [
    // Indices of the vertices
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
// uniform变量
let uniforms = {
  u_ModelMatrix: mat4.scale(mat4.create(), mat4.create(), vec3.fromValues(10, 10, 10)),
  u_ViewMatrix: mat4.lookAt(mat4.create(), vec3.fromValues(25, 65, 35), vec3.fromValues(0, 2, 0), vec3.fromValues(0, 1, 0)),
  u_ProjMatrix: mat4.perspective(mat4.create(), (30 * Math.PI) / 180, 1, 1, 1000),
  u_LightColor: vec4.fromValues(1.0, 1.0, 1.0, 1.0),
  u_LightPosition: vec4.fromValues(2.3, 4.0, 3.5, 1.0),
  u_AmbientColor: vec4.fromValues(0.2, 0.2, 0.2, 1.0),
  u_FogColor: vec4.fromValues(0.137, 0.231, 0.423, 1.0),
  u_Dist: [55, 80],
  u_EyePosition: [25, 65, 35, 1],
};

const draw = (gl: WebGL2RenderingContext, programInfo: twgl.ProgramInfo) => {
  // 创建缓冲区
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  // 设置缓冲区和属性信息
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  // 设置uniform变量
  twgl.setUniforms(programInfo, uniforms);
  // 绘制立方体
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
};

onMounted(() => {
  const { gl, programInfo, clearGL } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  gl.clearColor(0.137, 0.231, 0.423, 1.0);
  clearGL();
  draw(gl, programInfo);
  pane.on("change", () => {
    uniforms.u_Dist[1] = params.dist;
    clearGL();
    draw(gl, programInfo);
  });
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
