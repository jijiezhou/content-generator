/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-02-29 13:21:43
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-03 10:13:58
 */
const mongoose = require("mongoose");

//Schema
const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reference: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      required: true,
    },
    subscriptionPlan: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    //based on the trial type
    monthlyRequestCount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

//! Compile to form the model
const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
