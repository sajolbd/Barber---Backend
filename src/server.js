require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const sellerRoutes = require("./routes/sellerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// MongoDB Atlas Connection
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://sajolibn2_db_user:ezUme9glGH7aLNZm@cluster0.ctroqgp.mongodb.net/barber_saas_db?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("==========================================");
    console.log("🚀 Connected to MongoDB Atlas Database!");
    console.log("Database Name: barber_saas_db");
    console.log("==========================================");
  })
  .catch((err) => {
    console.error("❌ MongoDB Atlas Connection Error:", err.message);
  });

// API Routes
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/marketplace", marketplaceRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Barber SaaS REST API Backend",
    mongoStatus: mongoose.connection.readyState === 1 ? "Connected to MongoDB Atlas" : "Disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`📡 Barber SaaS REST API running on http://localhost:${PORT}`);
});
