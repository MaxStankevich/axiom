import { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../config/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const userFromRedux = useSelector(selectUser);

  const user = useMemo(() => {
    return userFromRedux || JSON.parse(localStorage.getItem("user")) || {}
  }, [userFromRedux]);

  const isAdmin = useMemo(() => {
    return user && user.role && user.role.name === "admin"
  }, [user]);

  const updateUser = useCallback((data) => {
    const newUser = { ...user, ...data };

    dispatch(setUser(newUser));
    localStorage.setItem("user", JSON.stringify(newUser));
  }, [user, dispatch])

  return [user, updateUser, isAdmin];
}

export default useAuth;