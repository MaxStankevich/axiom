import React from "react";
import { useHistory } from "react-router-dom";
import OrderForm from "../form/Form";

const CreateOrder = () => {
  const history = useHistory();

  return (
    <OrderForm onSuccess={({ id }) => {
      history.push(`/orders/${id}`);
    }} />
  )
}

export default CreateOrder;