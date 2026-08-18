# Henry 管理平台前端

Umi Max 4 + React + TypeScript 的后台管理系统，对接 Henry 用户服务后端。

## 技术栈

- **框架**：`@umijs/max@4.7.6`（antd 5、ProLayout、plugin-access、plugin-initialState）
- **状态**：zustand（业务状态统一放 `src/stores/`）—— 禁止在业务代码中使用 `useModel`
- **HTTP**：axios 自封装（`@/utils/request`）
- **样式**：CSS Modules（`*.module.less`）+ classnames，全局样式在 `global.less`
- **其他**：ahooks（`useLocalStorageState` 等）、jsencrypt（RSA 登录）
- **品牌字体**：`@fontsource-variable/outfit`（本地打包，Outfit Variable）

## 常用命令

| 命令 | 作用 |
|---|---|
| `npm run dev` | 启动开发服务器（http://localhost:8000） |
| `npm run typecheck` | TypeScript 类型检查（`tsc --noEmit`） |
| `npm run build` | 生产构建 |
| `npm run lint` | lint |
| `npm run setup` | 重新生成 `.umi`（`max setup`） |

## 后端契约（关键约定）

- 统一响应 `StandardResponse<T>`：`{ returnCode, errorMsg, body }`，**成功码为字符串 `"SUC0000"`**，失败提示在 `errorMsg`。
- 登录：`GET /user/login/public-key` 取 RSA 公钥 → 密码 jsencrypt 加密后 base64 → `POST /user/login`。
- 登录返回：`{ token, userId, username, nickname }`，token 在 `body.token`。
- 请求头：`Authorization: Bearer <token>`（常量集中在 `src/constants/`）。
- dev 代理：`/user → http://localhost:8080`。后端未启动时接口会失败（504），属预期。

## 编码约定

- **状态管理**：业务状态一律用 zustand（`src/stores/user.ts`），登录/退出/刷新都在 store 内；`model` 插件仅作为 Umi Max 框架内部机制（ProLayout/权限/初始状态依赖），业务代码不直接用 `useModel`。
- **接口层**：请求统一走 `@/utils/request`（自动注入 token、解包 body、`SUC0000` 判定、401 处理）；请求/返回类型集中定义在 `src/services/`，页面不散落字段类型。
- **权限**：`src/access.ts` 定义 `isLogin`（登录门禁）+ `canAdmin`（RBAC 插槽，后端返回 `role` 后生效）；路由 `access` 字段 + `<Access>` 组件 + `onRouteChange` 守卫。
- **UI 规范**：页面级样式用 CSS Modules；登录页设计语言（分屏品牌区 + 靛蓝→紫罗兰 `#6366F1→#8B5CF6` 强调色、发光卡片、Outfit 字体）见 `.interface-design/system.md`（如已保存）。
- **交付前验证**：改代码后跑 `npm run typecheck`；改动涉及编译/路由时再起 dev 确认编译通过。

## 目录结构

```
config/            Umi 配置（config.ts 主配置、routes.ts 路由表）
src/
  access.ts        权限定义
  app.tsx          运行时：getInitialState / onRouteChange 守卫 / layout
  global.less      全局样式
  constants/       常量（token key、SUC0000、Header 名等，集中可改）
  stores/          zustand 全局状态
  services/        接口层（类型 + 请求函数）
  utils/           request / auth / rsa 等工具
  components/      公共组件（RightContent 等）
  pages/           页面（Login / Dashboard / User / AccessDemo / 403 / 404）
```

## 常见坑

- `.umi` 生成目录若出现 `Can't resolve 'umi'` 之类的级联报错：停 dev → 删 `src/.umi` → 重启即可（生成竞态，不是依赖问题）。
- 新增依赖后 `@types` 缺失时，可在 `src/typings.d.ts` 补本地 `declare module`。
- 修改 `config/` 或新增路由后需重启 dev 让 `.umi` 重新生成。
