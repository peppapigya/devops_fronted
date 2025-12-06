<template>
  <div class="plan-page">
    <el-card shadow="never" class="toolbar">
      <div class="toolbar-left">
        <el-form :inline="true" :model="pageParam" class="filter-form">
          <el-form-item label="计划名称">
            <el-input
              v-model="pageParam.name"
              clearable
              placeholder="请输入计划名称"
              @keyup.enter="loadPlans"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="loadPlans">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="toolbar-right">
        <el-button type="success" :icon="Plus" @click="openCreate">新增计划</el-button>
      </div>
    </el-card>

    <el-card shadow="never" class="table-card">
      <el-table
        v-loading="loading"
        :data="plans"
        border
        stripe
        style="width: 100%"
        empty-text="暂无数据"
      >
        <el-table-column prop="name" label="计划名称" min-width="160" />
        <el-table-column label="主机数量" width="100">
          <template #default="{ row }">
            {{ row.hostIds ? row.hostIds.length : 0 }}
          </template>
        </el-table-column>
        <el-table-column label="脚本数量" width="100">
          <template #default="{ row }">
            {{ row.scripts ? row.scripts.length : 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
        <el-table-column label="更新时间" min-width="180">
          <template #default="{ row }">
            {{ formatDate(row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button size="small" :icon="VideoPlay" type="success" @click="onRun(row)">执行</el-button>
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

    <PlanDrawer
      v-model="drawerVisible"
      :current-id="currentId"
      @success="loadPlans"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, Search, Plus, VideoPlay } from '@element-plus/icons-vue'
import { PlanApi, type JobPlan, type JobPlanPageReq } from '@/api/jobs/plan'
import PlanDrawer from './components/PlanDrawer.vue'

const loading = ref(false)
const plans = ref<JobPlan[]>([])
const total = ref(0)
const drawerVisible = ref(false)
const currentId = ref<number | undefined>(undefined)

const pageParam = reactive<JobPlanPageReq>({
  pageNum: 1,
  pageSize: 10,
  name: ''
})

const loadPlans = async () => {
  loading.value = true
  try {
    const res = await PlanApi.getPlanPage(pageParam)
    plans.value = res.data
    total.value = res.total
  } catch (error) {
    console.error(error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  pageParam.pageNum = 1
  pageParam.pageSize = 10
  pageParam.name = ''
  loadPlans()
}

const onPageChange = (page: number) => {
  pageParam.pageNum = page
  loadPlans()
}

const onPageSizeChange = (size: number) => {
  pageParam.pageSize = size
  loadPlans()
}

const openCreate = () => {
  currentId.value = undefined
  drawerVisible.value = true
}

const openEdit = (row: JobPlan) => {
  currentId.value = row.id
  drawerVisible.value = true
}

const onDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确认删除该计划？', '提示', { type: 'warning' })
    await PlanApi.deletePlan(id)
    ElMessage.success('删除成功')
    loadPlans()
  } catch {
    // Cancelled
  }
}

const onRun = (row: any) => {
  // TODO: Implement run logic
  ElMessage.info('执行功能开发中')
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

onMounted(() => {
  loadPlans()
})
</script>

<style scoped>
.plan-page {
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
