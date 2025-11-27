<template>
  <div class="test-container">
    <h1>用户管理页面测试</h1>
    <p>如果你能看到这个内容，说明路由工作正常</p>
    <el-button type="primary" @click="testClick">测试按钮</el-button>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

function testClick() {
  ElMessage.success('按钮点击成功！')
}
</script>

<style scoped>
.test-container {
  padding: 40px;
  background: white;
  min-height: 400px;
}

h1 {
  color: #409eff;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  margin-bottom: 20px;
}
</style>
