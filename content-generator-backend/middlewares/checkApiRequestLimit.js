/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-03-01 15:54:45
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-01 16:11:09
 */
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { request } = require("express");

const checkApiRequestLimit = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not Authorized",
    });
  }
  //Find the user
  const user = await User.findById(req?.user?.id);
  if (!user) {
    return res.status(404).json({
      message: "User Not Found",
    });
  }
  let requestLimit = 0;

  //check if user is in trial period
  if (user?.isTrialActive) {
    requestLimit = user?.monthlyRequestCount;
  }

  //check if use has exceed monthly request
  if (user?.apiRequestNumber > requestLimit) {
    throw new Error("API Request Limit Reached, please subscribe a new plan");
  }
  next();
});

module.exports = checkApiRequestLimit;
