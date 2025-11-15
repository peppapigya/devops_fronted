import request from '@/config/axios';
export const UserApi = {
    // // 获取用户列表
    getUserPage: async (data) => {
        return await request.post({ url: '/sysUser/page', data });
    },
    // // 获取用户详情
    getUserDetailById: async (id) => {
        return await request.get({ url: '/sysUser/' + id });
    },
    // // 创建用户
    createUser: async (data) => {
        return await request.post({ url: '/sysUser/', data });
    },
    // // 更新用户
    updateUserInfo: async (data) => {
        return await request.put({ url: '/sysUser/', data });
    },
    // 批量删除用户
    deleteUserById: async (ids) => {
        return await request.delete({ url: '/sysUser/', ids });
    },
    // // 更新用户状态
    updateUserStatus: async (status) => {
        return await request.put({ url: '/sysUser/status/?status=' + status });
    }
};
//# sourceMappingURL=index.js.map