import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "/help", component: () => import("pages/Help.vue") },
      { path: "/strategies", component: () => import("pages/Strategies.vue") },
      { path: "/settings", component: () => import("pages/Settings.vue") },
      { path: "/checkpair", component: () => import("pages/CheckPair.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
