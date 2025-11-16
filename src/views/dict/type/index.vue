<template>
  <div class="dict-type">
    <el-card shadow="never">
      <div class="toolbar">
        <el-form :model="query" inline>
          <el-form-item>
            <el-input v-model="query.name" placeholder="名称" prefix-icon="Search" style="width: 200px;" @change="fetch" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="query.type" placeholder="类型" style="width: 200px;" @change="fetch" />
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
          <el-button type="primary" v-permission="'system:dictType:create'" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            新增类型
          </el-button>
        </div>
      </div>

      <el-table :data="list" @selection-change="onSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="名称" min-width="180" />
        <el-table-column prop="type" label="类型" min-width="180" />
        <el-table-column prop="remark" label="备注" min-width="220" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{row}">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="220">
          <template #default="{row}">
            <el-button link type="primary" size="small" v-permission="'system:dictType:update'" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="warning" size="small" v-permission="'system:dictType:status'" @click="toggleStatus(row)">{{ row.status === 1 ? '禁用' : '启用' }}</el-button>
            <el-button link type="danger" size="small" v-permission="'system:dictType:delete'" @click="handleDelete(row)">删除</el-button>
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="form.type" placeholder="请输入类型" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="备注" />
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
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DictTypeApi } from '@/api/dictType'
import type { DictTypeVO, DictTypePageParams } from '@/api/dictType/types'

const query = reactive<DictTypePageParams>({ pageNum: 1, pageSize: 10, name: '', type: '', status: '' as any })
const list = ref<DictTypeVO[]>([])
const total = ref<number>(0)
const selectedRows = ref<DictTypeVO[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('新增类型')
const submitting = ref(false)
const formRef = ref<FormInstance>()
const form = reactive<DictTypeVO>({ name: '', type: '', remark: '', status: 1 })
const formRules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  type: [{ required: true, message: '请输入类型', trigger: 'blur' }],
}

const fetch = async () => {
  const res: any = await DictTypeApi.page(query)
  list.value = res.data || res.rows || []
  total.value = res.total || 0
}
const handleSearch = () => { query.pageNum = 1; fetch() }
const handleReset = () => { Object.assign(query, { pageNum: 1, pageSize: 10, name: '', type: '', status: '' }); fetch() }
const handleSizeChange = (val: number) => { query.pageSize = val; fetch() }
const handleCurrentChange = (val: number) => { query.pageNum = val; fetch() }
const onSelectionChange = (rows: DictTypeVO[]) => { selectedRows.value = rows }

const handleCreate = () => { dialogTitle.value = '新增类型'; Object.assign(form, { id: undefined, name: '', type: '', remark: '', status: 1 }); dialogVisible.value = true }
const handleEdit = (row: DictTypeVO) => { dialogTitle.value = '编辑类型'; Object.assign(form, row); dialogVisible.value = true }
const submit = async () => {
  await formRef.value?.validate()
  submitting.value = true
  try {
    if (form.id) await DictTypeApi.update(form)
    else await DictTypeApi.create(form)
    ElMessage.success('保存成功')
    dialogVisible.value = false
    fetch()
  } finally { submitting.value = false }
}
const toggleStatus = async (row: DictTypeVO) => { await DictTypeApi.updateStatus(row.id!, row.status === 1 ? 0 : 1); ElMessage.success('状态已更新'); fetch() }
const handleDelete = async (row: DictTypeVO) => { await ElMessageBox.confirm('确定删除该类型？', '提示'); await DictTypeApi.remove(row.id!); ElMessage.success('删除成功'); fetch() }

onMounted(() => { fetch() })
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.actions { display: flex; gap: 10px; }
.pagination { margin-top: 10px; display: flex; justify-content: flex-end; }
</style>