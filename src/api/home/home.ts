import request from "@/config/axios";


export const HomeApi = {
    getUserInfo : async (param: any) =>{
        return await request.get({url: '/sysUser/ '})
    }
}
