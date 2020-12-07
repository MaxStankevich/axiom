import React from "react";
import { useHistory } from "react-router-dom";
import CustomerForm from "../form/Form";

const CreateCustomer = () => {
  const history = useHistory();

  return (
    <CustomerForm onSuccess={({ id }) => {
      history.push(`/customers/${id}`);
    }}/>
  )
}

export default CreateCustomer;