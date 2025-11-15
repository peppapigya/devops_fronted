import request from '@/config/axios';
export const AssistProjectApi = {
    // 获取分页
    getPageList: async (params) => {
        return await request.get({ url: '/assistProject/list', params: params });
    },
    // 增加项目
    addAssistProject: async (data) => {
        return await request.post({ url: '/assistProject/', data });
    },
    // 修改
    updateAssistProject: async (data) => {
        return await request.put({ url: '/assistProject/', data });
    },
    // 根据id获取项目
    getAssistProjectDetail: async (id) => {
        return await request.get({ url: '/assistProject/?id=' + id });
    },
    // 删除项目
    deleteAssistProject: async (id) => {
        return await request.delete({ url: '/assistProject/' + id });
    }
};
//# sourceMappingURL=index.js.map