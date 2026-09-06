const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AdminUser = require("./models/AdminUser");
const Shop = require("./models/Shop");
const Appointment = require("./models/Appointment");
const Barber = require("./models/Barber");
const Customer = require("./models/Customer");
const Branch = require("./models/Branch");
const Plan = require("./models/Plan");
const Payout = require("./models/Payout");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://sajolibn2_db_user:ezUme9glGH7aLNZm@cluster0.ctroqgp.mongodb.net/barber_saas_db?retryWrites=true&w=majority&appName=Cluster0";

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas!");

    // Clear existing collections
    await AdminUser.deleteMany({});
    await Shop.deleteMany({});
    await Appointment.deleteMany({});
    await Barber.deleteMany({});
    await Customer.deleteMany({});
    await Branch.deleteMany({});
    await Plan.deleteMany({});
    await Payout.deleteMany({});

    console.log("Cleared existing collections.");

    const hashedPassword = await bcrypt.hash("password123", 10);
    const superAdminPassword = await bcrypt.hash("12345678", 10);

    // 0. Seed Super Admin User
    await AdminUser.create({
      adminId: "super-admin-01",
      name: "SaaS Super Admin HQ",
      email: "sajol@gmail.com",
      password: superAdminPassword,
      role: "Super Admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    });
    console.log("✓ Seeded Super Admin User.");

    // 1. Seed Shops (Empty for clean start)
    const shops = [];

    await Shop.insertMany(shops);
    console.log("✓ Seeded Shops.");

    // 2. Seed Appointments (Empty for clean start)
    const appointments = [];

    await Appointment.insertMany(appointments);
    console.log("✓ Seeded Appointments.");

    // 3. Seed Barbers (Empty for clean start)
    const barbers = [];

    await Barber.insertMany(barbers);
    console.log("✓ Seeded Barbers.");

    // 4. Seed Customers (Empty for clean start)
    const customers = [];

    await Customer.insertMany(customers);
    console.log("✓ Seeded Customers.");

    // 5. Seed Branches (Empty for clean start)
    const branches = [];

    await Branch.insertMany(branches);
    console.log("✓ Seeded Branches.");

    // 6. Seed SaaS Plans
    const plans = [
      {
        planId: "plan-starter",
        name: "Starter Plan",
        monthlyPrice: "$29",
        yearlyPrice: "$290",
        branchLimit: "1 Branch",
        barberLimit: "Up to 3 Barbers",
        platformFeePercent: "5.0%",
        activeShopsCount: 0,
        features: [
          "1 Barbershop Branch",
          "Up to 3 Active Barbers",
          "Online Appointment Booking Engine",
          "SMS & Email Customer Alerts",
          "Basic Revenue Reports",
        ],
      },
      {
        planId: "plan-pro",
        name: "Pro Plan",
        monthlyPrice: "$79",
        yearlyPrice: "$790",
        branchLimit: "3 Branches",
        barberLimit: "Up to 10 Barbers",
        platformFeePercent: "2.0%",
        activeShopsCount: 0,
        features: [
          "Up to 3 Location Branches",
          "Up to 10 Staff Barbers",
          "Walk-In Quick Booking Engine & Invoices",
          "Barber Schedule & Availability Manager",
          "Customer CRM & Spending Metrics",
          "Custom Storefront URL & Banner",
        ],
      },
      {
        planId: "plan-enterprise",
        name: "Enterprise Plan",
        monthlyPrice: "$199",
        yearlyPrice: "$1,990",
        branchLimit: "Unlimited Branches",
        barberLimit: "Unlimited Barbers",
        platformFeePercent: "0.0%",
        activeShopsCount: 0,
        features: [
          "Unlimited Location Branches",
          "Unlimited Staff Barbers",
          "0% Platform Commission Fee",
          "Dedicated Account Manager",
          "Stripe & POS Custom Integration",
          "Full Business Performance Analytics & Export",
        ],
      },
    ];

    await Plan.insertMany(plans);
    console.log("✓ Seeded SaaS Plans.");

    // 7. Seed Payouts (Empty for clean start)
    const payouts = [];

    await Payout.insertMany(payouts);
    console.log("✓ Seeded Seller Payouts.");

    console.log("==========================================");
    console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("==========================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
}

seedDatabase();
