import React, { useState } from 'react';
import {
  Form,
  Input,
  Tooltip,
  Select,
  Button,
  notification
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import request from "../../utils/request";
import useAuth from "../../hooks/useAuth";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 16,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 16,
    },
    sm: {
      span: 8,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const UserForm = ({ user = {}, onSuccess }) => {
  const [form] = Form.useForm();
  const [, , isAdmin] = useAuth();
  const [loading, setLoading] = useState(false);

  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const isEdit = !!(user.id);

  const onFinish = (values) => {
    setLoading(true);
    const userData = {
      username: values.username,
      email: values.email,
      fullName: values.fullName,
    };

    if (isEdit && showPasswordFields) {
      userData.password = values.password
    }

    if (values.roleId) {
      userData.roleId = Number(values.roleId);
    }

    (isEdit ? request.put(`/users/${user.id}`, userData) : request.post("/auth/signup", {
      ...userData,
      password: values.password
    }))
      .then(
        (response) => {
          notification.success({
            message: isEdit ?
              `Данные пользователя ${response.data.username} были успешно обновлены` :
              `Регистрация пользователя ${response.data.username} прошла успешно`
          })
          if (onSuccess) {
            onSuccess(response.data);
          }
        },
        () => {
          notification.error({ message: "Не удалось обновить данные пользователя" });
        }
      ).finally(() => {
      setLoading(false);
    })
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="user"
        onFinish={onFinish}
        initialValues={isEdit ? {
          ...user,
          roleId: String(user.role.id)
        } : { roleId: "2" }}
        scrollToFirstError
      >
        <Form.Item
          name="username"
          label={
            <span>
            Логин&nbsp;
              <Tooltip title="Логин необходимый для входа">
              <QuestionCircleOutlined/>
            </Tooltip>
          </span>
          }
          rules={[
            {
              required: true,
              message: 'Введите логин',
              whitespace: true,
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'Неправильный E-mail',
            },
            {
              required: true,
              message: 'Ведите E-mail',
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="fullName"
          label="ФИО"
          rules={[
            {
              required: true,
              message: 'Введите ФИО',
              whitespace: true,
            },
          ]}
        >
          <Input/>
        </Form.Item>
        {isAdmin &&
        <Form.Item
          name="roleId"
          label="Роль"
          rules={[
            {
              required: true,
              message: 'Выберите роль!',
            },
          ]}
        >
          <Select>
            <Option value="1">Администратор</Option>
            <Option value="2">Менеджер</Option>
          </Select>
        </Form.Item>
        }
        {isEdit &&
        <Form.Item {...tailFormItemLayout}>
          <Button onClick={() => {
            setShowPasswordFields(val => !val)
          }}>
            {showPasswordFields ? "Отмена" : "Сменить пароль"}
          </Button>
        </Form.Item>
        }
        {(!isEdit || showPasswordFields) &&
        <>
          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              {
                required: true,
                message: 'Введите пароль',
              },
            ]}
            hasFeedback
          >
            <Input.Password autoComplete="new-password"/>
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Подтверждение пароля"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Подтвердите пароль',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject('Пароль должен совпадать');
                },
              }),
            ]}
          >
            <Input.Password/>
          </Form.Item>
        </>
        }
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? "Сохранить" : "Создать"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default UserForm;