const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, default: "walkin@salon.com" },
    isWalkIn: { type: Boolean, default: false },
    shopId: { type: String, required: true, default: "barber-elite" },
    branchId: { type: String, default: "banani" },
    branchName: { type: String, default: "Banani Branch" },
    serviceName: { type: String, required: true },
    packageName: { type: String, default: "" },
    barberId: { type: String, default: "b1" },
    barberName: { type: String, required: true, default: "Alexander Ross" },
    date: { type: String, required: true },
    time: { type: String, required: true },
    amount: { type: String, required: true },
    status: {
      type: String,
      default: "Confirmed",
    },
    paymentStatus: {
      type: String,
      default: "Paid",
    },
    paymentMethod: {
      type: String,
      default: "Cash",
    },
    transactionId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
