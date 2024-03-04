/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-03-04 15:16:14
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-04 16:48:36
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "./components/Users/Register";
import Login from "./components/Users/Login";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
