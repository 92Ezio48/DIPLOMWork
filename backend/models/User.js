const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // если надо — добавь свои поля
});
module.exports = mongoose.model("User", userSchema);
