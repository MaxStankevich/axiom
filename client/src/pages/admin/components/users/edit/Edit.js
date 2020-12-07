import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import UserForm from "../../../../../components/user-form/UserForm";
import request from "../../../../../utils/request";
import Spinner from "../../../../../components/spinner/Spinner";

const EditUser = () => {
  const [user, setUser] = useState();
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    request.get(`/users/${id}`).then(res => {
      setUser(res.data);
    }).catch(err => {
      console.log(err);
    })
  }, [setUser, id])

  return (
    user ?
      <UserForm
        user={user}
        onSuccess={() => {
          history.push("/users");
        }}
      /> : <Spinner size="large" />
  )
}

export default EditUser;