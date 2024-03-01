/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-02-29 13:21:15
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-01 16:41:56
 */
const mongoose = require("mongoose");

//Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    //free trial default 3 days
    trialPeriod: {
      type: Number,
      default: 3,
    },
    //3-day free trial
    trialActive: {
      type: Boolean,
      default: true,
    },
    trialExpires: {
      type: Date,
    },
    subscriptionPlan: {
      type: String,
      enum: ["Trial", "Free", "Basic", "Premium"],
    },
    apiRequestNumber: {
      type: Number,
      default: 0,
    },
    //based on the trial type
    monthlyRequestCount: {
      type: Number,
      default: 100, //100 credits
    },
    nextBillingDate: Date,
    //*reference to other models
    payments: [
      {
        //*ObjectId: 12-byte, uniquely identified, allow referencing
        type: mongoose.Schema.Types.ObjectId,
        //*tell which model refer to
        ref: "Payment",
      },
    ],
    history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ContentHistory",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//! Add virtual property
userSchema.virtual("isTrialActive").get(function () {
  return this.trialActive && new Date() < this.trialExpires;
});

//! Compile to form the model
const User = mongoose.model("User", userSchema);

module.exports = User;
