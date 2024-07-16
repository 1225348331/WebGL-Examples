<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { initWebGL } from "@/utils/webgl";
import VSHADER_SOURCE from "./vertexShader.vs";
import FSHADER_SOURCE from "./fragmentShader.fs";
import jsonData from "@/assets/data/2019060106_TSK.json";
import jsonData1 from "@/assets/data/2019060112_TSK.json";
import jsonData2 from "@/assets/data/2019060118_TSK.json";
import { ParseData } from "@/utils/utils";
import * as twgl from "twgl.js";
import { Pane } from "tweakpane";

interface GridData {
  LAT: string;
  LONG: string;
  value: string;
}

interface JSONData {
  data: GridData[];
  row: number;
  col: number;
}
// 绘制
const draw = (gl: WebGL2RenderingContext, programInfo: twgl.ProgramInfo, jsonData: JSONData) => {
  // 解析格点数据
  const { positionData, colorData, indices } = ParseData(jsonData.data, jsonData.row, jsonData.col);
  // 设置顶点数据、颜色数据、索引数据
  let arrays: twgl.Arrays | null = {
    a_Position: {
      numComponents: 2,
      data: positionData,
    },
    a_Color: {
      numComponents: 3,
      data: colorData,
    },
    indices: {
      numComponents: 1,
      data: indices,
      type: gl.UNSIGNED_INT, // 用32位整数作为索引，移除了几何体索引的大小限制
    },
  };
  // 创建缓冲区
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  // 设置缓冲区和属性信息
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  // 绘制图形
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
  arrays = null;
};

// 参数面板
const pane = new Pane({
  title: "绘制格点数据",
});
pane.addBlade({
  view: "list",
  label: "温度图",
  options: [
    { text: "6时温度图", value: jsonData },
    { text: "12时温度图", value: jsonData1 },
    { text: "18时温度图", value: jsonData2 },
  ],
  value: jsonData,
});

onMounted(() => {
  // 初始化webgl
  const { gl, programInfo } = initWebGL(VSHADER_SOURCE, FSHADER_SOURCE);
  // 绘制图形
  draw(gl, programInfo, jsonData as JSONData);

  pane.on("change", (data) => {
    draw(gl, programInfo, data.value as JSONData);
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
