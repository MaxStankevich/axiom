import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  notification
} from 'antd';
import request from "../../../../../utils/request";
import { formItemLayout, tailFormItemLayout } from "../../../../../config/formLayout";

const ProductForm = ({ product = {}, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!(product.id);

  const onFinish = (values) => {
    setLoading(true);
    (isEdit ? request.put(`/products/${product.id}`, values) : request.post("/products", values))
      .then(
        (response) => {
          notification.success({
            message: isEdit ?
              `Данные товара ${response.data.name} были успешно обновлены` :
              `Добавление товара ${response.data.name} прошла успешно`
          })
          if (onSuccess) {
            onSuccess(response.data);
          }
        },
        () => {
          notification.error({ message: "Не удалось обновить данные товара" });
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
        name="product"
        onFinish={onFinish}
        initialValues={isEdit ? {
          name: product.name,
          description: product.description,
        } : {}}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="Наименование"
          rules={[
            {
              required: true,
              message: 'Ведите наименование',
              whitespace: true,
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="description"
          label="Описание"
        >
          <Input.TextArea />
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

export default ProductForm;