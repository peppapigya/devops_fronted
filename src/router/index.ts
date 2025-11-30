import { createRouter, createWebHistory } from 'vue-router'
import { getAccessToken } from '@/utils/auth'
import { useCache, CACHE_KEY } from '@/utils/useCache'
import { MenuApi } from '@/api/menu'
import type { RouteRecordRaw } from 'vue-router'

// 自定义 MenuRoute 类型，用于后端返回的菜单数据结构
interface MenuRoute {
  id?: string | number
  name: string
  path: string
  component?: string
  componentName?: string
  icon?: string
  permission?: string
  visible?: boolean
  keepAlive?: boolean
  alwaysShow?: boolean
  children?: MenuRoute[]
}

// 树形数据直接转换为路由配置函数
const treeToRoutes = (treeData: any[]): MenuRoute[] => {
  const result: MenuRoute[] = []

  const traverse = (node: any): MenuRoute | null => {
    if (!node) return null

    const routeItem: MenuRoute = {
      id: node.id,
      name: node.name || node.label,
      path: node.path || '',
      component: node.component,
      componentName: node.component_name,
      icon: node.icon,
      permission: node.permission,
      visible: node.visible !== false,
      keepAlive: node.keep_alive !== false,
      alwaysShow: node.always_show !== false
    }

    // 递归处理子节点
    if (node.children && node.children.length > 0) {
      const validChildren = node.children.map((child: any) => traverse(child)).filter(Boolean) as MenuRoute[]
      if (validChildren.length > 0) {
        routeItem.children = validChildren
      }
    }

    return routeItem
  }

  treeData.forEach(node => {
    const route = traverse(node)
    if (route) {
      result.push(route)
    }
  })
  return result
}

// 组件路径映射
const viewModules = import.meta.glob('/src/views/**/*.vue')

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/forget-passwd',
      name: 'forget',
      component: () => import('@/views/login/forgotpasswd/index.vue'),
    },
    {
      path: '/',
      name: 'template',
      component: () => import('@/views/template/index.vue'),
      redirect: '/home',
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/item',
          name: 'item',
          component: () => import('@/views/layout/item/index.vue')
        },
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/home/index.vue'),
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('@/views/user/index.vue'),
        },
        // AI助手
        {
          path: '/ai',
          name: 'ai',
          component: () => import('@/views/ai/index.vue'),
        },
        // 新增：Linux 主机管理
        {
          path: '/hosts',
          name: 'hosts',
          component: () => import('@/views/hosts/index.vue'),
        },
        // 作业管理
        {
          path: '/jobs/script',
          name: 'script',
          component: () => import('@/views/jobs/script/index.vue'),
        },
        {
          path: '/jobs/plan',
          name: 'plan',
          component: () => import('@/views/jobs/plan/index.vue'),
        },
        {
          path: '/jobs/schedule',
          name: 'schedule',
          component: () => import('@/views/jobs/schedule/index.vue'),
        },
        {
          path: '/jobs/log',
          name: 'log',
          component: () => import('@/views/jobs/log/index.vue'),
        },

        // 个人中心
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/profile/index.vue'),
        },
        // 系统设置
        {
          path: '/settings',
          name: 'settings',
          component: () => import('@/views/settings/index.vue'),
        }
      ]
    }
  ],
})

// 静态路由名称列表
const staticRouteNames = ['home', 'user', 'item', 'hosts', 'ai', 'profile', 'settings', 'script', 'plan', 'schedule', 'log']
const whiteList = ['/login', '/forget-passwd']
const toRoute = (m: MenuRoute): RouteRecordRaw => {
  // 跳过无效的路由配置
  if (!m.name || !m.path) {
    console.warn('跳过无效的路由配置:', m)
    return undefined as any
  }

  // 跳过与静态路由冲突的路由
  if (staticRouteNames.includes(m.name)) {
    console.log(`跳过静态路由冲突的路由: ${m.name}`)
    return undefined as any
  }

  // 跳过与静态路由路径冲突的路由
  const staticPaths = ['/item', '/home', '/user', '/hosts', '/ai']
  if (staticPaths.includes(m.path)) {
    console.log(`跳过静态路径冲突的路由: ${m.path}`)
    return undefined as any
  }

  // 生成路由名称，如果m.name为空则使用路径转换
  const routeName = m.name && m.name.trim() ? m.name : m.path.replace(/^\//, '').replace(/\//g, '-')

  const r: any = {
    path: m.path,
    name: routeName,
    meta: {
      title: m.name,
      icon: m.icon,
      permission: m.permission,
      keepAlive: m.keepAlive
    }
  }

  // 处理组件路径映射
  if (m.component) {
    // 根据后端返回的component字段映射到正确的文件路径
    const componentKey = `/src/views/${m.component}.vue`

    // 直接使用完整路径，不需要额外处理
    console.log('尝试加载组件:', componentKey)
    console.log('viewModules包含的键:', Object.keys(viewModules))
    console.log('viewModules是否包含该组件:', !!viewModules[componentKey])

    if (viewModules[componentKey]) {
      r.component = viewModules[componentKey]
      console.log('成功加载组件:', componentKey)
    } else {
      console.warn('找不到组件文件:', componentKey, '使用默认组件')
      // 尝试直接使用import导入，看是否能找到组件
      try {
        r.component = () => import(`@/views/${m.component}.vue`)
        console.log('直接导入组件成功:', `@/views/${m.component}.vue`)
      } catch (error) {
        console.error('直接导入组件失败:', error)
        // 如果找不到组件，使用默认的布局组件或者显示错误
        r.component = () => import('@/views/template/index.vue')
      }
    }
  } else {
    // 如果没有组件配置，使用默认组件
    r.component = () => import('@/views/template/index.vue')
  }

  // 处理子路由
  if (m.children && m.children.length) {
    r.children = m.children.map(child => toRoute(child)).filter(Boolean)
  }

  return r
}

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root', 'template']

  // 获取所有已添加的路由
  const routes = router.getRoutes()

  // 清理所有非白名单的动态路由
  routes.forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      try {
        router.hasRoute(name) && router.removeRoute(name)
      } catch (error) {
        console.warn('移除路由失败:', name, error)
      }
    }
  })

  // 重置路由加载状态
  isAsyncRouteAdded = false
  console.log('路由已重置，isAsyncRouteAdded设置为false')
}

// 使用全局变量来跟踪路由是否已加载
let isAsyncRouteAdded = false

router.beforeEach(async (to, from, next) => {
  console.log('全局路由守卫:', { from: from.path, to: to.path })

  const token = getAccessToken()

  // 如果没有token且不在白名单，跳转到登录页
  if (!token && !whiteList.includes(to.path)) {
    next({ path: '/login' })
    return
  }

  // 检查是否需要加载动态路由
  // 1. 如果还没加载过
  // 2. 或者当前路径是动态路由（不在静态路由和白名单中）且找不到对应的路由
  const currentRoute = router.getRoutes().find(route => route.path === to.path)
  const isDynamicRoute = token && !whiteList.includes(to.path) && !staticRouteNames.includes(String(to.name || ''))
  const needLoadRoutes = token && (!isAsyncRouteAdded || (isDynamicRoute && !currentRoute))

  if (needLoadRoutes) {
    const { wsCache } = useCache()

    try {
      console.log('开始加载动态路由...')

      // 先从缓存获取路由
      let routes: MenuRoute[] = wsCache.get(CACHE_KEY.ROLE_ROUTERS) || []

      // 如果缓存中没有或为空，请求后端接口
      if (!routes || routes.length === 0) {
        console.log('缓存中没有路由，请求后端接口...')

        // 尝试使用树形接口获取数据
        try {
          const treeRes: any = await MenuApi.getTree()
          if (treeRes.data && treeRes.data.length > 0) {
            console.log('使用树形接口获取菜单数据:', treeRes.data)
            // 直接使用树形数据构建路由，保留父子关系
            routes = treeToRoutes(treeRes.data)
            wsCache.set(CACHE_KEY.ROLE_ROUTERS, routes)
            console.log('路由已缓存（树形结构）')
          }
        } catch (error) {
          console.warn('获取树形数据失败，尝试获取平铺数据:', error)
          // 如果树形接口失败，使用原有平铺接口
          const res: any = await MenuApi.getRoutes()
          routes = res.data || res
        }

        console.log('获取到动态路由:', routes)

        if (routes && routes.length) {
          wsCache.set(CACHE_KEY.ROLE_ROUTERS, routes)
          console.log('路由已缓存')
        }
      } else {
        console.log('使用缓存的路由数据')
      }

      // 添加动态路由
      if (routes && routes.length) {
        const validRoutes = routes.map(toRoute).filter(Boolean)
        validRoutes.forEach(r => {
          console.log('添加动态路由:', r.name, r.path)
          try {
            router.addRoute('template', r)
          } catch (error) {
            console.warn('添加路由失败:', r, error)
          }
        })
        console.log(`动态路由加载完成，共添加 ${validRoutes.length} 个路由`)
      } else {
        console.warn('没有获取到动态路由，可能后端接口返回空数据')
      }
    } catch (error) {
      console.error('加载动态路由失败:', error)
      // 即使加载失败，也允许用户进入基本路由
    }

    // 确保标记为已加载
    isAsyncRouteAdded = true
    console.log('路由加载状态设置为true')

    // 重新检查当前路由是否存在，防止动态路由添加后仍找不到
    const updatedRoute = router.getRoutes().find(route => route.path === to.path)
    if (!updatedRoute && to.path !== '/') {
      console.warn('动态路由添加后仍找不到当前路由:', to.path)
      // 如果找不到，跳转到首页
      next({ path: '/home', replace: true })
      return
    }

    // 确保跳转的目标路由存在

    // 使用next({ ...to, replace: true })来重新触发路由匹配，确保动态路由生效
    next({ ...to, replace: true })
    return
  }

  next()
})

router.afterEach((to) => {
  console.log(`全局路由加载完成: ${to.path}, 名称: ${String(to.name)}`)
})

export default router
