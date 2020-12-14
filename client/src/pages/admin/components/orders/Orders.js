import React, { useCallback, useEffect, useState } from 'react';
import { Button, notification, Pagination, Select } from 'antd';
import { Link } from "react-router-dom";
import OrdersList from "./list/List";
import request from "../../../../utils/request";
import { getOrdersParams, setOrdersParams } from "../../../../utils/order";

const Orders = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrder] = useState([]);
  const [params, setParams] = useState(getOrdersParams());

  const [statuses, setStatuses] = useState([]);
  const [statusesLoading, setStatusesLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const updateParams = (data) => {
    setOrdersParams({ ...params, ...data });
    setParams(prevParams => ({ ...prevParams, ...data }));
  }

  const updateFilter = (data) => {
    setOrdersParams({ ...params, page: 1, size: 10, filter: { ...params.filter, ...data } });
    setParams(prevParams => ({ ...prevParams, page: 1, size: 10, filter: { ...prevParams.filter, ...data } }));
  }

  const fetchOrders = useCallback(() => {
    setLoading(true);
    request.get("/orders", { params }).then(res => {
      setOrder(res.data);
    }).catch(() => {
    }).finally(() => {
      setLoading(false);
    })
  }, [setLoading, setOrder, params])

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders])

  useEffect(() => {
    setStatusesLoading(true);
    request.get("/order_statuses").then(res => {
      setStatuses(res.data);
    }).catch(() => {
      notification.error({ message: "Не удалось загрузить статусы" })
    }).finally(() => {
      setStatusesLoading(false);
    })

    setUsersLoading(true);
    request.get("/users").then(res => {
      setUsers(res.data);
    }).catch(() => {
      notification.error({ message: "Не удалось загрузить юзеров" })
    }).finally(() => {
      setUsersLoading(false);
    })
  }, [])

  return (
    <>
      <div className="table-controls">
        <Link to="/orders/new">
          <Button className="green-button" type="primary">Создать</Button>
        </Link>
      </div>
      <div className="table-filters">
        Сортировать:
        <Select
          style={{ width: 300 }}
          allowClear
          loading={usersLoading}
          value={params.order}
          onChange={value => updateParams({ order: value })}
          defaultValue={'[["createdAt", "DESC"]]'}
        >
          <Select.Option value={'[["createdAt", "DESC"]]'}>по дате (сначала новые)</Select.Option>
          <Select.Option value={'[["createdAt", "ASC"]]'}>по дате (сначала старые)</Select.Option>
        </Select>{" "}
        <Select
          placeholder="Статус"
          style={{ width: 300 }}
          allowClear
          loading={statusesLoading}
          value={params.filter.orderStatusId}
          onChange={value => updateFilter({ orderStatusId: value })}
        >
          {statuses.map(status => (
            <Select.Option key={status.id} value={status.id}>{status.name}</Select.Option>
          ))}
        </Select>{" "}
        <Select
          placeholder="Ответственный"
          style={{ width: 300 }}
          allowClear
          value={params.filter.userId}
          loading={usersLoading}
          onChange={value => updateFilter({ userId: value })}
        >
          {users.map(user => (
            <Select.Option key={user.id} value={user.id}>{user.fullName}, {user.username}</Select.Option>
          ))}
          <Select.Option value={null}>Никто</Select.Option>
        </Select>
      </div>
      <OrdersList orders={orders.data} loading={loading} fetchOrders={fetchOrders}/>
      <div className="pagination">
        <Pagination
          total={orders.totalItems}
          current={params.page}
          defaultPageSize={params.size}
          onChange={page => {
            updateParams({ page });
          }}
        />
      </div>
    </>
  )
}


export default Orders