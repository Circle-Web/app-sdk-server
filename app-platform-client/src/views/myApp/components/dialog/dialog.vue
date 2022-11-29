<template>
  <ElDialog
    :title="title"
    v-model="dialogPopVisible"
    :width="width"
    :before-close="onBeforeClose"
    :center="true"
    v-bind="options"
  >
    <div><component :is="component" /></div>
  </ElDialog>
</template>

<script lang="ts" setup>
import { DialogProps, ElDialog } from "element-plus";
import { type Component, ref } from "vue";

withDefaults(
  defineProps<{
    title?: string;
    width?: string;
    options?: Partial<DialogProps>;
    component: Component;
  }>(),
  {
    width: "550px",
    options: () => ({})
  }
);

const onBeforeClose = done => {
  done();
};

const dialogPopVisible = ref(false);
</script>
