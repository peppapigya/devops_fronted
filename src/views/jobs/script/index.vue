<template>
  <div class="job-container">
    <h1>脚本执行页面</h1>
    <p>这是一个简化的脚本执行页面</p>
    <el-button type="primary">测试按钮</el-button>
    <div class="content">
      <h2>脚本内容</h2>
      <pre>{{ scriptContent }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 脚本基本信息
const scriptName = ref('untitled.py')
const scriptType = ref('python')
const scriptContent = ref(`#!/usr/bin/env python3
# 示例Python脚本

print("Hello, DevOps Platform!")
print("这是一个示例脚本")
import sys
print(f"命令行参数: {sys.argv}")
`)

onMounted(() => {
  console.log('脚本执行组件已挂载')
  ElMessage.success('脚本执行组件已成功挂载')
})
</script>

<style scoped>
.job-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 100px);
}

.content {
  margin-top: 20px;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
}

pre {
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>