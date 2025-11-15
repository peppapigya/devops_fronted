import { service } from './service';
import { config } from './config';
const { default_headers } = config;
const request = (option) => {
    const { headersType, headers, ...otherOption } = option;
    return service({
        ...otherOption,
        headers: {
            'Content-Type': headersType || default_headers,
            ...headers
        }
    });
};
export default {
    get: async (option) => {
        const res = await request({ method: 'GET', ...option });
        return res.data;
    },
    post: async (option) => {
        const res = await request({ method: 'POST', ...option });
        return res.data;
    },
    postOriginal: async (option) => {
        const res = await request({ method: 'POST', ...option });
        return res;
    },
    delete: async (option) => {
        const res = await request({ method: 'DELETE', ...option });
        return res.data;
    },
    put: async (option) => {
        const res = await request({ method: 'PUT', ...option });
        return res.data;
    },
    download: async (option) => {
        const res = await request({ method: 'GET', responseType: 'blob', ...option });
        return res;
    },
    upload: async (option) => {
        option.headersType = 'multipart/form-data';
        const res = await request({ method: 'POST', ...option });
        return res;
    }
};
//# sourceMappingURL=index.js.map