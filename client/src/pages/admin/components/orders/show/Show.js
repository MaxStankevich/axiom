import React, { useState, useEffect, Fragment } from "react";
import { Descriptions, Button, notification } from "antd";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import request from "../../../../../utils/request";
import Spinner from "../../../../../components/spinner/Spinner";
import StatusTag from "../../../../../components/status-tag/StatusTag";

const ShowOrder = () => {
  const [order, setOrder] = useState();
  const { id } = useParams();

  const fetchOrder = () => {
    request.get(`/orders/${id}`).then(res => {
      if (order && JSON.stringify(order) !== JSON.stringify(res.data)) {
        notification.warning({
          message: "Внимание! Этот заказ был изменён другим пользователем. Проверьте актуальность данных.",
          duration: 0
        })
        setOrder(res.data);
      }
      if (!order) {
        setOrder(res.data);
      }
    }).catch(err => {
      console.log(err);
    })
  }

  useEffect(() => {
    fetchOrder();
  }, [id])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrder();
    }, 5000);

    return () => {
      clearInterval(interval)
    }
  }, [id, order])

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
        <Descriptions.Item label="Счёт-фактура">
          {order.invoice}
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
        <Descriptions.Item label="История">
          {order.orderStatusHistories.map(history => (
            <Fragment key={history.id}>
              <b>{history.statusName}:</b> {moment(history.createdAt).format('D MMMM YYYY, HH:mm')}
              <br/>
            </Fragment>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="Договор заключается в лице">
          {order.contractPerson}
        </Descriptions.Item>
        <Descriptions.Item label="Договор действует на основе">
          {order.contractAuthority}
        </Descriptions.Item>
        <Descriptions.Item label="Источник финансирования">
          {order.financeSource.name === "Иной"
            ? order.customFinanceSource
            : order.financeSource.name
          }
        </Descriptions.Item>
      </Descriptions> : <Spinner size="large"/>
  )
}

export default ShowOrder;