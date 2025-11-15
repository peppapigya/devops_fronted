import request from '@/config/axios';
export const LoginApi = {
    // 登陆
    login: async (data) => {
        return await request.post({ url: '/sysUser/login', data });
    },
    // 获取code
    getCode: async () => {
        return await request.get({ url: '/sysUser/captcha' });
    }
};
//# sourceMappingURL=index.js.map