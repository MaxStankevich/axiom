import React, { Fragment } from 'react';
import { Table, Space, Button, notification } from 'antd';
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import StatusTag from "../../../../../components/status-tag/StatusTag";
import DeleteAction from "../../../../../components/delete-action/DeleteAction";
import request from "../../../../../utils/request";
import useAuth from "../../../../../hooks/useAuth";


const OrdersList = ({ orders, loading, showCustomer = true, fetchOrders }) => {
  const [user] = useAuth();
  const history = useHistory();

  const takeOrder = (id) => {
    request.put(`/orders/${id}`, { orderStatusId: 2, userId: user.id })
      .then(() => {
        notification.success({ message: "Заказ успешно принят вами" })
        history.push(`/orders/${id}`)
      })
      .catch(() => {
        notification.error({ message: "Не удалось принять заказ" })
      })
  }

  const columns = [
    {
      title: 'Номер заказа',
      dataIndex: 'id',
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'createdAt',
      render: createdAt => (
        moment(createdAt).format('D MMMM YYYY, HH:mm')
      ),
    },
    {
      title: 'Счёт-фактура',
      dataIndex: 'invoice',
    },
    ...(showCustomer ? [{
      title: 'Заказчик',
      dataIndex: "customer",
      render: customer =>
        <Link to={`/customers/${customer.id}`}>
          {customer.organizationName}
        </Link>
    }] : []),
    {
      title: 'Предмет заказа',
      dataIndex: "products",
      render: products => (
        products && !!products.length && products.map(product => (
          <Fragment key={product.id}>
            {product.name} ({product.order_product.quantity} шт)
            <br/>
          </Fragment>
        ))
      ),
    },
    {
      title: 'Статус',
      dataIndex: "orderStatus",
      render: status => (
        <StatusTag id={status.id} name={status.name}/>
      ),
    },
    {
      title: 'Ответственный',
      dataIndex: "user",
      render: user => (
        user && `${user.fullName || ""}, ${user.username}`
      ),
    },
    {
      title: '',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <DeleteAction
            url={`/orders/${record.id}`}
            onSuccess={fetchOrders}
            successMessage="Заказ был успешно удалён"
            errorMessage="Не удалось удалить заказ"
          />
          <Link to={`/orders/${record.id}/edit`}><Button
            type="primary" ghost
            size="small">Редактировать</Button></Link>
          <Link to={`/orders/${record.id}`}><Button
            size="small">Детали</Button></Link>
          {record.orderStatusId === 1 && !record.userId &&
          <Button
            size="small"
            type="primary"
            onClick={() => {
              takeOrder(record.id);
            }}
          >
            Принять
          </Button>
          }
        </Space>
      ),
    },
  ];

  return (
    <Table columns={columns} dataSource={orders} rowKey="id" loading={loading} pagination={false}/>
  )
}


export default OrdersList