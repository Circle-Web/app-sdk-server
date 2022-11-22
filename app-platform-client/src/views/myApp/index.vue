<script lang="ts" setup>
import { ElCard } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const handleClick = () => {
  router.push({ path: "/ext/detail", query: { id: 1 } });
};
</script>

<template>
  <div class="ext__my-app">
    <ElCard class="ext__app-card" shadow="hover" @click="handleClick">
      <div class="ext__card-body">
        <div class="ext__body-left">
          <img
            src="https://livewebbs2.msstatic.com/extension/pic/369f7e68/96d6f2e7e1_1593152638915.png"
          />
        </div>
        <div class="ext__body-right">
          <div class="ext__body-title">测试测试测试测测试测试测试测试</div>
          <div class="ext__body-version">1.0.14</div>
          <div class="ext__body-desc">
            miaoshu描述描述miaoshu描述描述miaoshu描述描述miaoshu描述描述
          </div>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<style lang="scss">
.ext__app-card {
  width: 300px;
  box-sizing: border-box;
  border-radius: 6px;
  cursor: pointer;
  --el-card-padding: 12px;
  color: rgba(0, 0, 0, 0.65);
  .ext__card-body {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
  }
  .ext__body-left {
    width: 80px;
    height: 80px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .ext__body-right {
    flex: 1;
    margin-left: 6px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
  .ext__body-title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 700;
    font-size: 18px;
    width: 100%;
    transition: all cubic-bezier(0.165, 0.84, 0.44, 1) 0.3s;
  }
  &:hover {
    .ext__body-title {
      color: var(--el-color-warning);
    }
  }
  .ext__body-version {
    font-size: 12px;
  }
  .ext__body-desc {
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
