const mongoose = require("mongoose");

const webhookSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    meals: { type: Number }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Webhook", webhookSchema);
