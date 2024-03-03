/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-03-01 16:26:00
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-03 10:29:09
 */
const asyncHandler = require("express-async-handler");
const calculateNextBillingDate = require("../utils/calculateNextBillingDate");
const shouldRenewSubscriptionPlan = require("../utils/shouldRenewSubscriptionPlan");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");
const User = require("../models/User");

//Stripe Payment
const handleStripePayment = asyncHandler(async (req, res) => {
  const { amount, subscriptionPlan } = req.body;
  //get the user
  const user = req?.user;

  //!Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
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

//Verify Payment
const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

    //todo paymentIntent status should be "succeeded"
    if (paymentIntent.status === "requires_payment_method") {
      //!Get the info from metadata
      const metadata = paymentIntent?.metadata;
      const subscriptionPlan = metadata?.subscriptionPlan;
      const userEmail = metadata?.userEmail;
      const userId = metadata?.userId;

      //!Find the user
      const userFound = await User.findById(userId);
      if (!userFound) {
        return res.status(404).json({
          status: "false",
          message: "User Not Found",
        });
      }

      //!Get payment details
      const amount = paymentIntent?.amount / 100;
      const currency = paymentIntent?.currency;
      const paymentId = paymentIntent?.id;

      const newPayment = await Payment.create({
        user: userId,
        email: userEmail,
        subscriptionPlan,
        amount,
        currency,
        status: "success",
        reference: paymentId,
      });

      //!Check Subscription Plan
      if (subscriptionPlan === "Basic") {
        //!Update user
        const updateUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan,
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate(),
          apiRequestCount: 0,
          monthlyRequestCount: 50,
          subscriptionPlan: "Basic",
          $addToSet: { payments: newPayment?._id },
        });
        res.json({
          status: "true",
          message: "Payment verified, User updated",
          updateUser,
        });
      }

      if (subscriptionPlan === "Premium") {
        //!Update user
        const updateUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan,
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate(),
          apiRequestCount: 0,
          monthlyRequestCount: 100,
          subscriptionPlan: "Premium",
          $addToSet: { payments: newPayment?._id },
        });
        res.json({
          status: "true",
          message: "Payment verified, User updated",
          updateUser,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

//Handle Free Subscription
const handleFreeSubscription = asyncHandler(async (req, res) => {
  //!Get the login user
  const user = req?.user;

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

module.exports = { handleStripePayment, handleFreeSubscription, verifyPayment };
