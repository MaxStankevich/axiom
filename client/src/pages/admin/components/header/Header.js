import React from 'react';
import { Layout, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setUser } from "../../../../config/authSlice";

const { Header } = Layout;

const AdminHeader = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const logout = () => {
    dispatch(setUser(null));
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    history.push("/");
  }

  return (
    <Header className="site-layout-sub-header-background">
      <Button type="primary"
              icon={<LogoutOutlined/>} onClick={logout}>Выйти</Button>
    </Header>
  )
}

export default AdminHeader;