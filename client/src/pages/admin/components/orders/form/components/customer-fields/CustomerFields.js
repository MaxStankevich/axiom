import React from 'react';
import {
  Form,
  Input,
} from 'antd';

const CustomerFields = () => {
  return (
    <>
      <Form.Item
        name={["customer", "email"]}
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
        name={["customer", "organizationName"]}
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
        name={["customer", "address"]}
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
        name={["customer", "bankAccountNumber"]}
        label="Номер банковского счёта (IBAN)"
        rules={[
          {
            required: true,
            message: 'Должно быть 28 символов',
            whitespace: true,
            len: 28
          },
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        name={["customer", "bankName"]}
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
        name={["customer", "payerAccountNumber"]}
        label="УНП"
        rules={[
          {
            required: true,
            message: 'Ведите УНП (9 цифр)',
            whitespace: true,
            len: 9
          },
        ]}
      >
        <Input/>
      </Form.Item>
    </>
  );
};

export default CustomerFields;