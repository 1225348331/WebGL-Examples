<script lang="ts" setup>
import { onMounted } from "vue";
import * as twgl from "twgl.js";
import VSHADER_SOURCE from "./vertexShader.vs";
import FSHADER_SOURCE from "./fragmentShader.fs";
import { initWebGL } from "@/utils/webgl";

onMounted(() => {
  const { gl, programInfo } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  let arrays: twgl.Arrays = {
    a_Position: {
      numComponents: 2,
      data: [0, 0, -0.5, 0, 0.5, 0],
    },
  };
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.drawBufferInfo(gl, bufferInfo, gl.POINTS);
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
