<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { initWebGL } from "@/utils/webgl";
import VSHADER_SOURCE from "./vertexShader.vs";
import FSHADER_SOURCE from "./fragmentShader.fs";
import * as twgl from "twgl.js";
import { Pane } from "tweakpane";
import { getColor, getColorRamp, getAllPng } from "@/utils/utils";
let imgArr = getAllPng();
let options = imgArr.map((item: string) => {
  return {
    text: item.replaceAll("/data/", ""),
    value: item,
  };
});

// 参数面板
const pane = new Pane({
  title: "绘制格点数据",
});
let params = {
  imgSrc: options[0].value,
  isStep: true,
  time: 0,
  threshold: 1.0,
};
pane.addBlade({
  view: "list",
  label: "温度图",
  options: options,
  value: params.imgSrc,
});
pane.addBinding(params, "isStep", {
  label: "是否分级渲染",
});
pane.addBinding(params, "threshold", {
  label: "阈值过滤",
  min: 0,
  max: 1,
  step: 0.01,
});

// 绘制
const draw = (gl: WebGL2RenderingContext, programInfo: twgl.ProgramInfo) => {
  twgl.createTextures(
    gl,
    {
      dataTexture: {
        src: params.imgSrc,
        min: gl.LINEAR,
        mag: gl.LINEAR,
      },
      colorTexture: {
        src: getColorRamp(),
        min: gl.LINEAR,
        mag: gl.LINEAR,
        width: 256,
        height: 1,
      },
    },
    (err, texture) => {
      let arrays: twgl.Arrays = {
        a_Position: {
          numComponents: 2,
          data: [-1, 1, -1, -1, 1, 1, 1, -1],
        },
      };
      let uniforms = {
        u_Texture: texture.dataTexture,
        u_Texture2: texture.dataTexture2,
        u_ColorTexture: texture.colorTexture,
        u_IsStep: params.isStep,
        u_Time: params.time,
        u_Threshold: params.threshold,
        clampColors: [
          { stop: 0.0, color: getColor(0.0) },
          { stop: 0.1, color: getColor(0.1) },
          { stop: 0.2, color: getColor(0.2) },
          { stop: 0.3, color: getColor(0.3) },
          { stop: 0.4, color: getColor(0.4) },
          { stop: 0.5, color: getColor(0.5) },
          { stop: 0.6, color: getColor(0.6) },
          { stop: 0.7, color: getColor(0.7) },
          { stop: 0.8, color: getColor(0.8) },
          { stop: 1.0, color: getColor(1.0) },
        ],
      };
      // 创建缓冲区
      const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
      // 设置缓冲区和属性信息
      twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
      // 设置uniforms变量
      twgl.setUniforms(programInfo, uniforms);
      // 清除数据
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      // 绘制图形
      twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLE_STRIP);
    }
  );
};

onMounted(() => {
  // 初始化webgl
  const { gl, programInfo } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  // 绘制图形
  draw(gl, programInfo);
  pane.on("change", (data) => {
    if (imgArr.includes(data.value as string)) {
      params.imgSrc = data.value as string;
    }
    draw(gl, programInfo);
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
