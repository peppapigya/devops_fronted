import request from '@/config/axios'
import type {UserLoginVO} from "@/api/login/type.ts";


export const LoginApi = {
    // 登陆
    login: async (data: UserLoginVO) => {
        return await request.post({url: '/sysUser/login', data});
    },
    // 获取code
    getCode: async () => {
        return await request.get({url: '/code/code'});
    }
}