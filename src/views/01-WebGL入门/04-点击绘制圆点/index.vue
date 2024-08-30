<script lang="ts" setup>
import { canvasPositionToGL, initWebGL } from "@/utils/webgl";
import { onMounted, ref } from "vue";
import * as twgl from "twgl.js";
import vs from "./vertexShader.vs";
import fs from "./fragmentShader.fs";

// 绘制顶点
const drawPoint = (gl: WebGL2RenderingContext, programInfo: twgl.ProgramInfo, attributesObj: twgl.Arrays, uniforms: any) => {
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, attributesObj);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo, gl.POINTS);
};

let arrays: number[][] = [];

onMounted(() => {
  const { gl, programInfo, canvas, clearGL } = initWebGL(vs, fs);

  canvas.onclick = (e) => {
    const [x, y] = canvasPositionToGL(e);
    arrays.push([x, y]);
    clearGL();
    // 同步绘图
    arrays.forEach((point) => {
      let arributeObj: twgl.Arrays = {
        a_PointSize: { numComponents: 1, data: [Math.max(Math.abs(point[0] * 50), 20)] },
        a_Position: { numComponents: 2, data: [point[0], point[1]] },
      };
      let uniforms = {
        u_Color: point,
      };
      drawPoint(gl, programInfo, arributeObj, uniforms);
    });
  };
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
