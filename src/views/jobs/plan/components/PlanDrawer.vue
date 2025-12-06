<template>
  <el-drawer
    v-model="visible"
    :title="title"
    size="60%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      v-loading="loading"
    >
      <el-form-item label="计划名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入计划名称" />
      </el-form-item>

      <el-form-item label="全局变量" prop="globalVars">
        <el-input
          v-model="formData.globalVars"
          type="textarea"
          placeholder="请输入全局变量，JSON格式"
          :rows="3"
        />
      </el-form-item>

      <el-form-item label="目标主机" prop="hostIds">
        <el-select
          v-model="formData.hostIds"
          multiple
          filterable
          placeholder="请选择目标主机"
          style="width: 100%"
        >
          <el-option
            v-for="host in hostList"
            :key="host.value"
            :label="host.label"
            :value="host.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>

      <el-divider content-position="left">脚本列表</el-divider>

      <div class="script-list-header">
        <el-button type="primary" size="small" @click="openScriptSelector">添加脚本</el-button>
      </div>

      <el-table :data="formData.scripts" border stripe style="width: 100%; margin-top: 10px">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="scriptName" label="脚本名称" min-width="150">
           <template #default="{ row }">
             {{ getScriptName(row.scriptId) }}
           </template>
        </el-table-column>
        <el-table-column label="排序" width="120">
          <template #default="{ $index }">
            <el-button-group>
              <el-button
                size="small"
                :disabled="$index === 0"
                @click="moveScript($index, -1)"
              >↑</el-button>
              <el-button
                size="small"
                :disabled="$index === formData.scripts!.length - 1"
                @click="moveScript($index, 1)"
              >↓</el-button>
            </el-button-group>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{ $index }">
            <el-button type="danger" link @click="removeScript($index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
      </div>
    </template>

    <!-- Script Selector Dialog -->
    <el-dialog
      v-model="scriptSelectorVisible"
      title="选择脚本"
      width="500px"
      append-to-body
    >
      <el-select
        v-model="selectedScriptId"
        filterable
        placeholder="请选择脚本"
        style="width: 100%"
      >
        <el-option
          v-for="script in scriptList"
          :key="script.id"
          :label="script.name"
          :value="script.id"
        />
      </el-select>
      <template #footer>
        <el-button @click="scriptSelectorVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddScript">确定</el-button>
      </template>
    </el-dialog>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { PlanApi, type JobPlan } from '@/api/jobs/plan'
import { ScriptApi, type JobScript } from '@/api/jobs/script'
import { HostsApi } from '@/api/hosts'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  currentId: {
    type: Number,
    default: undefined
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(false)
const loading = ref(false)
const title = ref('新增计划')
const formRef = ref<FormInstance>()
const hostList = ref<any[]>([])
const scriptList = ref<JobScript[]>([])

const scriptSelectorVisible = ref(false)
const selectedScriptId = ref<number | undefined>(undefined)

const formData = reactive<JobPlan>({
  name: '',
  globalVars: '',
  hostIds: [],
  remark: '',
  scripts: []
})

const rules = {
  name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
  hostIds: [{ required: true, message: '请选择目标主机', trigger: 'change' }]
}

watch(() => props.modelValue, async (val) => {
  visible.value = val
  if (val) {
    await loadData()
    if (props.currentId) {
      title.value = '编辑计划'
      await getDetail()
    } else {
      title.value = '新增计划'
      resetForm()
    }
  }
})

watch(() => visible.value, (val) => {
  emit('update:modelValue', val)
})

const loadData = async () => {
  try {
    const [hostsRes, scriptsRes] = await Promise.all([
      HostsApi.getSelectList(),
      ScriptApi.getAllScripts()
    ])
    hostList.value = hostsRes.map(h => ({
      value: h.id ?? h.value ?? h.hostId,
      label: h.name ?? h.label ?? h.hostName
    }))

    scriptList.value = scriptsRes
  } catch (error) {
    console.error('Failed to load data', error)
  }
}

const resetForm = () => {
  formData.id = undefined
  formData.name = ''
  formData.globalVars = ''
  formData.hostIds = []
  formData.remark = ''
  formData.scripts = []
}

const getDetail = async () => {
  if (!props.currentId) return
  loading.value = true
  try {
    const res = await PlanApi.getPlan(props.currentId)
    Object.assign(formData, res)
    // Ensure scripts is an array
    if (!formData.scripts) formData.scripts = []
    if (formData.hostIds) {
        formData.hostIds = formData.hostIds.map(Number)
    }
    console.log('formData', formData.scripts)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  visible.value = false
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // Update sort order
        formData.scripts?.forEach((s, index) => {
          s.sort = index + 1
        })

        if (formData.id) {
          await PlanApi.updatePlan(formData)
          ElMessage.success('更新成功')
        } else {
          await PlanApi.addPlan(formData)
          ElMessage.success('创建成功')
        }
        emit('success')
        handleClose()
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}

// Script Management
const openScriptSelector = () => {
  selectedScriptId.value = undefined
  scriptSelectorVisible.value = true
}

const confirmAddScript = () => {
  if (!selectedScriptId.value) return

  const script = scriptList.value.find(s => s.id === selectedScriptId.value)
  if (script) {
    formData.scripts?.push({
      scriptId: script.id!,
      sort: (formData.scripts?.length || 0) + 1,
      scriptName: script.name
    })
  }
  scriptSelectorVisible.value = false
}

const removeScript = (index: number) => {
  formData.scripts?.splice(index, 1)
}

const moveScript = (index: number, direction: number) => {
  if (!formData.scripts) return
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= formData.scripts.length) return

  const temp = formData.scripts[index]
  formData.scripts[index] = formData.scripts[newIndex]
  formData.scripts[newIndex] = temp
}

const getScriptName = (id: number) => {
  const script = scriptList.value.find(s => s.id === id)
  return script ? script.name : `Script #${id}`
}
</script>

<style scoped>
.script-list-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}
</style>
