// 命名工作流：审查最近 git 改动（需在 /config 开启 Workflows，付费计划可用）
// 调用方式：claude --workflow review-changes 或在对话中通过 Workflow 工具以 name 调用
export const meta = {
  name: 'review-changes',
  description: '审查最近 git 改动，产出结构化 findings（正确性 + 项目约定一致性）',
  phases: [{ title: 'Review' }],
};

phase('Review');
const result = await agent(
  `Review the current git diff of this Umi Max frontend project (run \`git diff\` and \`git diff --cached\` first).
   Check for:
   - correctness & type-safety issues;
   - adherence to CLAUDE.md conventions: zustand for business state (no useModel), requests via @/utils/request, success code "SUC0000", CSS Modules styles;
   - new API field types centralized in src/services.
   Return findings ordered by severity, each with file:line, the failure scenario, and a suggested fix.`,
  { label: 'review-diff', phase: 'Review' },
);
return result;
