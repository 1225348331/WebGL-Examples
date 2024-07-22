import * as d3 from "d3";
import { minBy, maxBy } from "lodash-es";
import { color } from "d3";
import imgArr from "virtual-scy:views";

interface GridData {
  LAT: string;
  LONG: string;
  value: string;
}

// 获取索引数组
export const getIndices = (row: number, col: number) => {
  var arr = [];
  for (var i = 1; i < row; i++) {
    for (var j = 0; j < col - 1; j++) {
      var x = i * col + j;
      var y = (i - 1) * col + j;
      var z = y + 1;
      var arr1 = [x, y, z, x, z, x + 1];
      arr.push(...arr1);
    }
  }
  return arr;
};

// 解析格点数据
export const ParseData = (gridData: GridData[], row: number, col: number) => {
  let data = gridData.map((item) => {
    return {
      lat: parseFloat(item.LAT),
      lon: parseFloat(item.LONG),
      value: parseFloat(item.value),
    };
  });
  // let imgData: number[] = new Uint8Array();
  let positionData: number[] = []; // 顶点数据
  let colorData: number[] = []; // 颜色数据
  let latMin = minBy(data, (item) => item.lat)!.lat; // 纬度最小值
  let latMax = maxBy(data, (item) => item.lat)!.lat; // 纬度最大值
  let lonMin = minBy(data, (item) => item.lon)!.lon; // 经度最小值
  let lonMax = maxBy(data, (item) => item.lon)!.lon; // 经度最大值
  let valMin = minBy(data, (item) => item.value)!.value; // 数据最小值
  let valMax = maxBy(data, (item) => item.value)!.value; // 数据最大值
  var lonLinear = d3.scaleLinear([lonMin, lonMax], [-1.0, 1.0]); // 经度映射器
  var latLinear = d3.scaleLinear([latMin, latMax], [-1.0, 1.0]); // 纬度映射器
  var valLinear = d3.scaleLinear([valMin, valMax], [0.0, 1.0]); // 数据映射器
  const color = d3.scaleSequential(d3.interpolateRainbow);
  //
  data.forEach((item) => {
    positionData.push(lonLinear(item.lon), latLinear(item.lat));
    let itemColor = Object.values(d3.color(color(valLinear(item.value)))!).map((item) => item / 255);
    colorData.push(itemColor[0], itemColor[1], itemColor[2]);
  });
  let indices = getIndices(row, col);

  return {
    positionData,
    colorData,
    indices,
  };
};

/**
 * @description: 将格点数据转换为行和列
 * @param {GridData} gridData 格点数据
 */
export const GridToImg = (gridData: GridData[]) => {
  let data = gridData.map((item) => {
    return {
      lat: parseFloat(item.LAT),
      lon: parseFloat(item.LONG),
      value: parseFloat(item.value),
    };
  });
  let valMin = minBy(data, (item) => item.value)!.value; // 数据最小值
  let valMax = maxBy(data, (item) => item.value)!.value; // 数据最大值
  let imgData: number[] = [];
  data.forEach((item) => {
    let gray = Math.round((255 * (item.value - valMin)) / (valMax - valMin));
    imgData.push(gray, gray, gray, 255);
  });
  return imgData;
};

const defaultRampColors: { [key: string | number]: string } = {
  0.0: "#313695",
  0.1: "#4575b4",
  0.2: "#74add1",
  0.3: "#abd9e9",
  0.4: "#e0f3f8",
  0.5: "#fee090",
  0.6: "#fdae61",
  0.7: "#f46d43",
  0.8: "#d73027",
  1.0: "#a50026",
};

/**
 * @description: 获取渐变色颜色数组
 * @param {object} colors
 */
export function getColorRamp(colors: { [key: string]: string } = defaultRampColors) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  canvas.width = 256;
  canvas.height = 1;

  const gradient = ctx.createLinearGradient(0, 0, 256, 0);
  for (const stop in colors) {
    gradient.addColorStop(+stop, colors[stop]);
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);

  return new Uint8Array(ctx.getImageData(0, 0, 256, 1).data);
}

/**
 * @description: 获取归一化颜色
 * @param {string} index defaultRampColors对象的key值
 */
export const getColor = (index: string | number) => {
  let rgb = color(defaultRampColors[index])?.rgb()!;
  return [rgb.r / 255, rgb.g / 255, rgb.b / 255, 1.0];
};

/**
 * @description: 获取所有的文件
 */
export const getAllPng = () => {
  return imgArr;
};
