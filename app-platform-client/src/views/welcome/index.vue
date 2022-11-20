<script setup lang="ts">
import { ref, computed } from "vue";
import { openLink } from "@pureadmin/utils";

defineOptions({
  name: "Welcome"
});

const date: Date = new Date();
const loading = ref<boolean>(true);

setTimeout(() => {
  loading.value = !loading.value;
}, 800);

const greetings = computed(() => {
  if (date.getHours() >= 0 && date.getHours() < 12) {
    return "上午阳光明媚，祝你薪水翻倍🌞！";
  } else if (date.getHours() >= 12 && date.getHours() < 18) {
    return "下午小风娇好，愿你青春不老😃！";
  } else {
    return "折一根天使羽毛，愿拂去您的疲惫烦恼忧伤🌛！";
  }
});
</script>

<template>
  <div class="welcome">
    <el-card class="top-content dark:border-none">
      <div class="left-mark select-none">
        <img
          src="https://avatars.githubusercontent.com/u/44761321?v=4"
          title="直达仓库地址"
          @click="openLink('https://github.com/xiaoxian521/vue-pure-admin')"
        />
        <span>{{ greetings }}</span>
      </div>
    </el-card>
  </div>
</template>

<style module scoped>
.size {
  height: 335px;
}
</style>

<style lang="scss" scoped>
.main-content {
  margin: 0 !important;
}

.welcome {
  height: 100%;

  .top-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    background: var(--el-bg-color);

    .left-mark {
      display: flex;
      align-items: center;

      img {
        display: block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
        cursor: pointer;
      }

      span {
        font-size: 14px;
      }
    }
  }
}
</style>
