---
description: 类型检查 + 生产构建验证
---

执行项目交付前的完整验证：

1. 运行 `npm run typecheck`（`tsc --noEmit`）。
2. 运行 `npm run build`（生产构建）。
3. 任一步失败：修复后重新执行，直到全部通过；最后汇总结果。
