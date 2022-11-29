import dayjs from "dayjs";
import { resolve } from "path";
import pkg from "./package.json";
import { warpperEnv } from "./build";
import { getPluginsList } from "./build/plugins";
import { UserConfigExport, ConfigEnv, loadEnv } from "vite";

/** 当前执行node命令时文件夹的地址（工作目录） */
const root: string = process.cwd();

/** 路径查找 */
const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};

/** 设置别名 */
const alias: Record<string, string> = {
  "@": pathResolve("src"),
  "@build": pathResolve("build")
};

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
};

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH } =
    warpperEnv(loadEnv(mode, root));
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias
    },
    // 服务端渲染
    server: {
      // 是否开启 https
      https: false,
      // 端口号
      port: VITE_PORT,
      host: "0.0.0.0",
      // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
      proxy: {}
    },
    plugins: getPluginsList(command, VITE_CDN, VITE_COMPRESSION),
    optimizeDeps: {
      include: [
        "xlsx",
        "dayjs",
        "pinia",
        "swiper",
        "intro.js",
        "vue-i18n",
        "lodash",
        "lodash-es",
        "cropperjs",
        "jsbarcode",
        "sortablejs",
        "swiper/vue",
        "@vueuse/core",
        "vue3-danmaku",
        "v-contextmenu",
        "vue-pdf-embed",
        "lodash-unified",
        "china-area-data",
        "@faker-js/faker",
        "vue-json-pretty",
        "@logicflow/core",
        "@pureadmin/utils",
        "@howdyjs/mouse-menu",
        "@logicflow/extension",
        "@amap/amap-jsapi-loader",
        "el-table-infinite-scroll",
        "@wangeditor/editor-for-vue",
        "xgplayer/dist/simple_player",
        "xgplayer/es/controls/volume",
        "vuedraggable/src/vuedraggable",
        "xgplayer/es/controls/screenShot",
        "xgplayer/es/controls/playbackRate"
      ],
      exclude: ["@pureadmin/theme/dist/browser-utils"]
    },
    build: {
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: pathResolve("index.html")
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        }
      }
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
};
