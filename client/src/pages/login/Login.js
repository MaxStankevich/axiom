import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css';
import request from "../../utils/request";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const [, updateUser] = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = values => {
    setLoading(true);
    request
      .post("/auth/signin", {
        username: values.username,
        password: values.password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("token", response.data.accessToken);
        }
        updateUser(response.data);
      }).catch((e) => {
      console.log(e);
      notification.error({ message: "Не удалось выполнить вход" })
    }).finally(() => {
      setLoading(false);
    })
  };

  return (
    <div className="login-form-wrapper">
      <div className="login-form-container">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Введите логин' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Логин"/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon"/>}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit" className="login-form-button">
              Войти
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login