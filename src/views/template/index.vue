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
}

.layout {
  padding: 10px 0px 10px 10px;
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
}
</style>
