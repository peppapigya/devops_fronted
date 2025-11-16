<template>
  <!-- 圣杯布局 -->
  <div class="layout">
    <el-container class="container">
      <el-aside width="200px">
        <EtoakAside/>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-content">
            Header
          </div>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
        <el-footer>
          <div class="footer-content">
            Footer
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import EtoakAside from "@/components/EtoakAside.vue";
</script>

<style scoped>
.layout, .container {
  height: 100%;
  width: 100%;
}

.layout {
  padding: 0;
  width: 100vw;
  height: 100vh;
}

.container {
  width: 100% !important;
  height: 100% !important;
}

.header-content, .footer-content {
  background-color: #F9F9F9;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.el-aside {
  background-color: #F9F9F9;
  border-radius: 4px;
  width: 200px !important;
  min-width: 200px !important;
  max-width: 200px !important;
}

.el-main {
  width: calc(100vw - 200px);
  padding: 0;
  overflow: auto;
}

.el-header, .el-footer {
  width: calc(100vw - 200px);
  min-width: calc(100vw - 200px);
}
</style>
