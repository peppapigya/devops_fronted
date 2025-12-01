<template>
  <div class="script-page">
    <el-card shadow="never" class="toolbar">
      <div class="toolbar-left">
        <el-form :inline="true" :model="pageParam" class="filter-form">
          <el-form-item label="脚本名称">
            <el-input
              v-model="pageParam.name"
              clearable
              placeholder="请输入脚本名称"
              @keyup.enter="loadScripts"
            />
          </el-form-item>
          <el-form-item label="脚本类型">
            <el-select v-model="pageParam.type" clearable placeholder="全部" style="width: 120px">
              <el-option label="Shell" value="shell" />
              <el-option label="Bat" value="bat" />
              <el-option label="Perl" value="perl" />
              <el-option label="Python" value="python" />
              <el-option label="PowerShell" value="powershell" />
              <el-option label="SQL" value="sql" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="loadScripts">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="toolbar-right">
        <el-button type="success" :icon="Plus" @click="openCreate">新增脚本</el-button>
      </div>
    </el-card>

    <el-card shadow="never" class="table-card">
      <el-table
        v-loading="loading"
        :data="scripts"
        border
        stripe
        style="width: 100%"
        empty-text="暂无数据"
      >
        <el-table-column prop="name" label="脚本名称" min-width="160" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag>{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" min-width="120" />
        <el-table-column label="更新时间" min-width="180">
          <template #default="{ row }">
            {{ formatDate(row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="success" :icon="VideoPlay" @click="openExecute(row)">执行</el-button>
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

    <ScriptDrawer
      v-model="drawerVisible"
      :current-id="currentId"
      @success="loadScripts"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, Search, Plus, VideoPlay } from '@element-plus/icons-vue'
import { ScriptApi, type JobScript, type JobScriptPageReq } from '@/api/jobs/script'
import ScriptDrawer from './components/ScriptDrawer.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false)
const scripts = ref<JobScript[]>([])
const total = ref(0)
const drawerVisible = ref(false)
const currentId = ref<number | undefined>(undefined)

const pageParam = reactive<JobScriptPageReq>({
  pageNum: 1,
  pageSize: 10,
  name: '',
  type: ''
})

const loadScripts = async () => {
  loading.value = true
  try {
    const res = await ScriptApi.getScriptPage(pageParam)
    scripts.value = res.data
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
  pageParam.type = ''
  loadScripts()
}

const onPageChange = (page: number) => {
  pageParam.pageNum = page
  loadScripts()
}

const onPageSizeChange = (size: number) => {
  pageParam.pageSize = size
  loadScripts()
}

const openCreate = () => {
  currentId.value = undefined
  drawerVisible.value = true
}

const openExecute = (row: JobScript) => {
  router.push({
    path: '/jobs/script/execute',
    query: { id: row.id }
  })
}

const openEdit = (row: JobScript) => {
  currentId.value = row.id
  drawerVisible.value = true
}

const onDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确认删除该脚本？', '提示', { type: 'warning' })
    await ScriptApi.deleteScript(id)
    ElMessage.success('删除成功')
    loadScripts()
  } catch {
    // Cancelled
  }
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

onMounted(() => {
  loadScripts()
})
</script>

<style scoped>
.script-page {
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
