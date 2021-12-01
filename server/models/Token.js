const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Token = new Schema({
  user: {
    type: Number,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: { type: Date, expires: "15m", default: Date.now },
});


module.exports = mongoose.model("tokens", Token);
