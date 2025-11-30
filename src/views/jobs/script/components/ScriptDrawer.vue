<template>
  <el-drawer
    v-model="visible"
    :title="title"
    size="50%"
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
      <el-form-item label="脚本名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入脚本名称" />
      </el-form-item>

      <el-form-item label="脚本类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择脚本类型" @change="handleTypeChange">
          <el-option label="Shell" value="shell" />
          <el-option label="Bat" value="bat" />
          <el-option label="Perl" value="perl" />
          <el-option label="Python" value="python" />
          <el-option label="PowerShell" value="powershell" />
          <el-option label="SQL" value="sql" />
        </el-select>
      </el-form-item>

      <el-form-item label="脚本分类" prop="category">
        <el-input v-model="formData.category" placeholder="请输入脚本分类" />
      </el-form-item>

      <el-form-item label="脚本内容" prop="content">
        <ScriptEditor
          v-model="formData.content"
          :language="formData.type"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="默认参数" prop="parameters">
        <el-input v-model="formData.parameters" placeholder="请输入默认参数" />
      </el-form-item>

      <el-form-item label="超时时间" prop="timeout">
        <el-input-number v-model="formData.timeout" :min="1" :max="86400" />
        <span class="ml-2">秒</span>
      </el-form-item>

      <el-form-item label="工作目录" prop="work_dir">
        <el-input v-model="formData.workDir" placeholder="请输入工作目录" />
      </el-form-item>

      <el-form-item label="环境变量" prop="env">
        <el-input v-model="formData.env" type="textarea" placeholder="请输入环境变量，JSON格式" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { ScriptApi, type JobScript } from '@/api/jobs/script'
import ScriptEditor from './ScriptEditor.vue'

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
const title = ref('新增脚本')
const formRef = ref<FormInstance>()

const formData = reactive<JobScript>({
  name: '',
  type: 'shell',
  category: '',
  content: '',
  parameters: '',
  timeout: 60,
  workDir: '',
  env: ''
})

const rules = {
  name: [{ required: true, message: '请输入脚本名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择脚本类型', trigger: 'change' }],
  content: [{ required: true, message: '请输入脚本内容', trigger: 'blur' }]
}

const scriptExamples: Record<string, string> = {
  shell: `#!/bin/bash\necho "Hello World"`,
  bat: `@echo off\necho Hello World`,
  perl: `#!/usr/bin/perl\nprint "Hello World\\n";`,
  python: `#!/usr/bin/env python3\nprint("Hello World")`,
  powershell: `Write-Host "Hello World"`,
  sql: `SELECT 'Hello World';`
}

watch(() => props.modelValue, async (val) => {
  visible.value = val
  if (val) {
    if (props.currentId) {
      title.value = '编辑脚本'
      await getDetail()
    } else {
      title.value = '新增脚本'
      resetForm()
      formData.content = scriptExamples.shell
    }
  }
})

watch(() => visible.value, (val) => {
  emit('update:modelValue', val)
})

const handleTypeChange = (val: string) => {
  if (!props.currentId && scriptExamples[val]) {
    formData.content = scriptExamples[val]
  }
}

const resetForm = () => {
  formData.id = undefined
  formData.name = ''
  formData.type = 'shell'
  formData.category = ''
  formData.content = ''
  formData.parameters = ''
  formData.timeout = 60
  formData.workDir = ''
  formData.env = ''
}

const getDetail = async () => {
  if (!props.currentId) return
  loading.value = true
  try {
    const res = await ScriptApi.getScript(props.currentId)
    Object.assign(formData, res)
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
        if (formData.id) {
          await ScriptApi.updateScript(formData)
          ElMessage.success('更新成功')
        } else {
          await ScriptApi.addScript(formData)
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
</script>

<style scoped>
.ml-2 {
  margin-left: 8px;
}
</style>
