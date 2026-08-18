---
description: 接口层约定（作用于 src/services/ 目录）
paths:
  - "src/services/**"
---

- 请求统一通过 `@/utils/request` 的 `get/post/put/del`，禁止在 service 里裸用 axios。
- 响应已由拦截器解包：`returnCode === "SUC0000"` 时返回 `body`，service 拿到的是业务数据。
- 请求参数与返回类型集中定义在 service 文件内，页面不散落字段类型。
- 后端字段若有变动，优先只改这里的类型定义。
