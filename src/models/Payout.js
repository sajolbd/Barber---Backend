const mongoose = require("mongoose");

const PayoutSchema = new mongoose.Schema(
  {
    payoutId: { type: String, required: true, unique: true },
    shopId: { type: String, required: true },
    shopName: { type: String, required: true },
    ownerName: { type: String, required: true },
    requestedAmount: { type: String, required: true },
    netPayoutAmount: { type: String, required: true },
    platformFeeDeducted: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    accountDetails: { type: String, required: true },
    dateRequested: { type: String, default: () => new Date().toISOString().split("T")[0] },
    status: { type: String, enum: ["Pending", "Paid", "Processing"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payout", PayoutSchema);
