const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    phoneNumber: { type: String, unique: true, required: true },
    otp: { type: String, required: false },
    name: { type: String, required: false },
    email: { type: String },
    address: { type: String },
    user_role: { type: String },
    wallet: { type: Number }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
