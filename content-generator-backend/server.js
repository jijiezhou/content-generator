/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-02-29 12:59:38
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-01 16:31:10
 */
const express = require("express");
require("dotenv").config();
const usersRouter = require("./routes/usersRouter");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorMiddleware");
const connectDB = require("./utils/connectDB");
const openAIRouter = require("./routes/openAIRouter");
const stripeRouter = require("./routes/stripeRouter");
connectDB();

const app = express();
const PORT = process.env.PORT || 8090;

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
