const mongoose = require("mongoose");

const mealsSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    gift_card_code: { type: String },
    meals: { type: Number },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Meal", mealsSchema);
