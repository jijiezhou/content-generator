/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-02-29 14:18:33
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-21 17:51:42
 */
const express = require("express");
const {
  register,
  login,
  logout,
  userProfile,
  checkAuth,
} = require("../controllers/UserController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const usersRouter = express.Router();

usersRouter.post("/register", register);

usersRouter.post("/login", login);

usersRouter.post("/logout", logout);

usersRouter.get("/profile", isAuthenticated, userProfile);

usersRouter.get("/auth/check", isAuthenticated, checkAuth);

module.exports = usersRouter;
