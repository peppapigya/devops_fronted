<template>
    <!-- 顶部工具栏：查询/重置/新增 -->
    <div class="hosts-page">
      <el-card shadow="never" class="toolbar">
        <div class="toolbar-left">
          <el-form :inline="true" :model="query" class="filter-form">
            <el-form-item label="关键词">
              <el-input
                v-model="query.keyword"
                clearable
                placeholder="名称 / IP / 用户名"
                @keyup.enter="loadHosts"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="loadHosts">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="toolbar-right">
          <el-button type="success" :icon="Plus" @click="openCreate">新增主机</el-button>
        </div>
      </el-card>
  
      <!-- 主表格：经典列表样式 -->
      <el-card shadow="never" class="table-card">
        <el-table
          v-loading="loading"
          :data="filteredHosts"
          border
          stripe
          style="width: 100%"
          empty-text="暂无数据"
        >
          <el-table-column prop="name" label="名称" min-width="160" />
          <el-table-column prop="address" label="地址/IP" min-width="180" />
          <el-table-column prop="port" label="端口" width="100" />
          <el-table-column prop="username" label="用户名" min-width="140" />
          <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip />
          <el-table-column label="创建时间" min-width="180">
            <template #default="{ row }">
              {{ formatDate(row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="360" fixed="right">
            <template #default="{ row }">
              <el-button size="small" :icon="Edit" @click="openEdit(row)">编辑</el-button>
              <el-button size="small" type="primary" :icon="Link" @click="onTest(row.id)">测试连接</el-button>
              <el-button size="small" type="warning" :icon="Monitor" @click="onInspect(row.id)">巡检</el-button>
              <el-popconfirm title="确认删除该主机？" @confirm="onDelete(row.id)">
                <template #reference>
                  <el-button size="small" type="danger" :icon="Delete">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  
      <!-- 结果卡片：巡检与连接测试 -->
      <div class="result-grid">
        <el-card v-if="testResult" class="result-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>连接测试</span>
              <el-button link type="primary" @click="testResult = ''">清空</el-button>
            </div>
          </template>
          <pre class="result-pre">{{ testResult }}</pre>
        </el-card>
  
        <el-card v-if="inspectResult" class="result-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>巡检结果</span>
              <el-button link type="primary" @click="inspectResult = ''">清空</el-button>
            </div>
          </template>
          <pre class="result-pre">{{ inspectResult }}</pre>
        </el-card>
      </div>
  
      <!-- 弹窗表单：新增/编辑主机 -->
      <el-dialog v-model="dialogVisible" :title="form.id ? '编辑主机' : '新增主机'" width="520px" destroy-on-close>
        <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="例如：生产-DB01" />
          </el-form-item>
          <el-form-item label="地址/IP" prop="address">
            <el-input v-model="form.address" placeholder="例如：192.168.1.10" />
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input-number v-model="form.port" :min="1" :max="65535" :step="1" controls-position="right" />
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="例如：root" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" type="password" placeholder="SSH 密码（可选）" show-password />
          </el-form-item>
          <el-form-item label="备注">
            <el-input 
            v-model="form.remark"
            type="textarea"
            maxlength="500"
            show-word-limit
            placeholder="可填写用途、环境、说明"
        />
      </el-form-item>
          <el-form-item>
            <el-alert
              title="提示：密码仅用于后端建立 SSH 连接，示例以明文存储于 SQLite，生产建议加密或使用秘钥登录。"
              type="info"
              :closable="false"
              show-icon
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" :loading="saving" @click="saveHost">保存</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  // 引入 Vue 与 Element Plus
  import { onMounted, reactive, ref, computed } from 'vue'
  import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
  import { Edit, Delete, Link, Search, Plus, Monitor } from '@element-plus/icons-vue'
  
  // 将本地类型替换为统一的 API 类型，并引入 HostsApi
  import { HostsApi } from '@/api/hosts/index'
  import type { Host } from '@/api/hosts/type'
  
  // 列表与加载态
  const hosts = ref<Host[]>([])
  const loading = ref<boolean>(false)
  
  // 查询条件
  const query = reactive({ keyword: '' })
  const filteredHosts = computed(() => {
    const kw = query.keyword.trim().toLowerCase()
    if (!kw) return hosts.value
    return hosts.value.filter(h =>
      [h.name, h.address, h.username].some(v => (v || '').toLowerCase().includes(kw))
    )
  })
  function resetQuery() {
    query.keyword = ''
    loadHosts()
  }
  
  // 结果显示
  const inspectResult = ref<string>('')
  const testResult = ref<string>('')
  
  // 表单弹窗
  const dialogVisible = ref<boolean>(false)
  const saving = ref<boolean>(false)
  const formRef = ref<FormInstance>()
  const form = reactive<Host>({
    id: 0,
    name: '',
    address: '',
    port: 22,
    username: '',
    password: '',
    remark: '',
  })
  const formRules: FormRules = {
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    address: [{ required: true, message: '请输入地址或 IP', trigger: 'blur' }],
    port: [{ required: true, message: '请输入端口', trigger: 'change' }],
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  }
  
  function resetForm() {
    form.id = 0
    form.name = ''
    form.address = ''
    form.port = 22
    form.username = ''
    form.password = ''
    form.remark = ''
  }
  
  function openCreate() {
    resetForm()
    dialogVisible.value = true
  }
  function openEdit(h: Host) {
    form.id = h.id
    form.name = h.name
    form.address = h.address
    form.port = h.port
    form.username = h.username
    form.password = '' // 更新时可选填
    form.remark = h.remark || ''
    dialogVisible.value = true
  }
  
  function formatDate(dt?: string) {
    if (!dt) return ''
    const d = new Date(dt)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    const ss = String(d.getSeconds()).padStart(2, '0')
    return `${y}-${m}-${day} ${hh}:${mm}:${ss}`
  }
  
  // async function loadHosts() { 使用 HostsApi.list 替代 fetch
  async function loadHosts() {
    loading.value = true
    try {
      const res = await HostsApi.list()
      hosts.value = res
    } catch (e: any) {
      ElMessage.error(e.message || '加载失败')
    } finally {
      loading.value = false
    }
  }
  
  // async function saveHost() { 使用 HostsApi.create / HostsApi.update
  async function saveHost() {
    if (!formRef.value) return
    await formRef.value.validate(async (valid) => {
      if (!valid) return
      saving.value = true
      try {
        const payload = {
          name: form.name.trim(),
          address: form.address.trim(),
          port: form.port || 22,
          username: form.username.trim(),
          password: form.password || '',
          remark: (form.remark || '').trim(),
        }
        if (form.id) {
          await HostsApi.update(form.id, payload)
          ElMessage.success('更新成功')
        } else {
          await HostsApi.create(payload)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        resetForm()
        await loadHosts()
      } catch (e: any) {
        ElMessage.error(e.message || '保存失败')
      } finally {
        saving.value = false
      }
    })
  }
  
  // async function onDelete(id: number) { 使用 HostsApi.remove
  async function onDelete(id: number) {
    try {
      await ElMessageBox.confirm('确认删除该主机？', '提示', { type: 'warning' })
      await HostsApi.remove(id)
      ElMessage.success('删除成功')
      await loadHosts()
    } catch {
      // 用户取消或删除失败均不处理
    }
  }
  
  // async function onTest(id: number) { 使用 HostsApi.test
  async function onTest(id: number) {
    testResult.value = ''
    try {
      const txt = await HostsApi.test(id)
      ElMessage.success('连接正常')
      // 如果返回的是对象，兜底展示为字符串
      testResult.value = typeof txt === 'string' ? txt : JSON.stringify(txt)
    } catch (e: any) {
      ElMessage.error('测试失败')
      testResult.value = `测试失败：${e?.message || '未知错误'}`
    }
  }
  
  // async function onInspect(id: number) { 使用 HostsApi.inspect
  async function onInspect(id: number) {
    inspectResult.value = ''
    try {
      const data = await HostsApi.inspect(id)
      ElMessage.success('巡检完成')
      inspectResult.value = JSON.stringify(data, null, 2)
    } catch (e: any) {
      ElMessage.error('巡检失败')
      inspectResult.value = `巡检失败：${e?.message || '未知错误'}`
    }
  }
  
  onMounted(loadHosts)
  </script>
  
  <style scoped>
  .hosts-page { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .toolbar { display: flex; justify-content: space-between; align-items: center; }
  .filter-form { display: flex; align-items: center; }
  .table-card { }
  .result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .result-card { }
  .card-header { display: flex; justify-content: space-between; align-items: center; }
  .result-pre { background: #f6f8fa; padding: 12px; border-radius: 4px; white-space: pre-wrap; }
  </style>