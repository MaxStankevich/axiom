import React, { useState, useEffect } from 'react';
import {
  Form,
  Select,
  Button,
  Radio,
  Row,
  Col,
  notification,
  Input,
  Spin
} from 'antd';
import { debounce } from "throttle-debounce";
import request from "../../../../../utils/request";
import { Link } from "react-router-dom";
import useAuth from "../../../../../hooks/useAuth";
import Products from "./components/products/Products";
import CustomerFields from "./components/customer-fields/CustomerFields";
import OrderFields from "./components/order-fields/OrderFields";

const { Option } = Select;

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

const OrderForm = ({ order = {}, onSuccess }) => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState({ data: [] });
  const [customersLoading, setCustomersLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [statusesLoading, setStatusesLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerRadio, setCustomerRadio] = useState(1);
  const isEdit = !!(order.id);
  const [user] = useAuth();

  const fetchCustomers = (searchTerm = "") => {
    setCustomersLoading(true);
    request.get("/customers", { params: { page: 1, size: 10, search: searchTerm } }).then(res => {
      setCustomers(res.data);
    }).catch(() => {
      notification.error({ message: "Не удалось загрузить заказчиков" })
    }).finally(() => {
      setCustomersLoading(false);
    })
  }

  useEffect(() => {
    fetchCustomers();

    setStatusesLoading(true);
    request.get("/order_statuses").then(res => {
      setStatuses(res.data);
    }).catch(() => {
      notification.error({ message: "Не удалось загрузить статусы" })
    }).finally(() => {
      setStatusesLoading(false);
    })

    setUsersLoading(true);
    request.get("/users").then(res => {
      setUsers(res.data);
    }).catch(() => {
      notification.error({ message: "Не удалось загрузить юзеров" })
    }).finally(() => {
      setUsersLoading(false);
    })
  }, [setCustomers, setCustomersLoading])

  const onCustomerRadioChange = e => {
    setCustomerRadio(e.target.value);
  };

  const initialProducts = (order.products || []).map(product => ({
    id: product.id,
    quantity: product.order_product.quantity
  }));

  const onFinish = (values) => {
    const errors = [];

    if (isEdit) {
      const productsIds = values.products.map(pr => pr.id);
      const deletedProducts = initialProducts.reduce((result, product) => {
        if (!productsIds.includes(product.id)) {
          result.push({ ...product, _destroy: true });
        }
        return result
      }, []);
      values.products = values.products.concat(deletedProducts);
    }

    if (!isEdit && (!values.products || !values.products.length)) {
      errors.push("Не выбраны товары")
    }

    if (errors.length) {
      notification.error({ message: errors.join(". ") })
    } else {
      setLoading(true);

      (isEdit ? request.put(`/orders/${order.id}`, values) : request.post("/orders", values))
        .then(
          (response) => {
            notification.success({
              message: isEdit ?
                "Изменения сохранены" :
                "Заказ добавлен"
            })
            if (onSuccess) {
              onSuccess(response.data);
            }
          },
          () => {
            notification.error({ message: "Не удалось сохранить данные заказа" });
          }
        ).finally(() => {
        setLoading(false);
      })
    }
  };

  return (
    <>
      {isEdit && <div className="table-controls"><Link to={`/orders/${order.id}`}><Button
        type="primary">Просмотр</Button></Link></div>}
      <Form
        layout="vertical"
        form={form}
        name="order"
        onFinish={onFinish}
        initialValues={isEdit ? {
          deliveryMethodId: order.deliveryMethodId,
          deliveryAddress: order.deliveryAddress,
          contactNumber: order.contactNumber,
          contactName: order.contactName,
          contactSurname: order.contactSurname,
          contactPatronymic: order.contactPatronymic,
          notes: order.notes,
          orderStatusId: order.orderStatusId,
          userId: order.userId,
          products: initialProducts
        } : {
          deliveryMethodId: 1,
          orderStatusId: 1,
          products: [{ id: null, quantity: 1 }]
        }}
        scrollToFirstError
        style={{ maxWidth: 750, margin: "0 auto" }}
      >
        <Products form={form}/>
        <div style={{ marginBottom: "50px" }}>
          <OrderFields form={form}/>
          <Form.Item
            name="notes"
            label="Дополнительные условия и пожелания"
          >
            <Input.TextArea/>
          </Form.Item>
          <Form.Item
            name="orderStatusId"
            label="Статус"
            rules={[
              {
                required: true,
                message: 'Укажите статус'
              },
            ]}
          >
            <Select loading={statusesLoading}>
              {statuses.map(status =>
                <Option
                  key={status.id}
                  value={status.id}>{status.name}
                </Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            shouldUpdate
            label="Ответственный"
          >
            {() => (
              <Row gutter={24}>
                <Col span={18}>
                  <Form.Item
                    name="userId"
                    noStyle
                  >
                    <Select loading={usersLoading}>
                      {users.map(user =>
                        <Option
                          key={user.id}
                          value={user.id}>{`${user.fullName || ""} ${user.email}, ${user.username}`}
                        </Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                {form.getFieldValue("userId") === user.id ? null :
                  <Col span={6}>
                    <Button type="primary" onClick={() => {
                      form.setFieldsValue({ userId: user.id })
                    }}>
                      Назначить меня
                    </Button>
                  </Col>
                }
              </Row>
            )}
          </Form.Item>
        </div>
        {isEdit ? null :
          <>
            <Form.Item label="Заказчик">
              <Radio.Group onChange={onCustomerRadioChange} value={customerRadio}>
                <Radio value={1}>Добавить нового заказчика</Radio>
                <Radio value={2}>Выбрать существующего</Radio>
              </Radio.Group>
            </Form.Item>
            {customerRadio === 1 ?
              <CustomerFields/>
              :
              <Form.Item
                name="customerId"
                label="Выберите"
                rules={[
                  {
                    required: true,
                    message: 'Выберите заказчика'
                  },
                ]}
              >
                <Select
                  showSearch
                  loading={customersLoading}
                  notFoundContent={customersLoading ? <Spin size="small"/> : null}
                  placeholder="Поиск по Email"
                  onSearch={debounce(500, fetchCustomers)}
                  filterOption={false}
                >
                  {customers.data.map(customer =>
                    <Option
                      key={customer.id}
                      value={customer.id}>{`${customer.organizationName}, ${customer.address}, ${customer.email}`}
                    </Option>)}
                </Select>
              </Form.Item>
            }
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

export default OrderForm;