/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-03-21 18:30:36
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-21 18:47:42
 */
import { useAuth } from "../../AuthContext/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import AuthCheckingComponent from "../Alert/AuthCheckingComponent";

const AuthRoute = ({ children }) => {
  const location = useLocation();

  const { isAuthenticated, isLoading, isError } = useAuth();
  if (isLoading) {
    return <AuthCheckingComponent />;
  }
  //if not authenticated, navigate to login
  if (isError || isAuthenticated === false) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  //if no error, then return DashBoard
  return children;
};

export default AuthRoute;
