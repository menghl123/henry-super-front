---
description: Zustand store 编写约定（作用于 src/stores/ 目录）
paths:
  - "src/stores/**"
---

- 业务状态一律使用 zustand（`create<T>()`），禁止使用 `useModel` / plugin-model。
- store 初始化时从 localStorage 恢复登录态（参考 `src/stores/user.ts`）。
- 异步 action 内部用 `set()` 更新，调用方 `await` 成功后再跳转/提示。
- 组件内用 selector 订阅：`const xxx = useUserStore((s) => s.xxx)`，避免整对象订阅引发多余渲染。
