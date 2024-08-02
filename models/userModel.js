const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  chatId: {
    type: Number,
    unique: true,
    required: [true, "Chat ID is required"],
  },
  right: {
    type: Number,
    default: 0,
  },
  wrong: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
