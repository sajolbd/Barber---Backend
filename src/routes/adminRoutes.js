const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");
const Shop = require("../models/Shop");
const Appointment = require("../models/Appointment");
const Plan = require("../models/Plan");
const Payout = require("../models/Payout");

const JWT_SECRET = process.env.JWT_SECRET || "barber_saas_super_secret_jwt_key_2026";

// ------------------------------------------------------------------
// 0. Super Admin Login Authentication
// ------------------------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter email and password." });
    }

    const admin = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Super Admin account not found." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Super Admin credentials." });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { adminId: admin.adminId, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Super Admin Authentication Successful!",
      token,
      adminUser: {
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ------------------------------------------------------------------
// 1. Super Admin Overview Metrics
// ------------------------------------------------------------------
router.get("/overview", async (req, res) => {
  try {
    const activeShops = await Shop.countDocuments({ status: "Active" });
    const pendingApps = await Shop.countDocuments({ status: "Pending Approval" });
    const totalBookings = await Appointment.countDocuments();

    res.json({
      success: true,
      metrics: {
        saasMRR: "$56,300",
        activeShopsCount: activeShops,
        pendingApprovalsCount: pendingApps,
        totalBookingsCount: totalBookings,
        platformCommissionFees: "$16,500",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ------------------------------------------------------------------
// 2. Pending Seller Approvals Queue
// ------------------------------------------------------------------
router.get("/pending-approvals", async (req, res) => {
  try {
    const pendingShops = await Shop.find({ status: "Pending Approval" }).sort({ createdAt: -1 });
    res.json({ success: true, count: pendingShops.length, applications: pendingShops });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Approve & Activate Shop Application
router.post("/approve-shop/:shopId", async (req, res) => {
  try {
    const shop = await Shop.findOneAndUpdate(
      { shopId: req.params.shopId },
      { status: "Active" },
      { new: true }
    );
    if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });

    res.json({
      success: true,
      message: `Shop '${shop.name}' successfully approved & activated across platform!`,
      shop,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reject Shop Application
router.post("/reject-shop/:shopId", async (req, res) => {
  try {
    await Shop.findOneAndDelete({ shopId: req.params.shopId });
    res.json({ success: true, message: "Shop application rejected and deleted." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ------------------------------------------------------------------
// 3. Shops & Sellers Directory
// ------------------------------------------------------------------
router.get("/shops", async (req, res) => {
  try {
    const shops = await Shop.find().sort({ createdAt: -1 });
    res.json({ success: true, count: shops.length, shops });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Toggle Shop Status (Active <-> Suspended)
router.patch("/shops/:shopId/toggle-status", async (req, res) => {
  try {
    const { shopId } = req.params;
    const isObjectId = shopId.match(/^[0-9a-fA-F]{24}$/);
    const shop = await Shop.findOne({
      $or: [{ shopId: shopId }, { ...(isObjectId ? { _id: shopId } : {}) }],
    });

    if (!shop) return res.status(404).json({ success: false, message: "Shop not found" });

    shop.status = shop.status === "Active" ? "Suspended" : "Active";
    await shop.save();
    res.json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ------------------------------------------------------------------
// 4. SaaS Plans Manager
// ------------------------------------------------------------------
router.get("/plans", async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json({ success: true, count: plans.length, plans });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ------------------------------------------------------------------
// 5. Revenue & Seller Payouts
// ------------------------------------------------------------------
router.get("/payouts", async (req, res) => {
  try {
    const payouts = await Payout.find().sort({ createdAt: -1 });
    res.json({ success: true, count: payouts.length, payouts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/approve-payout/:payoutId", async (req, res) => {
  try {
    const payout = await Payout.findOneAndUpdate(
      { payoutId: req.params.payoutId },
      { status: "Paid" },
      { new: true }
    );
    res.json({ success: true, payout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
