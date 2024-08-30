<script lang="ts" setup>
import { canvasPositionToGL, initWebGL } from "@/utils/webgl";
import { onMounted, ref } from "vue";
import * as twgl from "twgl.js";
import vs from "./vertexShader.vs";
import fs from "./fragmentShader.fs";
import { Track } from "./Track";
import { Compose } from "./Compose";

// 绘制顶点
const drawPoint = (gl: WebGL2RenderingContext, programInfo: twgl.ProgramInfo, attributesObj: twgl.Arrays, uniforms: any) => {
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, attributesObj);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo, gl.POINTS);
};

let collection: { x: number; y: number; alpha: number }[] = [];
let compose = new Compose();

onMounted(() => {
  const { gl, programInfo, canvas, clearGL } = initWebGL(vs, fs);

  canvas.onclick = (e) => {
    const [x, y] = canvasPositionToGL(e);
    const alpha = 1.0;
    const targetObj = { alpha, x, y };
    // 创建轨道对象
    const track = new Track(targetObj);
    track.keyMap.set("alpha", [
      [500, alpha],
      [1000, 0],
      [1500, alpha],
    ]);
    // 将轨道对象添加进合成对象
    compose.add(track);
    // 将点击点对象 位置、透明度添加进集合
    collection.push(targetObj);
  };

  // 渲染函数
  const render = () => {
    clearGL();
    collection.forEach(({ x, y, alpha }) => {
      let arributeObj: twgl.Arrays = {
        a_Position: { numComponents: 2, data: [x, y] },
      };
      let uniforms = {
        u_Alpha: alpha,
      };
      // 绘制点
      drawPoint(gl, programInfo, arributeObj, uniforms);
    });
  };

  // 动画函数
  const animate = () => {
    compose.update(new Date());
    render();
    requestAnimationFrame(animate);
  };

  // 开启动画
  animate();
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
