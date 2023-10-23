const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    id: {
      type: "string",
    },
    orderId: {
      type: "string",
      required: true,
    },
    method: {
      type: "string",
    },
    entity: {
      type: "string",
    },
    amount: {
      type: "number",
    },
    currency: {
      type: "string",
    },
    status: {
      type: "string",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);

// "id": "order_MrlQnErCymuoAt",
//     "entity": "order",
//     "amount": 230,
//     "amount_paid": 0,
//     "amount_due": 230,
//     "currency": "INR",
//     "receipt": null,
//     "offer_id": null,
//     "status": "created",
//     "attempts": 0,
//     "notes": [],
//     "created_at": 1698089367
