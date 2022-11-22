import { $t } from "@/plugins/i18n";
import type { RouteConfigsTable } from "/#/index";
const Layout = () => import("@/layout/index.vue");

const homeRouter: RouteConfigsTable = {
  path: "/ext",
  name: "ExtApp",
  component: Layout,
  redirect: "/ext/myApp",
  meta: {
    icon: "chrome-filled",
    title: $t("menus.extApp")
  },
  children: [
    {
      path: "/ext/myApp",
      name: "MyApp",
      component: () => import("@/views/myApp/index.vue"),
      meta: {
        title: $t("menus.hsMyExtApp"),
        icon: "shop"
      }
    },
    {
      path: "/ext/list",
      name: "AppList",
      component: () => import("@/views/appList/index.vue"),
      meta: {
        title: $t("menus.hsExtAppList"),
        icon: "list"
      }
    },
    {
      path: "/ext/detail",
      name: "AppDetail",
      component: () => import("@/views/appDetail/index.vue"),
      meta: {
        title: $t("menus.hsExtAppDetail"),
        showLink: false
      }
    }
  ]
};

export default homeRouter;
