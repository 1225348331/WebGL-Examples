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
    // 鼠标点击处的位置
    const { clientX, clientY } = e;
    // canvas 位置 宽高
    const { left, top, width, height } = (e.target as HTMLElement).getBoundingClientRect();
    // 鼠标点击的canvas坐标
    const [clickX, clickY] = [clientX - left, clientY - top];
    // 解决坐标原点位置的差异
    const [xbaseCenter, ybaseCenter] = [clickX - width / 2, clickY - height / 2];
    // 解决坐标基底的差异 和 y方向上的差异
    const [x, y] = [(xbaseCenter / width) * 2, (-ybaseCenter / height) * 2];

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
