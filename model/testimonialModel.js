const mongoose = require("mongoose");

const testimonialSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: { type: String },
    data: { type: String },
    auther: { type: String },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Testimonial", testimonialSchema);
