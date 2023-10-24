const mongoose = require("mongoose");

const webhookSchema = mongoose.Schema(
  {
   
    meals: { type: Number }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Webhook", webhookSchema);
