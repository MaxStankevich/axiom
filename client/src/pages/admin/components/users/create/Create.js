import React from "react";
import { useHistory } from "react-router-dom";
import UserForm from "../../../../../components/user-form/UserForm";

const CreateUser = () => {
  const history = useHistory();

  return (
    <UserForm
      onSuccess={() => {
        history.push("/users");
      }}
    />
  )
}

export default CreateUser;