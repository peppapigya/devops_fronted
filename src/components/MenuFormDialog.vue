<template>
  <el-dialog
    :title="isEdit ? '编辑菜单' : '新增菜单'"
    v-model="visible"
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      class="menu-form"
    >
      <!-- 父级菜单 -->
      <el-form-item label="父级菜单" prop="parentId">
        <el-tree-select
          v-model="formData.parentId"
          :data="menuTreeData"
          :props="{ children: 'children', label: 'name', value: 'id' }"
          check-strictly
          placeholder="请选择父级菜单"
          clearable
          filterable
          style="width: 100%"
          name="parentId"
          id="parentId"
        />
      </el-form-item>

      <!-- 菜单类型 -->
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="formData.type" @change="handleTypeChange" name="type" id="type">
          <el-radio :label="1">目录</el-radio>
          <el-radio :label="2">菜单</el-radio>
          <el-radio :label="3">按钮</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 菜单名称 -->
      <el-form-item label="菜单名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入菜单名称"
          maxlength="50"
          show-word-limit
          id="name"
          name="name"
        />
      </el-form-item>

      <!-- 权限标识 -->
      <el-form-item label="权限标识" prop="permission">
        <el-input
          v-model="formData.permission"
          placeholder="请输入权限标识，如：system:menu:list"
          maxlength="100"
          show-word-limit
          id="permission"
          name="permission"
        />
      </el-form-item>

      <!-- 显示顺序 -->
      <el-form-item label="显示顺序" prop="sort">
        <el-input-number
          v-model="formData.sort"
          :min="0"
          placeholder="请输入显示顺序"
          style="width: 100%"
          id="sort"
          name="sort"
        />
      </el-form-item>

      <!-- 路由地址 -->
      <el-form-item
        label="路由地址"
        prop="path"
        v-if="formData.type !== 3"
      >
        <el-input
          v-model="formData.path"
          placeholder="请输入路由地址，如：/system/menu"
          maxlength="200"
          id="path"
          name="path"
        />
      </el-form-item>

      <!-- 组件路径 -->
      <el-form-item
        label="组件路径"
        prop="component"
        v-if="formData.type === 2"
      >
        <el-input
          v-model="formData.component"
          placeholder="请输入组件路径，如：system/menu/index"
          maxlength="255"
          id="component"
          name="component"
        />
      </el-form-item>

      <!-- 组件名 -->
      <el-form-item
        label="组件名"
        prop="componentName"
        v-if="formData.type === 2"
      >
        <el-input
          v-model="formData.componentName"
          placeholder="请输入组件名"
          maxlength="50"
          show-word-limit
          id="componentName"
          name="componentName"
        />
      </el-form-item>

      <!-- 菜单图标 -->
      <el-form-item
        label="菜单图标"
        prop="icon"
        v-if="formData.type !== 3"
      >
        <div class="icon-selector">
          <el-input
            v-model="formData.icon"
            placeholder="请输入图标名称"
            style="flex: 1"
            id="icon"
            name="icon"
          />
          <el-button @click="showIconPicker = true" style="margin-left: 10px">
            选择图标
          </el-button>
        </div>
      </el-form-item>

      <!-- 是否显示 -->
      <el-form-item label="是否显示" prop="visible">
        <el-switch
          v-model="formData.visible"
          active-text="是"
          inactive-text="否"
          id="visible"
          name="visible"
        />
      </el-form-item>

      <!-- 是否缓存 -->
      <el-form-item label="是否缓存" prop="keepAlive">
        <el-switch
          v-model="formData.keepAlive"
          active-text="是"
          inactive-text="否"
          id="keepAlive"
          name="keepAlive"
        />
      </el-form-item>

      <!-- 始终显示 -->
      <el-form-item label="始终显示" prop="alwaysShow">
        <el-switch
          v-model="formData.alwaysShow"
          active-text="是"
          inactive-text="否"
          id="alwaysShow"
          name="alwaysShow"
        />
      </el-form-item>

      <!-- 菜单状态 (编辑时显示) -->
      <el-form-item label="菜单状态" prop="status" v-if="isEdit">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <!-- 图标选择器 -->
    <el-dialog
      v-model="showIconPicker"
      title="选择图标"
      width="800px"
      append-to-body
    >
      <div class="icon-grid">
        <div
          v-for="icon in iconList"
          :key="icon"
          class="icon-item"
          @click="selectIcon(icon)"
          :class="{ active: formData.icon === icon }"
        >
          <component :is="icon" />
          <span>{{ icon }}</span>
        </div>
      </div>
    </el-dialog>

    <!-- 对话框底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { MenuTreeVO, MenuListVO } from '@/api/menu'
import { MenuApi } from '@/api/menu'

// Props
interface Props {
  visible: boolean
  menuData?: MenuListVO | null
  parentId?: number | null
  isEdit: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  menuData: null,
  parentId: null,
  isEdit: false
})

// Emits
interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const formRef = ref<FormInstance>()
const submitting = ref(false)
const showIconPicker = ref(false)
const menuTreeData = ref<MenuTreeVO[]>([])

// 菜单图标列表
const iconList = [
  'Menu', 'User', 'Setting', 'Monitor', 'List', 'View', 'Edit', 'Delete',
  'Search', 'Refresh', 'Download', 'Upload', 'Bell', 'Message', 'Star',
  'Heart', 'Share', 'Location', 'Phone', 'Email', 'Calendar', 'Clock'
]

// 表单数据
const formData = reactive({
  parentId: 0,
  type: 1,
  name: '',
  permission: '',
  sort: 0,
  path: '',
  icon: '',
  component: '',
  componentName: '',
  visible: true,
  keepAlive: false,
  alwaysShow: false,
  status: 1
})

// 表单验证规则
const formRules: FormRules = {
  parentId: [
    { required: true, message: '请选择父级菜单', trigger: 'change' }
  ],
  type: [
    { required: true, message: '请选择菜单类型', trigger: 'change' }
  ],
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { min: 1, max: 50, message: '菜单名称长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  permission: [
    { required: true, message: '请输入权限标识', trigger: 'blur' },
    { min: 1, max: 100, message: '权限标识长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入显示顺序', trigger: 'blur' },
    { type: 'number', min: 0, message: '显示顺序必须为非负数', trigger: 'blur' }
  ],
  path: [
    {
      validator: (rule, value, callback) => {
        if (formData.type !== 3 && !value) {
          callback(new Error('请输入路由地址'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  component: [
    {
      validator: (rule, value, callback) => {
        if (formData.type === 2 && !value) {
          callback(new Error('请输入组件路径'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  componentName: [
    {
      validator: (rule, value, callback) => {
        if (formData.type === 2 && value && value.length > 50) {
          callback(new Error('组件名长度不能超过50个字符'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 计算属性
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 监听visible变化
watch(() => props.visible, async (newVal) => {
  if (newVal) {
    console.log('=== 监听器触发：visible变为true ===')

    // 重置表单
    resetForm()

    // 加载菜单树
    await loadMenuTree()

    // 如果是编辑模式，加载菜单数据
    if (props.isEdit && props.menuData) {
      await loadMenuData()
    } else if (props.parentId !== null) {
      formData.parentId = props.parentId
      console.log('设置parentId为:', formData.parentId)
    }

    console.log('=== 监听器完成：表单初始化完成 ===')
  }
})

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    parentId: 0,
    type: 1,
    name: '',
    permission: '',
    sort: 0,
    path: '',
    icon: '',
    component: '',
    componentName: '',
    visible: true,
    keepAlive: false,
    alwaysShow: false,
    status: 1
  })
  formRef.value?.clearValidate()
}

// 加载菜单数据到表单
const loadMenuData = () => {
  if (!props.menuData) return

  console.log('=== 加载菜单数据到表单 ===')
  console.log('原始menuData:', props.menuData)

  // 为缺失字段提供默认值，确保数据完整性
  const menuData = {
    id: props.menuData.id,
    parentId: props.menuData.parentId ?? 0,
    type: props.menuData.type ?? 2,  // 默认菜单类型为2（菜单）
    name: props.menuData.name ?? '',
    permission: props.menuData.permission ?? (props.menuData.name ? `${props.menuData.name}:op` : 'default:permission'),
    sort: props.menuData.sort ?? 0,
    path: props.menuData.path || '',
    icon: props.menuData.icon || '',
    component: props.menuData.component || '',
    componentName: props.menuData.componentName || '',
    visible: props.menuData.visible ?? true,
    keepAlive: props.menuData.keepAlive ?? false,
    alwaysShow: props.menuData.alwaysShow ?? false,
    status: props.menuData.status ?? 1
  }

  Object.assign(formData, menuData)

  console.log('修复后的menuData:', menuData)
  console.log('加载后的formData:', formData)
  console.log('各字段类型检查:')
  console.log('  name:', typeof formData.name, formData.name)
  console.log('  permission:', typeof formData.permission, formData.permission)
  console.log('  type:', typeof formData.type, formData.type)
  console.log('  sort:', typeof formData.sort, formData.sort)
  console.log('  parentId:', typeof formData.parentId, formData.parentId)
}

// 加载菜单树
const loadMenuTree = async () => {
  try {
    const response = await MenuApi.getTree()
    if (response.code === 200) {
      menuTreeData.value = response.data
      // 添加"无"选项，表示顶级菜单
      menuTreeData.value.unshift({
        id: 0,
        name: '无',
        label: '无',
        parentId: 0,
        children: []
      })
    }
  } catch (error) {
    console.error('加载菜单树失败:', error)
  }
}

// 处理菜单类型变化
const handleTypeChange = (value: number) => {
  // 当类型改变时，清空相关字段
  if (value === 3) {
    // 按钮类型不需要路由地址、组件路径等
    formData.path = ''
    formData.component = ''
    formData.componentName = ''
    formData.icon = ''
  } else if (value === 1) {
    // 目录类型不需要组件路径、组件名
    formData.component = ''
    formData.componentName = ''
  }
}

// 选择图标
const selectIcon = (icon: string) => {
  formData.icon = icon
  showIconPicker.value = false
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    // 首先确保必填字段有值（在表单验证之前）
    console.log('=== 数据预处理：确保必填字段 ===')
    if (!formData.name || formData.name.trim() === '') {
      formData.name = '未命名菜单'
      console.log('设置name默认值为:', formData.name)
    }
    if (!formData.permission || formData.permission.trim() === '') {
      formData.permission = (formData.name ? `${formData.name}:op` : 'default:permission')
      console.log('设置permission默认值为:', formData.permission)
    }
    if (formData.type === undefined || formData.type === null || formData.type === 0) {
      formData.type = 2
      console.log('设置type默认值为:', formData.type)
    }
    if (formData.sort === undefined || formData.sort === null || formData.sort === 0) {
      formData.sort = 0
      console.log('设置sort默认值为:', formData.sort)
    }

    // 检查表单数据状态
    console.log('=== 表单提交前数据检查 ===')
    console.log('formData当前值:', formData)
    console.log('isEdit模式:', props.isEdit)
    console.log('menuData:', props.menuData)
    console.log('formData.name:', formData.name, '类型:', typeof formData.name)
    console.log('formData.permission:', formData.permission, '类型:', typeof formData.permission)
    console.log('formData.type:', formData.type, '类型:', typeof formData.type)
    console.log('formData.sort:', formData.sort, '类型:', typeof formData.sort)
    console.log('formData.parentId:', formData.parentId, '类型:', typeof formData.parentId)

    // 执行表单验证
    console.log('=== 开始表单验证 ===')
    const validationResult = await formRef.value.validate().catch(error => {
      console.error('表单验证失败:', error)
      throw error
    })
    console.log('表单验证结果:', validationResult)

    submitting.value = true

    // 构造符合后端预期的数据格式（snake_case字段名）
    console.log('=== 开始构造提交数据 ===')
    const submitData: any = {
      id: props.isEdit && props.menuData?.id ? Number(props.menuData.id) : undefined,
      name: formData.name?.toString().trim() || '未命名菜单',
      permission: formData.permission?.toString().trim() || (formData.name ? `${formData.name}:op` : 'default:permission'),
      type: Number(formData.type) || 2,  // 确保必填
      sort: Number(formData.sort) || 0,  // 确保必填
      parentId: formData.parentId === 0 ? 0 : Number(formData.parentId),
      path: formData.type === 3 ? null : (formData.path?.toString().trim() || null),
      icon: formData.icon?.toString().trim() || null,
      component: formData.type === 1 ? null : (formData.component ? formData.component.toString().trim().slice(0, 50) : null),
      componentName: formData.type === 1 ? null : (formData.componentName ? formData.componentName.toString().trim().slice(0, 50) : null),
      visible: Boolean(formData.visible),
      keepAlive: Boolean(formData.keepAlive),
      alwaysShow: Boolean(formData.alwaysShow),
      status: Number(formData.status) || 0
    }

    // 强制确保所有必填字段有值
    console.log('=== 验证必填字段 ===')
    console.log('原始permission:', formData.permission, '-> 最终:', submitData.permission)
    console.log('原始type:', formData.type, '-> 最终:', submitData.type)
    console.log('原始sort:', formData.sort, '-> 最终:', submitData.sort)

    if (!submitData.permission || submitData.permission === '') {
      console.log('Permission为空，使用默认值')
      submitData.permission = submitData.name + ':op'
      console.log('Permission设置后:', submitData.permission)
    }
    if (!submitData.type || submitData.type === 0) {
      console.log('Type为空，使用默认值')
      submitData.type = 2
      console.log('Type设置后:', submitData.type)
    }
    if (submitData.sort === undefined || submitData.sort === null || submitData.sort === '') {
      console.log('Sort为空，使用默认值')
      submitData.sort = 0
      console.log('Sort设置后:', submitData.sort)
    }

    // 添加调试日志
    console.log('=== 最终提交数据 ===')
    console.log('转换后的提交数据:', JSON.stringify(submitData, null, 2))

    if (props.isEdit && props.menuData?.id) {
      await MenuApi.update(props.menuData.id, submitData as any)
      ElMessage.success('更新成功')
    } else {
      await MenuApi.create(submitData as any)
      ElMessage.success('创建成功')
    }

    emit('success')
  } catch (error: any) {
    console.error('=== 提交错误详情 ===')
    console.error('提交错误:', error)
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    submitting.value = false
  }
}

// 页面加载时执行
onMounted(() => {
  if (props.visible) {
    loadMenuTree()
  }
})
</script>

<style scoped>
.menu-form {
  padding-right: 20px;
}

.icon-selector {
  display: flex;
  align-items: center;
}

.checkbox-group {
  display: flex;
  gap: 20px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-item:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.icon-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.icon-item svg {
  width: 24px;
  height: 24px;
  margin-bottom: 8px;
  color: #409eff;
}

.icon-item span {
  font-size: 12px;
  color: #606266;
  text-align: center;
  word-break: break-all;
}
</style>
