<script lang="ts" setup>
import { ElCard } from "element-plus";
</script>

<template>
  <div class="ext__my-app">
    <ElCard class="ext__app-card" shadow="hover">
      <div class="ext__card-body">
        <div class="ext__body-left">
          <img
            src="https://livewebbs2.msstatic.com/extension/pic/369f7e68/96d6f2e7e1_1593152638915.png"
          />
        </div>
        <div class="ext__body-right">
          <div class="ext__body-title">ceshiceshi</div>
          <div class="ext__body-version">1.0.14</div>
          <div class="ext__body-desc">miaoshu描述描述</div>
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
  color: rgba(0, 0, 0, 0.65);
  .ext__card-body {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
  }
  .ext__body-left {
    width: 100px;
    height: 100px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .ext__body-right {
    margin-left: 6px;
    flex: 1;
    line-height: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
  .ext__body-title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 700;
    font-size: 16px;
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
