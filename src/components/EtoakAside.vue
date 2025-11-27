<template>
  <div class="aside-wrapper">
    <div class="logo-container">
      <img src="https://element-plus.org/images/element-plus-logo.svg" alt="logo" class="logo-img" />
      <span class="logo-text">DevOps Platform</span>
    </div>

    <!-- 添加导航菜单 -->
    <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical"
        :collapse="isCollapse"
        unique-opened
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
import { Guide, House, User, Setting, Document, Monitor, Menu, UploadFilled, Tools, Database, Folder, Bell, CollectionTag, Collection, Avatar, List, MagicStick } from "@element-plus/icons-vue";
import { useCache, CACHE_KEY } from '@/utils/useCache'
import { MenuApi } from '@/api/menu'

const router = useRouter()
const route = useRoute()
const activeIndex = ref(route.path)
const menus = ref<any[]>([])
const isCollapse = ref(false) // Can be controlled via props/event bus if needed

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
    // 将平铺数据转换为树形结构
    menus.value = convertFlatToTree(cachedRoutes)
  } else {
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
      },
      {
        id: 6,
        name: 'AI助手',
        label: 'AI助手',
        path: '/ai',
        icon: 'MagicStick',
        parent_id: 0,
        children: []
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

// 处理菜单选择事件
  const handleSelect = (key: string) => {
    console.log('菜单选择:', key);
    // 对于所有路由切换，使用replace而不是push，避免路由堆积
    // 特别为用户管理和主机管理路由添加时间戳参数，确保组件重新渲染
    if (key === '/user' || key === '/hosts') {
      router.replace({
        path: key,
        query: { t: Date.now().toString() }
      });
    } else {
      // 其他路由正常跳转
      router.push(key);
    }
  }

onMounted(() => {
  loadMenus()
})
</script>

<style scoped>
.aside-wrapper {
  height: 100%;
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
}

.logo-img {
  width: 24px;
  height: 24px;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}

.el-menu-vertical {
  border-right: none;
  flex: 1;
  overflow-y: auto;
}

/* 菜单项样式 */
:deep(.el-menu-item), :deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
}

:deep(.el-menu-item.is-active) {
  background-color: #e6f7ff;
  color: #1890ff;
  border-right: 3px solid #1890ff;
}

:deep(.el-menu-item:hover), :deep(.el-sub-menu__title:hover) {
  color: #1890ff;
  background-color: #f0f2f5;
}
</style>
