<template>
  <div class="script-execution-container">
    <div class="content-wrapper">
      <!-- 任务名称 -->
      <div class="form-row task-name-row">
        <div class="form-label">任务名称：</div>
        <div class="form-control">
          <el-input
            v-model="formData.taskName"
            placeholder="请输入任务名称"
            clearable
            maxlength="60"
            show-word-limit
            class="task-name-input"
          />
        </div>
      </div>

      <!-- 脚本来源 -->
      <div class="form-row script-source-row">
        <div class="form-label">脚本来源：</div>
        <div class="form-control">
          <el-radio-group v-model="formData.scriptSource" class="script-source-radio">
            <el-radio-button label="manual">手工录入</el-radio-button>
            <el-radio-button label="template">脚本引用</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- 脚本内容 -->
      <div class="form-row script-content-row">
        <div class="form-label">脚本内容：</div>
        <div class="form-control full-width">
          <!-- 脚本类型选项卡 -->
          <div class="script-type-tabs">
            <el-tabs v-model="formData.scriptType" @tab-change="handleScriptTypeChange" class="type-tabs">
              <el-tab-pane label="Shell" name="shell" />
              <el-tab-pane label="Bat" name="bash" />
              <el-tab-pane label="Perl" name="perl" />
              <el-tab-pane label="Python" name="python" />
              <el-tab-pane label="PowerShell" name="powershell" />
              <el-tab-pane label="SQL" name="sql" />
            </el-tabs>
            <div class="script-hint">
              <span class="hint-text">注意：脚本输出内容大小限制为25M，超过可导致日志丢失。</span>
            </div>
          </div>

          <!-- 编辑器区域 -->
          <div class="editor-container">
            <div class="editor-wrapper">
              <!-- 行号显示 -->
              <div class="line-numbers" ref="lineNumbers">
                <div v-for="i in lineCount" :key="i" class="line-number">{{ i }}</div>
              </div>

              <!-- 编辑区域 -->
              <div class="editor-content">


                <!-- 编辑层 -->
                <textarea
                  v-model="formData.scriptContent"
                  class="script-editor"
                  placeholder="请输入脚本内容"
                  spellcheck="false"
                  @input="handleScriptContentChange"
                  @scroll="handleEditorScroll"
                ></textarea>
                <!-- 高亮显示层 -->
                <div class="script-editor" ref="editorOverlay">
                  <pre ref="highlightPre" class="highlight-pre"><code ref="highlightCode" :class="`language-${formData.scriptType}`"></code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 脚本参数 -->
      <div class="form-row script-params-row">
        <div class="form-label">脚本参数：</div>
        <div class="form-control full-width">
          <el-input
            v-model="formData.scriptParams"
            placeholder="脚本执行时传入的参数，同脚本在终端执行时的参数格式。如：/bin/bash xxx.sh xxx"
            clearable
            maxlength="5000"
            show-word-limit
            class="script-params-input"
          />
        </div>
      </div>

      <!-- 超时时长 -->
      <div class="form-row timeout-row">
        <div class="form-label">超时时长：</div>
        <div class="form-control">
          <el-input-number
            v-model="formData.timeout"
            :min="1"
            :max="86400"
            :step="1"
            class="timeout-input"
          />
          <span class="timeout-unit">秒</span>
        </div>
      </div>

      <!-- 执行账号 -->
      <div class="form-row exec-user-row">
        <div class="form-label">执行账号：</div>
        <div class="form-control">
          <el-select v-model="formData.execUser" placeholder="请选择执行账号" class="exec-user-select">
            <el-option label="root" value="root" />
            <el-option label="admin" value="admin" />
            <el-option label="user" value="user" />
          </el-select>
        </div>
      </div>

      <!-- 目标服务器 -->
      <div class="form-row target-servers-row">
        <div class="form-label">目标服务器：</div>
        <div class="form-control">
          <el-select
            v-model="formData.targetServers"
            placeholder="请选择目标服务器"
            multiple
            clearable
            class="target-servers-select"
          >
            <el-option label="192.168.1.100" value="192.168.1.100" />
            <el-option label="192.168.1.101" value="192.168.1.101" />
            <el-option label="192.168.1.102" value="192.168.1.102" />
          </el-select>
          <el-button type="primary" size="small" class="add-server-btn">+ 添加服务器</el-button>
        </div>
      </div>

      <!-- 滚动执行 -->
      <div class="form-row scroll-exec-row">
        <div class="form-label">滚动执行：</div>
        <div class="form-control">
          <el-switch v-model="formData.autoScroll" class="scroll-exec-switch" />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="form-row action-buttons-row">
        <div class="form-label"></div>
        <div class="form-control">
          <div class="action-buttons">
            <el-button type="primary" size="large" @click="handleExecute" class="execute-btn">执行</el-button>
            <el-button size="large" @click="handleReset" class="reset-btn">重置</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import hljs from 'highlight.js/lib/core'
import shell from 'highlight.js/lib/languages/shell'
import bash from 'highlight.js/lib/languages/bash'
import perl from 'highlight.js/lib/languages/perl'
import python from 'highlight.js/lib/languages/python'
import powershell from 'highlight.js/lib/languages/powershell'
import sql from 'highlight.js/lib/languages/sql'
import 'highlight.js/styles/atom-one-dark.css'

// 注册语言
hljs.registerLanguage('shell', shell)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('perl', perl)
hljs.registerLanguage('python', python)
hljs.registerLanguage('powershell', powershell)
hljs.registerLanguage('sql', sql)

// 表单数据
const formData = reactive({
  taskName: '',
  scriptSource: 'manual',
  scriptType: 'shell',
  scriptContent: `#!/bin/bash
# 定义获取当前时间和PID的函数
function job_get_now {
  echo "[date +%Y-%m-%d_%H:%M:%S] [PID:$$]"
}

# 在脚本开始执行时调用，打印当前时间戳及PID
function job_start {
  echo "$(job_get_now) job_start"
}

# 在脚本执行成功结束时调用，打印当前时间戳及PID
function job_success {
  local msg="$*"
  echo "$(job_get_now) job_success:\${msg}"
  exit 0
}

# 在脚本执行失败时调用，打印当前时间戳及PID
function job_fail {
  local msg="$*"
  echo "$(job_get_now) job_fail:\${msg}"
  exit 1
}

# 示例用法
job_start

echo "Hello, DevOps Platform!"
echo "当前时间: $(date)"
echo "当前用户: $(whoami)"
echo "当前目录: $(pwd)"

job_success "脚本执行成功"
`,
  scriptParams: '',
  timeout: 7200,
  execUser: 'root',
  targetServers: [] as string[],
  autoScroll: true
})

// 高亮相关引用
const highlightPre = ref<HTMLElement>()
const highlightCode = ref<HTMLElement>()
const lineNumbers = ref<HTMLElement>()
const editorOverlay = ref<HTMLElement>()

// 计算行数
const lineCount = computed(() => {
  return formData.scriptContent.split('\n').length
})

// 处理编辑器滚动
const handleEditorScroll = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  if (editorOverlay.value) {
    editorOverlay.value.scrollTop = target.scrollTop
    editorOverlay.value.scrollLeft = target.scrollLeft
  }
  if (lineNumbers.value) {
    lineNumbers.value.scrollTop = target.scrollTop
  }
}

// 高亮更新锁，防止重复执行
let highlightLock = false

// 初始化高亮
const initHighlight = () => {
  // 如果正在执行高亮，跳过
  if (highlightLock) return

  if (highlightCode.value) {
    try {
      highlightLock = true

      // 1. 完全替换高亮层内容，避免累积问题
      highlightCode.value.textContent = ''
      highlightCode.value.innerHTML = ''

      // 2. 直接设置文本内容，确保完全一致
      highlightCode.value.textContent = formData.scriptContent

      // 3. 应用高亮
      hljs.highlightElement(highlightCode.value)
    } catch (error) {
      console.error('高亮初始化失败:', error)
    } finally {
      // 释放锁
      highlightLock = false
    }
  }
}

// 处理脚本类型变化
const handleScriptTypeChange = () => {
  initHighlight()
}

// 处理脚本内容变化 - 使用防抖确保只执行一次
let highlightTimeout: number | null = null
const handleScriptContentChange = () => {
  // 清除之前的定时器
  if (highlightTimeout) {
    clearTimeout(highlightTimeout)
  }

  // 设置新的定时器，延迟执行高亮
  highlightTimeout = window.setTimeout(() => {
    initHighlight()
    highlightTimeout = null
  }, 0) // 0ms延迟，确保当前事件循环结束后执行
}

// 执行脚本
const handleExecute = () => {
  // 表单验证
  if (!formData.taskName) {
    ElMessage.warning('请输入任务名称')
    return
  }
  if (!formData.scriptContent.trim()) {
    ElMessage.warning('请输入脚本内容')
    return
  }
  if (formData.targetServers.length === 0) {
    ElMessage.warning('请选择目标服务器')
    return
  }

  ElMessage.success('脚本执行中...')
  console.log('执行脚本:', formData)

  // 调用执行脚本API
  // executeScriptAPI(formData)
}

// 重置表单
const handleReset = () => {
  Object.assign(formData, {
    taskName: '',
    scriptSource: 'manual',
    scriptType: 'shell',
    scriptContent: `#!/bin/bash
# 定义获取当前时间和PID的函数
function job_get_now {
  echo "[date +%Y-%m-%d_%H:%M:%S] [PID:$$]"
}

# 在脚本开始执行时调用，打印当前时间戳及PID
function job_start {
  echo "$(job_get_now) job_start"
}

# 在脚本执行成功结束时调用，打印当前时间戳及PID
function job_success {
  local msg="$*"
  echo "$(job_get_now) job_success:\${msg}"
  exit 0
}

# 在脚本执行失败时调用，打印当前时间戳及PID
function job_fail {
  local msg="$*"
  echo "$(job_get_now) job_fail:\${msg}"
  exit 1
}

# 示例用法
job_start

echo "Hello, DevOps Platform!"
echo "当前时间: $(date)"
echo "当前用户: $(whoami)"
echo "当前目录: $(pwd)"

job_success "脚本执行成功"
`,
    scriptParams: '',
    timeout: 7200,
    execUser: 'root',
    targetServers: [],
    autoScroll: true
  })
  initHighlight()
  ElMessage.info('表单已重置')
}

onMounted(() => {
  console.log('脚本执行页面已挂载')
  initHighlight()
})
</script>

<style scoped>
/* 全局容器 */
.script-execution-container {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/* 表单行通用样式 */
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.form-label {
  width: 100px;
  text-align: right;
  padding-right: 16px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.form-control {
  flex: 1;
}

.full-width {
  width: 100%;
}

/* 任务名称行 */
.task-name-row {
  margin-bottom: 16px;
}

.task-name-input {
  width: 300px;
}

/* 脚本来源行 */
.script-source-row {
  margin-bottom: 16px;
}

.script-source-radio {
  display: flex;
  align-items: center;
}

/* 脚本内容行 */
.script-content-row {
  margin-bottom: 16px;
}

/* 脚本类型选项卡 */
.script-type-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.type-tabs {
  flex: 1;
}

.type-tabs .el-tabs__nav {
  border-bottom: 1px solid #e4e7ed;
}

.type-tabs .el-tabs__item {
  font-size: 13px;
  padding: 8px 16px;
  color: #606266;
}

.type-tabs .el-tabs__item.is-active {
  color: #409eff;
  font-weight: 500;
}

.type-tabs .el-tabs__active-bar {
  background-color: #409eff;
  height: 2px;
}

/* 脚本提示 */
.script-hint {
  margin-left: 16px;
}

.hint-text {
  font-size: 12px;
  color: #909399;
}

/* 编辑器容器 */
.editor-container {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
  background-color: #1e1e1e;
}

.editor-wrapper {
  position: relative;
  height: 350px;
  display: flex;
  overflow: hidden;
}

/* 行号显示 */
.line-numbers {
  width: 40px;
  background-color: #2d2d2d;
  color: #858585;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  padding: 16px 8px;
  text-align: right;
  user-select: none;
  overflow: hidden;
  border-right: 1px solid #3e3e42;
  flex-shrink: 0;
}

.line-number {
  height: 22.4px;
  line-height: 22.4px;
}

/* 编辑内容区域 */
.editor-content {
  flex: 1;
  position: relative;
  overflow: auto;
  background-color: #1e1e1e;
}

/* 编辑器覆盖层 - 显示高亮内容 */
.editor-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.highlight-pre {
  margin: 0;
  padding: 16px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 22.4px;
  line-height: 22.4px;
  white-space: pre;
  word-break: normal;
  display: block;
  background-color: transparent;
  tab-size: 2;
  letter-spacing: 0;
  word-spacing: 0;
}

.highlight-pre code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 22.4px;
  white-space: pre;
  word-break: normal;
  display: block;
  background-color: transparent;
  tab-size: 2;
  letter-spacing: 0;
  word-spacing: 0;
}

/* 编辑器 - 显示光标，不显示文字 */
.script-editor {
  position: absolute;
  top: -30px;
  left: -37px;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  padding: 16px;
  border: none;
  resize: none;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 22.4px;
  background-color: transparent;
  color: transparent; /* 文字完全透明 */
  caret-color: #ffffff; /* 光标白色，确保可见 */
  outline: none;
  z-index: 2; /* 编辑层在上面，确保光标可见 */
  white-space: pre;
  word-break: normal;
  tab-size: 2;
  overflow: auto;
  letter-spacing: 0;
  word-spacing: 0;
  margin: 0;
  display: block;
}

.timeout-input {
  width: 120px;
}

.timeout-unit {
  margin-left: 8px;
  font-size: 14px;
  color: #909399;
}

/* 执行账号行 */
.exec-user-row {
  margin-bottom: 16px;
}

.exec-user-select {
  width: 150px;
}

/* 目标服务器行 */
.target-servers-row {
  margin-bottom: 16px;
}

.target-servers-select {
  width: 300px;
  margin-right: 8px;
}

.add-server-btn {
  padding: 8px 16px;
  font-size: 13px;
}

/* 滚动执行行 */
.scroll-exec-row {
  margin-bottom: 24px;
}

/* 操作按钮行 */
.action-buttons-row {
  margin-bottom: 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.execute-btn {
  font-size: 16px;
  padding: 10px 24px;
  border-radius: 4px;
  font-weight: 500;
}

.reset-btn {
  font-size: 16px;
  padding: 10px 24px;
  border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-label {
    width: auto;
    text-align: left;
    padding-right: 0;
    margin-bottom: 8px;
  }

  .task-name-input {
    width: 100%;
  }

  .target-servers-select {
    width: 100%;
    margin-bottom: 8px;
  }

  .editor-wrapper {
    height: 250px;
  }
}

.script-params-input {
  width: 100%;
}
</style>
