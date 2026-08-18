#!/usr/bin/env node
/**
 * PreToolUse 钩子：禁止直接向 main/master 分支推送，保护主分支。
 *
 * 约定：
 *   - 钩子通过 stdin 接收 JSON（{ tool_name, tool_input: { command, ... } }）
 *   - 命中 `git push` 且目标含 main/master 时 exit 2 阻止执行
 *   - 其他情况一律 exit 0 放行；解析失败时放行，避免误伤
 */
const chunks = [];
process.stdin.on('data', (c) => chunks.push(c));
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const command = String(input.tool_input && input.tool_input.command || '');
    if (/\bgit\s+push\b/.test(command) && /\b(main|master)\b/.test(command)) {
      console.error(
        '❌ 已拦截：禁止直接 push 到 main/master。\n' +
          '   请先创建 feature 分支（git checkout -b feat/xxx）并在 PR 中合并。',
      );
      process.exit(2);
    }
    process.exit(0);
  } catch (err) {
    // 输入无法解析时放行，保证不阻塞正常工作流
    process.exit(0);
  }
});
