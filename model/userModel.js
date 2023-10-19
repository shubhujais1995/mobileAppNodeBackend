const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    phoneNumber: { type: String, unique: true, required: true },
    name: { type: String, required: false },
    email: { type: String },
    address: { type: String },
    user_role: { type: String }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
