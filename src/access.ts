import type { LoginResult } from '@/services/user';

/** app.tsx getInitialState 返回的全局初始状态 */
export type InitialState = {
  currentUser?: LoginResult | null;
};

/**
 * 权限定义（plugin-access）
 * 返回值即路由 access 字段与 <Access accessible> 的判定依据
 */
export default function access(initialState: InitialState) {
  const { currentUser } = initialState;

  return {
    /** 登录门禁：已登录才可访问受保护路由 */
    isLogin: !!currentUser,
    /** RBAC 插槽：后端返回 role 后自动生效（如 'admin'） */
    canAdmin: currentUser?.role === 'admin',
  };
}
