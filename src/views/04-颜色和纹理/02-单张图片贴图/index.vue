<script lang="ts" setup>
import { initWebGL } from "@/utils/webgl";
import * as twgl from "twgl.js";
import { onMounted } from "vue";
import FSHADER_SOURCE from "./fragmentShader.fs";
import VSHADER_SOURCE from "./vertexShader.vs";
import img from "@/assets/square.png";

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

  twgl.createTexture(
    gl,
    {
      src: img,
      flipY: 1,
    },
    (err, tex) => {
      let uniform = {
        u_Texture: tex,
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
