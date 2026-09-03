const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true, unique: true },
    shopId: { type: String, default: "barber-elite" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    preferredBranch: { type: String, default: "Banani Branch" },
    totalBookings: { type: Number, default: 1 },
    completedBookings: { type: Number, default: 1 },
    cancelledBookings: { type: Number, default: 0 },
    totalSpending: { type: String, default: "$45.00" },
    lastVisit: { type: String, default: () => new Date().toISOString().split("T")[0] },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);
