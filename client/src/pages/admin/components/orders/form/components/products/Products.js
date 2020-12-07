import React, { useState, useEffect } from 'react';
import {
  Form,
  Select,
  Button,
  Row,
  Col,
  InputNumber,
  notification
} from 'antd';
import { PlusOutlined, DeleteTwoTone } from '@ant-design/icons';
import request from "../../../../../../../utils/request";
import { tailFormItemLayout } from "../../../../../../../config/formLayout";

const { Option } = Select;

const OrderForm = ({ form }) => {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    setProductsLoading(true);
    request.get("/products").then(res => {
      setProducts(res.data);
    }).catch(() => {
      notification.error({ message: "Не удалось загрузить заказчиков" })
    }).finally(() => {
      setProductsLoading(false);
    })
  }, [setProducts, setProductsLoading])

  return (
    <Form.List name="products">
      {(fields, { add, remove }) => {
        return (
          <>
            {fields.map(field => (
              <Row gutter={24} align="middle" key={field.key}>
                <Col xs={16}>
                  <Form.Item
                    noStyle
                    shouldUpdate
                  >
                    {() => {
                      const values = form.getFieldValue("products") || [];
                      const selectedIds = values.filter(val => val && val.id).map(val => val.id);
                      return (
                        <Form.Item
                          {...field}
                          label="Товар"
                          name={[field.name, 'id']}
                          fieldKey={[field.fieldKey, 'id']}
                          rules={[{ required: true, message: 'Выберите товар' }]}
                        >
                          <Select disabled={productsLoading}>
                            {products.map(item => (
                              <Option disabled={selectedIds.includes(item.id)} key={item.id} value={item.id}>
                                {item.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      )
                    }}
                  </Form.Item>
                </Col>
                <Col xs={5}>
                  <Form.Item
                    {...field}
                    label="Количество"
                    name={[field.name, 'quantity']}
                    fieldKey={[field.fieldKey, 'quantity']}
                    rules={[
                      {
                        required: true, message: 'Введите количество',
                        type: 'number',
                        min: 1,
                      },
                    ]}
                  >
                    <InputNumber/>
                  </Form.Item>
                </Col>
                <Col xs={1}>
                  <DeleteTwoTone onClick={() => remove(field.name)}/>
                </Col>
              </Row>
            ))}

            {fields.length < products.length &&
            <Form.Item {...tailFormItemLayout}>
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined/>}>
                Добавить товар
              </Button>
            </Form.Item>
            }
          </>
        )
      }}
    </Form.List>
  );
};

export default OrderForm;