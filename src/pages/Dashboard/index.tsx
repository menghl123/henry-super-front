import type { FC } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { useUserStore } from '@/stores/user';
import styles from './index.module.less';

/** 首页仪表盘（占位数据） */
const Dashboard: FC = () => {
  const currentUser = useUserStore((s) => s.currentUser);

  return (
    <div className={styles.container}>
      <Typography.Title level={4} className={styles.welcome}>
        欢迎回来，{currentUser?.nickname || currentUser?.username}
      </Typography.Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="注册用户" value={128} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="今日访问" value={256} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="在线用户" value={64} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="系统消息" value={8} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
