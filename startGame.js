exports.startGame = async (bot, chats, chatId, options) => {
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "What do you suggest?", options);
};
