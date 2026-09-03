const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Shop = require("../models/Shop");
const Appointment = require("../models/Appointment");
const Barber = require("../models/Barber");
const Customer = require("../models/Customer");
const Branch = require("../models/Branch");

const JWT_SECRET = process.env.JWT_SECRET || "barber_saas_super_secret_jwt_key_2026";

// ------------------------------------------------------------------
// 1. Seller Shop Registration
// ------------------------------------------------------------------
router.post("/register", async (req, res) => {
  try {
    const {
      shopName,
      ownerName,
      email,
      password,
      phone,
      city,
      address,
      tradeLicenseNumber,
      nidNumber,
      requestedPlan,
    } = req.body;

    // Check if email already registered
    const existingShop = await Shop.findOne({ email: email.toLowerCase() });
    if (existingShop) {
      return res.status(400).json({ success: false, message: "Email is already registered. Please login instead." });
    }

    const hashedPassword = await bcrypt.hash(password || "password123", 10);
    const shopId = shopName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now().toString().slice(-4);
    const planType = requestedPlan && requestedPlan.includes("Enterprise")
      ? "Enterprise"
      : requestedPlan && requestedPlan.includes("Starter")
      ? "Starter"
      : "Pro";

    const newShop = new Shop({
      shopId,
      name: shopName,
      ownerName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      city: city || "Dhaka",
      address,
      tradeLicenseNumber: tradeLicenseNumber || "TRD-2026-99999",
      nidNumber: nidNumber || "NID-2026-9999999",
      plan: planType,
      status: "Pending Approval",
    });

    await newShop.save();

    res.status(201).json({
      success: true,
      status: "Pending Approval",
      message: "Barbershop registration submitted! Your account is pending Super Admin approval before you can log in.",
      shop: {
        shopId: newShop.shopId,
        name: newShop.name,
        ownerName: newShop.ownerName,
        email: newShop.email,
        status: newShop.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ------------------------------------------------------------------
// 2. Seller Gated Login
// ------------------------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide both email and password." });
    }

    const shop = await Shop.findOne({ email: email.toLowerCase() });
    if (!shop) {
      return res.status(404).json({ success: false, message: "No shop account found with this email." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // Approval Gate Check
    if (shop.status === "Pending Approval") {
      return res.status(403).json({
        success: false,
        status: "Pending Approval",
        message: "Your application for '" + shop.name + "' is currently Pending Super Admin Approval. You can log in once approved by the platform admin.",
      });
    }

    if (shop.status === "Suspended") {
      return res.status(403).json({
        success: false,
        status: "Suspended",
        message: "Your shop account has been suspended by the platform admin. Please contact support.",
      });
    }

    // Active Shop -> Generate JWT Session Token
    const token = jwt.sign(
      { shopId: shop.shopId, email: shop.email, role: "seller" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful! Welcome to your Seller Dashboard.",
      token,
      shop: {
        shopId: shop.shopId,
        name: shop.name,
        ownerName: shop.ownerName,
        email: shop.email,
        phone: shop.phone,
        city: shop.city,
        plan: shop.plan,
        status: shop.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch Seller Shop Details
router.get("/shop/:shopId", async (req, res) => {
  try {
    const shop = await Shop.findOne({ shopId: req.params.shopId });
    if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });
    res.json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ------------------------------------------------------------------
// 2. Appointments & Walk-In Engine
// ------------------------------------------------------------------
router.get("/appointments", async (req, res) => {
  try {
    const { branchId, status } = req.query;
    const filter = {};
    if (branchId && branchId !== "all") filter.branchId = branchId;
    if (status && status !== "all") filter.status = status;

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/appointments", async (req, res) => {
  try {
    const newApt = new Appointment({
      bookingId: req.body.id || `apt-${Date.now().toString().slice(-4)}`,
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone,
      customerEmail: req.body.customerEmail || "walkin@salon.com",
      isWalkIn: req.body.isWalkIn || false,
      shopId: req.body.shopId || "barber-elite",
      branchId: req.body.branchId || "banani",
      branchName: req.body.branchName || "Banani Branch",
      serviceName: req.body.serviceName,
      packageName: req.body.packageName || "",
      barberId: req.body.barberId || "b1",
      barberName: req.body.barberName || "Alexander Ross",
      date: req.body.date || "2026-09-03",
      time: req.body.time || "02:30 PM",
      amount: req.body.amount || "$45.00",
      status: req.body.status || "Confirmed",
      paymentStatus: req.body.paymentStatus || "Paid",
      paymentMethod: req.body.paymentMethod || "Cash",
    });

    await newApt.save();

    // Optionally add/update Customer CRM record
    let existingCust = await Customer.findOne({ phone: req.body.customerPhone });
    if (!existingCust) {
      existingCust = new Customer({
        customerId: `c-${Date.now().toString().slice(-4)}`,
        name: req.body.customerName,
        phone: req.body.customerPhone,
        email: req.body.customerEmail || "customer@gmail.com",
        preferredBranch: req.body.branchName || "Banani Branch",
        totalBookings: 1,
        completedBookings: 1,
        totalSpending: req.body.amount || "$45.00",
      });
      await existingCust.save();
    } else {
      existingCust.totalBookings += 1;
      existingCust.completedBookings += 1;
      await existingCust.save();
    }

    res.status(201).json({ success: true, appointment: newApt });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch("/appointments/:bookingId/status", async (req, res) => {
  try {
    const { status } = req.body;
    const apt = await Appointment.findOneAndUpdate(
      { bookingId: req.params.bookingId },
      { status },
      { new: true }
    );
    res.json({ success: true, appointment: apt });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ------------------------------------------------------------------
// 3. Barber Roster & Availability
// ------------------------------------------------------------------
router.get("/barbers", async (req, res) => {
  try {
    const barbers = await Barber.find().sort({ createdAt: -1 });
    res.json({ success: true, count: barbers.length, barbers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/barbers", async (req, res) => {
  try {
    const newBarber = new Barber({
      barberId: req.body.id || `b-${Date.now().toString().slice(-4)}`,
      shopId: req.body.shopId || "barber-elite",
      name: req.body.name,
      role: req.body.role || "Master Barber",
      branchId: req.body.branchId || "banani",
      branchName: req.body.branchName || "Banani Branch",
      phone: req.body.phone || "+880 1700-000000",
      email: req.body.email || "barber@moderncut.com",
      workingHours: req.body.workingHours || { start: "09:00 AM", end: "07:00 PM" },
      breakTimes: req.body.breakTimes || { start: "01:00 PM", end: "02:00 PM" },
      daysOff: req.body.daysOff || ["Sunday"],
    });

    await newBarber.save();
    res.status(201).json({ success: true, barber: newBarber });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch("/barbers/:barberId/toggle-status", async (req, res) => {
  try {
    const barber = await Barber.findOne({ barberId: req.params.barberId });
    if (!barber) return res.status(404).json({ success: false, message: "Barber not found" });

    barber.status = barber.status === "Active" ? "Off-Duty" : "Active";
    await barber.save();
    res.json({ success: true, barber });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ------------------------------------------------------------------
// 4. Branch Locations
// ------------------------------------------------------------------
router.get("/branches", async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json({ success: true, count: branches.length, branches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/branches", async (req, res) => {
  try {
    const newBranch = new Branch({
      branchId: req.body.id || req.body.codeName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      shopId: req.body.shopId || "barber-elite",
      name: req.body.name || `Modern Cut — ${req.body.codeName}`,
      codeName: req.body.codeName,
      address: req.body.address,
      coordinates: req.body.coordinates || "23.8103° N, 90.4125° E",
      phone: req.body.phone || "+880 1700-000000",
      workingHours: req.body.workingHours || "09:00 AM – 09:00 PM",
    });

    await newBranch.save();
    res.status(201).json({ success: true, branch: newBranch });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ------------------------------------------------------------------
// 5. Customer CRM
// ------------------------------------------------------------------
router.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({ success: true, count: customers.length, customers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
