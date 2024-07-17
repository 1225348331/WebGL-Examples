<script lang="ts" setup>
import * as twgl from "twgl.js";
import VSHADER_SOURCE from "./vertexShader.vs";
import FSHADER_SOURCE from "./fragmentShader.fs";
import { onMounted } from "vue";
import { mat4, vec3 } from "gl-matrix";
import { initWebGL } from "@/utils/webgl";
import img from "@/assets/landScape.png";

interface Uniforms {
  u_ModelMatrix: mat4;
  u_ViewMatrix: mat4;
  u_ProjMatrix: mat4;
  u_Texture: WebGLTexture | null;
  u_PickedFace: number;
}
// 顶点坐标、纹理坐标、绘制索引
let arrays: twgl.Arrays = {
  a_Position: {
    numComponents: 3,
    data: [
      // Vertex coordinates
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0, // v0-v1-v2-v3 front
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0, // v0-v3-v4-v5 right
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0, // v0-v5-v6-v1 up
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0, // v1-v6-v7-v2 left
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0, // v7-v4-v3-v2 down
      1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0, // v4-v7-v6-v5 back
    ],
  },
  a_TexCoord: {
    numComponents: 2,
    data: [
      // Texture coordinates
      1.0,
      1.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0, // v0-v1-v2-v3 front
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0, // v0-v3-v4-v5 right
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0,
      0.0,
      0.0, // v0-v5-v6-v1 up
      1.0,
      1.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0, // v1-v6-v7-v2 left
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0, // v7-v4-v3-v2 down
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0, // v4-v7-v6-v5 back
    ],
  },
  a_Face: {
    numComponents: 1,
    data: [
      // Faces
      1,
      1,
      1,
      1, // v0-v1-v2-v3 front
      2,
      2,
      2,
      2, // v0-v3-v4-v5 right
      3,
      3,
      3,
      3, // v0-v5-v6-v1 up
      4,
      4,
      4,
      4, // v1-v6-v7-v2 left
      5,
      5,
      5,
      5, // v7-v4-v3-v2 down
      6,
      6,
      6,
      6, // v4-v7-v6-v5 back
    ],
  },
  indices: [
    // Indices of the vertices
    0,
    1,
    2,
    0,
    2,
    3, // front
    4,
    5,
    6,
    4,
    6,
    7, // right
    8,
    9,
    10,
    8,
    10,
    11, // up
    12,
    13,
    14,
    12,
    14,
    15, // left
    16,
    17,
    18,
    16,
    18,
    19, // down
    20,
    21,
    22,
    20,
    22,
    23, // back
  ],
};
// uniform变量
let uniforms: Uniforms = {
  u_ModelMatrix: mat4.create(),
  u_ViewMatrix: mat4.lookAt(mat4.create(), vec3.fromValues(3, 3, 7), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0)),
  u_ProjMatrix: mat4.perspective(mat4.create(), (50 * Math.PI) / 180, 1, 2, 100),
  u_Texture: null,
  u_PickedFace: -1,
};

const draw = (gl: WebGL2RenderingContext, programInfo: twgl.ProgramInfo) => {
  // 创建缓冲区
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  // 设置缓冲区和属性信息
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  // 设置uniform变量
  twgl.setUniforms(programInfo, uniforms);
  // 绘制立方体
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
};

onMounted(() => {
  const { gl, programInfo, canvas } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  twgl.createTexture(gl, { src: img, flipY: 1 }, (err, tex, img) => {
    uniforms.u_Texture = tex;
    // 绘制图形
    draw(gl, programInfo);
  });
  canvas.onmousedown = (e) => {
    let x = e.clientX;
    let y = e.clientY;
    let rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      let xCoord = x - rect.left;
      let yCoord = rect.bottom - y;
      // 读取像素坐标上的值
      uniforms.u_PickedFace = 0;
      draw(gl, programInfo);
      let pixels = new Uint8Array(4);
      gl.readPixels(xCoord, yCoord, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      console.log(pixels[3]);
      // 绘制选中后的状态
      uniforms.u_PickedFace = pixels[3];
      draw(gl, programInfo);
    }
  };
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
