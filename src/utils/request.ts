import axios from 'axios';
import { message } from 'antd';
import { history } from '@umijs/max';
import {
  API_BASE,
  AUTH_HEADER,
  AUTH_PREFIX,
  LOGIN_PATH,
  SUCCESS_CODE,
} from '@/constants';
import { clearAuth, getToken } from '@/utils/auth';

/** 后端统一响应包装（StandardResponse） */
export interface StandardResponse<T> {
  returnCode: string;
  errorMsg: string | null;
  body: T;
}

const instance = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// 请求拦截：注入鉴权头
instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers[AUTH_HEADER] = `${AUTH_PREFIX}${token}`;
  }
  return config;
});

// 响应拦截：解包 body，统一错误提示
instance.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (response): any => {
    const res = response.data as StandardResponse<unknown>;
    if (res.returnCode !== SUCCESS_CODE) {
      const msg = res.errorMsg || '请求失败';
      message.error(msg);
      return Promise.reject(new Error(msg));
    }
    // 成功：直接返回业务数据 body，调用方无需再解包
    return res.body;
  },
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearAuth();
      message.error('登录已过期，请重新登录');
      if (history.location.pathname !== LOGIN_PATH) {
        history.push(LOGIN_PATH);
      }
    } else if (error?.response) {
      message.error(error.response.data?.errorMsg || `请求失败(${status})`);
    } else {
      message.error(error?.message || '网络异常，请稍后重试');
    }
    return Promise.reject(error);
  },
);

/** GET 请求，返回解包后的 body */
export function get<T>(url: string, params?: Record<string, any>): Promise<T> {
  return instance.get(url, { params }) as Promise<T>;
}

/** POST 请求，返回解包后的 body */
export function post<T>(url: string, data?: unknown): Promise<T> {
  return instance.post(url, data) as Promise<T>;
}

/** PUT 请求，返回解包后的 body */
export function put<T>(url: string, data?: unknown): Promise<T> {
  return instance.put(url, data) as Promise<T>;
}

/** DELETE 请求，返回解包后的 body */
export function del<T>(url: string): Promise<T> {
  return instance.delete(url) as Promise<T>;
}

export default instance;
