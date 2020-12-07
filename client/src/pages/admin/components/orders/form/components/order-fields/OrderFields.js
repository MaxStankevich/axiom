import React from 'react';
import {
  Form,
  Input,
  Select,
} from 'antd';

const OrderFields = ({ form }) => {
  return (
    <>
      <Form.Item
        name="deliveryMethodId"
        label="Способ доставки"
      >
        <Select>
          <Select.Option value={1}>Самовывоз</Select.Option>
          <Select.Option value={2}>Курьер (Autolight Express)</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {() => {
          return form.getFieldValue("deliveryMethodId") === 1 ? null :
            <Form.Item
              name="deliveryAddress"
              label="Адрес доставки"
              rules={[
                {
                  required: true,
                  message: 'Введите адрес',
                  whitespace: true,
                },
              ]}
            >
              <Input/>
            </Form.Item>
        }}
      </Form.Item>
      <Form.Item
        name="contactNumber"
        label="Контактный номер"
        rules={[
          {
            required: true,
            message: 'Номер должен состоять из 9 цифр',
            // len: 9
          },
        ]}
      >
        <Input
          addonBefore="+375"
          style={{
            width: '100%',
          }}
        />
      </Form.Item>
      <Form.Item
        name="contactName"
        label="Имя"
        rules={[
          {
            required: true,
            message: 'Укажите имя',
          },
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {() => {
          return form.getFieldValue("deliveryMethodId") === 1 ? null :
            <>
              <Form.Item
                name="contactSurname"
                label="Фамилия"
                rules={[
                  {
                    required: true,
                    message: 'Введите адрес',
                    whitespace: true,
                  },
                ]}
              >
                <Input/>
              </Form.Item>
              <Form.Item
                name="contactPatronymic"
                label="Отчество"
                rules={[
                  {
                    required: true,
                    message: 'Введите отчество',
                    whitespace: true,
                  },
                ]}
              >
                <Input/>
              </Form.Item>
            </>
        }}
      </Form.Item>
    </>
  );
};

export default OrderFields;