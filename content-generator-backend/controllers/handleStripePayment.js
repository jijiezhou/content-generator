/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-03-01 16:26:00
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-02 23:00:19
 */
const asyncHandler = require("express-async-handler");
const calculateNextBillingDate = require("../utils/calculateNextBillingDate");
const shouldRenewSubscriptionPlan = require("../utils/shouldRenewSubscriptionPlan");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");

//Stripe Payment
const handleStripePayment = asyncHandler(async (req, res) => {
  const { amount, subscriptionPlan } = req.body;
  //get the user
  const user = req?.user;

  //!Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "usd",
    //add some meta data
    metadata: {
      userId: user?._id?.toString(),
      userEmail: user?.email,
      subscriptionPlan,
    },
  });

  //!send the response
  res.json({
    clientSecret: paymentIntent?.client_secret,
    paymentId: paymentIntent?.id,
    metadata: paymentIntent?.metadata,
  });

  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
});

//Handle Free Subscription
const handleFreeSubscription = asyncHandler(async (req, res) => {
  //!Get the login user
  const user = req?.user;
  console.log(user);

  //!Check if user account should be renew or not
  try {
    if (shouldRenewSubscriptionPlan(user)) {
      //!Update the user account
      user.subscriptionPlan = "Free";
      user.monthlyRequestCount = 5;
      user.apiRequestCount = 0;
      //!Calculate Next Billing Date
      user.nextBillingDate = calculateNextBillingDate();

      //!Create new payment and save into db
      const newPayment = await Payment.create({
        user: user?._id,
        subscriptionPlan: "Free",
        amount: 0,
        status: "success",
        reference: Math.random().toString(36).substring(7),
        monthlyRequestCount: 5,
        currency: "usd",
      });
      user.payments.push(newPayment?._id);

      //!Save user
      await user.save();

      //!Send response
      res.json({
        status: "success",
        message: "Subscription plan updated successfully",
        user,
      });
    } else {
      return res.status(403).json({
        error: "Subscription renewal not due yet",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
});

module.exports = { handleStripePayment, handleFreeSubscription };
