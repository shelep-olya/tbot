const TelegramApi = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: "./config.env" });
const token = process.env.TOKEN;

const bot = new TelegramApi(token, { polling: true });

const start = () => {
  bot.on("message", async (msg) => {
    let message;
    const text = msg.text;
    const username = msg.from.first_name;
    const chatId = msg.chat.id;

    bot.setMyCommands([
      { command: "/start", description: "Greeting" },
      { command: "/info", description: "Get user information" },
    ]);
    if (text === "/start") {
      message = `Hello, ${username}! My name is gameF0r_bot.`;
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/e19/f38/e19f384b-951a-3074-81d9-a8316ec23a70/2.webp"
      );
      return bot.sendMessage(chatId, message);
    }
    if (text === "/info") {
      message = `Your username is ${msg.chat.username}.`;
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/bd8/819/bd881963-bdcc-41e5-bfe5-f3c74c477f18/6.webp"
      );
      return bot.sendMessage(chatId, message);
    }
    if (text === "/game") {
      await bot.sendMessage(
        chatId,
        "Now i think up about the number between 0 and 9...\nTry to guess it bro"
      );
      const randomNumber = Math.floor(Math.random() * 10);
    }
    return bot
      .sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/e19/f38/e19f384b-951a-3074-81d9-a8316ec23a70/11.webp"
      )
      .then(bot.sendMessage(chatId, `Didn't get ya bro. Try again later\n😉`));
  });
};

start();
