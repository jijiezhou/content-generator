/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-02-29 21:22:27
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-01 15:57:28
 */
const express = require("express");
const openAIController = require("../controllers/openAIController");

const isAuthenticated = require("../middlewares/isAuthenticated");
const checkApiRequestLimit = require("../middlewares/checkApiRequestLimit");

const openAIRouter = express.Router();

openAIRouter.post(
  "/generate-content",
  isAuthenticated, //check if login
  checkApiRequestLimit, //check api limit
  openAIController
);

module.exports = openAIRouter;
