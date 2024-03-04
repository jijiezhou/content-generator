/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-03-04 16:11:21
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-04 17:35:55
 */
import axios from "axios";

//*Registration
export const registerAPI = async (userData) => {
  const response = await axios.post(
    "http://localhost:8090/api/v1/users/register",
    {
      email: userData?.email,
      password: userData?.password,
      username: userData?.username,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

//*Login
export const loginAPI = async (userData) => {
  const response = await axios.post(
    "http://localhost:8090/api/v1/users/login",
    {
      email: userData?.email,
      password: userData?.password,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

//*Check Auth
export const CheckUserAuthStatusAPI = async (userData) => {
  const response = await axios.get(
    "http://localhost:8090/api/v1/users/auth/check",
    {
      withCredentials: true,
    }
  );
  return response.data;
};
