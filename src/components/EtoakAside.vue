<template>
  <div>
    <h3 class="logo">
      <span class="title"><el-icon><Guide /></el-icon>Devops系统</span>
      <el-divider style="margin: 10px 0px"></el-divider>
    </h3>

    <!-- 添加导航菜单 -->
    <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical"
        @select="handleSelect">
      <el-menu-item index="/home">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </el-menu-item>

      <el-menu-item index="/user">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>
      
      <el-menu-item index="/hosts">
        <el-icon><User /></el-icon>
        <span>主机管理</span>
      </el-menu-item>
      

      <el-menu-item index="/settings">
        <el-icon><Setting /></el-icon>
        <span>系统设置</span>
      </el-menu-item>

      <el-sub-menu index="sub1">
        <template #title>
          <el-icon><Document /></el-icon>
          <span>文档管理</span>
        </template>
        <el-menu-item index="/docs/list">文档列表</el-menu-item>
        <el-menu-item index="/docs/create">新建文档</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Guide, House, User, Setting, Document } from "@element-plus/icons-vue";

const router = useRouter()
const route = useRoute()
const activeIndex = ref(route.path)

// 监听路由变化，更新激活的菜单项
watch(
    () => route.path,
    (newPath) => {
      activeIndex.value = newPath
    }
)

// 处理菜单选择
const handleSelect = (key: string) => {
  router.push(key)
}
</script>

<style scoped>
.en{
  font-weight: 400;
  font-size: 16px;
  color: #585656;
}
.logo .title{
  font-size: 25px;
  color: #213547;
}
.logo {
  width: 200px;
}
</style>
