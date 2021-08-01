import axios from "axios";
import { notification } from "antd";
import { getUserToken } from "./user";

const request = axios.create({
  // baseURL: "http://localhost:5000/api/",
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:5000/api/" : "/api/",
});

request.interceptors.request.use(function (config) {
  const token = getUserToken();
  if (token) {
    config.headers["x-access-token"] = token;
  }
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

request.interceptors.response.use(
  response => {
    return response;
  },
  function(error) {
    // Do something with response error
    if (error.response.status === 401) {
      notification.error({ message: error.response.data.message || "Ошибка авторизации!" });
    }
    return Promise.reject(error.response);
  }
);

export  default request;