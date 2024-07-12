<script lang="ts" setup>
import { onMounted } from "vue";
import { initWebGL } from "@/utils/webgl";
import VSHADER_SOURCE from "./vertexShader.vs";
import FSHADER_SOURCE from "./fragmentShader.fs";
import * as twgl from "twgl.js";

onMounted(() => {
  // 设置webgl2
  const { gl, programInfo } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  // 设置顶点坐标
  const arrays: twgl.Arrays = {
    a_Position: {
      numComponents: 2,
      data: [-0.5, -0.5, 0.5, -0.5, 0, 0.5],
    },
    a_Color: {
      numComponents: 3,
      data: [1, 0, 0, 0, 1, 0, 0, 0, 1],
    },
  };
  // 创建缓冲区
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  // 设置缓冲区和属性信息
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  // 绘制三角形
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
