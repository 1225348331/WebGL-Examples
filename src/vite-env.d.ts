/// <reference types="vite/client" />

declare module "*.vs" {
  const value: string;
  export default value;
}

declare module "*.fs" {
  const value: string;
  export default value;
}

// 对所有以 virtual-scy: 开头的模块声明共同的类型
declare module "virtual-scy:*" {
  // 声明一个变量，保存这个值的类型
  const val: any;
  // 告诉 ts，这个模块默认导出的值就是这个 val 变量的类型
  export default val;
}


