import React, { useState, useEffect, useCallback } from "react";
import { Descriptions, Button } from "antd";
import { Link, useParams } from "react-router-dom";
import request from "../../../../../utils/request";
import Spinner from "../../../../../components/spinner/Spinner";
import OrdersList from "../../orders/list/List";

const ShowCustomer = () => {
  const [customer, setCustomer] = useState();
  const { id } = useParams();

  const fetchCustomer = useCallback(() => {
    request.get(`/customers/${id}`).then(res => {
      setCustomer(res.data);
    }).catch(err => {
      console.log(err);
    })
  }, [id, setCustomer])

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer])

  return (
    customer ?
      <>
        <div style={{ marginBottom: 40 }}>
          <Descriptions
            bordered
            title="Информация о заказчике"
            extra={
              <Link to={`/customers/${id}/edit`}><Button
                type="primary">Редактировать</Button></Link>}
          >
            <Descriptions.Item label="Название организации">{customer.organizationName}</Descriptions.Item>
            <Descriptions.Item label="Email">{customer.email}</Descriptions.Item>
            <Descriptions.Item label="Адрес">{customer.address}</Descriptions.Item>
            <Descriptions.Item label="Нобер банковского счёта">{customer.bankAccountNumber}</Descriptions.Item>
            <Descriptions.Item label="Банк">{customer.bankName}</Descriptions.Item>
            <Descriptions.Item label="УНП">{customer.payerAccountNumber}</Descriptions.Item>
          </Descriptions>
        </div>
        <h2>Заказы</h2>
        <OrdersList orders={customer.orders} showCustomer={false} loading={false} fetchOrders={fetchCustomer} />
      </>
      : <Spinner size="large"/>
  )
}

export default ShowCustomer;