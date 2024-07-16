<script lang="ts" setup>
import { initWebGL } from "@/utils/webgl";
import FSHADER_SOURCE from "./fragmentShader.fs";
import VSHADER_SOURCE from "./vertexShader.vs";
import { onMounted, onUnmounted } from "vue";
import * as twgl from "twgl.js";
import { Pane } from "tweakpane";

const pane = new Pane({
  title: "天气-雪",
});
let params = {
  SnowflakeAmount: 100,
  BlizardFactor: 0.1,
  speed: 1.0,
};
pane.addBinding(params, "SnowflakeAmount", {
  label: "雪花数量",
  min: 50,
  max: 350,
});
pane.addBinding(params, "BlizardFactor", {
  label: "暴风雪因子",
  min: 0,
  max: 1,
});
pane.addBinding(params, "speed", {
  label: "下雪速度",
  min: 1.0,
  max: 10.0,
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
    u_SnowflakeAmount: params.SnowflakeAmount,
    u_BlizardFactor: params.BlizardFactor,
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
    uniforms.u_Time += 1 / 200;
    clearGL();
    draw();
    requestAnimationFrame(tick);
  };
  tick();
  // 面板监听事件
  pane.on("change", () => {
    uniforms.u_Speed = params.speed;
    uniforms.u_BlizardFactor = params.BlizardFactor;
    uniforms.u_SnowflakeAmount = params.SnowflakeAmount;
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
