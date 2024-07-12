<script lang="ts" setup>
import { initWebGL } from "@/utils/webgl";
import * as twgl from "twgl.js";
import { onMounted } from "vue";
import FSHADER_SOURCE from "./fragmentShader.fs";
import VSHADER_SOURCE from "./vertexShader.vs";
import img from "@/assets/square.png";
import img1 from "@/assets/square1.png";

onMounted(() => {
  const { gl, programInfo, clearGL } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  let arrays: twgl.Arrays = {
    a_Position: {
      numComponents: 2,
      data: [-0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5],
    },
    a_TexCoord: {
      numComponents: 2,
      data: [0, 1, 0, 0, 1, 0, 1, 1],
    },
  };

  twgl.createTextures(
    gl,
    {
      texture1: { src: img, flipY: 1 },
      texture2: { src: img1, flipY: 1 },
    },
    (err, tex, img) => {
      let uniform = {
        u_Texture1: tex.texture1,
        u_Texture2: tex.texture2,
      };
      clearGL();
      const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
      twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
      twgl.setUniforms(programInfo, uniform);
      twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLE_FAN);
    }
  );
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
