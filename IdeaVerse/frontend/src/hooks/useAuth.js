import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export const useAuth = () => {
  const { state, dispatch } = useContext(AuthContext);
  return {
    user: state.user,
    token: state.token,
    login: (user, token) => dispatch({ type: "LOGIN", payload: { user, token } }),
    logout: () => dispatch({ type: "LOGOUT" }),
  };
};

