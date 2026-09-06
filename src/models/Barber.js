const mongoose = require("mongoose");

const BarberSchema = new mongoose.Schema(
  {
    barberId: { type: String, required: true, unique: true },
    shopId: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: "Master Barber" },
    branchId: { type: String, default: "banani" },
    branchName: { type: String, default: "Banani Branch" },
    phone: { type: String },
    email: { type: String },
    status: { type: String, enum: ["Active", "Off-Duty", "Break"], default: "Active" },
    photo: { type: String, default: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=800&auto=format&fit=crop" },
    rating: { type: Number, default: 5.0 },
    assignedServices: [{ type: String }],
    assignedPackages: [{ type: String }],
    workingHours: {
      start: { type: String, default: "09:00 AM" },
      end: { type: String, default: "08:00 PM" },
    },
    breakTimes: {
      start: { type: String, default: "01:00 PM" },
      end: { type: String, default: "02:00 PM" },
    },
    daysOff: [{ type: String }],
    monthlyRevenue: { type: String, default: "$0.00" },
    completedCutsMonth: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Barber", BarberSchema);
