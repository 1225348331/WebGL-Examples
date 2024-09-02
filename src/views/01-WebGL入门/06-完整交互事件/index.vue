<script lang="ts" setup>
import { canvasPositionToGL, initWebGL } from "@/utils/webgl";
import { onMounted, ref } from "vue";
import * as twgl from "twgl.js";
import vs from "./vertexShader.vs";
import fs from "./fragmentShader.fs";
import { Track } from "./Track";
import { Compose } from "./Compose";
import { Poly } from "./Poly";

// 创建时间轨 - 透明度
const createTrack = (targetObj: any) => {
  const track = new Track(targetObj);
  track.keyMap.set("alpha", [
    [500, 1.0],
    [1000, 0],
    [1500, 1.0],
  ]);
  return track;
};

let compose = new Compose();
let collection: Poly;
let isMove = false;
onMounted(() => {
  const { gl, programInfo, canvas, clearGL } = initWebGL(vs, fs);

  canvas.onmousedown = (e) => {
    // 右击删除顶点
    if (e.button == 2) {
      collection && collection.popVertices()
      isMove = false;
    } else {
      if (!collection) {
        collection = new Poly({ gl, programInfo, type: ["POINTS", "LINE_STRIP"] });
      }
      const [x, y] = canvasPositionToGL(e);
      const alpha = 1.0;
      const targetObj1 = { alpha, x, y };
      const targetObj2 = { alpha, x, y };
      // 创建轨道对象
      const track1 = createTrack(targetObj1);
      const track2 = createTrack(targetObj2);
      // 将轨道对象添加进合成对象
      compose.add(track1);
      compose.add(track2);
      // 将点击点对象 位置、透明度添加进集合
      collection.addVertices(targetObj1);
      collection.addVertices(targetObj2);
      isMove = true;
    }
  };

  canvas.onmousemove = (e) => {
    if (isMove) {
      const [x, y] = canvasPositionToGL(e);
      const movePoint = collection.vertices[collection.vertices.length - 1];
      movePoint.x = x;
      movePoint.y = y;
    }
  };

  canvas.oncontextmenu = () => {
    return false;
  };

  // 渲染函数
  const render = () => {
    clearGL();
    collection && collection.draw();
  };

  // 动画函数
  const animate = () => {
    compose.update(new Date());
    render();
    requestAnimationFrame(animate);
  };

  // 开启动画
  animate();
});
</script>
<template>
  <canvas></canvas>
</template>
<style lang="scss" scoped></style>
