import React, { useState, useEffect, Fragment } from "react";
import { DatePicker, Descriptions } from "antd";
import { Pie } from '@ant-design/charts';
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
  });

  const products = groupBy(orders.data.reduce((acc, order) => {
    return acc.concat(order.products);
  }, []), "name");

  const data = Object.keys(products).map(key => ({
    type: key,
    value: products[key].reduce((acc, item) => {
      return acc + item.order_product.quantity
    }, 0),
  }));

  const totalProducts = data.reduce((acc, item) => {
    return acc + item.value
  }, 0)

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      autoRotate: false,
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 17,
      },
    },
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        formatter: () => `Всего ${totalProducts}`,
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
      <Descriptions
        title={params.createdAt ? `За период ${JSON.parse(params.createdAt).map(time => moment(time).format('D MMMM YYYY')).join(" - ")}` : "За всё время"}
        bordered
        layout="vertical"
        style={{ marginBottom: 50 }}
      >
        {data.map(item => <Descriptions.Item key={item.type} label={item.type}>{item.value}</Descriptions.Item>)}
        <Descriptions.Item label="Всего">{totalProducts}</Descriptions.Item>
      </Descriptions>
      <Pie {...config} loading={loading}/>
    </>
  )
}

export default Statistics;