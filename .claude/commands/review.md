---
description: 审查最近改动与项目约定的一致性
---

对当前未提交的 git 改动做一次代码审查：

1. 用 `git diff`（含 `git diff --cached`）查看改动。
2. 审查维度：
   - 正确性与类型安全；
   - 是否遵守 `CLAUDE.md` 约定：业务状态用 zustand（禁 useModel）、请求走 `@/utils/request`、成功码 `SUC0000`、样式用 CSS Modules；
   - 新增接口字段是否集中在 `src/services/` 类型里。
3. 输出结构化 findings（按严重程度排序，标注文件与行号）。
