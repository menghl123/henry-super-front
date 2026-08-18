import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
// 品牌几何字体（Outfit Variable），随包本地加载，不依赖外网 CDN
import '@fontsource-variable/outfit';
import RightContent from '@/components/RightContent';
import { getToken } from '@/utils/auth';
import { LOGIN_PATH, WHITE_LIST } from '@/constants';
import { useUserStore } from '@/stores/user';
import type { InitialState } from '@/access';

/**
 * 应用启动初始化：从 Zustand 用户 store 恢复登录态
 * （store 创建时已从 localStorage 恢复；后端暂无独立的 current-user 接口）
 */
export async function getInitialState(): Promise<InitialState> {
  return { currentUser: useUserStore.getState().currentUser };
}

/**
 * 登录门禁：未登录访问受保护路由时，重定向到登录页
 */
export function onRouteChange({ location }: { location: { pathname: string } }) {
  const token = getToken();
  if (!token && !WHITE_LIST.includes(location.pathname)) {
    history.push(LOGIN_PATH);
  }
}

/** ProLayout 定制（plugin-layout） */
export const layout: RunTimeLayoutConfig = () => {
  return {
    title: 'Henry 管理平台',
    rightContentRender: () => <RightContent />,
  };
};
