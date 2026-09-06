const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema(
  {
    shopId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true, default: "Dhaka" },
    address: { type: String, required: true },
    tradeLicenseNumber: { type: String, required: true },
    nidNumber: { type: String, required: true },
    category: { type: String, default: "Barbershop" },
    tagline: { type: String, default: "Executive Cuts, Beard Styling & Luxury Grooming" },
    coverImage: { type: String, default: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop" },
    plan: { type: String, enum: ["Starter", "Pro", "Enterprise"], default: "Pro" },
    status: {
      type: String,
      enum: ["Pending Approval", "Active", "Suspended"],
      default: "Pending Approval",
    },
    monthlyRevenue: { type: String, default: "$0.00" },
    platformFeePaid: { type: String, default: "$0.00" },
    totalBookings: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    dateJoined: { type: String, default: () => new Date().toISOString().split("T")[0] },
    services: [
      {
        id: String,
        title: String,
        category: String,
        duration: String,
        price: String,
        active: { type: Boolean, default: true },
        assignedBarbersCount: { type: Number, default: 0 },
      },
    ],
    packages: [
      {
        id: String,
        title: String,
        includedServices: [String],
        duration: String,
        price: String,
        originalPrice: String,
        active: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", ShopSchema);
