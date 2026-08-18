import { create } from 'zustand';
import { history } from '@umijs/max';
import {
  clearAuth,
  getToken,
  getUser as getStoredUser,
  setToken,
  setUser as setStoredUser,
} from '@/utils/auth';
import {
  getPublicKey,
  login as loginService,
  type LoginParams,
  type LoginResult,
} from '@/services/user';
import { rsaEncryptPassword } from '@/utils/rsa';
import { LOGIN_PATH } from '@/constants';

/**
 * 全局用户状态（Zustand，替代 Umi plugin-model 的 useModel('user')）
 * - 初始化时从 localStorage 恢复登录态，避免刷新丢失
 * - 组件内用 selector 订阅：const currentUser = useUserStore((s) => s.currentUser)
 */
export const useUserStore = create<{
  currentUser: LoginResult | null;
  login: (params: LoginParams) => Promise<LoginResult>;
  logout: () => void;
  refresh: () => void;
}>((set) => ({
  currentUser: getStoredUser(),

  /** 登录：取公钥 -> RSA 加密密码 -> 调接口 -> 持久化登录态 */
  login: async (params: LoginParams): Promise<LoginResult> => {
    const publicKey = await getPublicKey();
    const encrypted = rsaEncryptPassword(params.password, publicKey);
    const result = await loginService({ ...params, password: encrypted });
    setToken(result.token);
    setStoredUser(result);
    set({ currentUser: result });
    return result;
  },

  /** 退出登录：清除本地登录态并跳转登录页 */
  logout: (): void => {
    clearAuth();
    set({ currentUser: null });
    history.push(LOGIN_PATH);
  },

  /** 刷新当前用户：以本地缓存兜底（后端无单独 current-user 接口） */
  refresh: (): void => {
    const stored = getStoredUser();
    if (!stored || !getToken()) {
      set({ currentUser: null });
      return;
    }
    set({ currentUser: stored });
  },
}));
