<script lang="ts" setup>
import { onMounted } from "vue";
import { initWebGL } from "@/utils/webgl";
import VSHADER_SOURCE from "./vertexShader.vs";
import FSHADER_SOURCE from "./fragmentShader.fs";
import { mat4 } from "gl-matrix";
import * as twgl from "twgl.js";

// 三角形顶点坐标
let data: number[] = [];
let centerPosition: number[] = [];
for (let i = -1; i <= 1 - 0.2; i += 0.2) {
  for (let j = -1; j <= 1 - 0.3; j += 0.3) {
    data.push(i, j, i + 0.1, j, i + 0.2, j + 0.3);
    centerPosition.push(i + 0.1, j + 0.1, i + 0.1, j + 0.1, i + 0.1, j + 0.1);
  }
}

// 顶点坐标
let arrays: twgl.Arrays = {
  a_Position: {
    numComponents: 2,
    data: data,
  },
  a_CenterPosition: {
    numComponents: 2,
    data: centerPosition,
  },
};
// 视图矩阵uniform变量
let uniforms = {
  u_ModelMatrix: mat4.create(),
};

onMounted(() => {
  // 初始化webgl
  const { gl, programInfo } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  // 创建缓冲区
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  // 设置缓冲区和属性信息
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

  // 帧动画函数
  const tick = () => {
    mat4.rotateZ(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, Math.PI / 360.0);
    // 设置清除颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // 设置uniform变量
    twgl.setUniforms(programInfo, uniforms);
    // 绘制三角形
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
    requestAnimationFrame(tick);
  };
  // 调用帧动画函数
  tick();
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
