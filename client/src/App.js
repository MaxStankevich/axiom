import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Admin from "./pages/admin/Admin";
import './App.css';
import Login from "./pages/login/Login";
import { selectUser, setUser } from "./config/authSlice";
import moment from "moment";
import 'moment/locale/ru';
import OrderForm from "./pages/order-form/OrderForm";

moment.locale('ru');

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem("user"));

    if (userFromStorage) {
      dispatch(setUser(userFromStorage));
    }
  }, [dispatch]);

  return user ?
    <Admin/>
    :
    <Switch>
      <Route exact path="/">
        <Login/>
      </Route>
      <Route exact path="/order_form">
        <OrderForm/>
      </Route>
    </Switch>;
}

export default App;
