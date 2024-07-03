<script lang="ts" setup>
import { onMounted } from "vue";
import * as twgl from "twgl.js";
import { initCanvas } from "@/utils/webgl";
import FSHADER_SOURCE from "./fragmentShader.fs";
import VSHADER_SOURCE from "./vertexShader.vs";

onMounted(() => {
  const gl = initCanvas();
  const programInfo = twgl.createProgramInfo(gl, [VSHADER_SOURCE, FSHADER_SOURCE]);
  gl.useProgram(programInfo.program);
  const arrays = {
    a_Position: { numComponents: 2, data: [0.5, -0.5, 0, 0.5, -0.5, -0.5] },
    a_PointSize: { numComponents: 1, data: [5, 10, 15] },
  };
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  // 设置清除颜色
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  twgl.drawBufferInfo(gl, bufferInfo, gl.POINTS);
});
</script>
<template>
  <canvas id="canvas"></canvas>
</template>
<style lang="scss" scoped></style>
