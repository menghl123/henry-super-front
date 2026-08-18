import type { FC } from 'react';
import { useState } from 'react';
import { useRequest } from 'ahooks';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  createUser,
  deleteUser,
  getPublicKey,
  pageUsers,
  updateUser,
  type CreateUserParams,
  type UpdateUserParams,
  type UserDTO,
} from '@/services/user';
import { rsaEncryptPassword } from '@/utils/rsa';
import styles from './index.module.less';

interface UserForm {
  username?: string;
  password?: string;
  nickname?: string;
}

/** 用户管理：分页列表 + 新建/编辑/删除 */
const UserPage: FC = () => {
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UserDTO | null>(null);
  const [form] = Form.useForm<UserForm>();

  const { data, loading, run: reload } = useRequest(
    () => pageUsers({ pageNum, pageSize }),
    { refreshDeps: [pageNum, pageSize] },
  );

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: UserDTO) => {
    setEditing(record);
    form.setFieldsValue({ nickname: record.nickname });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      const params: UpdateUserParams = { nickname: values.nickname };
      await updateUser(editing.id, params);
      message.success('更新成功');
    } else {
      // 新建用户密码同样需要 RSA 加密后提交
      const publicKey = await getPublicKey();
      const encrypted = rsaEncryptPassword(values.password!, publicKey);
      const params: CreateUserParams = {
        username: values.username!,
        password: encrypted,
        nickname: values.nickname,
      };
      await createUser(params);
      message.success('创建成功');
    }
    setModalOpen(false);
    reload();
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    message.success('删除成功');
    reload();
  };

  const columns: ColumnsType<UserDTO> = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '用户名', dataIndex: 'username' },
    { title: '昵称', dataIndex: 'nickname', render: (v) => v || '-' },
    { title: '状态', dataIndex: 'status', render: (v) => v || '-' },
    {
      title: '操作',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确认删除该用户？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="用户管理">
      <div className={styles.toolbar}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建用户
        </Button>
      </div>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data?.list}
        pagination={{
          current: pageNum,
          pageSize,
          total: data?.total ?? 0,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (page, size) => {
            setPageNum(page);
            setPageSize(size);
          },
        }}
      />
      <Modal
        title={editing ? '编辑用户' : '新建用户'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          {!editing && (
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
          )}
          {!editing && (
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, max: 32, message: '密码长度需在 6-32 位之间' },
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
          <Form.Item name="nickname" label="昵称">
            <Input placeholder="请输入昵称" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserPage;
