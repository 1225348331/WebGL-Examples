<script lang="ts" setup>
import { onMounted } from "vue";
import { initWebGL } from "@/utils/webgl";
import VSHADER_SOURCE from "./vertexShader.vs";
import FSHADER_SOURCE from "./fragmentShader.fs";
import * as twgl from "twgl.js";
import { mat4 } from "gl-matrix";
import { Pane } from "tweakpane";

let pane = new Pane();
// 绑定参数
let params = {
  x: 0,
  y: 0,
  theta: 0,
  scaleX: 1,
  scaleY: 1,
};
pane.addBinding(params, "x", {
  min: -0.5,
  max: 0.5,
  step: 0.01,
  label: "x轴平移",
});
pane.addBinding(params, "y", {
  min: -0.5,
  max: 0.5,
  step: 0.01,
  label: "y轴平移",
});
pane.addBinding(params, "theta", {
  min: -180,
  max: 180,
  step: 1,
  label: "旋转角度",
});
pane.addBinding(params, "scaleX", {
  min: 0.5,
  max: 2,
  step: 0.1,
  label: "X轴缩放",
});
pane.addBinding(params, "scaleY", {
  min: 0.5,
  max: 2,
  step: 0.1,
  label: "Y轴缩放",
});

onMounted(() => {
  // 初始化webgl2
  const { gl, programInfo } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  // 设置顶点坐标
  let arrays: twgl.Arrays = {
    a_Position: {
      numComponents: 2,
      data: [0.5, -0.8, 0.5, 0.5, 0.2, 0.5],
    },
  };
  // 设置uniform变量
  let uniforms = {
    u_ModelMatrix: mat4.create(),
  };
  // 创建缓冲区
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  // 设置缓冲区信息和属性
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  // 设置uniform变量
  twgl.setUniforms(programInfo, uniforms);
  // 绘制三角形
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
  // 模型变换监听
  pane.on("change", () => {
    const modelMatrix = mat4.create();
    // 平移矩阵
    mat4.translate(modelMatrix, modelMatrix, [params.x, params.y, 0]);
    // 旋转矩阵
    mat4.rotateZ(modelMatrix, modelMatrix, (params.theta * Math.PI) / 180.0);
    // 缩放矩阵
    mat4.scale(modelMatrix, modelMatrix, [params.scaleX, params.scaleY, 1]);
    // 设置uniform变量
    uniforms.u_ModelMatrix = modelMatrix;
    twgl.setUniforms(programInfo, uniforms);
    // 设置清除颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // 绘制三角形
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
  });
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
