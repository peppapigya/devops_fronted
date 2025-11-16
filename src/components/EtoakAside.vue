<template>
  <div>
    <h3 class="logo">
      <span class="title"><el-icon><Guide /></el-icon>Devops系统</span>
      <el-divider style="margin: 10px 0px"/>
    </h3>

    <!-- 添加导航菜单 -->
    <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical"
        @select="handleSelect">
      <template v-if="treeMenus && treeMenus.length">
        <template v-for="m in treeMenus" :key="m.path">
          <el-sub-menu v-if="m.children && m.children.length" :index="m.path">
            <template #title>
              <el-icon v-if="m.icon"><component :is="getIconComponent(m.icon)" /></el-icon>
              <span>{{ m.name }}</span>
            </template>
            <el-menu-item v-for="c in m.children" :key="c.path" :index="c.path">
              <el-icon v-if="c.icon"><component :is="getIconComponent(c.icon)" /></el-icon>
              <span>{{ c.name }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="m.path">
            <el-icon v-if="m.icon"><component :is="getIconComponent(m.icon)" /></el-icon>
            <span>{{ m.name }}</span>
          </el-menu-item>
        </template>
      </template>
      <template v-else>
        <el-menu-item index="/home">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Guide, House, User, Setting, Document } from "@element-plus/icons-vue";
import { useCache, CACHE_KEY } from '@/utils/useCache'
import { MenuApi } from '@/api/menu'

const router = useRouter()
const route = useRoute()
const activeIndex = ref(route.path)
const menus = ref<any[]>([])

// 图标组件映射
const getIconComponent = (iconName: string) => {
  // 创建一个映射来转换图标名称
  const iconMap: { [key: string]: string } = {
    'home': 'House',
    'user': 'User', 
    'setting': 'Setting',
    'document': 'Document',
    'system': 'Monitor',
    'menu': 'Menu',
    'deploy': 'UploadFilled',
    'monitor': 'Monitor',
    'tools': 'Tools',
    'database': 'Database',
    'folder': 'Folder',
    'file': 'Document',
    'bell': 'Bell',
    'CollectionTag': 'CollectionTag',
    'Collection': 'Collection',
    'Avatar': 'Avatar',
    'List': 'List',
    'MagicStick': 'MagicStick'
  }
  return iconMap[iconName] || 'Menu'
}

// 转换树形数据格式，从后端getTree接口返回的数据
const transformTreeData = (treeData: any[]): any[] => {
  if (!treeData || treeData.length === 0) return []
  
  const transformNode = (node: any) => {
    // 现在后端返回的数据包含所有必要字段，直接使用
    return {
      name: node.name || node.label || '',
      label: node.label || node.name || '',
      path: node.path || `/menu-${node.id}`,
      icon: node.icon || '',
      id: node.id,
      parent_id: node.parent_id,
      children: node.children ? node.children.map(transformNode) : []
    }
  }
  
  return treeData.map(transformNode)
}

// 计算属性：树形菜单数据
const treeMenus = computed(() => {
  return transformTreeData(menus.value)
})

// 加载菜单数据
const loadMenus = async () => {
  try {
    // 优先尝试获取树形数据
    const treeResponse = await MenuApi.getTree()
    if (treeResponse.data && treeResponse.data.length > 0) {
      console.log('使用树形数据接口获取菜单', treeResponse.data)
      menus.value = treeResponse.data
      return
    }
  } catch (error) {
    console.warn('获取树形数据失败，尝试其他方式:', error)
  }
  
  // 优先从缓存获取平铺数据
  const { wsCache } = useCache()
  const cachedRoutes = wsCache.get(CACHE_KEY.ROLE_ROUTERS) || []
  
  if (cachedRoutes.length > 0) {
    console.log('使用缓存的路由数据')
    // 将平铺数据转换为树形结构
    menus.value = convertFlatToTree(cachedRoutes)
  } else {
    console.log('缓存中没有菜单数据，使用默认树形菜单')
    // 使用默认树形菜单作为后备
    menus.value = [
      {
        id: 1,
        name: '首页',
        label: '首页',
        path: '/home',
        icon: 'House',
        parent_id: 0,
        children: []
      },
      {
        id: 2,
        name: '系统管理',
        label: '系统管理',
        path: '/system',
        icon: 'Setting',
        parent_id: 0,
        children: [
          {
            id: 3,
            name: '用户管理',
            label: '用户管理',
            path: '/user',
            icon: 'User',
            parent_id: 2,
            children: []
          },
          {
            id: 4,
            name: '角色管理',
            label: '角色管理',
            path: '/role',
            icon: 'User',
            parent_id: 2,
            children: []
          },
          {
            id: 5,
            name: '菜单管理',
            label: '菜单管理',
            path: '/menu',
            icon: 'Menu',
            parent_id: 2,
            children: []
          }
        ]
      }
    ]
  }
}

// 将平铺数据转换为树形结构
const convertFlatToTree = (flatData: any[]): any[] => {
  if (!flatData || flatData.length === 0) return []
  
  const tree: any[] = []
  const nodeMap = new Map<number, any>()
  
  // 创建节点映射
  flatData.forEach(item => {
    nodeMap.set(item.id, {
      ...item,
      children: []
    })
  })
  
  // 构建树形结构
  flatData.forEach(item => {
    const node = nodeMap.get(item.id)
    if (item.parent_id && item.parent_id > 0) {
      const parent = nodeMap.get(item.parent_id)
      if (parent) {
        parent.children.push(node)
      }
    } else {
      tree.push(node)
    }
  })
  
  return tree
}

// 监听路由变化，更新激活的菜单项
watch(
    () => route.path,
    (newPath) => {
      activeIndex.value = newPath
    }
)

// 处理菜单选择
const handleSelect = (key: string) => {
  router.push(key)
}

onMounted(() => {
  loadMenus()
})
</script>

<style scoped>
.en{
  font-weight: 400;
  font-size: 16px;
  color: #585656;
}
.logo .title{
  font-size: 25px;
  color: #213547;
}
.logo {
  width: 200px;
}

/* 菜单项样式 */
:deep(.el-menu-item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-sub-menu__title) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-icon) {
  margin-right: 0;
}
</style>
