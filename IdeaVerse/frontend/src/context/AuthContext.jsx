import React, { createContext, useReducer, useEffect } from "react";

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem("ideaverse_user")) || null,
  token: localStorage.getItem("ideaverse_token") || null,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload.user, token: action.payload.token };
    case "LOGOUT":
      return { user: null, token: null };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.user && state.token) {
      localStorage.setItem("ideaverse_user", JSON.stringify(state.user));
      localStorage.setItem("ideaverse_token", state.token);
    } else {
      localStorage.removeItem("ideaverse_user");
      localStorage.removeItem("ideaverse_token");
    }
  }, [state.user, state.token]);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

export default AuthContext;

