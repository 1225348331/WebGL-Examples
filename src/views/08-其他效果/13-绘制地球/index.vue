<script lang="ts" setup>
import { onMounted } from "vue";
import * as twgl from "twgl.js";
import { initWebGL } from "@/utils/webgl";
import vs from "./vertexShader.vs";
import fs from "./fragmentShader.fs";
import earth from "./earth.png";
import { mat4, vec3 } from "gl-matrix";

let latitudeBands = 50; // 纬度带
let lontitudeBands = 50; // 经度带
let positions = []; // 存储x，y，z坐标
let indices = []; // 三角形列表（索引值）
let textureCoordData = []; // 存储纹理坐标uv，纹理坐标与顶点坐标一一对应

for (let latNum = 0; latNum <= latitudeBands; latNum++) {
  let lat = (latNum * Math.PI) / latitudeBands - Math.PI / 2; // 纬度从-π/2到π/2
  let sinLat = Math.sin(lat);
  let cosLat = Math.cos(lat);
  for (let longNum = 0; longNum <= lontitudeBands; longNum++) {
    let lon = (longNum * 2 * Math.PI) / lontitudeBands - Math.PI; // 经度范围从-π/π
    let sinLon = Math.sin(lon);
    let cosLon = Math.cos(lon);

    let x = cosLat * cosLon;
    let y = cosLat * sinLon;
    let z = sinLat;
    let u = longNum / lontitudeBands;
    let v = latNum / latitudeBands;
    positions.push(x, y, z);
    textureCoordData.push(u, v);
  }
}

for (let latNum = 0; latNum < latitudeBands; latNum++) {
  for (let longNum = 0; longNum < lontitudeBands; longNum++) {
    let first = latNum * (lontitudeBands + 1) + longNum;
    let second = first + lontitudeBands + 1;
    indices.push(first, first + 1, second);
    indices.push(second, second + 1, first + 1);
  }
}
interface Uniforms {
  u_Texture: null | WebGLTexture;
  u_ModelMatrix: mat4;
  u_ViewMatrix: mat4;
  u_ProjMatrix: mat4;
}

let uniforms: Uniforms = {
  u_Texture: null,
  u_ModelMatrix: mat4.scale(mat4.create(), mat4.create(), vec3.fromValues(3, 3, 3)),
  u_ViewMatrix: mat4.lookAt(mat4.create(), vec3.fromValues(4, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 1)),
  u_ProjMatrix: mat4.perspective(mat4.create(), (120 * Math.PI) / 180, 1, 1, 100),
};

const draw = (gl: WebGL2RenderingContext, programInfo: twgl.ProgramInfo, bufferInfo: twgl.BufferInfo) => {
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo);
};

onMounted(() => {
  const { gl, programInfo, clearGL } = initWebGL(vs, fs);
  const arrays: twgl.Arrays = {
    a_Position: {
      numComponents: 3,
      data: positions,
      // data: [-0.5, 0, -0.4, 0.5, -0.5, -0.4, 0.5, 0.5, -0.4],
    },
    a_TexCoord: {
      numComponents: 2,
      data: textureCoordData,
    },
    indices,
  };
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  twgl.createTexture(
    gl,
    {
      src: earth,
      flipY: 1,
    },
    (err, tex) => {
      uniforms.u_Texture = tex;
      draw(gl, programInfo, bufferInfo);
    }
  );
  // 拖拽变量
  let dragging = false;
  let lastX = -1;
  let lastY = -1;
  let currentAngle: number[] = [0, 0];
  let canvas = document.querySelector("canvas") as HTMLCanvasElement;

  canvas.onmousedown = (e) => {
    let x = e.clientX;
    let y = e.clientY;
    let rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      lastX = x;
      lastY = y;
      dragging = true;
    }
  };
  canvas.onmouseup = () => {
    dragging = false;
  };
  canvas.onmousemove = (e) => {
    let x = e.clientX;
    let y = e.clientY;
    if (dragging) {
      var factor = 100 / canvas.height; // The rotation ratio
      var dx = factor * (x - lastX);
      var dy = factor * (y - lastY);
      currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0); // 将沿Y轴旋转的角度控制在-90到90度之间
      currentAngle[1] += dx;
      mat4.rotateZ(uniforms.u_ModelMatrix, mat4.create(), (currentAngle[1] * Math.PI) / 180);
      mat4.rotateY(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, (currentAngle[0] * Math.PI) / 180);
      mat4.scale(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, vec3.fromValues(3, 3, 3));
      clearGL();
      draw(gl, programInfo, bufferInfo);
    }
    lastX = x;
    lastY = y;
  };
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
