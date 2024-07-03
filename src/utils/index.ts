import { type RouteRecordRaw } from "vue-router";
import type { ItemType } from "ant-design-vue";
import { MenuItemType, SubMenuType } from "ant-design-vue/es/menu/src/interface";

/* views目录 */
const compModules = import.meta.glob("@/views/**/index.vue");
const routes: RouteRecordRaw[] = Object.entries(compModules).map(([compPath, comp]) => {
  let path = compPath.replace("/src/views/", "").replace("/index.vue", "");
  return {
    name: path.replace(/\b\d{2}-/g, "").replace("/", "-"),
    path: encodeURI(path.replace(/\b\d{2}-/g, "").replace("/", "-")),
    component: comp,
  };
});

/* 根据views目录生成侧边栏 */
const map: { [key: string]: string[] } = {};
routes.forEach((item) => {
  const key = (item.name as string).split("-")[0];
  const childKey = (item.name as string).split("-")[1];
  if (!map.hasOwnProperty(key)) map[key] = [];
  map[key].push(childKey);
});
const getMenuItems = (keyArray: string[]) => {
  const menuItems: ItemType[] = [];
  keyArray?.forEach((key) => {
    let obj: SubMenuType | MenuItemType = {
      key: key,
      label: key,
    };
    if (map[key]) (obj as SubMenuType).children = getMenuItems(map[key]);
    menuItems.push(obj);
  });
  return menuItems;
};

const menuItems = getMenuItems(Object.keys(map));

export { menuItems, routes };
