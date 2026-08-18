import type { FC } from 'react';
import { Alert, Button, Card } from 'antd';
import { Access, useAccess } from '@umijs/max';

/**
 * 权限演示页
 * - 路由级：config/routes.ts 中该路由配置了 access: 'canAdmin'，非管理员进入会渲染 403
 * - 按钮级：<Access> 组件按权限条件渲染/隐藏操作按钮
 */
const AccessDemo: FC = () => {
  const access = useAccess();

  return (
    <Card title="权限演示（路由级 + 按钮级）">
      <Alert
        type="info"
        showIcon
        message="该页面路由配置了 access: canAdmin，仅管理员角色可进入；普通用户访问将被重定向到 403 页。"
      />
      <div style={{ marginTop: 16 }}>
        <Access
          accessible={access.canAdmin}
          fallback={
            <Alert
              type="warning"
              showIcon
              message="按钮级控制：当前无管理员权限，以下按钮不可见。"
            />
          }
        >
          <Button type="primary">仅管理员可见的操作按钮</Button>
        </Access>
      </div>
    </Card>
  );
};

export default AccessDemo;
