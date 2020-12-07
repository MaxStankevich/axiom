import React, { useState } from 'react';
import {
  Form,
  Button,
  notification, Input
} from 'antd';
import request from "../../utils/request";
import Products from "../admin/components/orders/form/components/products/Products";
import OrderFields from "../admin/components/orders/form/components/order-fields/OrderFields";
import CustomerFields from "../admin/components/orders/form/components/customer-fields/CustomerFields";

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 10,
    },
  },
};

const OrderForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onFinish = (values) => {
    const errors = [];

    if (!values.products || !values.products.length) {
      errors.push("Не выбраны товары")
    }

    if (errors.length) {
      notification.error({ message: errors.join(". ") })
    } else {
      setLoading(true);

      request.post("/orders", values)
        .then(
          () => {
            notification.success({
              message: "Заказ отправлен"
            })
            setSuccess(true);
          },
          () => {
            notification.error({ message: "Не удалось отправить заказ" });
          }
        ).finally(() => {
        setLoading(false);
      })
    }
  };

  return success ?
    <div style={{ maxWidth: 750, margin: "50px auto 30px auto" }}>
      <h1>Ваш заказ отправлен!</h1>
      <h3>Мы свяжемся с вами по возможности. По причине повышенного спроса, связанного с реализацией программы по переходу на использование биометрических документов, оперативно реагировать на все обращения не представляется возможным. Приносим извинения за задержки.</h3>
    </div> :
    <>
      <div style={{ maxWidth: 750, margin: "50px auto 30px auto" }}>
        <h3>Пожалуйста, выберите интересующие вас товары, укажите их количество, заполните все поля помеченные * и
          нажмите кнопку <b>Отправить</b></h3>
      </div>
      <Form
        layout="vertical"
        form={form}
        name="order"
        onFinish={onFinish}
        initialValues={{
          deliveryMethodId: 1,
          orderStatusId: 1,
          products: [{ id: null, quantity: 1 }]
        }}
        scrollToFirstError
        style={{ maxWidth: 750, margin: "0 auto", paddingBottom: 30 }}
      >
        <Products form={form}/>
        <OrderFields form={form}/>
        <CustomerFields/>
        <Form.Item
          name="notes"
          label="Дополнительные условия и пожелания"
        >
          <Input.TextArea/>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={loading}>
            Отправить
          </Button>
        </Form.Item>
      </Form>
    </>
};

export default OrderForm;