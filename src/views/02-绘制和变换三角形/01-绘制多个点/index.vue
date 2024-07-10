<script lang="ts" setup>
import { onMounted } from "vue";
import * as twgl from "twgl.js";
import VSHADER_SOURCE from "./vertexShader.vs";
import FSHADER_SOURCE from "./fragmentShader.fs";
import { initWebGL } from "@/utils/webgl";

onMounted(() => {
  // 初始化webgl
  const { gl, programInfo } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  // 顶点坐标
  let arrays: twgl.Arrays = {
    a_Position: { numComponents: 2, data: [0, 0, 0.4, 0.4, -0.4, 0] },
  };
  // 创建缓冲区信息
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  // 设置缓冲区和属性
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  // 设置清除颜色
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  twgl.drawBufferInfo(gl, bufferInfo, gl.POINTS);
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
