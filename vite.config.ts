import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import glsl from "vite-plugin-glsl";
// @ts-ignore
import getFileNamePlugin from "./src/plugins/index.ts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    glsl(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
    getFileNamePlugin(),
  ],
  resolve: {
    // 配置路径别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
