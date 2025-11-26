<template>
  <div class="layout-header">
    <div class="header-left">
      <el-icon class="collapse-btn" @click="toggleCollapse">
        <Fold v-if="!isCollapse" />
        <Expand v-else />
      </el-icon>
      
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="header-right">
      <div class="action-item">
        <el-icon><FullScreen /></el-icon>
      </div>
      <div class="action-item">
        <el-icon><Search /></el-icon>
      </div>
      <div class="action-item">
        <el-icon><Sort /></el-icon> <!-- Translate placeholder -->
      </div>
      <div class="action-item">
        <el-icon><Bell /></el-icon>
      </div>
      
      <el-dropdown trigger="click" class="user-dropdown" @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="30" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <span class="username">DevOps Admin</span>
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="settings">系统设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Fold, Expand, FullScreen, Search, Sort, Bell, CaretBottom 
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
  // Emit event if needed to control sidebar
}

const breadcrumbs = computed(() => {
  return route.matched.filter(item => item.meta && item.meta.title && item.meta.title !== '首页')
})

// 个人中心
const handleProfile = () => {
  router.push('/profile')
}

// 系统设置
const handleSettings = () => {
  router.push('/settings')
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 清除本地存储
    localStorage.clear()
    sessionStorage.clear()
    
    ElMessage.success('退出登录成功')
    
    // 跳转到登录页
    router.push('/login')
  } catch {
    // 用户取消
  }
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      handleProfile()
      break
    case 'settings':
      handleSettings()
      break
    case 'logout':
      handleLogout()
      break
  }
}
</script>

<style scoped>
.layout-header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.action-item {
  height: 100%;
  padding: 0 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #5a5e66;
  transition: background .3s;
}

.action-item:hover {
  background: rgba(0,0,0,.025);
}

.action-item .el-icon {
  font-size: 18px;
}

.user-dropdown {
  cursor: pointer;
  margin-left: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-size: 14px;
  color: #606266;
}
</style>
