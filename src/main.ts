import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'uno.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useCache, CACHE_KEY } from '@/utils/useCache'
import { createI18n } from 'vue-i18n'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import myZhCn from '@/locales/zh-CN'

const messages = (myZhCn as any).default || myZhCn

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'zh-CN',
    fallbackLocale: 'zh-CN',
    messages: { 'zh-CN': messages }
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(ElementPlus, { locale: zhCn })

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.directive('permission', {
  mounted(el, binding) {
    const v = binding.value
    const s = sessionStorage.getItem('user')
    const u = s ? JSON.parse(s) : {}
    const { wsCache } = useCache()
    const perms = u.permissions || u.perms || wsCache.get('perms') || []
    const ok = Array.isArray(v) ? v.some((p: string) => perms.includes(p)) : perms.includes(v)
    if (!ok) el.parentNode && el.parentNode.removeChild(el)
  }
})

app.mount('#app')
