import React from "react";
import { Spin } from 'antd';
import './Spinner.css';

const Spinner = (props) => (
  <div className="spinner">
    <Spin {...props} />
  </div>
)

export default Spinner