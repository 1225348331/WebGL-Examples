<script lang="ts" setup>
import { onMounted } from "vue";
import { getContext } from "@/utils/webgl";
import * as twgl from "twgl.js";
import WindGL from "./wind";
import windData from "./data/2016112000.json";
import img from "./data/2016112000.png";
import drawVert from "./shaders/drawVertexShader.vs";
import drawFrag from "./shaders/drawFragmetnShader.fs";

onMounted(() => {
  const { gl } = getContext();

  const wind = new WindGL(gl);
  wind.numParticles = 65536;
  // const pxRatio = Math.max(Math.floor(window.devicePixelRatio) || 1, 2);
  wind.resize();
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const windImage = new Image();
  // @ts-ignore
  windData.image = windImage;
  windImage.src = img;
  windImage.onload = function () {
    // @ts-ignore
    wind.setWind(windData);
  };

  function frame() {
    if (wind.windData) {
      wind.draw();
    }
    requestAnimationFrame(frame);
  }
  frame();
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
