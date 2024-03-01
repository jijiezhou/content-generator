const express = require("express");
require("dotenv").config();
const usersRouter = require("./routes/usersRouter");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorMiddleware");
const connectDB = require("./utils/connectDB");
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

//ErrorHandler
app.use(errorHandler);

//start the server
app.listen(PORT, console.log(`server is running on port ${PORT}`));
