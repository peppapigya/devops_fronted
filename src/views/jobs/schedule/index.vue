<template>
  <div class="schedule-page">
    <el-card shadow="never" class="toolbar">
      <div class="toolbar-left">
        <el-form :inline="true" :model="pageParam" class="filter-form">
          <el-form-item label="任务名称">
            <el-input
              v-model="pageParam.name"
              clearable
              placeholder="请输入任务名称"
              @keyup.enter="loadSchedules"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="pageParam.status" clearable placeholder="全部" style="width: 120px">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="loadSchedules">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="toolbar-right">
        <el-button type="success" :icon="Plus" @click="openCreate">新增任务</el-button>
      </div>
    </el-card>

    <el-card shadow="never" class="table-card">
      <el-table
        v-loading="loading"
        :data="schedules"
        border
        stripe
        style="width: 100%"
        empty-text="暂无数据"
      >
        <el-table-column prop="name" label="任务名称" min-width="160" />
        <el-table-column label="执行计划" min-width="160">
          <template #default="{ row }">
            {{ getPlanName(row.planId) }}
          </template>
        </el-table-column>
        <el-table-column prop="strategy" label="Cron表达式" min-width="140" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              :loading="statusLoading[row.id]"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="最近状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.leatestStatus === 0" type="success">成功</el-tag>
            <el-tag v-else-if="row.leatestStatus === 1" type="danger">失败</el-tag>
            <el-tag v-else type="info">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="成功率" width="120">
          <template #default="{ row }">
            <el-progress
              :percentage="row.sycleSuccessRate || 0"
              :status="getSuccessRateStatus(row.sycleSuccessRate)"
            />
          </template>
        </el-table-column>
        <el-table-column label="更新时间" min-width="180">
          <template #default="{ row }">
            {{ formatDate(row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" :icon="Edit" @click="openEdit(row)">编辑</el-button>
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
        :current-page="pageParam.pageNum"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
      />
    </el-card>

    <ScheduleDrawer
      v-model="drawerVisible"
      :current-id="currentId"
      @success="loadSchedules"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, Search, Plus } from '@element-plus/icons-vue'
import { ScheduleApi, type JobScheduledTask, type JobSchedulePageReq } from '@/api/jobs/schedule'
import { PlanApi } from '@/api/jobs/plan'
import ScheduleDrawer from './components/ScheduleDrawer.vue'

const loading = ref(false)
const schedules = ref<JobScheduledTask[]>([])
const total = ref(0)
const drawerVisible = ref(false)
const currentId = ref<number | undefined>(undefined)
const planMap = ref<Record<number, string>>({})
const statusLoading = ref<Record<number, boolean>>({})

const pageParam = reactive<JobSchedulePageReq>({
  pageNum: 1,
  pageSize: 10,
  name: '',
  status: undefined
})

const loadSchedules = async () => {
  loading.value = true
  try {
    const res = await ScheduleApi.getSchedulePage(pageParam)
    schedules.value = res.list
    total.value = res.total
  } catch (error) {
    console.error(error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const loadPlans = async () => {
  try {
    const res = await PlanApi.getAllPlans()
    const map: Record<number, string> = {}
    res.forEach(p => {
      if (p.id) map[p.id] = p.name
    })
    planMap.value = map
  } catch (error) {
    console.error('Failed to load plans', error)
  }
}

const getPlanName = (id: number) => {
  return planMap.value[id] || `Plan #${id}`
}

const resetQuery = () => {
  pageParam.pageNum = 1
  pageParam.pageSize = 10
  pageParam.name = ''
  pageParam.status = undefined
  loadSchedules()
}

const onPageChange = (page: number) => {
  pageParam.pageNum = page
  loadSchedules()
}

const onPageSizeChange = (size: number) => {
  pageParam.pageSize = size
  loadSchedules()
}

const openCreate = () => {
  currentId.value = undefined
  drawerVisible.value = true
}

const openEdit = (row: JobScheduledTask) => {
  currentId.value = row.id
  drawerVisible.value = true
}

const onDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确认删除该任务？', '提示', { type: 'warning' })
    await ScheduleApi.deleteSchedule(id)
    ElMessage.success('删除成功')
    loadSchedules()
  } catch {
    // Cancelled
  }
}

const handleStatusChange = async (row: JobScheduledTask) => {
  if (!row.id) return
  statusLoading.value[row.id] = true
  try {
    await ScheduleApi.updateStatus(row.id, row.status)
    ElMessage.success('状态更新成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('状态更新失败')
    // Revert status
    row.status = row.status === 1 ? 0 : 1
  } finally {
    statusLoading.value[row.id] = false
  }
}

const getSuccessRateStatus = (rate?: number) => {
  if (!rate) return ''
  if (rate >= 90) return 'success'
  if (rate >= 60) return 'warning'
  return 'exception'
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

onMounted(async () => {
  await loadPlans()
  loadSchedules()
})
</script>

<style scoped>
.schedule-page {
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
.toolbar-right {
  margin-left: 16px;
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
</style>
