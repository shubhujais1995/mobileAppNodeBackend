const mongoose = require("mongoose");

const webhookSchema = mongoose.Schema(
  {
    account_id: { type: String },
    id: { type: String },
    email: { type: String },
    order_id: { type: String },
    method: { type: String },
    bank: { type: String },
    amount: { type: Number }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Webhook", webhookSchema);
