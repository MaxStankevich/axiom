import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Table, Tag, Space, Button } from 'antd';
import { Link } from 'react-router-dom';
import request from "../../../../utils/request";
import { selectUser } from "../../../../config/authSlice";
import "./Users.css";
import { USER_ROLES } from "../../../../constants";
import DeleteAction from "../../../../components/delete-action/DeleteAction";

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const user = useSelector(selectUser);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    request.get("/users").then(res => {
      setUsers(res.data);
    }).catch(err => {
    }).finally(() => {
      setLoading(false);
    })
  }, [setLoading, setUsers])

  const columns = useMemo(() => [
    {
      title: 'Имя пользователя',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'ФИО',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Роль',
      dataIndex: ['role', 'name'],
      key: 'role',
      render: role => (
        <Tag color={role === "admin" ? 'geekblue' : 'green'}>
          {USER_ROLES[role]}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Link to={record.id === user.id ? "/profile" : `/users/${record.id}`}><Button
            size="small">Редактировать</Button></Link>
          {record.id !== user.id &&
            <DeleteAction
              url={`/users/${record.id}`}
              onSuccess={fetchUsers}
              successMessage={`Пользователь ${record.username} был успешно удалён`}
              errorMessage={"Не удалось удалить пользователя"}
            />
          }
        </Space>
      ),
    },
  ], [user, fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers])

  return (
    <>
      <div className="table-controls">
        <Link to="/users/new">
          <Button className="green-button" type="primary">Добавить</Button>
        </Link>
      </div>
      <Table columns={columns} dataSource={users} rowKey="id" loading={loading} pagination={false} />
    </>
  )
};

export default Users