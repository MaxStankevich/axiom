import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import request from "../../../../../utils/request";
import Spinner from "../../../../../components/spinner/Spinner";
import CustomerForm from "../form/Form";

const EditCustomer = () => {
  const [customer, setCustomer] = useState();
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    request.get(`/customers/${id}`).then(res => {
      setCustomer(res.data);
    }).catch(err => {
      console.log(err);
    })
  }, [id])

  return (
    customer ?
      <CustomerForm
        customer={customer}
        onSuccess={({ id }) => {
          history.push(`/customers/${id}`);
        }}
      /> : <Spinner size="large" />
  )
}

export default EditCustomer;