import React, { useState, useEffect, Fragment } from "react";
import { Descriptions, Button } from "antd";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import request from "../../../../../utils/request";
import Spinner from "../../../../../components/spinner/Spinner";
import StatusTag from "../../../../../components/status-tag/StatusTag";

const ShowOrder = () => {
  const [order, setOrder] = useState();
  const { id } = useParams();

  useEffect(() => {
    request.get(`/orders/${id}`).then(res => {
      setOrder(res.data);
    }).catch(err => {
      console.log(err);
    })
  }, [id])

  return (
    order ?
      <Descriptions
        bordered
        title="Информация о заказе"
        extra={
          <Link to={`/orders/${id}/edit`}><Button
            type="primary">Редактировать</Button></Link>}
      >
        <Descriptions.Item label="Предмет заказа">{(order.products || []).map(product => (
          <Fragment key={product.id}>
            {product.name} ({product.order_product.quantity} шт)
            <br/>
          </Fragment>
        ))}</Descriptions.Item>
        <Descriptions.Item label="Создан">{moment(order.createdAt).format('D MMMM YYYY, HH:mm')}</Descriptions.Item>
        <Descriptions.Item
          label="Контактное лицо">{order.contactSurname} {order.contactName} {order.contactPatronymic} {`+375${order.contactNumber}`}</Descriptions.Item>
        <Descriptions.Item label="Способ доставки">{order.deliveryMethod.name}</Descriptions.Item>
        {order.deliveryAddress && <Descriptions.Item label="Адрес доставки">{order.deliveryAddress}</Descriptions.Item>}
        {order.notes && <Descriptions.Item label="Доп. комментарии">{order.notes}</Descriptions.Item>}
        <Descriptions.Item label="Статус"><StatusTag {...order.orderStatus} /></Descriptions.Item>
        <Descriptions.Item label="Ответственный">
          {order.user ?
            <>
              {order.user.fullName &&
              <>
                {order.user.fullName}
                <br/>
              </>
              }
              {order.user.username}
              <br/>
              {order.user.email}
              <br/>
            </> :
            "Не назначен"
          }
        </Descriptions.Item>
        <Descriptions.Item label="Заказчик">
          <Link to={`/customers/${order.customer.id}`}>
            {order.customer.organizationName}
            <br/>
            {order.customer.email}
            <br/>
            {order.customer.address}
            <br/>
            {order.customer.bankName} ({order.customer.bankAccountNumber})
            <br/>
            УНП: {order.customer.payerAccountNumber}
          </Link>
        </Descriptions.Item>
      </Descriptions> : <Spinner size="large"/>
  )
}

export default ShowOrder;