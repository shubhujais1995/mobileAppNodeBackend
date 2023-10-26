const mongoose = require("mongoose");

// const acquirerDataSchema = new mongoose.Schema({
//   bank_transaction_id: String,
// });

const webhookSchema = mongoose.Schema(
  {
    account_id: { type: String },
    id: { type: String },
    email: { type: String },
    order_id: { type: String },
    method: { type: String },
    bank: { type: String },
    amount: { type: Number },
    currency: { type: String },
    status: { type: String },
    amount_refunded: { type: Number },
    refund_status: { type: String },
    card_id: { type: String },
    wallet: { type: String },
    vpa: { type: String },
    contact: { type: String },
    error_code: { type: String },
    error_reason: { type: String },
    bank_transaction_id: { type: String },
    created_at: { type: String },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Webhook", webhookSchema);
