<template>
  <ElDialog :title="title" v-model="dialogPopVisible" :width="width" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" v-bind="options">
    <component :is="component" @close="handleClose" />
  </ElDialog>
</template>

<script lang="ts" setup>
  import {
    DialogProps,
    ElDialog
  } from "element-plus";
  import {
    type Component,
    ref,
    watch
  } from "vue";

  const props = withDefaults(
    defineProps < {
      title ? : string;
      width ? : string;
      options ? : Partial < DialogProps > ;
      component: Component;
      remove: () => void;
    } > (), {
      width: "550px",
      options: () => ({})
    }
  );

  const dialogPopVisible = ref(true);

  watch(dialogPopVisible, (val) => {
    if (!val) {
      props.remove()
    }
  });

  const handleClose = () => {
    dialogPopVisible.value = false;
  }

</script>
