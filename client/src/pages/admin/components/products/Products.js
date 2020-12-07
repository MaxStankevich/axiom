import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Table, Space, Button, notification } from 'antd';
import { Link } from 'react-router-dom';
import request from "../../../../utils/request";
import DeleteAction from "../../../../components/delete-action/DeleteAction";

const Products = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    request.get("/products").then(res => {
      setProducts(res.data);
    }).catch(() => {
      notification.error({ message: "Не удалось загрузить товары" })
    }).finally(() => {
      setLoading(false);
    })
  }, [setLoading, setProducts])

  const columns = useMemo(() => [
    {
      title: 'Наименование',
      dataIndex: 'name',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
    },
    {
      title: '',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <DeleteAction
            url={`/products/${record.id}`}
            onSuccess={fetchProducts}
            successMessage="Товар был успешно удалён"
            errorMessage="Не удалось удалить товар"
          />
          <Link to={`/products/${record.id}/edit`}><Button
            size="small">Редактировать</Button></Link>
        </Space>
      ),
    },
  ], [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts])

  return (
    <>
      <div className="table-controls">
        <Link to="/products/new">
          <Button className="green-button" type="primary">Добавить</Button>
        </Link>
      </div>
      <Table columns={columns} dataSource={products} rowKey="id" loading={loading}/>
    </>
  )
};

export default Products