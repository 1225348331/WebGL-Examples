<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { initWebGL } from "@/utils/webgl";
import VSHADER_SOURCE from "./vertexShader.vs";
import FSHADER_SOURCE from "./fragmentShader.fs";
import { getAllPng, getColor } from "@/utils/utils";
import * as twgl from "twgl.js";
import { Pane } from "tweakpane";

let imgArr = getAllPng();
imgArr.length = 4;

// 参数面板
const pane = new Pane({
  title: "绘制格点数据",
});
// 参数控制
let params = {
  currentIndex: 0,
  time: 0, // 时间控制
  speed: 5, // 播放速度
};
pane.addBinding(params, "speed", {
  label: "动画速度",
  min: 1,
  max: 15,
});

/**
 * @description: 获取图片data数组
 * @param {*} image image对象
 */
const getImageData = (image: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, 0, 0);
  return ctx.getImageData(0, 0, image.width, image.height).data;
};

/**
 * @description: 获取深度纹理 - 纹理数组
 * @param {WebGL2RenderingContext} gl
 * @param {string[]} imgArr
 */
const getDepthTexture = (gl: WebGL2RenderingContext, imgArr: string[]) => {
  let obj: { [key: string]: object } = {};

  imgArr.forEach((item, index) => {
    obj[`texture${index}`] = {
      src: item,
      min: gl.LINEAR,
      mag: gl.LINEAR,
    };
  });
  return new Promise((resolve) => {
    twgl.createTextures(gl, obj, (err, tex, img) => {
      const width = (img.texture0 as HTMLImageElement).width; // 宽度
      const height = (img.texture0 as HTMLImageElement).height; // 长度
      const depth = imgArr.length; // 深度
      const textureData = new Uint8Array(width * height * depth * 4);
      Object.values(img).forEach((image, index) => {
        const imageData = getImageData(image as HTMLImageElement);
        textureData.set(imageData, index * width * height * 4);
      });
      let texture = twgl.createTexture(gl, {
        target: gl.TEXTURE_2D_ARRAY,
        width: width,
        height: height,
        depth: depth,
        src: textureData,
        min: gl.LINEAR,
        mag: gl.LINEAR,
        wrap: gl.CLAMP_TO_EDGE,
      });
      resolve(texture);
    });
  });
};

// 绘制
const draw = (gl: WebGL2RenderingContext, programInfo: twgl.ProgramInfo, depthTexture: WebGLTexture) => {
  let arrays: twgl.Arrays = {
    a_Position: {
      numComponents: 2,
      data: [-1, 1, -1, -1, 1, 1, 1, -1],
    },
  };
  let uniforms = {
    u_TextureArray: depthTexture,
    u_Time: params.time,
    u_CurrentIndex: params.currentIndex,
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
};

onMounted(() => {
  // 初始化webgl
  const { gl, programInfo } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  getDepthTexture(gl, imgArr).then((depthTexture) => {
    // 循环动画
    const tick = () => {
      params.time += params.speed / 8000;
      if (params.time >= 1) {
        params.currentIndex = imgArr.length - 2 ? (params.currentIndex = 0) : ++params.currentIndex;
        params.time = 0;
      }
      draw(gl, programInfo, depthTexture as WebGLTexture);
      requestAnimationFrame(tick);
    };
    tick();
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
