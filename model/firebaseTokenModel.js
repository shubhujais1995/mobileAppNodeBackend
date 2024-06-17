const mongoose = require("mongoose");

const fbTokenSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    firebaseToken: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("FBTOKEN", fbTokenSchema);
