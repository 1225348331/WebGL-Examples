<script lang="ts" setup>
import { computed, ref } from "vue";
import { SlackOutlined } from "@ant-design/icons-vue";
import type { MenuProps } from "ant-design-vue";
import { menuItems } from "@/utils";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
/** 当前路由名称 */
const currentRouteName = computed(() => {
  return (route.name as string)!.split("-");
});
/** 当前菜单展开项 */
const openKeys = ref<string[]>([currentRouteName.value[0]]);
/** 菜单栏选中key */
const selectedKeys = ref<string[]>([currentRouteName.value[1]]);
/** 菜单栏点击事件 */
const handleClick: MenuProps["onClick"] = (e) => {
  router.push({
    path: encodeURI(e.keyPath!.join("-")),
  });
};
</script>
<template>
  <a-layout class="main">
    <a-layout-sider class="sider">
      <div class="title"><SlackOutlined spin style="margin-right: 5px; color: #e0392f" />WebGL编程指南</div>
      <a-menu
        id="menu"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        :inlineIndent="12"
        :items="menuItems"
        @click="handleClick"
      />
    </a-layout-sider>
    <a-layout class="app-container">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item v-for="item in currentRouteName">{{ item }}</a-breadcrumb-item>
      </a-breadcrumb>
      <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, borderRadius: '6px' }">
        <div class="canvas-container">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<style lang="scss" scoped>
.main {
  --sider-width: 250px;
  .sider {
    width: var(--sider-width) !important;
    max-width: var(--sider-width) !important;
    overflow: auto;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    background: #fff;
    padding: 16px 0px;

    // 整个滚动条
    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }

    .title {
      text-align: center;
      margin-bottom: 10px;
      font-size: 24px;
      font-weight: bolder;
    }

    #menu {
      border: 0px;
    }
  }

  .app-container {
    margin-left: var(--sider-width);
    padding: 0 24px 24px;
    height: 100vh;
  }
}
</style>
