import React from "react";
import UserForm from "../../../../components/user-form/UserForm";
import useAuth from "../../../../hooks/useAuth";

const Profile = () => {
  const [user, updateUser] = useAuth();

  return (
    <UserForm
      user={user}
      onSuccess={res => {
        updateUser(res);
      }}
    />
  )
}

export default Profile;