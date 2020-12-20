import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import request from "../../../../../utils/request";
import Spinner from "../../../../../components/spinner/Spinner";
import OrderForm from "../form/Form";
import { notification } from "antd";

const EditOrder = () => {
  const [order, setOrder] = useState();
  const { id } = useParams();
  const history = useHistory();

  const fetchOrder = () => {
    request.get(`/orders/${id}`).then(res => {
      if (order && JSON.stringify(order) !== JSON.stringify(res.data)) {
        notification.warning({ message: "Внимание! Этот заказ был изменён другим пользователем. Проверьте актуальность данных.", duration: 0 })
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
      <OrderForm
        order={order}
        onSuccess={({ id }) => {
          history.push(`/orders/${id}`);
        }}
      /> : <Spinner size="large"/>
  )
}

export default EditOrder;