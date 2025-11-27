<template>
  <div class="layout">
    <el-container class="container">
      <el-aside width="220px">
        <EtoakAside/>
      </el-aside>
      <el-container class="main-container">
        <el-header height="60px">
          <LayoutHeader />
        </el-header>
        <el-main>
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" :key="$route.fullPath" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import EtoakAside from "@/components/EtoakAside.vue";
import LayoutHeader from "@/components/LayoutHeader.vue";
</script>

<style scoped>
.layout {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  margin: 0;
  padding: 0;
}

.container {
  width: 100%;
  height: 100%;
  display: flex !important;
  flex-direction: row !important;
  margin: 0;
  padding: 0;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.el-aside {
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  height: 100%;
  width: 220px;
  transition: width 0.3s;
  overflow-x: hidden;
  flex-shrink: 0;
}

.el-header {
  padding: 0;
  margin: 0;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  width: 100%;
  flex-shrink: 0;
}

.el-main {
  background-color: #f0f2f5;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: visible;
  width: 100%;
  box-sizing: border-box;
}

/* 确保容器没有内边距和外边距 */
* {
  box-sizing: border-box;
}

/* 确保整个应用没有额外的边距 */
html, body, #app {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
}

/* 确保路由视图完全填满父容器 */
.router-view-container {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
