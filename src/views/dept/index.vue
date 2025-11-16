<template>
  <div class="dept-management">
    <el-card shadow="never">
      <div class="toolbar">
        <el-form :model="query" inline>
          <el-form-item>
            <el-input v-model="query.name" placeholder="部门名称" prefix-icon="Search" style="width: 200px;" @change="fetch" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="query.status" placeholder="状态" clearable style="width: 120px;">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>

        <div class="actions">
          <el-button type="primary" v-permission="'system:dept:create'" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            新增部门
          </el-button>
          <el-button :disabled="!selectedRows.length" v-permission="'system:dept:delete'" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
        </div>
      </div>

      <el-table :data="list" row-key="id" :tree-props="{ children: 'children' }" @selection-change="onSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="部门名称" min-width="180" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="leaderUserId" label="负责人ID" width="120" />
        <el-table-column prop="phone" label="电话" width="140" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{row}">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="220">
          <template #default="{row}">
            <el-button link type="primary" size="small" v-permission="'system:dept:update'" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="warning" size="small" v-permission="'system:dept:status'" @click="toggleStatus(row)">{{ row.status === 1 ? '禁用' : '启用' }}</el-button>
            <el-button link type="danger" size="small" v-permission="'system:dept:delete'" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
            v-model:current-page="query.pageNum"
            v-model:page-size="query.pageSize"
            :page-sizes="[10,20,50]"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="520px" :close-on-click-modal="false">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="90px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="上级部门" prop="parentId">
          <el-tree-select v-model="form.parentId" :data="treeOptions" placeholder="选择上级" check-strictly clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="负责人ID" prop="leaderUserId">
          <el-input v-model="form.leaderUserId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="submit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
  
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DeptApi } from '@/api/dept'
import type { DeptVO, DeptPageParams } from '@/api/dept/types'

const query = reactive<DeptPageParams>({ pageNum: 1, pageSize: 10, name: '', status: '' as any })
const list = ref<DeptVO[]>([])
const total = ref<number>(0)
const selectedRows = ref<DeptVO[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('新增部门')
const submitting = ref(false)
const formRef = ref<FormInstance>()
const form = reactive<DeptVO>({ name: '', parentId: null, sort: 0, leaderUserId: null, phone: '', email: '', status: 1 })
const formRules: FormRules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'change' }],
}

const treeOptions = ref<any[]>([])

const fetch = async () => {
  const res: any = await DeptApi.page(query)
  list.value = res.data || res.rows || []
  total.value = res.total || 0
}
const fetchTree = async () => {
  try {
    const res: any = await DeptApi.tree()
    treeOptions.value = res.data || res || []
  } catch {}
}

const handleSearch = () => { query.pageNum = 1; fetch() }
const handleReset = () => { Object.assign(query, { pageNum: 1, pageSize: 10, name: '', status: '' }); fetch() }
const handleSizeChange = (val: number) => { query.pageSize = val; fetch() }
const handleCurrentChange = (val: number) => { query.pageNum = val; fetch() }
const onSelectionChange = (rows: DeptVO[]) => { selectedRows.value = rows }

const handleCreate = () => { dialogTitle.value = '新增部门'; Object.assign(form, { id: undefined, name: '', parentId: null, sort: 0, leaderUserId: null, phone: '', email: '', status: 1 }); dialogVisible.value = true; fetchTree() }
const handleEdit = (row: DeptVO) => { dialogTitle.value = '编辑部门'; Object.assign(form, row); dialogVisible.value = true; fetchTree() }
const submit = async () => {
  await formRef.value?.validate()
  submitting.value = true
  try {
    if (form.id) await DeptApi.update(form)
    else await DeptApi.create(form)
    ElMessage.success('保存成功')
    dialogVisible.value = false
    fetch()
  } finally { submitting.value = false }
}
const toggleStatus = async (row: DeptVO) => { await DeptApi.updateStatus(row.id!, row.status === 1 ? 0 : 1); ElMessage.success('状态已更新'); fetch() }
const handleDelete = async (row: DeptVO) => {
  await ElMessageBox.confirm('确定删除该部门？', '提示')
  await DeptApi.remove(row.id!)
  ElMessage.success('删除成功')
  fetch()
}
const handleBatchDelete = async () => {
  await ElMessageBox.confirm('确定批量删除选中部门？', '提示')
  for (const r of selectedRows.value) await DeptApi.remove(r.id!)
  ElMessage.success('批量删除成功')
  fetch()
}

onMounted(() => { fetch() })
</script>

<style scoped>
.dept-management { }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.actions { display: flex; gap: 10px; }
.pagination { margin-top: 10px; display: flex; justify-content: flex-end; }
</style>