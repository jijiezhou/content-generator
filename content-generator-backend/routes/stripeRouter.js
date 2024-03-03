/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-03-01 16:28:51
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-02 23:14:12
 */
const express = require("express");
const {
  handleStripePayment,
  handleFreeSubscription,
  verifyPayment,
} = require("../controllers/handleStripePayment");

const isAuthenticated = require("../middlewares/isAuthenticated");

const stripeRouter = express.Router();

stripeRouter.post("/checkout", isAuthenticated, handleStripePayment);
stripeRouter.post("/free-plan", isAuthenticated, handleFreeSubscription);
stripeRouter.post("/verify-payment/:paymentId", isAuthenticated, verifyPayment);

module.exports = stripeRouter;
