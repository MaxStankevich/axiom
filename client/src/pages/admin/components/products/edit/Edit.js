import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import request from "../../../../../utils/request";
import Spinner from "../../../../../components/spinner/Spinner";
import ProductForm from "../form/Form";

const EditProduct = () => {
  const [product, setProduct] = useState();
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    request.get(`/products/${id}`).then(res => {
      setProduct(res.data);
    }).catch(err => {
      console.log(err);
    })
  }, [id])

  return (
    product ?
      <ProductForm
        product={product}
        onSuccess={() => {
          history.push("/products");
        }}
      /> : <Spinner size="large" />
  )
}

export default EditProduct;