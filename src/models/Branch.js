const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema(
  {
    branchId: { type: String, required: true, unique: true },
    shopId: { type: String, required: true },
    name: { type: String, required: true },
    codeName: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: { type: String, default: "23.8103° N, 90.4125° E" },
    phone: { type: String, required: true },
    workingHours: { type: String, default: "09:00 AM – 09:00 PM" },
    totalBarbers: { type: Number, default: 2 },
    activeAppointmentsToday: { type: Number, default: 4 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branch", BranchSchema);
