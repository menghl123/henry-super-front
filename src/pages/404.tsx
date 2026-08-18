import type { FC } from 'react';
import { Button, Result } from 'antd';
import { history } from '@umijs/max';

/** 404 页面 */
const NotFound: FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="抱歉，你访问的页面不存在"
    extra={
      <Button type="primary" onClick={() => history.push('/dashboard')}>
        返回首页
      </Button>
    }
  />
);

export default NotFound;
