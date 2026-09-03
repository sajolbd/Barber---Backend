const express = require("express");
const router = express.Router();
const Shop = require("../models/Shop");

// Public Storefront Active Salons List
router.get("/salons", async (req, res) => {
  try {
    const activeSalons = await Shop.find({ status: "Active" }).sort({ rating: -1 });
    res.json({ success: true, count: activeSalons.length, salons: activeSalons });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
