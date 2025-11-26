<template>
  <div class="login-container">
    <TechBackground />
    
    <div class="login-content">
      <div class="login-box">
        <div class="login-left">
          <div class="brand-area">
            <div class="logo-circle">
              <el-icon><Monitor /></el-icon>
            </div>
            <h1>DevOps 自动化平台</h1>
            <p class="subtitle">下一代自动化运维系统</p>
          </div>
          
          <div class="features-list">
            <div class="feature-item" v-for="(item, index) in features" :key="index" :style="{ animationDelay: index * 0.1 + 's' }">
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.text }}</span>
            </div>
          </div>

          <div class="stats-mini">
            <div class="stat-item">
              <span class="stat-val">99.9%</span>
              <span class="stat-label">运行时间</span>
            </div>
            <div class="stat-item">
              <span class="stat-val">10k+</span>
              <span class="stat-label">部署次数</span>
            </div>
          </div>
        </div>

        <div class="login-right">
          <div class="form-header">
            <h2>欢迎回来</h2>
          </div>

          <el-form 
            ref="loginFormRef"
            :model="loginForm" 
            :rules="loginFormRules" 
            class="login-form"
            label-position="top"
            @keyup.enter="onSubmit"
          >
            <el-form-item prop="username">
              <el-input 
                v-model="loginForm.username" 
                placeholder="用户名 / 邮箱" 
                prefix-icon="User"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input 
                v-model="loginForm.password" 
                placeholder="密码" 
                show-password 
                prefix-icon="Lock"
                type="password"
              />
            </el-form-item>

            <el-form-item prop="code">
              <div class="captcha-box">
                <el-input 
                  v-model="loginForm.code" 
                  placeholder="验证码" 
                  prefix-icon="Key"
                  class="captcha-input"
                />
                <div class="captcha-img" @click="onGetCode" title="点击刷新">
                  <el-image :src="loginForm.imageCode" class="code-img">
                    <template #error>
                      <div class="image-slot">
                        <el-icon><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </div>
              </div>
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="btnFlag">记住我</el-checkbox>
              <el-link type="primary" :underline="false" @click="onForgotPassword">忘记密码?</el-link>
            </div>

            <el-button 
              type="primary" 
              class="submit-btn" 
              :loading="loading" 
              @click="onSubmit"
            >
              登录
            </el-button>

            <div class="divider">
              <span>其他登录方式</span>
            </div>

            <div class="social-links">
              <div class="social-btn"><el-icon><Message /></el-icon></div>
              <div class="social-btn"><el-icon><ChatDotRound /></el-icon></div>
              <div class="social-btn"><el-icon><Monitor /></el-icon></div>
            </div>
          </el-form>
        </div>
      </div>
      
      <div class="footer-copyright">
        <p>Copyright © 2025 DevOps 自动化平台. All Rights Reserved.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { 
  Pointer, RefreshRight, Message, ChatDotRound, Monitor, 
  User, Lock, Key, Picture, Connection, DataLine, Odometer 
} from "@element-plus/icons-vue";
import { ref, onMounted, reactive } from 'vue'
import { LoginApi } from "@/api/login";
import { ElNotification, type FormRules } from "element-plus";
import type { UserLoginVO } from "@/api/login/type.ts";
import { useRouter } from "vue-router";
import * as authUtil from '@/utils/auth'
import CryptoJS from 'crypto-js'; // added for client‑side password hashing
import TechBackground from './components/TechBackground.vue';

const router = useRouter();
const loading = ref(false);

const loginForm = ref<UserLoginVO>({
  username: '',
  password: '',
  code: '',
  captchaId: '',
  imageCode: ''
})

const features = [
  { icon: Connection, text: 'CI/CD 流水线自动化' },
  { icon: DataLine, text: '实时监控与分析' },
  { icon: Odometer, text: '云原生基础设施' },
]

const onGetCode = async () => {
  const res = await LoginApi.getCode();
  loginForm.value.captchaId = res.captchaId
  loginForm.value.imageCode = res.code
}

const btnFlag = ref<boolean>(false)

const onForgotPassword = () => {
  router.push('/forget-passwd')
}

onMounted(() => {
  onGetCode();
})

const onSubmit = async () => {
  if (!loginForm.value.username || !loginForm.value.password || !loginForm.value.code) {
    ElNotification.warning('请填写所有字段');
    return;
  }
  
  loading.value = true;
  try {
    // 创建一个副本，避免修改原表单值
    const loginData = { ...loginForm.value };
    // 使用 SHA-256 对密码进行哈希
    loginData.password = CryptoJS.SHA256(loginData.password).toString();
    const res = await LoginApi.login(loginData)
    authUtil.setToken(res)
    sessionStorage.setItem("user", JSON.stringify(res))
    
    ElNotification.success({
      message: '登录成功',
      duration: 2000
    })
    
    router.push('/').then(() => {
      setTimeout(() => {
        if (sessionStorage.getItem("user")) {
          router.push('/home')
        }
      }, 100)
    })
    
  } catch (error) {
    
    onGetCode(); // Refresh code on failure
  } finally {
    loading.value = false;
  }
}

const loginFormRules = ref<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '长度至少为 3 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '长度至少为 6 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 5, message: '长度应为 5 位', trigger: 'blur' }
  ]
})
</script>

<style scoped>
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', sans-serif;
}

.login-content {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 1000px;
  padding: 20px;
}

.login-box {
  display: flex;
  width: 100%;
  height: 600px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.login-left {
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 242, 234, 0.1) 0%, transparent 100%);
  z-index: 0;
}

.brand-area {
  position: relative;
  z-index: 1;
}

.logo-circle {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #00f2ea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 10px 20px rgba(0, 242, 234, 0.3);
}

.logo-circle .el-icon {
  font-size: 32px;
  color: white;
}

.login-left h1 {
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  margin: 0;
  letter-spacing: -1px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  margin-top: 10px;
}

.features-list {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  animation: slideIn 0.5s ease-out backwards;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.stats-mini {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 40px;
  margin-top: auto;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-val {
  font-size: 24px;
  font-weight: 700;
  color: #00f2ea;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.login-right {
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 28px;
  color: #1a1a2e;
  margin: 0 0 10px 0;
}

.form-header p {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
}

:deep(.el-input__wrapper) {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  border: 2px solid #e4e7ed;
  transition: all 0.3s ease;
  padding: 12px 15px;
  border-radius: 8px;
}

:deep(.el-input__wrapper:hover) {
  border-color: #c0c4cc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
}

:deep(.el-input__wrapper.is-focus) {
  background-color: #fff;
  border-color: #764ba2;
  box-shadow: 0 0 0 4px rgba(118, 75, 162, 0.15) !important;
}

:deep(.el-input__inner) {
  font-size: 15px;
  color: #303133;
  font-weight: 500;
}

:deep(.el-input__inner::placeholder) {
  color: #a8abb2;
  font-weight: 400;
}

:deep(.el-input__prefix) {
  font-size: 18px;
  color: #909399;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

.captcha-box {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.captcha-input {
  flex: 1;
}

.captcha-img {
  width: 140px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.captcha-img:hover {
  border-color: #c0c4cc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: scale(1.02);
}

.code-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(118, 75, 162, 0.3);
}

.divider {
  margin: 30px 0;
  text-align: center;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background: #eee;
}

.divider span {
  background: #fff;
  padding: 0 15px;
  color: #bdc3c7;
  font-size: 12px;
  position: relative;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background: #f5f7fa;
  color: #764ba2;
  border-color: #764ba2;
}

.footer-copyright {
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  text-align: center;
}

@media (max-width: 900px) {
  .login-box {
    flex-direction: column;
    height: auto;
  }
  
  .login-left {
    padding: 40px;
    min-height: 200px;
  }
  
  .features-list, .stats-mini {
    display: none;
  }
  
  .login-right {
    padding: 40px;
  }
}
</style>
