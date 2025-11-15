import request from "@/config/axios";
export const HomeApi = {
    getUserInfo: async (param) => {
        return await request.get({ url: '/sysUser/ ' });
    }
};
//# sourceMappingURL=home.js.map