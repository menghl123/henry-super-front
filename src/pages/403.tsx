import type { FC } from 'react';
import { Button, Result } from 'antd';
import { history } from '@umijs/max';

/** 403 无权限页 */
const Forbidden: FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="抱歉，你无权访问该页面"
    extra={
      <Button type="primary" onClick={() => history.push('/dashboard')}>
        返回首页
      </Button>
    }
  />
);

export default Forbidden;
