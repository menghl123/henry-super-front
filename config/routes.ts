/**
 * 路由表
 * - access: 与 src/access.ts 中返回的权限 key 对应，无权限时由 plugin-layout 渲染 unAccessible（403）
 * - layout: false 表示不套用 ProLayout 外壳（登录/403/404）
 */
interface RouteConfig {
  path?: string;
  name?: string;
  icon?: string;
  component?: string;
  layout?: boolean;
  access?: string;
  redirect?: string;
  routes?: RouteConfig[];
}

const routes: RouteConfig[] = [
  {
    path: '/login',
    name: '登录',
    component: './Login',
    layout: false,
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: '仪表盘',
    icon: 'dashboard',
    component: './Dashboard',
    access: 'isLogin',
  },
  {
    path: '/user',
    name: '用户管理',
    icon: 'team',
    component: './User',
    access: 'isLogin',
  },
  {
    // 仅管理员可访问（演示路由级权限管控）
    path: '/access',
    name: '权限演示',
    icon: 'safety',
    component: './AccessDemo',
    access: 'canAdmin',
  },
  {
    path: '/403',
    component: './403',
    layout: false,
  },
  {
    path: '/404',
    component: './404',
    layout: false,
  },
  {
    path: '*',
    component: './404',
  },
];

export default routes;
