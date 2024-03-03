/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-02-29 12:59:38
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-03 10:54:42
 */
const express = require("express");
require("dotenv").config();
const usersRouter = require("./routes/usersRouter");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const errorHandler = require("./middlewares/errorMiddleware");
const connectDB = require("./utils/connectDB");
const openAIRouter = require("./routes/openAIRouter");
const stripeRouter = require("./routes/stripeRouter");
const User = require("./models/User");
connectDB();

const app = express();
const PORT = process.env.PORT || 8090;

//*Cron for the tral period - run every single day
cron.schedule("0 0 * * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        trialActive: true,
        trialExpires: { $lt: today },
      },
      {
        trialActive: false,
        subscriptionPlan: "Free",
        monthlyRequestCount: 5,
      }
    );
  } catch (error) {
    console.log(error);
  }
});
//*Cron for the Free plan - run at end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Free",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});
//*Cron for the Basic plan - run at end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Basic",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});
//*Cron for the Premium plan - run at end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Premium",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//Middlewares
//*parse incoming request with json
app.use(express.json());
//*parse cookie automatically
app.use(cookieParser());

//Routes
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/openai", openAIRouter);
app.use("/api/v1/stripe", stripeRouter);

//ErrorHandler
app.use(errorHandler);

//start the server
app.listen(PORT, console.log(`server is running on port ${PORT}`));
