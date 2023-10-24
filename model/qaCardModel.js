const mongoose = require("mongoose");

const qrCardShema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    qr_id: { type: String, required: true },
    qr_display_name: { type: String, required: true },
    qr_code: { type: String, required: true },
    qr_status: { type: Boolean, required: true },
    total_meals: { type: String, required: true },
    qr_available_meals: { type: Number, required: true },
    qr_app: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("QACard", qrCardShema);
