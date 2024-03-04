/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-03-04 15:16:14
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-04 17:26:23
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "./components/Users/Register";
import Login from "./components/Users/Login";
import Dashboard from "./components/Users/Dashboard";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import Home from "./components/Home/Home";
import FreeTrial from "./components/Home/FreeTrial";
import HomeFeatures from "./components/Home/HomeFeatures";

export default function App() {
  return (
    <>
      <BrowserRouter>
        {/*Navbar */}
        <PrivateNavbar />
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
