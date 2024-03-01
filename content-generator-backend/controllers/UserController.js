const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

//Registration
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  //Validate
  if (!username || !email || !password) {
    res.status(404);
    throw new Error("Please fill all fields");
  }

  //Check email is taken
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }

  //Hash user password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create the user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  //Add the date trial end
  newUser.trialExpires = new Date(
    new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000
  );

  //Save the user
  await newUser.save();

  res.json({
    status: true,
    message: "Registration success",
    user: {
      username,
      email,
    },
  });
});

//Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check for user email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    //* Not be specific
    throw new Error("Invalid email or password");
  }

  //check if password valid
  const isMatch = await bcrypt.compare(password, user?.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  //Generate token(jwt)
  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
    expiresIn: "3d", //token expires in 3 days
  });

  //set the token inside cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, //1 day
  });

  //Send response
  res.json({
    status: "success",
    _id: user?._id,
    message: "Login success",
    username: user?.username,
    email: user?.email,
  });
});

//Logout
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    maxAge: 1, //1 milli sec
  });
  res.status(200).json({
    message: "logout success",
  });
});

//Profile
const userProfile = asyncHandler(async (req, res) => {
  const id = req.user?._id;

  //*exclude password
  const user = await User.findById(id).select("-password");
  if (user) {
    res.status(200).json({
      status: "success",
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//Check User Auth Status

module.exports = {
  register,
  login,
  logout,
  userProfile,
};
