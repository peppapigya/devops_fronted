<template>
  <div class="log-page">
    <el-card shadow="never" class="toolbar">
      <div class="toolbar-left">
        <el-form :inline="true" :model="pageParam" class="filter-form">
          <el-form-item label="执行计划">
            <el-select v-model="pageParam.planId" clearable placeholder="全部" style="width: 160px">
              <el-option
                v-for="plan in planList"
                :key="plan.id"
                :label="plan.name"
                :value="plan.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="主机">
            <el-select v-model="pageParam.hostId" clearable placeholder="全部" style="width: 160px">
              <el-option
                v-for="host in hostList"
                :key="host.value"
                :label="host.label"
                :value="Number(host.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="pageParam.status" clearable placeholder="全部" style="width: 120px">
              <el-option label="运行中" :value="0" />
              <el-option label="成功" :value="1" />
              <el-option label="失败" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="loadLogs">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card shadow="never" class="table-card">
      <el-table
        v-loading="loading"
        :data="logs"
        border
        stripe
        style="width: 100%"
        empty-text="暂无数据"
      >
        <el-table-column label="执行计划" min-width="160">
          <template #default="{ row }">
            {{ getPlanName(row.planId) }}
          </template>
        </el-table-column>
        <el-table-column label="主机" min-width="160">
          <template #default="{ row }">
            {{ getHostName(row.hostId) }}
          </template>
        </el-table-column>
        <el-table-column prop="method" label="执行方式" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success">成功</el-tag>
            <el-tag v-else-if="row.status === 2" type="danger">失败</el-tag>
            <el-tag v-else type="primary">运行中</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalTime" label="耗时(ms)" width="100" />
        <el-table-column prop="returnCode" label="返回码" width="80" />
        <el-table-column label="执行时间" min-width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="viewOutput(row)">查看日志</el-button>
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
        :current-page="pageParam.pageNum"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
      />
    </el-card>

    <!-- Log Output Dialog -->
    <el-dialog
      v-model="outputVisible"
      title="执行日志"
      width="800px"
      append-to-body
    >
      <pre class="log-output">{{ currentOutput }}</pre>
      <template #footer>
        <el-button @click="outputVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { LogApi, type JobPlanLog, type JobLogPageReq } from '@/api/jobs/log'
import { PlanApi, type JobPlan } from '@/api/jobs/plan'
import { HostsApi } from '@/api/hosts'

const loading = ref(false)
const logs = ref<JobPlanLog[]>([])
const total = ref(0)
const planList = ref<JobPlan[]>([])
const hostList = ref<any[]>([])
const planMap = ref<Record<number, string>>({})
const hostMap = ref<Record<number, string>>({})

const outputVisible = ref(false)
const currentOutput = ref('')

const pageParam = reactive<JobLogPageReq>({
  pageNum: 1,
  pageSize: 10,
  planId: undefined,
  hostId: undefined,
  status: undefined
})

const loadLogs = async () => {
  loading.value = true
  try {
    const res = await LogApi.getLogPage(pageParam)
    logs.value = res.list
    total.value = res.total
  } catch (error) {
    console.error(error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const loadMetadata = async () => {
  try {
    const [plansRes, hostsRes] = await Promise.all([
      PlanApi.getAllPlans(),
      HostsApi.getSelectList()
    ])
    planList.value = plansRes
    hostList.value = hostsRes

    const pMap: Record<number, string> = {}
    plansRes.forEach(p => {
      if (p.id) pMap[p.id] = p.name
    })
    planMap.value = pMap

    const hMap: Record<number, string> = {}
    hostsRes.forEach((h: any) => {
      if (h.value) hMap[Number(h.value)] = h.label
    })
    hostMap.value = hMap
  } catch (error) {
    console.error('Failed to load metadata', error)
  }
}

const getPlanName = (id: number) => {
  return planMap.value[id] || `Plan #${id}`
}

const getHostName = (id: number) => {
  return hostMap.value[id] || `Host #${id}`
}

const resetQuery = () => {
  pageParam.pageNum = 1
  pageParam.pageSize = 10
  pageParam.planId = undefined
  pageParam.hostId = undefined
  pageParam.status = undefined
  loadLogs()
}

const onPageChange = (page: number) => {
  pageParam.pageNum = page
  loadLogs()
}

const onPageSizeChange = (size: number) => {
  pageParam.pageSize = size
  loadLogs()
}

const viewOutput = (row: JobPlanLog) => {
  currentOutput.value = row.output || '无输出'
  outputVisible.value = true
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

onMounted(async () => {
  await loadMetadata()
  loadLogs()
})
</script>

<style scoped>
.log-page {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.toolbar-left {
  flex: 1;
}
.filter-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
.log-output {
  background-color: #1e1e1e;
  color: #abb2bf;
  padding: 16px;
  border-radius: 4px;
  overflow: auto;
  max-height: 500px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
