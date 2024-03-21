/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-03-04 17:33:21
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-05 13:48:04
 */
import { createContext, useContext, useEffect, useState } from "react";
import { CheckUserAuthStatusAPI } from "../apis/user/usersAPI";
import { useQuery } from "@tanstack/react-query";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  //! Make request using react query
  //! set unique key for query
  const { isError, isLoading, data, isSuccess } = useQuery({
    queryFn: CheckUserAuthStatusAPI,
    queryKey: ["checkAuth"],
  });

  //! Update authenticated user, whenever response data change, set to true
  useEffect(() => {
    if (isSuccess) {
      setIsAuthenticated(data);
    }
  }, [data, isSuccess]);

  //!Update user auth after login
  const login = () => {
    setIsAuthenticated(true);
  };

  //!Update user auth after logout
  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isError, isLoading, isSuccess, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//! Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
