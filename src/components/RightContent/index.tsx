import type { FC } from 'react';
import { Avatar, Dropdown, Space } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useUserStore } from '@/stores/user';

/** 顶栏右侧：当前用户信息 + 退出登录 */
const RightContent: FC = () => {
  const currentUser = useUserStore((s) => s.currentUser);
  const logout = useUserStore((s) => s.logout);

  const items = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logout,
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Space style={{ cursor: 'pointer', padding: '0 12px' }}>
        <Avatar size="small" style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
        <span>{currentUser?.nickname || currentUser?.username || '未登录'}</span>
      </Space>
    </Dropdown>
  );
};

export default RightContent;
