<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts" setup>

</script>

<style>
html,body,#app{
  height: 100vh;
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
  overflow-x: hidden;
  overflow-y: auto;
}
*{  
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 确保容器元素不会产生额外的滚动条 */
.el-container,
.el-main,
.el-card,
.el-table-wrapper {
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: visible;
}

/* 确保表格内容可以正确显示 */
.el-table {
  width: 100% !important;
  box-sizing: border-box;
  border-collapse: collapse;
}

/* 确保对话框包装器默认居中 */
.el-dialog__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>