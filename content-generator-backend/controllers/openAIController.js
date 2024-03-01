/*
 * @Descripttion: ZJJ Code
 * @version: 1.0.0
 * @Author: ZJJ
 * @Date: 2024-02-29 19:19:57
 * @LastEditors: ZJJ
 * @LastEditTime: 2024-03-01 15:52:59
 */
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User");

const openAIController = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.OPENAI_API_KEY,
        },
      }
    );
    const content = response?.data?.choices[0].message.content;
    //!Create the history
    const newContent = await ContentHistory.create({
      user: req?.user?._id,
      content,
    });

    //!Push the content into the user
    const userFound = await User.findById(req?.user?._id);
    userFound.history.push(newContent?._id);

    //!Update api request count
    userFound.apiRequestNumber += 1;
    await userFound.save();

    //!send the response back to user
    res.status(200).json(content);
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
    throw new Error(error);
  }
});

module.exports = openAIController;
