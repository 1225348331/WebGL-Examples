<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { initWebGL } from "@/utils/webgl";
import VSHADER_SOURCE from "./vertexShader.vs";
import FSHADER_SOURCE from "./fragmentShader.fs";
import * as twgl from "twgl.js";
import { mat4 } from "gl-matrix";
import { Pane } from "tweakpane";

let pane = new Pane();
// 绑定参数
let params = {
  theta: 0,
};
// 绑定旋转角度
pane.addBinding(params, "theta", {
  min: -360,
  max: 360,
  step: 1,
  label: "旋转角度",
});

onMounted(() => {
  // 初始化webgl2
  const { gl, programInfo } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  // 设置顶点坐标
  let arrays: twgl.Arrays = {
    a_Position: {
      numComponents: 2,
      data: [0.2, 0, 0.2, 1, 0.8, 0],
    },
    a_CenterPosition: {
      numComponents: 2,
      data: [0.2, 0, 0.2, 0, 0.2, 0],
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
    // 设置旋转矩阵
    mat4.rotateZ(uniforms.u_ModelMatrix, mat4.create(), (params.theta * Math.PI) / 180.0);
    // 创建缓冲区
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    // 设置缓冲区信息和属性
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    // 设置uniform变量
    twgl.setUniforms(programInfo, uniforms);
    // 清除颜色缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT);
    // 绘制三角形
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
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
