import type {AssistProjectVO, PageParams} from "@/api/item/types.ts";
import request from '@/config/axios'


export const AssistProjectApi = {
    // 获取分页
    getPageList: async (params: PageParams) => {
        return await request.get({url: '/assistProject/list', params: params});
    },
    // 增加项目
    addAssistProject: async (data: AssistProjectVO) => {
        return await request.post({url: '/assistProject/', data});
    },
    // 修改
    updateAssistProject: async (data: AssistProjectVO) => {
        return await request.put({url: '/assistProject/', data});
    },
    // 根据id获取项目
    getAssistProjectDetail: async (id: number) => {
        return await request.get({url: '/assistProject/?id=' + id});
    },
    // 删除项目
    deleteAssistProject: async (id: number) => {
        return await request.delete({url: '/assistProject/' + id});
    }

}