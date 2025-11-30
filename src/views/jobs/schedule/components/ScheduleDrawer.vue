<template>
  <el-drawer
    v-model="visible"
    :title="title"
    size="40%"
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
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入任务名称" />
      </el-form-item>

      <el-form-item label="执行计划" prop="plan_id">
        <el-select
          v-model="formData.planId"
          filterable
          placeholder="请选择执行计划"
          style="width: 100%"
        >
          <el-option
            v-for="plan in planList"
            :key="plan.id"
            :label="plan.name"
            :value="plan.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Cron表达式" prop="strategy">
        <el-input v-model="formData.strategy" placeholder="例如: 0 0 * * * (每天零点执行)" />
        <div class="form-tip">
          <a href="https://cron.qqe2.com/" target="_blank" class="link">在线生成Cron表达式</a>
        </div>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="formData.status"
          :active-value="1"
          :inactive-value="0"
          active-text="启用"
          inactive-text="禁用"
        />
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
import { ScheduleApi, type JobScheduledTask } from '@/api/jobs/schedule'
import { PlanApi, type JobPlan } from '@/api/jobs/plan'

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
const title = ref('新增定时任务')
const formRef = ref<FormInstance>()
const planList = ref<JobPlan[]>([])

const formData = reactive<JobScheduledTask>({
  name: '',
  planId: undefined as any,
  strategy: '',
  status: 1
})

const rules = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  plan_id: [{ required: true, message: '请选择执行计划', trigger: 'change' }],
  strategy: [{ required: true, message: '请输入Cron表达式', trigger: 'blur' }]
}

watch(() => props.modelValue, async (val) => {
  visible.value = val
  if (val) {
    await loadPlans()
    if (props.currentId) {
      title.value = '编辑定时任务'
      await getDetail()
    } else {
      title.value = '新增定时任务'
      resetForm()
    }
  }
})

watch(() => visible.value, (val) => {
  emit('update:modelValue', val)
})

const loadPlans = async () => {
  try {
    const res = await PlanApi.getAllPlans()
    planList.value = res
  } catch (error) {
    console.error('Failed to load plans', error)
  }
}

const resetForm = () => {
  formData.id = undefined
  formData.name = ''
  formData.planId = undefined as any
  formData.strategy = ''
  formData.status = 1
}

const getDetail = async () => {
  if (!props.currentId) return
  loading.value = true
  try {
    const res = await ScheduleApi.getSchedule(props.currentId)
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
          await ScheduleApi.updateSchedule(formData)
          ElMessage.success('更新成功')
        } else {
          await ScheduleApi.addSchedule(formData)
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
.form-tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-top: 4px;
}
.link {
  color: #409eff;
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}
</style>
