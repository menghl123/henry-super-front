---
description: 启动 Umi dev 开发服务器
---

启动开发服务器：

1. 若端口 8000 被占用（`netstat -ano | grep ':8000'`），先释放再启动。
2. 后台运行 `npm run dev`。
3. 等待编译完成后，报告本地地址 http://localhost:8000 与网络地址。

若日志出现 `Can't resolve` 级联报错（`.umi` 生成竞态），先停掉进程、删除 `src/.umi`、再重启。
