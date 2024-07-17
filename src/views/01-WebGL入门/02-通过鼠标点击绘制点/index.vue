<script lang="ts" setup>
import * as twgl from "twgl.js";
import VSHADER_SOURCE from "./vertexShader.vs";
import FSHADER_SOURCE from "./fragmentShader.fs";
import { onMounted } from "vue";
import { initWebGL } from "@/utils/webgl";

// 存储顶点坐标
let arrays: [number, number][] = [];

/**
 * @description: 绘制点
 * @param {*} gl
 * @param {*} programInfo
 */
const drawPoints = (gl: WebGL2RenderingContext, programInfo: twgl.ProgramInfo, attributesObj: twgl.Arrays) => {
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, attributesObj);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.drawBufferInfo(gl, bufferInfo, gl.POINTS);
};

onMounted(() => {
  // 初始化webgl2
  const { gl, programInfo } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  // canvas点击事件
  document.querySelector("canvas")?.addEventListener("click", (e) => {
    let x = e.clientX; // 鼠标点击处的x坐标
    let y = e.clientY; // 鼠标点击出的y坐标
    const rect = (e.target as HTMLCanvasElement)?.getBoundingClientRect(); // canvas位置及长宽信息
    x = (x - rect.left - rect.width / 2) / (rect.width / 2); // webgl x坐标
    y = (rect.height / 2 - (y - rect.top)) / (rect.height / 2); // webgl y坐标
    arrays.push([x, y]); // 将坐标存储到顶点变量中
    // 清除颜色缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    arrays.forEach((item) => {
      let arributeObj: twgl.Arrays = {
        a_Position: {
          numComponents: 2,
          data: [item[0], item[1]],
        },
      };
      drawPoints(gl, programInfo, arributeObj);
    });
  });
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
