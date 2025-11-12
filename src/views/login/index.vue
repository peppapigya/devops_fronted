<template>
  <div id="app">
    <el-container class="loginDiv">
      <el-main class="main">
        <div class="mainDiv">
          <el-row :gutter="5" class="row">
            <el-col :span="11">
              <div class="devops-intro">
                <h1>DevOps 自动化平台</h1>
                <p class="feature-item">
                  <el-icon><Pointer/></el-icon>
                  <span>持续集成与持续部署 (CI/CD)</span>
                </p>
                <p class="feature-item">
                  <el-icon><Pointer/></el-icon>
                  <span>自动化测试与质量保障</span>
                </p>
                <p class="feature-item">
                  <el-icon><Pointer/></el-icon>
                  <span>容器化与云原生支持</span>
                </p>
                <p class="feature-item">
                  <el-icon><Pointer/></el-icon>
                  <span>监控告警与日志分析</span>
                </p>
                <p class="feature-item">
                  <el-icon><Pointer/></el-icon>
                  <span>多环境统一管理</span>
                </p>
                <p class="feature-item">
                  <el-icon><Pointer/></el-icon>
                  <span>故障自动修复</span>
                </p>
                <div class="stats">
                  <el-statistic title="今日部署" :value="126" />
                  <el-statistic title="运行服务" :value="58" />
                  <el-statistic title="成功率" value="98.7" suffix="%" />
                </div>
              </div>
            </el-col>

            <!-- 分隔线 -->
            <el-col :span="2">
              <el-divider direction="vertical" style="height: 100%" border-style="dashed"/>
            </el-col>

            <!-- 登录表单 -->
            <el-col :span="11">
              <div class="login-form">
                <h2>DevOps 平台登录</h2>
                <el-form label-position="top" :model="loginForm" :rules="loginFormRules">
                  <el-form-item prop="username" label="用户名:">
                    <el-input
                        v-model="loginForm.username"
                        placeholder="请输入用户名/邮箱"
                        prefix-icon="User"
                    />
                  </el-form-item>

                  <el-form-item prop="password" label="密码">
                    <el-input
                        v-model="loginForm.password"
                        placeholder="请输入密码"
                        show-password
                        prefix-icon="Lock"
                    />
                  </el-form-item>

                  <el-form-item prop="code" label="验证码">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <el-input
                          v-model="loginForm.code"
                          placeholder="请输入验证码"
                          style="flex: 1;"
                          prefix-icon="Key"
                      />
                      <div class="captcha-container" @click="onGetCode">
                        <el-image
                            :src="loginForm.imageCode"
                            class="captcha-image"
                        />
                        <el-icon class="refresh-icon">
                          <RefreshRight/>
                        </el-icon>
                      </div>
                    </div>
                  </el-form-item>
                </el-form>

                <div class="login-options">
                  <el-checkbox v-model="btnFlag" @change="changeFlag">
                    记住密码
                  </el-checkbox>
                  <el-link type="primary" :underline="true" @click="onForgotPassword">忘记密码</el-link>
                </div>

                <el-button
                    type="primary"
                    class="login-btn"
                    :disabled="!submitFlag"
                    @click="onSubmit"
                >
                  登录
                </el-button>

                <div class="social-login">
                  <el-divider>其他登录方式</el-divider>
                  <div class="social-buttons">
                    <el-button circle>
                      <el-icon><Message /></el-icon>
                    </el-button>
                    <el-button circle>
                      <el-icon><ChatDotRound /></el-icon>
                    </el-button>
                    <el-button circle>
                      <el-icon><Monitor /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-main>

      <el-footer class="footer">
        <div class="footer-content">
          <h3>DevOps 自动化平台 v1.0</h3>
          <p>
            基于 Kubernetes + Docker + Jenkins + GitLab 构建的一站式 DevOps <解决方案>  </解决方案>
            <br>
            <span>Copyright ©peppa-pig 2025 </span>

          </p>
          <div class="footer-links">
            <el-link :underline="false">帮助文档</el-link>
            <el-link :underline="false">技术支持</el-link>
            <el-link :underline="false">关于我们</el-link>
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { Pointer, RefreshRight, Message, ChatDotRound, Monitor } from "@element-plus/icons-vue";
import { ref, onMounted } from 'vue'
import { LoginApi } from "@/api/login";
import { ElNotification, type FormRules } from "element-plus";
import type { UserLoginVO } from "@/api/login/type.ts";
import { useRouter } from "vue-router";

const router = useRouter();
import * as authUtil from '@/utils/auth'

const loginForm = ref<UserLoginVO>({
  username: '',
  password: '',
  code: '',
  captchaId: '',
  imageCode: ''
})

const onGetCode = async () => {
  const res = await LoginApi.getCode();
  console.log("验证码数据", res);
  loginForm.value.captchaId = res.captchaId
  loginForm.value.imageCode = res.code
}

const btnFlag = ref<boolean>(false)
const submitFlag = ref<boolean>(true)

const changeFlag = () => {

}
// 忘记密码
const onForgotPassword = () => {
  console.log("忘记密码挑战")
  router.push('/forget-passwd')
}

onMounted(() => {
  onGetCode();
})

const onSubmit = async () => {
  try {
    console.log(loginForm.value)
    const res = await LoginApi.login(loginForm.value)
    authUtil.setToken(res)
    await router.push("/home")
    sessionStorage.setItem("user", JSON.stringify(res))
    ElNotification.success({
      message: '登录成功',
      duration: 2000
    })
  } catch (error) {
    ElNotification.error({
      message: '登录失败，请检查用户名密码',
      duration: 2000
    })
  }
}

// 校验规则
const loginFormRules = ref<FormRules<any>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度至少3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码长度为4位', trigger: 'blur' }
  ]
})
</script>

<style scoped>
.loginDiv {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: 100% 100%;
  padding: 20px 100px;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.main {
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer {
  height: 20%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
}

.footer-content {
  text-align: center;
}

.footer-links {
  margin-top: 10px;
}

.footer-links .el-link {
  margin: 0 15px;
  color: rgba(255, 255, 255, 0.8);
}

.footer-links .el-link:hover {
  color: #fff;
}

.mainDiv {
  height: 500px;
  width: 900px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.row {
  height: 100%;
  padding: 30px;
}

.devops-intro {
  padding: 20px;
  color: #2c3e50;
}

.devops-intro h1 {
  color: #667eea;
  margin-bottom: 30px;
  font-size: 28px;
}

.feature-item {
  display: flex;
  align-items: center;
  margin: 15px 0;
  font-size: 14px;
}

.feature-item .el-icon {
  color: #667eea;
  margin-right: 10px;
  font-size: 16px;
}

.stats {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stats :deep(.el-statistic__content) {
  font-size: 18px;
  font-weight: bold;
  color: #667eea;
}

.stats :deep(.el-statistic__title) {
  font-size: 12px;
  color: #7f8c8d;
}

.login-form {
  padding: 20px;
}

.login-form h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 24px;
}

:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

:deep(.el-input__inner) {
  color: #2c3e50 !important;
}

:deep(input:-webkit-autofill) {
  -webkit-text-fill-color: #2c3e50;
  transition: background-color 5000s ease-out 0.5s;
}

:deep(input::-webkit-input-placeholder) {
  color: #bdc3c7;
}

.captcha-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 5px;
  border: 1px solid #dcdfe6;
}

.captcha-image {
  height: 40px;
  border-radius: 4px;
}

.refresh-icon {
  margin-left: 8px;
  color: #667eea;
  font-size: 16px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.login-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.login-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.social-login {
  margin-top: 30px;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-buttons .el-button {
  width: 45px;
  height: 45px;
  font-size: 18px;
}

:deep(.el-divider__text) {
  background: transparent;
  color: #7f8c8d;
  font-size: 12px;
}

@media (max-width: 768px) {
  .loginDiv {
    padding: 10px;
  }

  .mainDiv {
    width: 100%;
    height: auto;
  }

  .row {
    padding: 15px;
  }
}
</style>
