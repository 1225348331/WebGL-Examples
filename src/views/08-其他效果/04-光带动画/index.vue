<script lang="ts" setup>
import { initWebGL } from "@/utils/webgl";
import FSHADER_SOURCE from "./fragmentShader.fs";
import VSHADER_SOURCE from "./vertexShader.vs";
import { onMounted, onUnmounted } from "vue";
import * as twgl from "twgl.js";
import { Pane } from "tweakpane";

const pane = new Pane({
  title: "平面扩散波",
});
let params = {
  speed: 20,
  width: 0.3,
};
pane.addBinding(params, "speed", {
  label: "扩散速度",
  min: 5,
  max: 50,
});
pane.addBinding(params, "width", {
  label: "波纹宽度",
  min: 0.1,
  max: 1,
});

onMounted(() => {
  // 初始化webgl2
  const { gl, programInfo, clearGL, width } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  // 设置顶点数据
  let arrays: twgl.Arrays = {
    a_Position: {
      numComponents: 2,
      data: [-1, 1, -1, -1, 1, -1, 1, 1],
    },
  };
  // 设置uniform变量
  let uniforms = {
    u_Color: [0, 1, 0, 1],
    u_Resolution: width,
    u_Time: 0,
    u_Speed: params.speed,
    u_Width: params.width,
  };
  // 绘制函数
  const draw = () => {
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLE_FAN);
  };
  // 帧动画函数
  const tick = () => {
    uniforms.u_Time += 0.1;
    if (uniforms.u_Time * uniforms.u_Speed > width) uniforms.u_Time = 0.0;
    clearGL();
    draw();
    requestAnimationFrame(tick);
  };
  tick();
  // 面板监听事件
  pane.on("change", () => {
    uniforms.u_Speed = params.speed;
    uniforms.u_Width = params.width;
  });
});

onUnmounted(() => {
  pane.dispose();
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
