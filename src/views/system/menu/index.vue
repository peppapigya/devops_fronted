<template>
  <div class="menu-management">
    <!-- 搜索条件 -->
    <div class="search-wrapper">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="菜单名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入菜单名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择菜单状态" clearable style="width: 150px">
            <el-option label="正常" :value="0" />
            <el-option label="停用" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch" :icon="Search">搜索</el-button>
          <el-button @click="handleReset" :icon="Refresh">重置</el-button>
          <el-button type="primary" plain @click="handleAdd" :icon="Plus">新增</el-button>
          <el-button type="danger" plain @click="toggleExpandAll" :icon="Sort">展开/折叠</el-button>
          <el-button @click="handleSearch" :icon="RefreshRight">刷新菜单缓存</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <div class="table-wrapper">
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="tableData"
        row-key="id"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        header-row-class-name="table-header"
        class="custom-table"
      >
        <el-table-column prop="name" label="菜单名称" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="menu-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" width="80" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.icon" class="menu-icon">
              <component :is="getIconComponent(row.icon)" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column prop="permission" label="权限标识" min-width="150" show-overflow-tooltip />
        <el-table-column prop="path" label="组件路径" min-width="180" show-overflow-tooltip />
        <el-table-column prop="component" label="组件名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="0"
              :inactive-value="1"
              @change="handleStatusChange(row)"
              style="--el-switch-on-color: #409eff;"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <div class="operation-links">
              <el-link type="primary" :underline="false" @click="handleEdit(row)">修改</el-link>
              <el-link type="primary" :underline="false" @click="handleAddChild(row)">新增</el-link>
              <el-link type="danger" :underline="false" @click="handleDelete(row)">删除</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增/编辑对话框 -->
    <MenuFormDialog
      v-model:visible="dialogVisible"
      :menu-data="currentMenu"
      :parent-id="currentParentId"
      :is-edit="isEdit"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Sort, RefreshRight } from '@element-plus/icons-vue'
import { MenuApi, MenuListVO, MenuQueryDTO } from '@/api/menu'
import MenuFormDialog from '@/components/MenuFormDialog.vue'

// 响应式数据
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentMenu = ref<MenuListVO | null>(null)
const currentParentId = ref<number | null>(null)
const isExpandAll = ref(true)
const refreshTable = ref(true)

const searchForm = reactive<MenuQueryDTO>({
  name: '',
  type: undefined,
  status: undefined,
  page: 1,
  pageSize: 10
})

const tableData = ref<MenuListVO[]>([])

// 获取图标组件
const getIconComponent = (iconName: string) => {
  if (!iconName) return 'View'

  // 图标映射表
  const iconMap: Record<string, string> = {
    'Menu': 'Menu',
    'menu': 'Menu',
    'home': 'House',
    'system': 'Setting',
    'User': 'User',
    'user': 'User',
    'Edit': 'Edit',
    'List': 'List',
    'Monitor': 'Monitor',
    'Setting': 'Setting',
    'View': 'View',
    'Search': 'Search',
    'Refresh': 'Refresh'
  }

  return iconMap[iconName] || 'View'
}

// 搜索
const handleSearch = async () => {
  await loadMenuList()
}

// 重置搜索条件
const handleReset = () => {
  searchForm.name = ''
  searchForm.type = undefined
  searchForm.status = undefined
  handleSearch()
}

// 展开/折叠
const toggleExpandAll = () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

// 新增菜单
const handleAdd = () => {
  isEdit.value = false
  currentMenu.value = null
  currentParentId.value = null
  dialogVisible.value = true
}

// 添加子菜单
const handleAddChild = (row: MenuListVO) => {
  isEdit.value = false
  // 新增子菜单时不复制父节点数据，只设置父级 ID
  currentMenu.value = null
  currentParentId.value = row.id
  dialogVisible.value = true
}

// 编辑菜单
const handleEdit = (row: MenuListVO) => {
  isEdit.value = true
  // 复制当前行数据用于编辑
  currentMenu.value = { ...row }
  // 设置父级 ID，编辑时保留原有父级关系
  currentParentId.value = row.parentId ?? null
  dialogVisible.value = true
}

// 删除菜单
const handleDelete = async (row: MenuListVO) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除菜单"${row.name}"吗？删除后无法恢复！`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await MenuApi.delete(row.id)
    ElMessage.success('删除成功')
    await loadMenuList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 状态变更
const handleStatusChange = async (row: MenuListVO) => {
  if (import.meta.env.PROD) {
    try {
      const updateData = {
        ...row,
        status: row.status
      }
      await MenuApi.update(row.id, updateData as any)
      ElMessage.success('状态更新成功')
    } catch (error) {
      // 恢复原状态
      row.status = row.status === 0 ? 1 : 0
      ElMessage.error('状态更新失败')
    }
  }
}

// 对话框成功回调
const handleDialogSuccess = () => {
  dialogVisible.value = false
  loadMenuList()
}

const loadMenuList = async () => {
  try {
    loading.value = true

    // 优先尝试直接获取树形接口
    try {
      const treeResponse = await MenuApi.getTree()
      if (treeResponse.code === 200 && treeResponse.data.length > 0) {
        // 转换为标准格式
        tableData.value = treeResponse.data as unknown as MenuListVO[]
        loading.value = false
        return
      }
    } catch (treeError) {
      console.warn('获取树形数据失败，尝试使用列表接口:', treeError)
    }

    // 如果树形接口失败，使用分页接口获取完整数据，但不分页
    const queryParams = {
      ...searchForm,
      page: 1,
      page_size: 1000 // 获取大量数据以构建完整树形
    }

    const response = await MenuApi.getList(queryParams)
    if (response.code === 200) {
      // 将平面数据转换为树形结构
      tableData.value = buildTreeFromList(response.data.list)
    }
  } catch (error) {
    console.error('加载菜单列表失败:', error)
    ElMessage.error('加载菜单列表失败')
  } finally {
    loading.value = false
  }
}

// 将平面列表数据转换为树形结构
const buildTreeFromList = (list: MenuListVO[]): MenuListVO[] => {
  const tree: MenuListVO[] = []
  const map = new Map<number, MenuListVO>()

  // 先把所有节点放到map中，初始化children数组
  list.forEach(item => {
    map.set(item.id, {
      ...item,
      children: item.children || [],
      // 确保所有必要字段都存在
      name: item.name,
      parentId: item.parentId,
      id: item.id
    })
  })

  // 构建树形结构
  list.forEach(item => {
    const node = map.get(item.id)!
    if (item.parentId === 0 || !item.parentId) {
      // 根节点或无父节点的节点
      tree.push(node)
    } else {
      // 子节点
      const parent = map.get(item.parentId)
      if (parent) {
        // 确保父节点的children数组存在
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(node)
      } else {
        // 如果父节点不存在，也作为根节点处理
        tree.push(node)
      }
    }
  })

  // 按sort字段排序
  const sortTree = (nodes: MenuListVO[]) => {
    nodes.sort((a, b) => (a.sort || 0) - (b.sort || 0))
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        sortTree(node.children)
      }
    })
  }

  sortTree(tree)
  return tree
}

// 页面加载时执行
onMounted(() => {
  loadMenuList()
})
</script>

<style scoped>
.menu-management {
  padding: 20px;
  background-color: #f0f2f5;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.search-wrapper {
  background: #fff;
  padding: 18px 18px 0;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.table-wrapper {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.custom-table {
  width: 100%;
}

:deep(.table-header th) {
  background-color: #f8f8f9 !important;
  color: #515a6e;
  font-weight: 600;
  height: 40px;
}

.menu-name {
  font-weight: 500;
  color: #606266;
}

.menu-icon {
  font-size: 16px;
  color: #606266;
  vertical-align: middle;
}

.operation-links {
  display: flex;
  justify-content: center;
  gap: 12px;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa !important;
}

:deep(.el-table__expand-icon) {
  color: #606266;
}
</style>
