import { createRouter, createWebHistory } from "vue-router";
import { routes } from "../utils";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/components/layouts/index.vue"),
      redirect: {
        path: "/" + routes[0].path,
      },
      children: routes,
    },
    {
      path: "/404",
      component: () => import("@/components/error-page/404.vue"),
      alias: "/:pathMatch(.*)*",
    },
  ],
});

export default router;
