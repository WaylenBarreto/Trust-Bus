const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/authRoutes");
const dialogflowRoutes = require("./routes/dialogflowRoutes");
const safetyReportRoutes = require("./routes/safetyReportRoutes");
const driverRatingRoutes = require("./routes/driverRatingRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("🚀 TrustBus API Running");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dialogflow", dialogflowRoutes);
app.use("/api/reports", safetyReportRoutes);
app.use("/api/ratings", driverRatingRoutes);
app.use("/api/ai", aiRoutes);

// MongoDB Connection + Start Server ONLY after DB connects
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
