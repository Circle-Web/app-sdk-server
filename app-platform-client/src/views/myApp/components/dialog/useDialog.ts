import Dialog from "./dialog.vue";
import { h, render } from "vue";

const createMount = opts => {
  const mountNode = document.createElement("div");
  document.body.appendChild(mountNode);
  const vnode = h(Dialog, {
    ...opts,
    modelValue: true,
    remove() {
      document.body.removeChild(mountNode);
    }
  });
  vnode.appContext = Modal._context;
  render(vnode, mountNode);
};

interface ModalOptions {
  title?: string;
  id?: string;
}

export const Modal = {
  install(app) {
    app.config.globalProperties.$myDialog = {
      show: (title, component, options: ModalOptions = {}) => {
        options.id = options.id || "v3popup_" + 1; //唯一id 删除组件时用于定位
        createMount({
          title,
          component,
          options
        });
      }
    };
  },
  _context: null
};
