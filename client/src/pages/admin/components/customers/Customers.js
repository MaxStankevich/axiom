import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Table, Space, Button, notification, Input, Pagination } from 'antd';
import { Link } from 'react-router-dom';
import { debounce } from "throttle-debounce";
import request from "../../../../utils/request";
import DeleteAction from "../../../../components/delete-action/DeleteAction";

const Customers = () => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [params, setParams] = useState({ page: 1, size: 10 });

  const updateParams = (data) => {
    setParams(prevParams => ({ ...prevParams, ...data }));
  }

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    request.get("/customers", { params }).then(res => {
      setCustomers(res.data);
    }).catch(() => {
      notification.error({ message: "Не удалось загрузить заказчиков" })
    }).finally(() => {
      setLoading(false);
    })
  }, [setLoading, setCustomers, params])

  const columns = useMemo(() => [
    {
      title: 'Название организации',
      dataIndex: 'organizationName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Количество заказов',
      dataIndex: ["orders", "length"],
    },
    {
      title: '',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <DeleteAction
            url={`/customers/${record.id}`}
            onSuccess={fetchCustomers}
            successMessage="Заказчик был успешно удалён"
            errorMessage="Не удалось удалить заказчика"
          />
          <Link to={`/customers/${record.id}/edit`}><Button
            size="small">Редактировать</Button></Link>
          <Link to={`/customers/${record.id}`}><Button
            size="small">Детали</Button></Link>
        </Space>
      ),
    },
  ], [fetchCustomers]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers])

  const search = debounce(500, function (e) {
    updateParams({ search: e.target.value, page: 1, size: 10 })
  })

  return (
    <>
      <div className="table-controls">
        <Link to="/customers/new">
          <Button className="green-button" type="primary">Добавить</Button>
        </Link>
      </div>
      <div className="table-filters">
        <Input
          style={{ width: 300 }}
          onChange={search}
          placeholder="Поиск"
        />
      </div>
      <Table columns={columns} dataSource={customers.data} rowKey="id" loading={loading} pagination={false}/>
      <div className="pagination">
        <Pagination
          showSizeChanger={false}
          total={customers.totalItems}
          current={params.page}
          defaultPageSize={params.size}
          onChange={page => {
            updateParams({ page });
          }}
        />
      </div>
    </>
  )
};

export default Customers