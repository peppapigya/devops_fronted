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
          <el-radio-group v-model="scriptSource" @change="handleScriptSourceChange">
            <el-radio label="library">使用脚本库</el-radio>
            <el-radio label="manual">手动输入</el-radio>
          </el-radio-group>
        </div>
      </div>

      <!-- 选择脚本（仅当使用脚本库时显示） -->
      <div class="form-row script-select-row" v-if="scriptSource === 'library'">
        <div class="form-label">选择脚本：</div>
        <div class="form-control">
          <el-select
              v-model="selectedScriptId"
              placeholder="请选择要执行的脚本"
              filterable
              remote
              clearable
              class="script-select"
              :loading="loadingScripts"
              :remote-method="remoteSearchScripts"
              @change="handleScriptChange"
          >
            <el-option
                v-for="script in filteredScriptList"
                :key="script.id"
                :label="script.name"
                :value="script.id"
            >
              <span>{{ script.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px; margin-left: 8px">
                <el-tag size="small">{{ script.type }}</el-tag>
              </span>
            </el-option>
          </el-select>
        </div>
      </div>

      <!-- 脚本信息（仅当使用脚本库且已选择时显示） -->
      <div class="form-row script-info-row" v-if="scriptSource === 'library' && scriptInfo.name">
        <div class="form-label">脚本信息：</div>
        <div class="form-control">
          <el-descriptions :column="3" border size="small">
            <el-descriptions-item label="脚本名称">{{ scriptInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="脚本类型">
              <el-tag size="small">{{ scriptInfo.type }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="分类">{{ scriptInfo.category }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <!-- 脚本内容（使用脚本库时只读，手动输入时可编辑） -->
      <div class="form-row script-content-row" v-if="scriptSource === 'library' ? scriptInfo.content : true">
        <div class="form-label">脚本内容：</div>
        <div class="form-control full-width">
          <ScriptEditor
              v-model="manualScriptContent"
              :language="scriptSource === 'library' ? scriptInfo.type : manualScriptType"
              :placeholder="scriptSource === 'library' ? '脚本内容（只读）' : '请输入脚本内容'"
              :style="scriptSource === 'library' ? 'pointer-events: none; opacity: 0.9;' : ''"
          />
        </div>
      </div>

      <!-- 脚本类型（仅当手动输入时显示） -->
      <div class="form-row script-type-row" v-if="scriptSource === 'manual'">
        <div class="form-label">脚本类型：</div>
        <div class="form-control">
          <el-select v-model="manualScriptType" placeholder="请选择脚本类型" class="script-type-select">
            <el-option label="Shell" value="shell" />
            <el-option label="Bat" value="bat" />
            <el-option label="Perl" value="perl" />
            <el-option label="Python" value="python" />
            <el-option label="PowerShell" value="powershell" />
            <el-option label="SQL" value="sql" />
          </el-select>
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

      <!-- 工作目录 -->
      <div class="form-row work-dir-row">
        <div class="form-label">工作目录：</div>
        <div class="form-control">
          <el-input
              v-model="formData.workDir"
              placeholder="请输入工作目录，如：/tmp"
              clearable
              class="work-dir-input"
          />
        </div>
      </div>

      <!-- 环境变量 -->
      <div class="form-row env-row">
        <div class="form-label">环境变量：</div>
        <div class="form-control">
          <el-input
              v-model="formData.env"
              type="textarea"
              :rows="3"
              placeholder="请输入环境变量，每行一个，格式：KEY=VALUE&#10;例如：&#10;PATH=/usr/local/bin:$PATH&#10;LANG=en_US.UTF-8"
              clearable
              class="env-input"
          />
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
                :value="Number(server.value)"
            />
          </el-select>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="form-row action-buttons-row">
        <div class="form-label"></div>
        <div class="form-control">
          <div class="action-buttons">
            <el-button
                type="primary"
                size="large"
                @click="handleExecute"
                class="execute-btn"
                :loading="executing"
                :disabled="formData.targetServerIds.length === 0"
            >
              {{ executing ? '执行中...' : '执行' }}
            </el-button>
            <el-button size="large" @click="goBack" class="reset-btn">返回</el-button>
          </div>
        </div>
      </div>

      <!-- 执行结果 -->
      <div class="form-row log-section-row" v-if="logs.length > 0">
        <div class="form-label">执行结果：</div>
        <div class="form-control full-width">
          <!-- 模式切换 -->
          <div class="mode-switcher">
            <el-radio-group v-model="logDisplayMode" size="small">
              <el-radio-button label="simple">简洁模式</el-radio-button>
              <el-radio-button label="detailed">详细模式</el-radio-button>
            </el-radio-group>

            <!-- 详细模式下的主机切换 -->
            <div class="host-switcher" v-if="logDisplayMode === 'detailed' && logs.length > 1">
              <span class="switcher-label">切换主机：</span>
              <el-select
                  v-model="selectedHostIndex"
                  size="small"
                  class="host-select"
              >
                <el-option
                    v-for="(log, index) in logs"
                    :key="index"
                    :label="getHostDisplayName(log)"
                    :value="index"
                >
                  <div class="host-option">
                    <span class="host-name">{{ getHostDisplayName(log) }}</span>
                    <el-tag
                        :type="getStatusType(log.status)"
                        size="mini"
                        class="status-tag"
                    >
                      {{ getStatusText(log.status) }}
                    </el-tag>
                  </div>
                </el-option>
              </el-select>
            </div>
          </div>

          <!-- 简洁模式 -->
          <div v-if="logDisplayMode === 'simple'" class="log-container">
            <div
                v-for="(log, index) in logs"
                :key="index"
                class="log-item"
                :class="getLogClass(log.status)"
            >
              <div class="log-header">
                <span class="log-host">{{ getHostDisplayName(log) }}</span>
                <el-tag :type="getStatusType(log.status)" size="small">
                  {{ getStatusText(log.status) }}
                </el-tag>
                <span class="log-time">{{ log.time }}</span>
              </div>
              <pre class="log-output">{{ log.output || '等待执行...' }}</pre>
            </div>
          </div>

          <!-- 详细模式 -->
          <div v-else class="detailed-container">
            <!-- 当前主机详细执行信息 -->
            <div
                v-if="currentHostLog"
                class="detailed-log"
                :class="getLogClass(currentHostLog.status)"
            >
              <div class="log-header">
                <span class="log-host">{{ getHostDisplayName(currentHostLog) }}</span>
                <el-tag :type="getStatusType(currentHostLog.status)" size="small">
                  {{ getStatusText(currentHostLog.status) }}
                </el-tag>
                <span class="log-time">{{ currentHostLog.time }}</span>
                <span class="log-duration" v-if="currentHostLog.commands">
                  总耗时: {{ calculateTotalDuration(currentHostLog.commands) }}
                </span>
              </div>

              <div class="command-steps">
                <div
                    v-for="(cmd, cmdIndex) in currentHostLog.commands"
                    :key="cmdIndex"
                    class="command-step"
                    :class="cmd.Success ? 'step-success' : 'step-failed'"
                >
                  <div class="step-header">
                    <div class="step-info">
                      <span class="step-number">步骤 {{ cmdIndex + 1 }}</span>
                      <span class="step-command">{{ cmd.Command }}</span>
                    </div>
                    <div class="step-meta">
                      <span class="step-duration">{{ cmd.Duration }}</span>
                      <el-tag
                          :type="cmd.Success ? 'success' : 'danger'"
                          size="small"
                      >
                        {{ cmd.Success ? '成功' : '失败' }}
                      </el-tag>
                    </div>
                  </div>
                  <div class="step-output">
                    <pre class="output-content">{{ cmd.Output }}</pre>
                    <div v-if="cmd.Error" class="step-error">
                      <i class="el-icon-warning"></i>
                      {{ cmd.Error }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 主机快速导航 -->
            <div class="host-navigation" v-if="logs.length > 1">
              <div class="nav-title">主机列表</div>
              <div class="host-list">
                <div
                    v-for="(log, index) in logs"
                    :key="index"
                    class="host-nav-item"
                    :class="{ active: selectedHostIndex === index }"
                    @click="selectedHostIndex = index"
                >
                  <div class="host-nav-info">
                    <span class="host-name">{{ getHostDisplayName(log) }}</span>
                    <el-tag
                        :type="getStatusType(log.status)"
                        size="small"
                    >
                      {{ getStatusText(log.status) }}
                    </el-tag>
                  </div>
                  <div class="host-stats">
                    <span class="stat">{{ log.commands?.length || 0 }} 个步骤</span>
                    <span class="duration" v-if="log.commands">
                      {{ calculateTotalDuration(log.commands) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ScriptApi, type JobScript, type ExecuteScriptReq } from '@/api/jobs/script'
import { HostsApi } from '@/api/hosts'
import ScriptEditor from './components/ScriptEditor.vue'

const router = useRouter()
const route = useRoute()

// 定义接口
interface CommandResult {
  Success: boolean
  Output: string
  Error: string | null
  Host: string
  Command: string
  ExitCode: number
  Duration: string
}

interface LogItem {
  hostAddr: string
  hostId?: number
  status: 'pending' | 'running' | 'success' | 'failed'
  output: string
  time: string
  commands?: CommandResult[]
}

interface ExecuteResponse {
  [hostAddr: string]: CommandResult[]
}

const loadingHost = ref(false)
const loadingScripts = ref(false)
const executing = ref(false)
const selectedScriptId = ref<number | undefined>(undefined)
const filteredScriptList = ref<JobScript[]>([])
const scriptSource = ref<'library' | 'manual'>('library')
const manualScriptContent = ref('')
const manualScriptType = ref('shell')
const logDisplayMode = ref<'simple' | 'detailed'>('simple')
const selectedHostIndex = ref(0)

const scriptInfo = ref<JobScript>({
  id: undefined,
  name: '',
  type: 'shell',
  category: '',
  content: '',
  timeout: 60
})

const formData = reactive({
  taskName: '',
  scriptParams: '',
  timeout: 7200,
  execUser: 'root',
  workDir: '',
  env: '',
  targetServerIds: [] as number[]
})

const hosts = ref<any[]>([])
const hostMap = ref<Record<number, string>>({})
const logs = ref<LogItem[]>([])

// 计算属性
const currentHostLog = computed(() => {
  return logs.value[selectedHostIndex.value]
})

// 远程搜索脚本（后端筛选）
const remoteSearchScripts = async (query: string) => {
  try {
    loadingScripts.value = true
    const params = query ? { name: query } : undefined
    const res = await ScriptApi.getAllScripts(params)
    filteredScriptList.value = res
  } catch (error) {
    console.error(error)
    ElMessage.error('搜索脚本失败')
  } finally {
    loadingScripts.value = false
  }
}

// 获取脚本信息
const loadScriptInfo = async (scriptId: number) => {
  if (!scriptId) return

  try {
    const res = await ScriptApi.getScript(scriptId)
    scriptInfo.value = res
    formData.timeout = res.timeout || 7200
    formData.taskName = `执行-${res.name}`
    manualScriptContent.value = res.content || ''
  } catch (error) {
    console.error(error)
    ElMessage.error('加载脚本信息失败')
  }
}

// 处理脚本选择变化
const handleScriptChange = (scriptId: number) => {
  if (scriptId) {
    loadScriptInfo(scriptId)
  } else {
    scriptInfo.value = {
      name: '',
      type: 'shell',
      category: '',
      content: '',
      timeout: 60
    }
    formData.taskName = ''
    formData.timeout = 7200
    manualScriptContent.value = ''
  }
}

// 处理脚本来源变化
const handleScriptSourceChange = (source: 'library' | 'manual') => {
  if (source === 'library') {
    manualScriptContent.value = ''
    manualScriptType.value = 'shell'
  } else {
    selectedScriptId.value = undefined
    scriptInfo.value = {
      name: '',
      type: 'shell',
      category: '',
      content: '',
      timeout: 60
    }
  }
  formData.taskName = ''
}

// 获取主机列表
const getHosts = async () => {
  try {
    loadingHost.value = true
    const response = await HostsApi.getSelectList()
    if (Array.isArray(response)) {
      hosts.value = [...response]
      const map: Record<number, string> = {}
      response.forEach((h: any) => {
        if (h.value) map[Number(h.value)] = h.label
      })
      hostMap.value = map
    }
  } catch (error) {
    ElMessage.error('获取主机列表失败')
  } finally {
    loadingHost.value = false
  }
}

// 获取主机显示名称
const getHostDisplayName = (log: LogItem) => {
  if (log.hostAddr) return log.hostAddr
  if (log.hostId && hostMap.value[log.hostId]) return hostMap.value[log.hostId]
  return `Host #${log.hostId || 'Unknown'}`
}

// 计算总耗时
const calculateTotalDuration = (commands: CommandResult[]) => {
  let totalMs = 0
  commands.forEach(cmd => {
    const duration = cmd.Duration
    if (duration.endsWith('ms')) {
      totalMs += parseInt(duration)
    } else if (duration.endsWith('s')) {
      totalMs += parseFloat(duration) * 1000
    }
  })
  return totalMs > 1000 ? `${(totalMs / 1000).toFixed(2)}s` : `${totalMs}ms`
}

// 执行脚本
const handleExecute = async () => {
  // 表单验证
  if (scriptSource.value === 'library' && !selectedScriptId.value) {
    ElMessage.warning('请选择要执行的脚本')
    return
  }
  if (scriptSource.value === 'manual' && !manualScriptContent.value.trim()) {
    ElMessage.warning('请输入脚本内容')
    return
  }
  if (!formData.taskName) {
    ElMessage.warning('请输入任务名称')
    return
  }
  if (formData.targetServerIds.length === 0) {
    ElMessage.warning('请选择目标服务器')
    return
  }

  executing.value = true
  selectedHostIndex.value = 0

  try {
    const executeReq: ExecuteScriptReq = {
      scriptId: selectedScriptId.value!,
      hostIds: formData.targetServerIds,
      parameters: formData.scriptParams,
      timeout: formData.timeout,
      workDir: formData.workDir,
      env: formData.env
    }

    const res = await ScriptApi.executeScript(executeReq) as ExecuteResponse

    // 清空之前的日志
    logs.value = []

    // 处理返回的 map 结构数据
    if (res && typeof res === 'object') {
      Object.entries(res).forEach(([hostAddr, commandResults]) => {
        const allSuccess = commandResults.every(cmd => cmd.Success)
        const output = commandResults.map(cmd => cmd.Output).join('\n')

        logs.value.push({
          hostAddr,
          status: allSuccess ? 'success' : 'failed',
          output,
          time: new Date().toLocaleTimeString(),
          commands: commandResults
        })
      })
    } else {
      // 如果返回格式不是预期的，创建基础日志
      formData.targetServerIds.forEach(hostId => {
        const hostName = hostMap.value[hostId] || `Host #${hostId}`
        logs.value.push({
          hostAddr: hostName,
          hostId,
          status: 'failed',
          output: '执行完成，但返回格式异常',
          time: new Date().toLocaleTimeString()
        })
      })
    }

    ElMessage.success('执行完成')
  } catch (error: any) {
    console.error(error)
    ElMessage.error(error.message || '执行失败')

    // 创建错误日志
    logs.value = formData.targetServerIds.map(hostId => {
      const hostName = hostMap.value[hostId] || `Host #${hostId}`
      return {
        hostAddr: hostName,
        hostId,
        status: 'failed',
        output: `执行失败: ${error.message || '未知错误'}`,
        time: new Date().toLocaleTimeString()
      }
    })
  } finally {
    executing.value = false
  }
}

const getStatusType = (status: string) => {
  switch (status) {
    case 'success': return 'success'
    case 'failed': return 'danger'
    case 'running': return 'primary'
    default: return 'info'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'success': return '成功'
    case 'failed': return '失败'
    case 'running': return '运行中'
    default: return '等待'
  }
}

const getLogClass = (status: string) => {
  return `log-${status}`
}

const goBack = () => {
  router.back()
}

onMounted(async () => {
  await remoteSearchScripts('')
  const scriptId = Number(route.query.id)
  if (scriptId) {
    selectedScriptId.value = scriptId
    await loadScriptInfo(scriptId)
  }
  getHosts()
})
</script>

<style scoped>
/* 保持原有的简洁样式 */
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

.task-name-input {
  width: 400px;
}

.script-select {
  width: 400px;
}

.script-type-select {
  width: 150px;
}

.script-content-row {
  align-items: flex-start;
}

.timeout-input {
  width: 120px;
}

.timeout-unit {
  margin-left: 8px;
  font-size: 14px;
  color: #909399;
}

.exec-user-select {
  width: 150px;
}

.work-dir-input {
  width: 400px;
}

.env-input {
  width: 100%;
}

.target-servers-select {
  width: 400px;
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

.log-section-row {
  margin-top: 24px;
  align-items: flex-start;
}

/* 模式切换器 */
.mode-switcher {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.host-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
}

.switcher-label {
  font-size: 14px;
  color: #606266;
}

.host-select {
  width: 200px;
}

.host-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

/* 日志容器 */
.log-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 600px;
  overflow-y: auto;
}

.log-item {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 12px;
  background-color: #ffffff;
}

.log-item.log-success {
  border-color: #67c23a;
  background-color: #f0f9ff;
}

.log-item.log-failed {
  border-color: #f56c6c;
  background-color: #fef0f0;
}

.log-item.log-running {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.log-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.log-host {
  font-weight: 600;
  color: #303133;
}

.log-time {
  margin-left: auto;
  font-size: 12px;
  color: #909399;
}

.log-duration {
  font-size: 12px;
  color: #909399;
  margin-left: 12px;
}

.log-output {
  margin: 0;
  padding: 12px;
  background-color: #1e1e1e;
  color: #abb2bf;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 300px;
  overflow-y: auto;
}

/* 详细模式 */
.detailed-container {
  display: flex;
  gap: 16px;
}

.detailed-log {
  flex: 1;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 12px;
  background-color: #ffffff;
}

.detailed-log.log-success {
  border-color: #67c23a;
  background-color: #f0f9ff;
}

.detailed-log.log-failed {
  border-color: #f56c6c;
  background-color: #fef0f0;
}

.command-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.command-step {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.command-step.step-success {
  border-left: 4px solid #67c23a;
}

.command-step.step-failed {
  border-left: 4px solid #f56c6c;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #fafafa;
  border-bottom: 1px solid #e4e7ed;
}

.step-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.step-number {
  font-weight: 500;
  color: #409eff;
  min-width: 60px;
}

.step-command {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  color: #303133;
  font-size: 13px;
}

.step-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-duration {
  font-size: 12px;
  color: #909399;
}

.step-output {
  padding: 8px 12px;
}

.output-content {
  margin: 0;
  padding: 8px;
  background-color: #1e1e1e;
  color: #abb2bf;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
}

.step-error {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #f56c6c;
  font-size: 12px;
  margin-top: 6px;
  padding: 6px 8px;
  background-color: #fef0f0;
  border-radius: 4px;
}

/* 主机导航 */
.host-navigation {
  width: 250px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #ffffff;
  padding: 12px;
}

.nav-title {
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.host-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.host-nav-item {
  padding: 8px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.host-nav-item:hover {
  border-color: #409eff;
  background-color: #f5f7fa;
}

.host-nav-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.host-nav-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.host-name {
  font-weight: 500;
  font-size: 13px;
  color: #303133;
}

.host-stats {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #909399;
}

.stat {
  color: #606266;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-label {
    width: 100%;
    text-align: left;
    padding-right: 0;
    margin-bottom: 8px;
  }

  .task-name-input,
  .target-servers-select {
    width: 100%;
  }

  .mode-switcher {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .detailed-container {
    flex-direction: column;
  }

  .host-navigation {
    width: 100%;
  }

  .host-switcher {
    width: 100%;
    justify-content: space-between;
  }

  .host-select {
    flex: 1;
  }
}
</style>
