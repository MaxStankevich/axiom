import React, { useState, useEffect, Fragment } from "react";
import { DatePicker } from "antd";
import { Line } from '@ant-design/charts';
import { groupBy } from 'lodash-es';
import moment from 'moment';
import request from "../../../../utils/request";

const Statistics = () => {
  const [orders, setOrders] = useState({ data: [] });
  const [loading, setLoading] = useState();
  const [params, setParams] = useState({
    page: 1,
    size: 10000,
    createdAt: null,
    order: '[["createdAt", "ASC"]]'
  });

  const groupedOrders = groupBy(orders.data, (order) => {
    return moment(order.createdAt).format("MMM D");
  })

  const data = Object.keys(groupedOrders).map(key => {
    return {
      day: key, value: groupedOrders[key].reduce((accum, order) => {
        return accum + order.products.reduce((acc, item) => {
          return acc + item.order_product.quantity
        }, 0)
      }, 0)
    }
  });

  const config = {
    data,
    width: 1000,
    height: 400,
    autoFit: false,
    xField: 'day',
    yField: 'value',
    point: {
      size: 5,
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  const updateParams = (data) => {
    setParams(prevParams => ({ ...prevParams, ...data }));
  }

  useEffect(() => {
    setLoading(true);
    request.get("/orders", {
      params
    }).then(res => {
      setOrders(res.data);
    }).catch(() => {
    }).finally(() => {
      setLoading(false);
    })
  }, [params])

  return (
    <>
      <DatePicker.RangePicker style={{ marginBottom: "50px", width: 300 }} onChange={(value, str) => {
        updateParams({ createdAt: JSON.stringify(str) })
      }}/>
      <Line {...config} loading={loading}/>
    </>
  )
}

export default Statistics;