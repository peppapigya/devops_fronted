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
            <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="type-tabs">
              <el-tab-pane label="Shell" name="shell" />
              <el-tab-pane label="Bat" name="bat" />
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
                <!-- 高亮显示层 -->
                <div class="editor-overlay" ref="editorOverlay">
                  <pre ref="highlightPre" class="highlight-pre"><code ref="highlightCode" :class="getHighlightClass"></code></pre>
                </div>

                <!-- 编辑层 -->
                <textarea
                    ref="scriptEditor"
                    v-model="formData.scriptContent"
                    class="script-editor"
                    placeholder="请输入脚本内容"
                    spellcheck="false"
                    @input="handleScriptContentChange"
                    @scroll="handleEditorScroll"
                    @keydown="handleKeydown"
                ></textarea>
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
              v-model="formData.targetServerIds"
              placeholder="请选择目标服务器"
              multiple
              clearable
              class="target-servers-select"
              :loading="loadingHost"
          >
            <el-option
                v-for="server in hosts"
                :key="server.value"
                :label="server.label"
                :value="server.value"
            />
          </el-select>
          <el-button type="primary" size="small" class="add-server-btn">+ 添加服务器</el-button>
        </div>
      </div>

      <!-- 滚动执行 -->
      <div class="form-row scroll-exec-row">
        <div class="form-label">滚动执行：</div>
        <div class="form-control">
          <el-switch
              v-model="formData.autoScroll"
              class="scroll-exec-switch"
              @change="handlerAutoScroll"
          />
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
import {computed, nextTick, onMounted, reactive, ref} from 'vue'
import {ElMessage} from 'element-plus'
import hljs from 'highlight.js/lib/core'
import shell from 'highlight.js/lib/languages/shell'
import bash from 'highlight.js/lib/languages/bash'
import perl from 'highlight.js/lib/languages/perl'
import python from 'highlight.js/lib/languages/python'
import powershell from 'highlight.js/lib/languages/powershell'
import sql from 'highlight.js/lib/languages/sql'
import {HostsApi} from "@/api/hosts";

import { onUnmounted } from 'vue'

// 添加组件销毁标志
let isComponentMounted = true

// 注册语言
hljs.registerLanguage('shell', shell)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('perl', perl)
hljs.registerLanguage('python', python)
hljs.registerLanguage('powershell', powershell)
hljs.registerLanguage('sql', sql)

// 不同脚本类型的简单示例代码
const scriptExamples = {
  shell: `#!/bin/bash
echo "Shell脚本测试"
echo "当前用户: $(whoami)"
echo "当前目录: $(pwd)"
echo "系统时间: $(date)"
echo "测试完成"`,

  bat: `@echo off
echo Windows批处理测试
echo 当前用户: %USERNAME%
echo 当前目录: %CD%
echo 系统时间: %DATE% %TIME%
echo 测试完成
pause`,

  perl: `#!/usr/bin/perl
print "Perl脚本测试\\n";
print "当前时间: " . localtime() . "\\n";
my $user = $ENV{'USER'} || "unknown";
print "当前用户: $user\\n";
print "测试完成\\n";`,

  python: `#!/usr/bin/env python3
import os
import datetime
print("Python脚本测试")
print("当前用户:", os.getenv('USER', 'unknown'))
print("当前目录:", os.getcwd())
print("系统时间:", datetime.datetime.now())
print("测试完成")`,

  powershell: `Write-Host "PowerShell脚本测试"
Write-Host "当前用户: $env:USERNAME"
Write-Host "当前目录: $(Get-Location)"
Write-Host "系统时间: $(Get-Date)"
Write-Host "测试完成"`,

  sql: `-- SQL脚本测试
SELECT 'SQL脚本测试' AS message;
SELECT CURRENT_TIMESTAMP AS current_time;
SELECT USER AS current_user;
SELECT '测试完成' AS status;`
}

// 在组件卸载时设置标志
onUnmounted(() => {
  isComponentMounted = false
  // 清理定时器
  if (highlightTimeout) {
    clearTimeout(highlightTimeout)
    highlightTimeout = null
  }
})
// 使用独立的响应式变量来管理当前激活的标签
const activeTab = ref('shell')
const loadingHost = ref(false)
// 表单数据
const formData = reactive({
  taskName: '',
  scriptSource: 'manual',
  scriptType: 'shell',
  scriptContent: scriptExamples.shell,
  scriptParams: '',
  timeout: 7200,
  execUser: 'root',
  targetServerIds: [] as string[],
  autoScroll: false
})
// 主机数据参数
const hosts = ref<HostsDTO[]>([])


// 获取主机数据
const getHosts = async () => {
  try {
    loadingHost.value = true
    const response = await HostsApi.getSelectList()
    console.log('获取主机列表成功:', response)
    if (Array.isArray(response)) {
      hosts.value = [...response] // 创建新数组以触发响应式更新
        // hosts.value = response
    }
    console.log('处理后的主机列表:', hosts.value)
  } catch (error) {
    ElMessage.error('获取主机列表失败')
  } finally {
    loadingHost.value = false
  }
}

// 高亮相关引用
const highlightPre = ref<HTMLElement>()
const highlightCode = ref<HTMLElement>()
const lineNumbers = ref<HTMLElement>()
const editorOverlay = ref<HTMLElement>()
const scriptEditor = ref<HTMLTextAreaElement>()

// 计算高亮类名
const getHighlightClass = computed(() => {
  return `hljs language-${formData.scriptType}`
})

// 计算行数
const lineCount = computed(() => {
  const lines = formData.scriptContent.split('\n')
  return lines.length === 1 && lines[0] === '' ? 1 : lines.length
})

// 处理标签点击事件
const handleTabClick = (tab: any) => {
  const scriptType = tab.paneName
  console.log('切换到脚本类型:', scriptType)

  // 更新激活的标签
  activeTab.value = scriptType

  // 更新表单数据
  formData.scriptType = scriptType
  console.log('更新表单数据:', formData)

  // 更新脚本内容为对应类型的示例
  const example = scriptExamples[scriptType as keyof typeof scriptExamples]
  console.log('更新脚本内容:', example)
  if (example) {
    formData.scriptContent = example
  }

  // 更新行号和高亮
  setTimeout(() => {
    if (isComponentMounted) {
      updateLineNumbers()
      initHighlight()
    }
  }, 0)
}

// 处理键盘事件，确保 Tab 键正常工作
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    e.preventDefault()
    const start = scriptEditor.value!.selectionStart
    const end = scriptEditor.value!.selectionEnd

    // 插入两个空格作为 Tab
    const newValue = formData.scriptContent.substring(0, start) + '  ' + formData.scriptContent.substring(end)
    formData.scriptContent = newValue

    // 设置光标位置
    nextTick(() => {
      if (scriptEditor.value) {
        scriptEditor.value.selectionStart = scriptEditor.value.selectionEnd = start + 2
      }
    })
  }
}

// 处理编辑器滚动
const handleEditorScroll = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  const scrollTop = target.scrollTop
  const scrollLeft = target.scrollLeft

  // 同步所有层的滚动位置
  if (editorOverlay.value) {
    editorOverlay.value.scrollTop = scrollTop
    editorOverlay.value.scrollLeft = scrollLeft
  }
  if (lineNumbers.value) {
    lineNumbers.value.scrollTop = scrollTop
  }
}

// 高亮更新锁，防止重复执行
let highlightLock = false

// 专门的行号更新函数
const updateLineNumbers = () => {
  if (!isComponentMounted || !lineNumbers.value) {
    return
  }

  const lines = formData.scriptContent.split('\n')
  const lineNumbersHTML = lines.map((_, i) =>
      `<div class="line-number">${i + 1}</div>`
  ).join('')
  lineNumbers.value.innerHTML = lineNumbersHTML
}

// 初始化高亮
const initHighlight = async () => {
  if (highlightLock || !isComponentMounted) return

  await nextTick()
  if (!isComponentMounted || !highlightCode.value) {
    return
  }

    try {
      highlightLock = true

      // 设置正确的语言类
      highlightCode.value.className = `hljs language-${formData.scriptType}`

      // 使用 highlight.js 进行高亮
      const result = hljs.highlight(formData.scriptContent, {
        language: formData.scriptType
      })
      highlightCode.value.innerHTML = result.value

    } catch (error) {
      console.error('高亮初始化失败:', error)
      // 降级方案：直接显示文本，但确保有 hljs 类
      highlightCode.value.textContent = formData.scriptContent
      highlightCode.value.className = `hljs language-${formData.scriptType}`
      highlightCode.value.innerHTML = formData.scriptContent
    } finally {
      highlightLock = false
    }

}

// 处理脚本内容变化
let highlightTimeout: number | null = null
const handleScriptContentChange = () => {
  // 立即更新行号
  updateLineNumbers()

  // 清除之前的定时器
  if (highlightTimeout) {
    clearTimeout(highlightTimeout)
  }

  // 设置新的定时器，延迟执行高亮
  highlightTimeout = window.setTimeout(() => {
    if (isComponentMounted) {
      initHighlight()
    }
    highlightTimeout = null
  }, 50)
}
// 自动滚动
const handlerAutoScroll = (value: boolean) => {
  console.log('自动滚动:', value)
  if (value) {
    nextTick(() => {
      highlightPre.value?.scrollIntoView({ behavior: 'smooth' })
      formData.autoScroll = value
    })
  }
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
  if (formData.targetServerIds.length === 0) {
    ElMessage.warning('请选择目标服务器')
    return
  }

  ElMessage.success('脚本执行中...')
  console.log('执行脚本:', formData.targetServerIds)
}

// 重置表单
const handleReset = () => {
  Object.assign(formData, {
    taskName: '',
    scriptSource: 'manual',
    scriptType: 'shell',
    scriptContent: scriptExamples.shell,
    scriptParams: '',
    timeout: 7200,
    execUser: 'root',
    targetServers: [],
    autoScroll: true
  })

  activeTab.value = 'shell'

  nextTick(() => {
    updateLineNumbers()
    initHighlight()
  })

  ElMessage.info('表单已重置')
}

onMounted(() => {
  console.log('脚本执行页面已挂载')

  // 初始化行号
  updateLineNumbers()

  // 初始化高亮
  initHighlight()
  // 获取下拉框列表
  getHosts()
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
  align-items: flex-start;
  margin-bottom: 16px;
}

.form-label {
  width: 100px;
  text-align: right;
  padding-right: 16px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  line-height: 32px;
  flex-shrink: 0;
}

.form-control {
  flex: 1;
  min-width: 0;
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
  align-items: flex-start;
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
  flex-shrink: 0;
}

.hint-text {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}

/* 编辑器容器 */
.editor-container {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
  background-color: #1e1e1e;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.editor-wrapper {
  position: relative;
  height: 350px;
  display: flex;
  overflow: hidden;
}

/* 行号显示 */
.line-numbers {
  width: 50px;
  background-color: #2d2d2d;
  color: #858585;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 22.4px;
  padding: 16px 8px;
  text-align: right;
  user-select: none;
  overflow: hidden;
  border-right: 1px solid #3e3e42;
  flex-shrink: 0;
  box-sizing: border-box;
}

.line-number {
  height: 22.4px;
  line-height: 22.4px;
  min-height: 22.4px;
}

/* 编辑内容区域 */
.editor-content {
  flex: 1;
  position: relative;
  overflow: auto;
  background-color: #1e1e1e;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 22.4px;
}

/* 高亮层 */
.editor-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.highlight-pre {
  margin: 0;
  padding: 16px;
  background: transparent;
  min-height: 100%;
  box-sizing: border-box;
  white-space: pre;
  word-break: normal;
  overflow: visible;
  /* 默认字体颜色，确保在没有高亮时也有颜色 */
  color: #abb2bf;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 22.4px;
}

/* 编辑器 */
.script-editor {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 16px;
  margin: 0;
  border: none;
  resize: none;
  background: transparent;
  color: transparent;
  caret-color: #ffffff;
  outline: none;
  z-index: 2;
  white-space: pre;
  overflow: auto;
  box-sizing: border-box;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 22.4px;
  letter-spacing: 0;
  word-spacing: 0;
  tab-size: 2;
}

.script-editor::placeholder {
  color: #6c757d;
  opacity: 0.6;
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

.script-params-input {
  width: 100%;
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

  .script-type-tabs {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .script-hint {
    margin-left: 0;
  }
}
</style>

<style>
/* 全局高亮样式 - 确保始终应用 */
.hljs {
  display: block;
  background: #1e1e1e !important;
  color: #abb2bf !important;
  padding: 0;
  margin: 0;
}

/* 如果没有高亮类，也确保基础颜色 */
pre code {
  color: #abb2bf !important;
  background: #1e1e1e !important;
}

.hljs-keyword {
  color: #c678dd !important;
}

.hljs-built_in {
  color: #e06c75 !important;
}

.hljs-string {
  color: #98c379 !important;
}

.hljs-comment {
  color: #5c6370 !important;
  font-style: italic !important;
}

.hljs-function {
  color: #61afef !important;
}

.hljs-number {
  color: #d19a66 !important;
}

.hljs-params {
  color: #e06c75 !important;
}

.hljs-meta {
  color: #c678dd !important;
}

.hljs-title {
  color: #61afef !important;
}

.hljs-type {
  color: #e06c75 !important;
}

.hljs-variable {
  color: #e06c75 !important;
}

.hljs-name {
  color: #e06c75 !important;
}

.hljs-tag {
  color: #e06c75 !important;
}

.hljs-attr {
  color: #d19a66 !important;
}

.hljs-attribute {
  color: #98c379 !important;
}

.hljs-section {
  color: #e06c75 !important;
}

.hljs-bullet {
  color: #98c379 !important;
}

.hljs-code {
  color: #56b6c2 !important;
}

.hljs-emphasis {
  font-style: italic !important;
}

.hljs-strong {
  font-weight: bold !important;
}

/* 确保编辑器中的文本始终有颜色，即使没有高亮 */
.editor-overlay pre,
.editor-overlay code {
  color: #abb2bf !important;
}
</style>
