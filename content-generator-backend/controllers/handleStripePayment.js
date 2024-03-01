/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-03-01 16:26:00
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-01 16:53:52
 */
const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

module.exports = handleStripePayment;
