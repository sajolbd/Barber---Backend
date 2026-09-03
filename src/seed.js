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
    const superAdminPassword = await bcrypt.hash("superadmin123", 10);

    // 0. Seed Super Admin User
    await AdminUser.create({
      adminId: "super-admin-01",
      name: "SaaS Super Admin HQ",
      email: "admin@barbersaas.com",
      password: superAdminPassword,
      role: "Super Admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    });
    console.log("✓ Seeded Super Admin User.");

    // 1. Seed Shops
    const shops = [
      {
        shopId: "barber-elite",
        name: "BARBER ELITE",
        ownerName: "Rayhan Vance",
        email: "rayhan@barberelite.com",
        password: hashedPassword,
        phone: "+880 1711-888111",
        city: "Dhaka",
        address: "House 42, Road 11, Banani, Dhaka",
        tradeLicenseNumber: "TRD-2026-90812",
        nidNumber: "NID-1992-8827361",
        category: "Barbershop",
        plan: "Pro",
        status: "Active",
        monthlyRevenue: "$18,400",
        platformFeePaid: "$1,450",
        totalBookings: 1840,
        rating: 4.9,
      },
      {
        shopId: "urban-fade-studio",
        name: "URBAN FADE STUDIO",
        ownerName: "Imtiaz Ahmed",
        email: "imtiaz@urbanfade.com",
        password: hashedPassword,
        phone: "+880 1822-999333",
        city: "Dhaka",
        address: "Block D, Lalmatia, Dhaka",
        tradeLicenseNumber: "TRD-2026-11029",
        nidNumber: "NID-1988-1120394",
        category: "Barbershop",
        plan: "Starter",
        status: "Active",
        monthlyRevenue: "$11,200",
        platformFeePaid: "$560",
        totalBookings: 1120,
        rating: 4.8,
      },
      {
        shopId: "royal-cuts-lounge",
        name: "ROYAL CUTS LOUNGE",
        ownerName: "David Sterling",
        email: "david@royalcuts.com",
        password: hashedPassword,
        phone: "+880 1911-333444",
        city: "Chittagong",
        address: "GEC Circle, Chittagong",
        tradeLicenseNumber: "TRD-2026-44390",
        nidNumber: "NID-1990-5540192",
        category: "Luxury Spa",
        plan: "Enterprise",
        status: "Active",
        monthlyRevenue: "$24,500",
        platformFeePaid: "$2,450",
        totalBookings: 1950,
        rating: 4.9,
      },
      {
        shopId: "crown-razor-club",
        name: "Crown & Razor Club",
        ownerName: "Tariqul Islam",
        email: "tariqul@crownrazor.com",
        password: hashedPassword,
        phone: "+880 1711-444555",
        city: "Dhaka",
        address: "Plot 14, Main Road, Dhanmondi 27, Dhaka",
        tradeLicenseNumber: "TRD-2026-88129",
        nidNumber: "NID-1994-8827361",
        category: "Barbershop",
        plan: "Pro",
        status: "Pending Approval",
      },
    ];

    await Shop.insertMany(shops);
    console.log("✓ Seeded Shops.");

    // 2. Seed Appointments
    const appointments = [
      {
        bookingId: "apt-101",
        customerName: "Tanvir Hossain",
        customerPhone: "+880 1819-876543",
        customerEmail: "tanvir@gmail.com",
        isWalkIn: false,
        shopId: "barber-elite",
        branchId: "banani",
        branchName: "Banani Branch",
        serviceName: "Executive Precision Cut",
        barberId: "b1",
        barberName: "Alexander Ross",
        date: "2026-09-03",
        time: "10:30 AM",
        amount: "$45.00",
        status: "Confirmed",
        paymentStatus: "Paid",
        paymentMethod: "Card",
      },
      {
        bookingId: "apt-102",
        customerName: "Mahmud Hasan",
        customerPhone: "+880 1711-223344",
        customerEmail: "mahmud@gmail.com",
        isWalkIn: true,
        shopId: "barber-elite",
        branchId: "mirpur",
        branchName: "Mirpur Branch",
        serviceName: "Beard Sculpting & Trim",
        barberId: "b2",
        barberName: "Marcus Vance",
        date: "2026-09-03",
        time: "02:15 PM",
        amount: "$30.00",
        status: "Pending",
        paymentStatus: "Pending",
        paymentMethod: "Cash",
      },
      {
        bookingId: "apt-103",
        customerName: "Kazi Shafiq",
        customerPhone: "+880 1922-334455",
        customerEmail: "shafiq@gmail.com",
        isWalkIn: false,
        shopId: "barber-elite",
        branchId: "gulshan",
        branchName: "Gulshan Branch",
        serviceName: "The Elite Master Groom",
        barberId: "b3",
        barberName: "Julian Thorne",
        date: "2026-09-03",
        time: "04:00 PM",
        amount: "$95.00",
        status: "Completed",
        paymentStatus: "Paid",
        paymentMethod: "Online",
      },
    ];

    await Appointment.insertMany(appointments);
    console.log("✓ Seeded Appointments.");

    // 3. Seed Barbers
    const barbers = [
      {
        barberId: "b1",
        shopId: "barber-elite",
        name: "Alexander Ross",
        role: "Master Barber & Stylist",
        branchId: "banani",
        branchName: "Banani Branch",
        phone: "+880 1711-000111",
        email: "alexander@moderncut.com",
        status: "Active",
        photo: "/images/barber-hero.png",
        rating: 5.0,
        assignedServices: ["Executive Precision Cut", "Beard Sculpting & Trim"],
        assignedPackages: ["The Elite Master Groom"],
        workingHours: { start: "09:00 AM", end: "07:00 PM" },
        breakTimes: { start: "01:00 PM", end: "02:00 PM" },
        daysOff: ["Sunday"],
        monthlyRevenue: "$4,850.00",
        completedCutsMonth: 108,
      },
      {
        barberId: "b2",
        shopId: "barber-elite",
        name: "Marcus Vance",
        role: "Senior Fade Specialist",
        branchId: "mirpur",
        branchName: "Mirpur Branch",
        phone: "+880 1711-000222",
        email: "marcus@moderncut.com",
        status: "Active",
        photo: "/images/barber-hero.png",
        rating: 4.9,
        assignedServices: ["Beard Sculpting & Trim", "Hot Towel Shave"],
        assignedPackages: ["Beard & Hair Refresh"],
        workingHours: { start: "10:00 AM", end: "08:00 PM" },
        breakTimes: { start: "02:00 PM", end: "03:00 PM" },
        daysOff: ["Monday"],
        monthlyRevenue: "$3,920.00",
        completedCutsMonth: 95,
      },
      {
        barberId: "b3",
        shopId: "barber-elite",
        name: "Julian Thorne",
        role: "Color & Styling Expert",
        branchId: "gulshan",
        branchName: "Gulshan Branch",
        phone: "+880 1711-000333",
        email: "julian@moderncut.com",
        status: "Active",
        photo: "/images/barber-hero.png",
        rating: 4.8,
        assignedServices: ["Scalp Treatment", "Executive Precision Cut"],
        assignedPackages: ["Royal Spa Package"],
        workingHours: { start: "11:00 AM", end: "09:00 PM" },
        breakTimes: { start: "03:00 PM", end: "04:00 PM" },
        daysOff: ["Tuesday"],
        monthlyRevenue: "$5,100.00",
        completedCutsMonth: 112,
      },
    ];

    await Barber.insertMany(barbers);
    console.log("✓ Seeded Barbers.");

    // 4. Seed Customers
    const customers = [
      {
        customerId: "c1",
        shopId: "barber-elite",
        name: "Tanvir Hossain",
        phone: "+880 1819-876543",
        email: "tanvir@gmail.com",
        preferredBranch: "Banani Branch",
        totalBookings: 14,
        completedBookings: 12,
        cancelledBookings: 1,
        totalSpending: "$630.00",
        lastVisit: "2026-08-28",
        notes: "Prefers low skin fade on sides, scissor trim on top. Always drinks espresso.",
      },
      {
        customerId: "c2",
        shopId: "barber-elite",
        name: "Mahmud Hasan",
        phone: "+880 1711-223344",
        email: "mahmud@gmail.com",
        preferredBranch: "Mirpur Branch",
        totalBookings: 8,
        completedBookings: 8,
        cancelledBookings: 0,
        totalSpending: "$380.00",
        lastVisit: "2026-08-25",
        notes: "Sensitive skin. Use tea tree post-shave balm only.",
      },
    ];

    await Customer.insertMany(customers);
    console.log("✓ Seeded Customers.");

    // 5. Seed Branches
    const branches = [
      {
        branchId: "banani",
        shopId: "barber-elite",
        name: "Modern Cut — Banani Branch",
        codeName: "Banani Branch",
        address: "House 42, Road 11, Banani, Dhaka 1213",
        coordinates: "23.7937° N, 90.4047° E",
        phone: "+880 1711-888111",
        workingHours: "09:00 AM – 09:00 PM",
        totalBarbers: 4,
        activeAppointmentsToday: 12,
      },
      {
        branchId: "mirpur",
        shopId: "barber-elite",
        name: "Modern Cut — Mirpur Branch",
        codeName: "Mirpur Branch",
        address: "Plot 8, Section 10, Mirpur, Dhaka 1216",
        coordinates: "23.8069° N, 90.3687° E",
        phone: "+880 1711-888222",
        workingHours: "10:00 AM – 10:00 PM",
        totalBarbers: 3,
        activeAppointmentsToday: 8,
      },
      {
        branchId: "gulshan",
        shopId: "barber-elite",
        name: "Modern Cut — Gulshan Branch",
        codeName: "Gulshan Branch",
        address: "Avenue 2, Gulshan 1, Dhaka 1212",
        coordinates: "23.7806° N, 90.4167° E",
        phone: "+880 1711-888333",
        workingHours: "09:00 AM – 10:00 PM",
        totalBarbers: 3,
        activeAppointmentsToday: 10,
      },
    ];

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
        activeShopsCount: 14,
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
        activeShopsCount: 22,
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
        activeShopsCount: 8,
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

    // 7. Seed Payouts
    const payouts = [
      {
        payoutId: "pay-401",
        shopId: "barber-elite",
        shopName: "BARBER ELITE",
        ownerName: "Rayhan Vance",
        requestedAmount: "$3,500.00",
        netPayoutAmount: "$3,325.00",
        platformFeeDeducted: "$175.00",
        paymentMethod: "Bank Wire Transfer",
        accountDetails: "City Bank BD — Acc: 1102938475",
        dateRequested: "2026-09-02",
        status: "Pending",
      },
      {
        payoutId: "pay-402",
        shopId: "urban-fade-studio",
        shopName: "URBAN FADE STUDIO",
        ownerName: "Imtiaz Ahmed",
        requestedAmount: "$2,200.00",
        netPayoutAmount: "$2,090.00",
        platformFeeDeducted: "$110.00",
        paymentMethod: "bKash Merchant",
        accountDetails: "+880 1822-999333",
        dateRequested: "2026-09-01",
        status: "Paid",
      },
    ];

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
