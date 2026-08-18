# Henry 管理平台前端

基于 **Umi Max 4.7.6** 的 React + TypeScript 管理后台，内置登录、权限管控与模块化目录结构。

## 技术栈

| 项 | 选型 |
| --- | --- |
| 框架 | `@umijs/max@4.7.6`（含 antd5、ProLayout、access、model、initialState） |
| 语言 | TypeScript |
| HTTP | `axios`（自封装，见 `src/utils/request.ts`） |
| 状态 | `@umijs/max` plugin-model（`src/models/user.ts`） |
| 请求逻辑 | `ahooks`（`useRequest`） |
| 样式 | `less` + CSS Modules（`*.module.less`）+ `classnames` |
| 加密 | `jsencrypt`（RSA 公钥加密密码） |

## 快速开始

```bash
npm install       # 安装依赖，postinstall 会自动执行 max setup
npm run dev       # 开发，默认 http://localhost:8000
npm run build     # 生产构建，输出到 dist/
npm run typecheck # TS 类型检查
```

## 目录结构（模块化）

```
config/
  config.ts       # Umi 配置：插件、proxy、define
  routes.ts       # 路由表（含 access 字段）
src/
  access.ts       # 权限定义（isLogin / canAdmin）
  app.tsx         # 运行时：getInitialState、onRouteChange 登录守卫、layout 定制
  constants/      # 常量（成功码、token key、鉴权头等，集中可改）
  components/     # 通用组件（RightContent：用户下拉 + 退出）
  models/         # 全局状态（user：登录/退出/恢复）
  pages/          # 页面（Login / Dashboard / User / AccessDemo / 403 / 404）
  services/       # 接口层（user.ts：登录、公钥、用户 CRUD）
  utils/          # 工具（request：axios 封装；auth：token 存取；rsa：加密）
  global.less     # 全局样式
```

## 后端对接（Henry 用户服务）

接口约定来自后端 Java 源码，集中可调整的点：

### 统一响应 `StandardResponse<T>`

```json
{ "returnCode": "SUC0000", "errorMsg": null, "body": {} }
```

- 成功码为字符串 **`SUC0000`**（`src/constants/index.ts` 的 `SUCCESS_CODE`）。
- axios 响应拦截器会**自动解包 `body`**，service 层拿到的即业务数据；失败时 `errorMsg` 统一弹出提示。

### 登录（RSA 加密密码）

1. `GET /user/login/public-key` → 取 RSA 公钥
2. 前端用 `jsencrypt` 加密密码（`src/utils/rsa.ts`，自动处理缺失 PEM 头的公钥）
3. `POST /user/login`，body：`{ username, password }`（password 为加密后 base64）
4. 返回 `{ token, userId, username, nickname }`，前端写入 localStorage 并跳转

### 鉴权头

- 默认 `Authorization: Bearer <token>`，如需自定义头，改 `src/constants/index.ts` 的 `AUTH_HEADER` / `AUTH_PREFIX`。
- 401 时自动清除登录态并跳转 `/login`。

### 其他接口

`GET /user/{id}`、`GET /user/page`、`POST /user`、`PUT /user/{id}`、`DELETE /user/{id}`（见 `src/services/user.ts`）。
⚠️ `UserDTO` / `StandardPage` / `PageQuery` 字段按常见约定假定，若与实际不符，集中修改 `src/services/user.ts` 中的类型定义即可。

## 权限管控

- **登录门禁**：`src/app.tsx` 的 `onRouteChange` 将未登录访问重定向到 `/login`；受保护路由配置 `access: 'isLogin'`。
- **RBAC（角色）**：`src/access.ts` 按 `currentUser.role` 推导 `canAdmin`。
  - 路由级：`config/routes.ts` 中 `/access` 配置了 `access: 'canAdmin'`，非管理员进入渲染 403。
  - 按钮级：`<Access accessible={access.canAdmin}>` 控制 UI 显隐（见 `src/pages/AccessDemo`）。
  - **后端暂未返回 role 字段**，`LoginResult.role` 为可选项；后端补上后即自动生效。

## 后端地址配置

- **开发**：`config/config.ts` 的 `proxy['/user']` 指向本地后端（默认 `http://localhost:8080`），接口走相对路径 `/user/...`，避免跨域。
- **生产**：构建时覆盖 API 基础地址：
  ```bash
  API_BASE=https://api.example.com npm run build
  ```
  或直接修改 `src/constants/index.ts` 的 `API_BASE`。
