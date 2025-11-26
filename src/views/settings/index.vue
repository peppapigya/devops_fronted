<template>
  <div class="settings-page">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" class="settings-tabs">
        <el-tab-pane label="基本设置" name="basic">
          <el-form :model="basicSettings" label-width="120px">
            <el-form-item label="系统名称">
              <el-input v-model="basicSettings.systemName" />
            </el-form-item>
            
            <el-form-item label="系统Logo">
              <el-input v-model="basicSettings.logoUrl" placeholder="Logo URL" />
            </el-form-item>
            
            <el-form-item label="系统描述">
              <el-input v-model="basicSettings.description" type="textarea" :rows="3" />
            </el-form-item>
            
            <el-form-item label="版权信息">
              <el-input v-model="basicSettings.copyright" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleSaveBasic">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="主题设置" name="theme">
          <el-form :model="themeSettings" label-width="120px">
            <el-form-item label="主题模式">
              <el-radio-group v-model="themeSettings.mode">
                <el-radio label="light">浅色模式</el-radio>
                <el-radio label="dark">深色模式</el-radio>
                <el-radio label="auto">跟随系统</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="主题色">
              <el-color-picker v-model="themeSettings.primaryColor" />
            </el-form-item>
            
            <el-form-item label="侧边栏布局">
              <el-radio-group v-model="themeSettings.sidebarLayout">
                <el-radio label="vertical">垂直</el-radio>
                <el-radio label="horizontal">水平</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="固定头部">
              <el-switch v-model="themeSettings.fixedHeader" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleSaveTheme">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="通知设置" name="notification">
          <el-form :model="notificationSettings" label-width="120px">
            <el-form-item label="邮件通知">
              <el-switch v-model="notificationSettings.emailEnabled" />
            </el-form-item>
            
            <el-form-item label="系统消息">
              <el-switch v-model="notificationSettings.systemMessageEnabled" />
            </el-form-item>
            
            <el-form-item label="任务提醒">
              <el-switch v-model="notificationSettings.taskReminderEnabled" />
            </el-form-item>
            
            <el-form-item label="告警通知">
              <el-switch v-model="notificationSettings.alertEnabled" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleSaveNotification">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="安全设置" name="security">
          <el-form :model="securitySettings" label-width="120px">
            <el-form-item label="会话超时">
              <el-input-number v-model="securitySettings.sessionTimeout" :min="5" :max="1440" />
              <span class="unit-text">分钟</span>
            </el-form-item>
            
            <el-form-item label="密码强度">
              <el-radio-group v-model="securitySettings.passwordStrength">
                <el-radio label="low">低</el-radio>
                <el-radio label="medium">中</el-radio>
                <el-radio label="high">高</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="双因素认证">
              <el-switch v-model="securitySettings.twoFactorAuth" />
            </el-form-item>
            
            <el-form-item label="IP白名单">
              <el-switch v-model="securitySettings.ipWhitelistEnabled" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleSaveSecurity">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('basic')

const basicSettings = reactive({
  systemName: 'DevOps Platform',
  logoUrl: 'https://element-plus.org/images/element-plus-logo.svg',
  description: 'DevOps运维管理平台',
  copyright: '© 2024 DevOps Platform. All rights reserved.'
})

const themeSettings = reactive({
  mode: 'light',
  primaryColor: '#409eff',
  sidebarLayout: 'vertical',
  fixedHeader: true
})

const notificationSettings = reactive({
  emailEnabled: true,
  systemMessageEnabled: true,
  taskReminderEnabled: true,
  alertEnabled: true
})

const securitySettings = reactive({
  sessionTimeout: 30,
  passwordStrength: 'medium',
  twoFactorAuth: false,
  ipWhitelistEnabled: false
})

const handleSaveBasic = () => {
  ElMessage.success('基本设置保存成功')
}

const handleSaveTheme = () => {
  ElMessage.success('主题设置保存成功')
}

const handleSaveNotification = () => {
  ElMessage.success('通知设置保存成功')
}

const handleSaveSecurity = () => {
  ElMessage.success('安全设置保存成功')
}
</script>

<style scoped>
.settings-page {
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.settings-card {
  max-width: 900px;
}

.card-header {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.settings-tabs {
  margin-top: 20px;
}

.unit-text {
  margin-left: 10px;
  color: #909399;
}

:deep(.el-form-item) {
  margin-bottom: 22px;
}
</style>
