/** 后端统一响应的成功码（StandardResponse.returnCode） */
export const SUCCESS_CODE = 'SUC0000';

/** token 在 localStorage 的存储 key */
export const TOKEN_KEY = 'henry_front_token';

/** 登录用户信息在 localStorage 的存储 key */
export const USER_KEY = 'henry_front_user';

/** 鉴权请求头名称（后端若为自定义头，改这里即可） */
export const AUTH_HEADER = 'Authorization';

/** 鉴权请求头前缀 */
export const AUTH_PREFIX = 'Bearer ';

/** 登录页路径 */
export const LOGIN_PATH = '/login';

/** 免登录白名单（这些路径无需 token） */
export const WHITE_LIST: string[] = [LOGIN_PATH];

/**
 * 后端 API 基础地址：
 * - 开发环境为空串，走 config/config.ts 里的 dev proxy（/user -> localhost:8080）
 * - 生产环境构建时通过环境变量覆盖：API_BASE=https://api.example.com npm run build
 */
export const API_BASE: string = process.env.API_BASE || '';
