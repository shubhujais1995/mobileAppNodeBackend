const mongoose = require("mongoose");

const giftCardShema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    gift_card_code: { type: String, unique: true, required: true },
    gift_card_status: { type: Boolean, required: true },
    total_meals: { type: Number, required: true },
    available_meals: { type: Number, required: true }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GiftCard", giftCardShema);
