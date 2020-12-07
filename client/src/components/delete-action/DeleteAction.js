import React, { useState } from 'react';
import { Button, Popconfirm, notification } from 'antd';
import request from "../../utils/request";

const DeleteAction = ({ onSuccess = () => {}, url, successMessage, errorMessage }) => {
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteConfirmLoading, setDeleteConfirmLoading] = useState(false);

  return (
    <Popconfirm
      title="Вы действительно хотите удалить?"
      placement="topRight"
      visible={deleteConfirmVisible}
      onConfirm={() => {
        setDeleteConfirmLoading(true);
        request.delete(url).then(() => {
          notification.success({ message: successMessage })
          onSuccess();
        }).catch(err => {
          notification.error({ message: errorMessage });
          console.error(err);
        }).finally(() => {
          setDeleteConfirmLoading(false);
          setDeleteConfirmVisible(false);
        })
      }}
      okText="Удалить"
      cancelText="Отмена"
      okButtonProps={{ loading: deleteConfirmLoading, danger: true }}
      onCancel={() => {
        setDeleteConfirmVisible(false);
      }}
    >
      <Button
        size="small"
        danger
        onClick={() => {
          setDeleteConfirmVisible(true);
        }}
      >Удалить</Button>
    </Popconfirm>
  )
};

export default DeleteAction