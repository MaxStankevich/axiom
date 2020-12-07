import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  notification
} from 'antd';
import request from "../../../../../utils/request";

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

const CustomerForm = ({ customer = {}, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!(customer.id);

  const onFinish = (values) => {
    setLoading(true);
    (isEdit ? request.put(`/customers/${customer.id}`, values) : request.post("/customers", values))
      .then(
        (response) => {
          notification.success({
            message: isEdit ?
              `Данные заказчика ${response.data.organizationName} были успешно обновлены` :
              `Добавление заказчика ${response.data.organizationName} прошла успешно`
          })
          if (onSuccess) {
            onSuccess(response.data);
          }
        },
        () => {
          notification.error({ message: "Не удалось обновить данные заказчика" });
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
        name="customer"
        onFinish={onFinish}
        initialValues={isEdit ? {
          email: customer.email,
          organizationName: customer.organizationName,
          address: customer.address,
          bankAccountNumber: customer.bankAccountNumber,
          bankName: customer.bankName,
          payerAccountNumber: customer.payerAccountNumber,
        } : {}}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              type: 'email',
              message: 'Неправильный E-mail',
            },
            {
              required: true,
              message: 'Ведите E-mail',
              whitespace: true,
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="organizationName"
          label="Название организации"
          rules={[
            {
              required: true,
              message: 'Ведите название организации',
              whitespace: true,
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="address"
          label="Юридический адрес"
          rules={[
            {
              required: true,
              message: 'Ведите юридический адрес',
              whitespace: true,
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="bankAccountNumber"
          label="Номер банковского счёта"
          rules={[
            {
              required: true,
              message: 'Ведите номер банковского счёта',
              whitespace: true,
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="bankName"
          label="Название банка"
          rules={[
            {
              required: true,
              message: 'Ведите название банка',
              whitespace: true,
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="payerAccountNumber"
          label="УНП"
          rules={[
            {
              required: true,
              message: 'Ведите УНП (9 цифр)',
              // whitespace: true,
              // len: 9
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? "Сохранить" : "Создать"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CustomerForm;