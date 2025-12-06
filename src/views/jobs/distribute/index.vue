<template>
  <div class="distribute-page">
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">脚本文件分发</h2>
        <p class="page-subtitle">高效、安全地将本地脚本分发至多台目标服务器</p>
      </div>
      <div class="header-actions">
        <!-- 预留操作按钮位置 -->
      </div>
    </div>

    <div class="main-container">
      <el-row :gutter="24">
        <!-- 左侧：文件上传 -->
        <el-col :xs="24" :sm="24" :md="10" :lg="9" :xl="8">
          <el-card shadow="hover" class="feature-card upload-card">
            <template #header>
              <div class="card-header">
                <div class="header-icon upload-icon">
                  <el-icon><UploadFilled /></el-icon>
                </div>
                <div class="header-text">
                  <span class="card-title">文件上传</span>
                  <span class="card-desc">选择或拖拽文件到此处</span>
                </div>
              </div>
            </template>

            <div class="upload-area">
              <el-upload
                v-model:file-list="fileList"
                class="upload-dragger-custom"
                drag
                multiple
                :auto-upload="false"
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
                :show-file-list="false"
              >
                <div class="upload-content">
                  <el-icon class="upload-icon-large"><UploadFilled /></el-icon>
                  <div class="upload-text">
                    <span class="primary-text">点击或拖拽文件上传</span>
                    <span class="secondary-text">支持任意类型，单文件最大 500MB</span>
                  </div>
                </div>
              </el-upload>

              <!-- 自定义文件列表 -->
              <div class="file-list-container" v-if="fileList.length > 0">
                <div class="list-header">
                  <span>已选文件 ({{ fileList.length }})</span>
                  <el-button link type="primary" size="small" @click="fileList = []">清空</el-button>
                </div>
                <el-scrollbar max-height="300px">
                  <div class="custom-file-list">
                    <div v-for="file in fileList" :key="file.uid" class="file-item-card">
                      <div class="file-icon-wrapper">
                        <el-icon><Document /></el-icon>
                      </div>
                      <div class="file-info">
                        <div class="file-name" :title="file.name">{{ file.name }}</div>
                        <div class="file-size">{{ formatFileSize(file.size || 0) }}</div>
                      </div>
                      <div class="file-actions">
                        <el-button link type="danger" :icon="Close" @click="handleFileRemove(file)" />
                      </div>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧：分发配置 -->
        <el-col :xs="24" :sm="24" :md="14" :lg="15" :xl="16">
          <el-card shadow="hover" class="feature-card config-card">
            <template #header>
              <div class="card-header">
                <div class="header-icon config-icon">
                  <el-icon><Setting /></el-icon>
                </div>
                <div class="header-text">
                  <span class="card-title">分发配置</span>
                  <span class="card-desc">设置目标服务器及传输选项</span>
                </div>
                <div class="header-action">
                  <el-button
                    type="primary"
                    size="default"
                    :icon="Promotion"
                    @click="handleDistribute"
                    :disabled="fileList.length === 0 || distributeForm.targetHosts.length === 0"
                    :loading="distributing"
                    class="distribute-btn"
                  >
                    {{ distributing ? '正在分发...' : '开始分发' }}
                  </el-button>
                </div>
              </div>
            </template>

            <el-form :model="distributeForm" label-position="top" class="config-form">
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item label="目标服务器" required>
                    <el-select
                      v-model="distributeForm.targetHosts"
                      multiple
                      filterable
                      placeholder="请选择目标服务器"
                      style="width: 100%"
                      :loading="loadingHosts"
                      tag-type="primary"
                    >
                      <el-option
                        v-for="host in hosts"
                        :key="host.value"
                        :label="host.label"
                        :value="Number(host.value)"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="目标路径" required>
                    <el-input
                      v-model="distributeForm.targetPath"
                      placeholder="/opt/scripts"
                    >
                      <template #prefix>
                        <el-icon><FolderOpened /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="传输用户">
                    <el-select v-model="distributeForm.transferUser" style="width: 100%">
                      <template #prefix>
                        <el-icon><User /></el-icon>
                      </template>
                      <el-option label="root" value="root" />
                      <el-option label="admin" value="admin" />
                      <el-option label="user" value="user" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="form-section-divider">高级选项</div>

              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="文件权限">
                    <el-input
                      v-model="distributeForm.filePermission"
                      placeholder="755"
                      maxlength="3"
                    >
                      <template #suffix>
                        <el-tooltip content="Unix 权限格式，如 755 (rwxr-xr-x)" placement="top">
                          <el-icon><QuestionFilled /></el-icon>
                        </el-tooltip>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="覆盖策略">
                    <div class="switch-wrapper">
                      <el-switch v-model="distributeForm.overwrite" />
                      <span class="switch-label">覆盖已存在文件</span>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="安全备份">
                    <div class="switch-wrapper">
                      <el-switch v-model="distributeForm.backup" />
                      <span class="switch-label">覆盖前创建备份</span>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

            <!-- 分发日志 (终端风格) -->
            <div class="log-section" v-if="distributeLogs.length > 0">
              <div class="log-header">
                <div class="log-title">
                  <el-icon><Monitor /></el-icon>
                  <span>执行日志</span>
                </div>
                <el-button link size="small" @click="clearLogs">清空</el-button>
              </div>
              <div class="terminal-window">
                <el-scrollbar max-height="300px" ref="logScrollbar">
                  <div class="terminal-content">
                    <div
                      v-for="(log, index) in distributeLogs"
                      :key="index"
                      class="log-line"
                      :class="log.status"
                    >
                      <span class="log-time">[{{ log.time }}]</span>
                      <span class="log-host">{{ log.hostName }}</span>
                      <span class="log-file">{{ log.fileName }}</span>
                      <span class="log-status" :class="log.status">
                        {{ log.status === 'success' ? 'SUCCESS' : log.status === 'failed' ? 'FAILED' : 'PROCESSING' }}
                      </span>
                      <span class="log-msg" v-if="log.message">- {{ log.message }}</span>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox, type UploadUserFile, type UploadFile } from 'element-plus'
import {
  UploadFilled,
  FolderOpened,
  QuestionFilled,
  Document,
  Close,
  Setting,
  User,
  Monitor,
  Promotion
} from '@element-plus/icons-vue'
import { HostsApi } from '@/api/hosts'
import { DistributeApi } from '@/api/jobs/fileDistribute'

// 分发日志接口
interface DistributeLog {
  fileName: string
  hostName: string
  status: 'success' | 'failed' | 'processing'
  message?: string
  time: string
  duration?: string
}

// 文件列表
const fileList = ref<UploadUserFile[]>([])
const logScrollbar = ref()

// 分发表单
const distributeForm = reactive({
  targetHosts: [] as number[],
  targetPath: '/opt/scripts',
  transferUser: 'root',
  filePermission: '755',
  overwrite: true,
  backup: true
})

// 状态
const distributing = ref(false)
const loadingHosts = ref(false)

// 数据
const hosts = ref<any[]>([])
const distributeLogs = ref<DistributeLog[]>([])

// 监听日志变化，自动滚动到底部
watch(() => distributeLogs.value.length, () => {
  nextTick(() => {
    if (logScrollbar.value) {
      const wrap = logScrollbar.value.wrapRef
      if (wrap) {
        wrap.scrollTop = wrap.scrollHeight
      }
    }
  })
})

// 处理文件变化
const handleFileChange = (uploadFile: UploadFile) => {
  console.log('File added:', uploadFile)
}

// 处理文件移除
const handleFileRemove = (uploadFile: UploadFile) => {
  const index = fileList.value.indexOf(uploadFile)
  if (index > -1) {
    fileList.value.splice(index, 1)
  }
}

// 获取主机列表
const getHosts = async () => {
  try {
    loadingHosts.value = true
    const response = await HostsApi.getSelectList()
    if (Array.isArray(response)) {
      hosts.value = [...response]
    }
  } catch (error) {
    ElMessage.error('获取主机列表失败')
  } finally {
    loadingHosts.value = false
  }
}

// 开始分发
const handleDistribute = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请上传要分发的文件')
    return
  }

  if (distributeForm.targetHosts.length === 0) {
    ElMessage.warning('请选择目标服务器')
    return
  }

  if (!distributeForm.targetPath) {
    ElMessage.warning('请输入目标路径')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认将 ${fileList.value.length} 个文件分发到 ${distributeForm.targetHosts.length} 台服务器？`,
      '确认分发',
      { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }
    )

    distributing.value = true
    distributeLogs.value = []

    // 遍历文件列表，逐个发送请求 (因为后端接口设计为单次接收一个文件)
    let successCount = 0
    let failedCount = 0

    for (const file of fileList.value) {
      if (!file.raw) continue

      // 构建 FormData
      const formData = new FormData()
      formData.append('files', file.raw)
      
      formData.append('targetHosts', JSON.stringify(distributeForm.targetHosts))

      formData.append('remotePath', distributeForm.targetPath)
      formData.append('user', distributeForm.transferUser)
      if (distributeForm.filePermission) {
        formData.append('permission', distributeForm.filePermission)
      }
      formData.append('overwrite', String(distributeForm.overwrite))
      formData.append('backup', String(distributeForm.backup))

      try {
        const result = await DistributeApi.distributeFiles(formData)

        // 处理 Map 结果: keys are IPs
        if (result && typeof result === 'object') {
          Object.keys(result).forEach(ip => {
            const list = result[ip]
            if (Array.isArray(list)) {
              list.forEach(item => {
                const isSuccess = item.success
                if (isSuccess) successCount++
                else failedCount++

                distributeLogs.value.push({
                  fileName: file.name,
                  hostName: item.address || ip,
                  status: isSuccess ? 'success' : 'failed',
                  message: item.message,
                  time: new Date().toLocaleTimeString(),
                  duration: item.duration
                })
              })
            }
          })
        }
      } catch (err: any) {
        console.error(`File ${file.name} distribute error:`, err)
        failedCount += distributeForm.targetHosts.length
        distributeLogs.value.push({
          fileName: file.name,
          hostName: 'System',
          status: 'failed',
          message: err.message || 'Request Failed',
          time: new Date().toLocaleTimeString()
        })
      }
    }

    if (failedCount === 0 && successCount > 0) {
      ElMessage.success(`分发完成，共成功 ${successCount} 个任务`)
      fileList.value = []
    } else if (successCount > 0) {
      ElMessage.warning(`分发完成，成功 ${successCount} 个，失败 ${failedCount} 个`)
    } else if (failedCount > 0) {
      ElMessage.error(`分发失败`)
    }

  } catch (error: any) {
    if (error !== 'cancel') {
      console.error(error)
      ElMessage.error(error.message || '操作失败')
    }
  } finally {
    distributing.value = false
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

// 清空日志
const clearLogs = () => {
  distributeLogs.value = []
}

onMounted(() => {
  getHosts()
})
</script>

<style scoped>
.distribute-page {
  padding: 24px;
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.page-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.feature-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  height: 100%;
  background: #ffffff;
}

.feature-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  padding-bottom: 0;
}

.header-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
}

.upload-icon {
  background-color: #e0e7ff;
  color: #4f46e5;
}

.config-icon {
  background-color: #dcfce7;
  color: #16a34a;
}

.header-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.card-desc {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

/* Upload Styles */
.upload-area {
  padding: 8px 0;
}

.upload-dragger-custom :deep(.el-upload-dragger) {
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  padding: 40px 20px;
  transition: all 0.3s;
  background-color: #f9fafb;
}

.upload-dragger-custom :deep(.el-upload-dragger:hover) {
  border-color: #4f46e5;
  background-color: #eef2ff;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon-large {
  font-size: 48px;
  color: #9ca3af;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.upload-dragger-custom :deep(.el-upload-dragger:hover) .upload-icon-large {
  color: #4f46e5;
  transform: scale(1.1);
}

.upload-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.primary-text {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.secondary-text {
  font-size: 12px;
  color: #9ca3af;
}

.file-list-container {
  margin-top: 24px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
}

.custom-file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item-card {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background-color: #f3f4f6;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.file-item-card:hover {
  background-color: #ffffff;
  border-color: #d1d5db;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.file-icon-wrapper {
  width: 32px;
  height: 32px;
  background-color: #ffffff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  margin-right: 12px;
  border: 1px solid #e5e7eb;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 12px;
  color: #9ca3af;
}

/* Config Form Styles */
.config-form {
  padding: 8px 0;
}

.form-section-divider {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 24px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f3f4f6;
}

.switch-wrapper {
  display: flex;
  align-items: center;
  height: 32px;
}

.switch-label {
  margin-left: 8px;
  font-size: 13px;
  color: #4b5563;
}

.distribute-btn {
  padding: 10px 24px;
  font-weight: 500;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
}

/* Log Section Styles */
.log-section {
  margin-top: 32px;
  border-top: 1px solid #e5e7eb;
  padding-top: 24px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.log-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  gap: 8px;
}

.terminal-window {
  background-color: #111827;
  border-radius: 8px;
  padding: 12px;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.6;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.3);
}

.terminal-content {
  display: flex;
  flex-direction: column;
}

.log-line {
  display: flex;
  gap: 8px;
  padding: 2px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.log-time {
  color: #6b7280;
  min-width: 80px;
}

.log-host {
  color: #60a5fa;
  font-weight: 500;
}

.log-file {
  color: #d1d5db;
}

.log-status {
  font-weight: bold;
}

.log-status.success {
  color: #34d399;
}

.log-status.failed {
  color: #f87171;
}

.log-status.processing {
  color: #fbbf24;
}

.log-msg {
  color: #9ca3af;
  font-style: italic;
}

@media (max-width: 768px) {
  .distribute-page {
    padding: 16px;
  }
  
  .upload-card {
    margin-bottom: 16px;
  }
}
</style>
