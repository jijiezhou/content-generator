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
    subscription: {
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
      default: 0,
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
  }
);

//! Compile to form the model
const User = mongoose.model("User", userSchema);

module.exports = User;
