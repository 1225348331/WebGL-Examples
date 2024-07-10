<script lang="ts" setup>
import { onMounted } from "vue";
import * as twgl from "twgl.js";
import { initWebGL } from "@/utils/webgl";
import VSHADER_SOURCE from "./vertexShader.vs";
import FSHADER_SOURCE from "./fragmentShader.fs";

onMounted(() => {
  // 初始化WebGL上下文和程序信息
  const { gl, programInfo } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  // 定义顶点数据和点的大小
  const arrays: twgl.Arrays = {
    a_Position: { numComponents: 2, data: [0, 0] },
    a_PointSize: { numComponents: 1, data: [20] },
  };
  // 创建缓冲区信息
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  // 设置缓冲区和属性
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  // 绘制缓冲区信息
  twgl.drawBufferInfo(gl, bufferInfo, gl.POINTS);
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
