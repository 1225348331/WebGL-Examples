<script lang="ts" setup>
import { onMounted } from "vue";
import { initWebGL } from "@/utils/webgl";
import VSHADER_SOURCE from "./vertexShader.vs";
import FSHADER_SOURCE from "./fragmentShader.fs";
import * as twgl from "twgl.js";
import { mat4, vec3 } from "gl-matrix";
import { Pane } from "tweakpane";

// 获取vec3矢量
const getVec3 = (values: { x: number; y: number; z: number }) => {
  return vec3.fromValues(values.x, values.y, values.z);
};

const pane = new Pane();
let params = {
  eye: { x: 0, y: 0, z: 0 },
  target: { x: 0, y: 0, z: -1 },
  upDirection: { x: 0, y: 1, z: 0 },
  near: 0.1,
  far: 0.5,
  left: -1,
  right: 1,
  bottom: -1,
  top: 1,
};

pane.addBinding(params, "near", {
  view: "slider",
  min: 0.1,
  max: 0.3,
  label: "近裁剪面",
});
pane.addBinding(params, "far", {
  view: "slider",
  min: 0.3,
  max: 0.5,
  label: "远裁剪面",
});
pane.addBinding(params, "left", {
  view: "slider",
  min: -1,
  max: 0,
  label: "左边界",
});
pane.addBinding(params, "right", {
  view: "slider",
  min: 0,
  max: 1,
  label: "右边界",
});
pane.addBinding(params, "top", {
  view: "slider",
  min: 0,
  max: 1,
  label: "上边界",
});
pane.addBinding(params, "bottom", {
  view: "slider",
  min: -1,
  max: 0,
  label: "下边界",
});

// 设置顶点坐标
let arrays: twgl.Arrays = {
  a_Position: {
    data: [-0.5, 0, -0.4, 0.5, -0.5, -0.4, 0.5, 0.5, -0.4, 0.5, 0.4, -0.2, -0.5, 0.4, -0.2, 0, -0.6, -0.2],
  },
  a_Color: {
    numComponents: 3,
    data: [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  },
};
// 设置视图矩阵
let uniforms = {
  u_ViewMatrix: mat4.lookAt(mat4.create(), getVec3(params.eye), getVec3(params.target), getVec3(params.upDirection)),
  u_ProjMatrix: mat4.ortho(mat4.create(), params.left, params.right, params.bottom, params.top, params.near, params.far),
};

// 绘制图形
const draw = (gl: WebGL2RenderingContext, programInfo: twgl.ProgramInfo) => {
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
};

onMounted(() => {
  // 初始化webgl2
  const { gl, programInfo, clearGL } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  // 绘制图形
  draw(gl, programInfo);
  // 面板监听
  pane.on("change", () => {
    clearGL();
    mat4.ortho(uniforms.u_ProjMatrix, params.left, params.right, params.bottom, params.top, params.near, params.far);
    draw(gl, programInfo);
  });
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
