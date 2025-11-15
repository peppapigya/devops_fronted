import { useCache, CACHE_KEY } from '@/utils/useCache';
// import { TokenType } from '@/api/login/type.ts'
import { decrypt, encrypt } from '@/utils/jsencrypt.ts';
const { wsCache } = useCache();
const AccessTokenKey = 'ACCESS_TOKEN';
const RefreshTokenKey = 'REFRESH_TOKEN';
// 获取token
export const getAccessToken = () => {
    // 此处与TokenKey相同，此写法解决初始化时Cookies中不存在TokenKey报错
    const accessToken = wsCache.get(AccessTokenKey);
    return accessToken ? accessToken : wsCache.get('ACCESS_TOKEN');
};
// 刷新token
export const getRefreshToken = () => {
    return wsCache.get(RefreshTokenKey);
};
// 设置token
export const setToken = (token) => {
    wsCache.set(RefreshTokenKey, token.refreshToken);
    wsCache.set(AccessTokenKey, token.accessToken);
};
// 删除token
export const removeToken = () => {
    wsCache.delete(AccessTokenKey);
    wsCache.delete(RefreshTokenKey);
};
/** 格式化token（jwt格式） */
export const formatToken = (token) => {
    return 'Bearer ' + token;
};
export const getLoginForm = () => {
    const loginForm = wsCache.get(CACHE_KEY.LoginForm);
    if (loginForm) {
        loginForm.password = decrypt(loginForm.password);
    }
    return loginForm;
};
export const setLoginForm = (loginForm) => {
    loginForm.password = encrypt(loginForm.password);
    wsCache.set(CACHE_KEY.LoginForm, loginForm, { exp: 30 * 24 * 60 * 60 });
};
export const removeLoginForm = () => {
    wsCache.delete(CACHE_KEY.LoginForm);
};
// ========== 租户相关 ==========
export const getTenantId = () => {
    return wsCache.get(CACHE_KEY.TenantId);
};
export const setTenantId = (username) => {
    wsCache.set(CACHE_KEY.TenantId, username);
};
//# sourceMappingURL=auth.js.map