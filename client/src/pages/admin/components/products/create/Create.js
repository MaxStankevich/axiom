import React from "react";
import { useHistory } from "react-router-dom";
import ProductForm from "../form/Form";

const CreateProduct = () => {
  const history = useHistory();

  return (
    <ProductForm onSuccess={() => {
      history.push("/products");
    }}/>
  )
}

export default CreateProduct;