const mongoose = require("mongoose");

const pageHitSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PageHit", pageHitSchema);
