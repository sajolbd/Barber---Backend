const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, default: "walkin@salon.com" },
    isWalkIn: { type: Boolean, default: false },
    shopId: { type: String, required: true },
    branchId: { type: String, default: "banani" },
    branchName: { type: String, default: "Banani Branch" },
    serviceName: { type: String, required: true },
    packageName: { type: String, default: "" },
    barberId: { type: String, required: true },
    barberName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    amount: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Confirmed",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed", "Refunded", "Partially Paid"],
      default: "Paid",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Online"],
      default: "Cash",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
