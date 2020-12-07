import React from "react";
import { Tag } from 'antd';

const COLORS = {
  1: "orange",
  2: "geekblue",
  3: "blue",
  4: "cyan",
  5: "green"
}

const StatusTag = ({ id, name }) => (
  <Tag color={COLORS[id]}>{name}</Tag>
)

export default StatusTag