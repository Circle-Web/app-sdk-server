<script lang="ts" setup>
import { ElCard, ElInput, ElButton } from "element-plus";
import { getCurrentInstance } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const handleClick = () => {
  router.push({ path: "/ext/detail", query: { id: 1 } });
};

const { proxy } = getCurrentInstance();
const addPlugin = () => {
  proxy.$myDialog.show("111");
  // this.$myDialog({
  //   title: "添加插件",
  //   component: "addPlugin",
  //   options: {
  //     width: "600px",
  //     beforeClose: done => {
  //       done();
  //     }
  //   }
  // });
};
</script>

<template>
  <div class="ext__my-app">
    <div class="ext__opetor">
      <ElInput placeholder="请输入关键词回车进行搜索" />
      <ElButton type="primary">搜索</ElButton>
      <ElButton type="primary" @click="addPlugin">创建插件</ElButton>
    </div>
    <div class="ext_app-card-list">
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
  </div>
</template>

<style lang="scss">
.ext__my-app {
  width: 100%;
  margin: 0 !important;
  padding: 24px;
  box-sizing: border-box;
  .ext_app-card-list {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    gap: 24px;
    margin-top: 12px;
  }
  .ext__opetor {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 50%;
    .el-input {
      width: 300px;
      margin-right: 12px;
    }
  }
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
  .ext__app-card-add {
    height: 100%;
  }
}
</style>
