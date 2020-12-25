import React, { useMemo } from 'react';
import { Layout, Menu } from 'antd';
import { TeamOutlined, MailOutlined, UserOutlined, IdcardFilled, DatabaseOutlined, LineChartOutlined } from '@ant-design/icons';
import {
  Switch,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Header from './components/header/Header';
import Orders from './components/orders/Orders';
import Users from './components/users/Users';
import Profile from "./components/profile/Profile";
import EditUser from "./components/users/edit/Edit";
import CreateUser from "./components/users/create/Create";
import CreateOrder from "./components/orders/create/Create";
import EditOrder from "./components/orders/edit/Edit";
import ShowOrder from "./components/orders/show/Show";
import Customers from "./components/customers/Customers";
import ShowCustomer from "./components/customers/show/Show";
import EditCustomer from "./components/customers/edit/Edit";
import CreateCustomer from "./components/customers/create/Create";
import Products from "./components/products/Products";
import CreateProduct from "./components/products/create/Create";
import EditProduct from "./components/products/edit/Edit";
import Statistics from "./components/statistics/Statistics";

const { Content, Sider } = Layout;

const routes = [
  { path: "/", component: <Orders/> },
  { path: "/orders/new", component: <CreateOrder/> },
  { path: "/orders/:id/edit", component: <EditOrder/> },
  { path: "/orders/:id", component: <ShowOrder/> },
  { path: "/users", component: <Users/> },
  { path: "/users/new", component: <CreateUser/> },
  { path: "/users/:id", component: <EditUser/> },
  { path: "/customers", component: <Customers/> },
  { path: "/customers/new", component: <CreateCustomer/> },
  { path: "/customers/:id", component: <ShowCustomer/> },
  { path: "/customers/:id/edit", component: <EditCustomer/> },
  { path: "/products", component: <Products/> },
  { path: "/products/new", component: <CreateProduct/> },
  { path: "/products/:id/edit", component: <EditProduct/> },
  { path: "/profile", component: <Profile/> },
  { path: "/statistics", component: <Statistics/> },
]

const Admin = () => {
  const [, , isAdmin] = useAuth();
  const location = useLocation();

  const selectedMenuItem = useMemo(() => {
    if (location.pathname.match("/users")) {
      return "users"
    }
    if (location.pathname.match("/customers")) {
      return "customers"
    }
    if (location.pathname.match("/products")) {
      return "products"
    }
    if (location.pathname.match("/profile")) {
      return "profile"
    }
    if (location.pathname.match("/statistics")) {
      return "statistics"
    }
    return "orders";
  }, [location.pathname]);

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="logo">Axiom Admin</div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedMenuItem]}>
          <Menu.Item key="orders" icon={<MailOutlined/>}>
            <Link to="/">Заказы</Link>
          </Menu.Item>
          {isAdmin &&
          <Menu.Item key="users" icon={<TeamOutlined/>}>
            <Link to="/users">Пользователи</Link>
          </Menu.Item>
          }
          <Menu.Item key="customers" icon={<IdcardFilled/>}>
            <Link to="/customers">Заказчики</Link>
          </Menu.Item>
          <Menu.Item key="products" icon={<DatabaseOutlined/>}>
            <Link to="/products">Товары</Link>
          </Menu.Item>
          <Menu.Item key="profile" icon={<UserOutlined/>}>
            <Link to="/profile">Профиль</Link>
          </Menu.Item>
          {isAdmin &&
          <Menu.Item key="statistics" icon={<LineChartOutlined />}>
            <Link to="/statistics">Статистика</Link>
          </Menu.Item>
          }
        </Menu>
      </Sider>
      <Layout>
        <Header/>
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="site-layout-background" style={{ padding: 24 }}>
            {isAdmin ?
              <Switch>
                {routes.map(route => (
                  <Route key={route.path} exact path={route.path}>
                    {route.component}
                  </Route>
                ))}
              </Switch>
              :
              <Switch>
                {routes.filter(route => (!route.path.match("/users") || !route.path.match("/statistics"))).map(route => (
                  <Route key={route.path} exact path={route.path}>
                    {route.component}
                  </Route>
                ))}
              </Switch>
            }
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default Admin;