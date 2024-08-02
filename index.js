const TelegramApi = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const { startGame } = require("./startGame");
const { gameOptions, againOptions } = require("./options");
const User = require("./models/userModel");

const token = process.env.TOKEN;
const DB = process.env.DB;

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Greeting" },
    { command: "/game", description: "Start the intuition game" },
    { command: "/info", description: "Get user information" },
  ]);

  bot.on("message", async (msg) => {
    let message;
    const text = msg.text;
    const username = msg.from.first_name;
    const chatId = msg.chat.id;

    try {
      if (text === "/start") {
        const user = await User.findOne({ chatId });
        if (!user) {
          await User.create({
            chatId,
            right: 0,
            wrong: 0,
          });
        }
        message = `Hello, ${username}! My name is gameF0r_bot.`;
        await bot.sendSticker(
          chatId,
          "https://tlgrm.eu/_/stickers/e19/f38/e19f384b-951a-3074-81d9-a8316ec23a70/2.webp"
        );
        return bot.sendMessage(chatId, message);
      }

      if (text === "/info") {
        const user = await User.findOne({ chatId });
        if (user) {
          message = `Your game score is ${user.right}.\n You did ${
            user.wrong + user.right
          } tries.`;
          await bot.sendSticker(
            chatId,
            "https://tlgrm.eu/_/stickers/bd8/819/bd881963-bdcc-41e5-bfe5-f3c74c477f18/6.webp"
          );
          return bot.sendMessage(chatId, message);
        } else {
          return bot.sendMessage(chatId, "User not found.");
        }
      }

      if (text === "/game") {
        await bot.sendMessage(
          chatId,
          "Now I think up about the number between 0 and 9...\nTry to guess it bro"
        );
        return startGame(bot, chats, chatId, gameOptions);
      }

      return bot
        .sendSticker(
          chatId,
          "https://tlgrm.eu/_/stickers/e19/f38/e19f384b-951a-3074-81d9-a8316ec23a70/11.webp"
        )
        .then(() =>
          bot.sendMessage(chatId, `Didn't get ya bro. Try again later\n😉`)
        );
    } catch (err) {
      console.error(err);
      return bot.sendMessage(chatId, "Something went wrong..");
    }
  });

  bot.on("callback_query", async (msg) => {
    let data = msg.data;
    data = data === "/again" ? data : Number(data);
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(bot, chats, chatId, gameOptions);
    }

    try {
      const user = await User.findOne({ chatId });
      if (data === chats[chatId]) {
        user.right++;
        await bot.sendMessage(
          chatId,
          "Congrats, you're 100% right",
          againOptions
        );
      } else {
        user.wrong++;
        await bot.sendMessage(
          chatId,
          `Oops, you're 100% wrong, I thought about ${chats[chatId]}.`,
          againOptions
        );
      }
      await user.save();
    } catch (err) {
      console.error(err);
      await bot.sendMessage(chatId, "Something went wrong..");
    }
  });
};

start();
