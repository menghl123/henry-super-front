import { defineConfig } from '@umijs/max';
import routes from './routes';

/**
 * Umi 主配置
 * - 后端地址联调：开发环境走 dev proxy（/user -> 后端），构建时可用环境变量覆盖 API_BASE
 *   例：API_BASE=https://api.example.com npm run build
 */
export default defineConfig({
  antd: {},
  access: {},
  // model/initialState 为 Umi Max 框架内部机制（ProLayout / 权限 / 初始状态依赖），
  // 业务状态已全部迁移到 zustand（src/stores/），应用代码不直接使用 useModel
  model: {},
  initialState: {},
  layout: {
    title: 'Henry 管理平台',
    // 路由 access 校验失败（如非管理员访问 /access）时渲染的 403 页
    unAccessible: './403',
  },
  routes,
  npmClient: 'npm',
  define: {
    'process.env.API_BASE': process.env.API_BASE || '',
  },
  proxy: {
    // 开发环境将用户服务接口代理到后端，避免跨域
    '/user': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
});
