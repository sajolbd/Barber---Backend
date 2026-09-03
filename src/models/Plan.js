const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema(
  {
    planId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    monthlyPrice: { type: String, required: true },
    yearlyPrice: { type: String, required: true },
    branchLimit: { type: String, required: true },
    barberLimit: { type: String, required: true },
    platformFeePercent: { type: String, required: true },
    activeShopsCount: { type: Number, default: 0 },
    features: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", PlanSchema);
