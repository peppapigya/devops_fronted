import { createRouter, createWebHistory } from 'vue-router';
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
                // 新增：Linux 主机管理
                {
                    path: '/hosts',
                    name: 'hosts',
                    component: () => import('@/views/hosts/index.vue'),
                }
            ]
        },
        {
            path: '/ai',
            name: 'ai',
            component: () => import('@/views/ai/index.vue'),
        }
    ],
});
export const resetRouter = () => {
    const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root'];
    router.getRoutes().forEach((route) => {
        const { name } = route;
        if (name && !resetWhiteNameList.includes(name)) {
            router.hasRoute(name) && router.removeRoute(name);
        }
    });
};
export default router;
//# sourceMappingURL=index.js.map