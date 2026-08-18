import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { useLocalStorageState } from 'ahooks';
import { isLoggedIn } from '@/utils/auth';
import { useUserStore } from '@/stores/user';
import styles from './index.module.less';

interface LoginForm {
  username: string;
  password: string;
  remember?: boolean;
}

/** 记住用户名的 localStorage key */
const REMEMBER_KEY = 'henry_login_username';

/**
 * 登录页（ui-ux-design-pro 重设计）
 * 左右分屏：左侧深色品牌展示区，右侧发光登录卡片
 * 登录流程不变：取公钥 -> RSA 加密密码 -> 提交 -> 写入登录态跳转
 */
const Login: FC = () => {
  const login = useUserStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [remembered, setRemembered] = useLocalStorageState<string>(REMEMBER_KEY, {
    defaultValue: '',
  });

  useEffect(() => {
    if (isLoggedIn()) {
      history.push('/dashboard');
    }
  }, []);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      await login({ username: values.username, password: values.password });
      if (values.remember) {
        setRemembered(values.username);
      } else {
        setRemembered('');
      }
      message.success('登录成功');
      history.push('/dashboard');
    } catch {
      // 错误提示已在 request 拦截器统一处理
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* 左侧：品牌展示区 */}
      <div className={styles.brand} aria-hidden="true">
        <div className={styles.gridOverlay} />
        <span className={styles.orb1} />
        <span className={styles.orb2} />
        <span className={styles.orb3} />
        <div className={styles.brandInner}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>H</span>
            <span className={styles.logoText}>Henry</span>
          </div>
          <h1 className={styles.brandTitle}>Henry 管理平台</h1>
          <p className={styles.brandSub}>高效 · 安全 · 模块化的企业管理后台</p>
          <ul className={styles.brandPoints}>
            <li>统一账号体系与角色权限管控</li>
            <li>RSA 公钥加密，保障登录安全</li>
            <li>模块化架构，支撑快速迭代</li>
          </ul>
        </div>
      </div>

      {/* 右侧：登录表单区 */}
      <div className={styles.formSide}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>欢迎回来</h2>
          <p className={styles.formSub}>请登录你的账号以继续访问</p>
          <Form
            name="login"
            size="large"
            onFinish={onFinish}
            initialValues={{ username: remembered || undefined, remember: !!remembered }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<UserOutlined className={styles.inputIcon} />}
                placeholder="用户名"
                autoComplete="username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined className={styles.inputIcon} />}
                placeholder="密码"
                autoComplete="current-password"
              />
            </Form.Item>
            <div className={styles.formRow}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className={styles.remember}>记住用户名</Checkbox>
              </Form.Item>
              <span className={styles.forgot}>忘记密码？</span>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className={styles.submit}
            >
              登 录
            </Button>
          </Form>
          <p className={styles.formFooter}>
            © {new Date().getFullYear()} Henry · 登录即表示同意服务条款
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
