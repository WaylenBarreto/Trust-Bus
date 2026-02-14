const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const dialogflowRoutes = require("./routes/dialogflowRoutes");
const safetyReportRoutes = require("./routes/safetyReportRoutes"); 
const driverRatingRoutes = require("./routes/driverRatingRoutes")
const aiRoutes = require("./routes/aiRoutes")

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dialogflow", dialogflowRoutes);
app.use("/api/reports", safetyReportRoutes); // ⭐ NEW
app.use("/api/ratings", driverRatingRoutes)
app.use("/api/ai", aiRoutes)


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("TrustBus API Running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
