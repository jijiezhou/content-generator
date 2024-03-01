/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-03-01 16:28:51
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-01 16:29:59
 */
const express = require("express");
const handleStripePayment = require("../controllers/handleStripePayment");

const isAuthenticated = require("../middlewares/isAuthenticated");

const stripeRouter = express.Router();

stripeRouter.post("/checkout", isAuthenticated, handleStripePayment);

module.exports = stripeRouter;
