<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 左侧个人信息卡片 -->
      <div class="profile-sidebar">
        <el-card class="user-card" shadow="never">
          <div class="user-card-header">
            <h3>个人信息</h3>
          </div>
          
          <div class="user-avatar-section">
            <el-avatar :size="100" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          </div>
          
          <div class="user-info-list">
            <div class="info-item">
              <el-icon><User /></el-icon>
              <div class="info-content">
                <span class="info-label">用户名称</span>
                <span class="info-value">{{ userForm.username }}</span>
              </div>
            </div>
            
            <div class="info-item">
              <el-icon><Postcard /></el-icon>
              <div class="info-content">
                <span class="info-label">手机号码</span>
                <span class="info-value">{{ userForm.phone }}</span>
              </div>
            </div>
            
            <div class="info-item">
              <el-icon><Message /></el-icon>
              <div class="info-content">
                <span class="info-label">用户邮箱</span>
                <span class="info-value">{{ userForm.email }}</span>
              </div>
            </div>
            
            <div class="info-item">
              <el-icon><OfficeBuilding /></el-icon>
              <div class="info-content">
                <span class="info-label">所属部门</span>
                <span class="info-value">{{ userForm.department }}</span>
              </div>
            </div>
            
            <div class="info-item">
              <el-icon><Briefcase /></el-icon>
              <div class="info-content">
                <span class="info-label">所属角色</span>
                <span class="info-value">{{ userForm.position }}</span>
              </div>
            </div>
            
            <div class="info-item">
              <el-icon><Calendar /></el-icon>
              <div class="info-content">
                <span class="info-label">创建日期</span>
                <span class="info-value">2023-05-10 12:03:47</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 右侧内容区域 -->
      <div class="profile-content">
        <el-card class="content-card" shadow="never">
          <el-tabs v-model="activeTab" class="profile-tabs">
            <!-- 基本资料 -->
            <el-tab-pane label="基本资料" name="basic">
              <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="100px" class="profile-form">
                <el-form-item label="用户昵称" prop="nickname">
                  <el-input v-model="userForm.nickname" placeholder="请输入用户昵称" />
                </el-form-item>
                
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="userForm.phone" placeholder="请输入手机号码" maxlength="11" />
                </el-form-item>
                
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="userForm.email" placeholder="请输入邮箱" />
                </el-form-item>
                
                <el-form-item label="性别">
                  <el-radio-group v-model="userForm.gender">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="handleSaveBasic">保存</el-button>
                  <el-button @click="handleResetBasic">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            
            <!-- 修改密码 -->
            <el-tab-pane label="修改密码" name="password">
              <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px" class="profile-form">
                <el-form-item label="旧密码" prop="oldPassword">
                  <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入旧密码" show-password />
                </el-form-item>
                
                <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
                </el-form-item>
                
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请确认新密码" show-password />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="handleChangePassword">保存</el-button>
                  <el-button @click="handleResetPassword">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Postcard, Message, OfficeBuilding, Briefcase, Calendar } from '@element-plus/icons-vue'

const activeTab = ref('basic')
const userFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()

const userForm = reactive({
  username: 'admin',
  nickname: 'DevOps Admin',
  email: 'admin@devops.com',
  phone: '13800138000',
  department: '运维部',
  position: '系统管理员',
  gender: '男'
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const userRules: FormRules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

const passwordRules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleSaveBasic = async () => {
  if (!userFormRef.value) return
  await userFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('基本资料保存成功')
    }
  })
}

const handleResetBasic = () => {
  userFormRef.value?.resetFields()
}

const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  await passwordFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('密码修改成功')
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    }
  })
}

const handleResetPassword = () => {
  passwordFormRef.value?.resetFields()
}
</script>

<style scoped>
.profile-page {
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  background-color: #f0f2f5;
}

.profile-container {
  display: flex;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.profile-sidebar {
  width: 340px;
  flex-shrink: 0;
}

.profile-content {
  flex: 1;
  min-width: 0;
}

.user-card {
  border-radius: 8px;
}

.user-card-header {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.user-card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.user-avatar-section {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.user-info-list {
  margin-top: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .el-icon {
  font-size: 18px;
  color: #909399;
  margin-right: 12px;
  margin-top: 2px;
}

.info-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 14px;
  color: #606266;
}

.info-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.content-card {
  border-radius: 8px;
  min-height: 500px;
}

.profile-tabs {
  margin-top: -10px;
}

:deep(.el-tabs__header) {
  margin-bottom: 30px;
}

:deep(.el-tabs__item) {
  font-size: 15px;
  padding: 0 30px;
}

.profile-form {
  max-width: 600px;
  padding: 20px 0;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input) {
  width: 100%;
}

@media (max-width: 1200px) {
  .profile-container {
    flex-direction: column;
  }
  
  .profile-sidebar {
    width: 100%;
  }
}
</style>
