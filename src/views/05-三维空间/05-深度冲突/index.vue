<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
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
  near: 1,
  far: 6,
  fov: 90,
  aspect: 1,
};

pane.addBinding(params, "eye", {
  min: -1,
  max: 1,
  label: "视点",
});
pane.addBinding(params, "target", {
  min: -1,
  max: 1,
  label: "目标点",
});
pane.addBinding(params, "upDirection", {
  min: -1,
  max: 1,
  label: "上方向",
});
pane.addBinding(params, "near", {
  view: "slider",
  min: 0,
  max: 3,
  label: "近裁剪面",
});
pane.addBinding(params, "far", {
  view: "slider",
  min: 3,
  max: 6,
  label: "远裁剪面",
});
pane.addBinding(params, "fov", {
  view: "slider",
  min: 0,
  max: 180,
  label: "夹角",
});
pane.addBinding(params, "aspect", {
  min: 1,
  max: 1,
  label: "宽高比",
});

// 设置顶点坐标
let arrays: twgl.Arrays = {
  a_Position: {
    data: [0.0, 2.5, -5.0, -2.5, -2.5, -5.0, 2.5, -2.5, -5.0, 0.0, 3.0, -5.0, -3.0, -3.0, -5.0, 3.0, -3.0, -5.0],
  },
  a_Color: {
    numComponents: 3,
    data: [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  },
};
// 设置视图矩阵
let uniforms = {
  u_ViewMatrix: mat4.lookAt(mat4.create(), getVec3(params.eye), getVec3(params.target), getVec3(params.upDirection)),
  u_ProjMatrix: mat4.perspective(mat4.create(), (params.fov * Math.PI) / 180, params.aspect, params.near, params.far),
};

// 绘制图形
const draw = (gl: WebGL2RenderingContext, programInfo: twgl.ProgramInfo) => {
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES, 3, 0);
  gl.polygonOffset(2, 2);
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES, 3, 3);
};

onMounted(() => {
  // 初始化webgl2
  const { gl, programInfo, clearGL } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  gl.enable(gl.POLYGON_OFFSET_FILL);
  // 绘制图形
  draw(gl, programInfo);
  // 面板监听
  pane.on("change", () => {
    clearGL();
    mat4.lookAt(uniforms.u_ViewMatrix, getVec3(params.eye), getVec3(params.target), getVec3(params.upDirection));
    mat4.perspective(uniforms.u_ProjMatrix, (params.fov * Math.PI) / 180, params.aspect, params.near, params.far);
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
