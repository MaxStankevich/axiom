import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import request from "../../../../../utils/request";
import Spinner from "../../../../../components/spinner/Spinner";
import OrderForm from "../form/Form";

const EditOrder = () => {
  const [order, setOrder] = useState();
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    request.get(`/orders/${id}`).then(res => {
      setOrder(res.data);
    }).catch(err => {
      console.log(err);
    })
  }, [id])

  return (
    order ?
      <OrderForm
        order={order}
        onSuccess={({ id }) => {
          history.push(`/orders/${id}`);
        }}
      /> : <Spinner size="large" />
  )
}

export default EditOrder;