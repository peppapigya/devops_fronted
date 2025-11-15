<template>
  <div class="forgot-password-container">
    <el-card class="forgot-password-card">
      <h2>重置密码</h2>
      <el-steps :active="step" finish-status="success" align-center>
        <el-step title="验证邮箱" />
        <el-step title="重置密码" />
        <el-step title="完成" />
      </el-steps>

      <div v-if="step === 1" class="step-content">
        <el-form :model="emailForm" :rules="emailRules" ref="emailFormRef">
          <el-form-item prop="email">
            <el-input
              v-model="emailForm.email"
              placeholder="请输入注册邮箱"
              prefix-icon="Message"
            />
          </el-form-item>
          <el-button type="primary" @click="sendResetCode" :loading="loading">
            发送验证码
          </el-button>
        </el-form>
      </div>

      <el-button @click="goBack">返回登录</el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const router = useRouter()
const step = ref(1)
const loading = ref(false)

const emailFormRef = ref<FormInstance>()
const emailForm = ref({ email: '' })
const emailRules = ref<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ]
})

const sendResetCode = async () => {
  loading.value = true
  try {
    // 调用API发送重置验证码
    // await LoginApi.sendResetCode(emailForm.email)
    ElMessage.success('验证码已发送，请查收邮件')
    step.value = 2
  } catch (error) {
    ElMessage.error('发送失败，请检查邮箱地址')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/login')
}
</script>
