<script lang="ts" setup>
import { onMounted } from "vue";
import * as twgl from "twgl.js";
import f1 from "./cube1-fragmentShader.fs";
import v1 from "./cube1-vertexShader.vs";
import f2 from "./cube2-fragmentShader.fs";
import v2 from "./cube2-vertexmentShader.vs";
import { getContext } from "@/utils/webgl";
import { mat4, vec3 } from "gl-matrix";

// uniform变量
let uniforms = {
  u_ModelMatrix: mat4.scale(mat4.create(), mat4.create(), vec3.fromValues(2, 2, 2)),
  u_ViewMatrix: mat4.lookAt(mat4.create(), vec3.fromValues(25, 65, 35), vec3.fromValues(0, 2, 0), vec3.fromValues(0, 1, 0)),
  u_ProjMatrix: mat4.perspective(mat4.create(), (30 * Math.PI) / 180, 1, 1, 1000),
};

const draw = (gl: WebGL2RenderingContext, program: twgl.ProgramInfo) => {
  gl.useProgram(program.program);
  const bufferInfo = twgl.primitives.createCubeBufferInfo(gl, 3);
  twgl.setBuffersAndAttributes(gl, program, bufferInfo);
  twgl.setUniforms(program, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
};

onMounted(() => {
  const { gl } = getContext();
  gl.enable(gl.DEPTH_TEST);
  const programInfo1 = twgl.createProgramInfo(gl, [v1, f1]);
  const programInfo2 = twgl.createProgramInfo(gl, [v2, f2]);
  draw(gl, programInfo1);
  mat4.translate(uniforms.u_ModelMatrix, uniforms.u_ModelMatrix, vec3.fromValues(4, 0, 0));
  draw(gl, programInfo2);
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
