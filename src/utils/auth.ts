import { TOKEN_KEY, USER_KEY } from '@/constants';
import type { LoginResult } from '@/services/user';

/** 读取 token */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** 写入 token */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** 读取本地缓存的登录用户信息 */
export function getUser(): LoginResult | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LoginResult;
  } catch {
    return null;
  }
}

/** 写入登录用户信息 */
export function setUser(user: LoginResult): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/** 清除登录态（token + 用户信息） */
export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** 是否已登录 */
export function isLoggedIn(): boolean {
  return !!getToken();
}
