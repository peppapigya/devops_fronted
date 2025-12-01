<template>
    <!-- 顶部工具栏：查询/重置/新增 -->
    <div class="hosts-page">
      <el-card shadow="never" class="toolbar">
        <div class="toolbar-left">
          <el-form :inline="true" :model="pageParam" class="filter-form">
            <el-form-item label="关键词">
              <el-input
                v-model="pageParam.keyword"
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

      <el-card shadow="never" class="table-card">
        <el-table
          v-loading="loading"
          :data="hosts"
          border
          stripe
          style="width: 100%"
          empty-text="暂无数据"
        >
          <el-table-column prop="hostName" label="名称" min-width="160" />
          <el-table-column prop="address" label="地址/IP" min-width="180" />
          <el-table-column prop="hostPort" label="端口" width="100" />
          <el-table-column prop="username" label="用户名" min-width="140" />
          <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip />
          <el-table-column label="创建时间" min-width="180">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="360">
            <template #default="{ row }">
              <el-button size="small" :icon="Edit" @click="openEdit(row)">编辑</el-button>
              <el-button
                size="small"
                type="primary"
                :icon="Link"
                :loading="actionLoading[`test-${row.id}`]"
                @click="onTest(row.id)"
              >
                测试连接
              </el-button>
              <el-button
                size="small"
                type="warning"
                :icon="Monitor"
                :loading="actionLoading[`inspect-${row.id}`]"
                @click="onInspect(row.id)"
              >
                巡检
              </el-button>
              <el-button size="small" type="danger" :icon="Delete" @click="onDelete(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          class="pagination"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageParam.pageSize"
          :current-page="pageParam.pageNumber"
          @size-change="onPageSizeChange"
          @current-change="onPageChange"
        />
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
              <div>
                <!-- 新增：结构化查看按钮（有结构化对象时显示） -->
                <el-button v-if="inspectObj" link type="primary" @click="inspectDialogVisible = true">结构化查看</el-button>
                <el-button link type="primary" @click="inspectResult = ''">清空</el-button>
              </div>
            </div>
          </template>
          <pre class="result-pre">{{ inspectResult }}</pre>
        </el-card>
      </div>

      <!-- 新增：巡检详情弹窗（结构化展示） -->
      <el-dialog v-model="inspectDialogVisible" title="巡检详情" width="900px" destroy-on-close append-to-body align-center>
        <BeautifiedMetricsView v-if="inspectObj" :data="inspectObj" />
        <template #footer>
          <el-button @click="inspectDialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>

      <!-- 弹窗表单：新增/编辑主机 -->
      <el-dialog v-model="dialogVisible" :title="form.id ? '编辑主机' : '新增主机'" width="520px" destroy-on-close append-to-body align-center>
        <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
          <el-form-item label="名称" prop="hostName">
            <el-input v-model="form.hostName" placeholder="例如：生产-DB01" />
          </el-form-item>
          <el-form-item label="地址/IP" prop="address">
            <el-input v-model="form.address" placeholder="例如：192.168.1.10" />
          </el-form-item>
          <el-form-item label="端口" prop="hostPort">
            <el-input-number v-model="form.hostPort" :min="1" :max="65535" :step="1" controls-position="right" />
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="例如：root" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.hostPassword" type="hostPassword" placeholder="SSH 密码（可选）" show-hostPassword />
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
  import { onMounted, reactive, ref } from 'vue'
  import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
  import { Edit, Delete, Link, Search, Plus, Monitor } from '@element-plus/icons-vue'
  import { PageParamDTO } from '@/api/hosts/type'
  import { HostsApi } from '@/api/hosts/index'
  import type { Host } from '@/api/hosts/type'
  import BeautifiedMetricsView from '@/components/BeautifiedMetrics.vue' // 新增导入

  const hosts = ref<Host[]>([])
  const loading = ref<boolean>(false)

  const total = ref<number>(0)


  const pageParam = ref<PageParamDTO>( {
    pageSize: 10,
    pageNumber: 1,
    keyword: ''
  })

  function resetQuery() {
    pageParam.value.pageSize = 10
    pageParam.value.pageNumber = 1
    pageParam.value.keyword = ''
    loadHosts()
  }

  const inspectResult = ref<string>('')
  const testResult = ref<string>('')

  // 按钮Loading状态管理
  const actionLoading = reactive<Record<string, boolean>>({})

  // 表单弹窗
  const dialogVisible = ref<boolean>(false)
  const saving = ref<boolean>(false)
  const formRef = ref<FormInstance>()
  const form = reactive<Host>({
    id: 0,
    hostName: '',
    address: '',
    hostPort: 22,
    username: '',
    hostPassword: '',
    remark: '',
  })
  const formRules: FormRules = {
    hostName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    address: [{ required: true, message: '请输入地址或 IP', trigger: 'blur' }],
    hostPort: [{ required: true, message: '请输入端口', trigger: 'change' }],
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  }

  function resetForm() {
    form.id = 0
    form.hostName = ''
    form.address = ''
    form.hostPort = 22
    form.username = ''
    form.hostPassword = ''
    form.remark = ''
  }

  function openCreate() {
    resetForm()
    dialogVisible.value = true
  }
  function openEdit(h: Host) {
    form.id = h.id
    form.hostName = h.hostName
    form.address = h.address
    form.hostPort = h.hostPort
    form.username = h.username
    form.hostPassword = ''
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
  const inspectObj = ref<any>(null)
    const inspectDialogVisible = ref<boolean>(false)
  async function loadHosts() {
    loading.value = true
    try {
      const res = await HostsApi.list(pageParam.value)
      hosts.value = res.data
      total.value = res.total
      pageParam.value.pageSize = res.pageSize
      pageParam.value.pageNumber = res.pageNumber
    } catch (e: any) {
      ElMessage.error(e.message || '加载失败')
    } finally {
      loading.value = false
    }
  }

function onPageChange(page: number) {
  pageParam.value.pageNumber= page
  loadHosts()
}
function onPageSizeChange(size: number) {
  pageParam.value.pageSize = size
  loadHosts()
}

  async function saveHost() {
    if (!formRef.value) return
    await formRef.value.validate(async (valid) => {
      if (!valid) return
      saving.value = true
      try {
        const payload = {
          id: form.id,
          hostName: form.hostName.trim(),
          address: form.address.trim(),
          hostPort: form.hostPort || 22,
          username: form.username.trim(),
          hostPassword: form.hostPassword || '',
          remark: (form.remark || '').trim(),
        }
        if (form.id) {
          await HostsApi.update(payload)
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

  async function onDelete(id: number) {
    try {
      await ElMessageBox.confirm('确认删除该主机？', '提示', { type: 'warning' })
      await HostsApi.remove(id)
      ElMessage.success('删除成功')
      await loadHosts()
    } catch {
    }
  }

  async function onTest(id: number) {
    testResult.value = ''
    const key = `test-${id}`
    actionLoading[key] = true
    try {
      const txt = await HostsApi.test(id)
      ElMessage.success('连接正常')
      testResult.value = typeof txt === 'string' ? txt : JSON.stringify(txt)
    } catch (e: any) {
      ElMessage.error('测试失败')
      testResult.value = `测试失败：${e?.message || '未知错误'}`
    } finally {
      actionLoading[key] = false
    }
  }

  async function onInspect(id: number) {
    inspectResult.value = ''
    const key = `inspect-${id}`
    actionLoading[key] = true
    try {
      const data = await HostsApi.inspect(id)
      ElMessage.success('巡检完成')
      inspectResult.value = JSON.stringify(data, null, 2)
      inspectObj.value = data
      console.log("data:",data)
      inspectDialogVisible.value = true
    } catch (e: any) {
      ElMessage.error('巡检失败')
      inspectResult.value = `巡检失败：${e?.message || '未知错误'}`
      inspectObj.value = null
    } finally {
      actionLoading[key] = false
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
  .pagination { margin-top: 12px; display: flex; justify-content: flex-end; }
  </style>
