/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-02-29 15:02:10
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-21 17:51:48
 */
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    //*password + connection string
    const conn = await mongoose.connect(
      "mongodb+srv://jijiez:A6UVwgMHYFUmW1Cg@content-generator.fdffmik.mongodb.net/content-generator?retryWrites=true&w=majority&appName=content-generator"
    );
    console.log(`Mongodb connected ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to MongoDB ${error}`);
    process.exit(1);
  }
};

module.exports = connectDB;
