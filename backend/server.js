const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const dialogflowRoutes = require("./routes/dialogflowRoutes");
const safetyReportRoutes = require("./routes/safetyReportRoutes");
const driverRatingRoutes = require("./routes/driverRatingRoutes");
const aiRoutes = require("./routes/aiRoutes");
const busRoutes = require("./routes/busRoutes");

const app = express();

// ---------------- Middleware ----------------
app.use(cors());
app.use(express.json());

// ---------------- Routes ----------------
app.use("/api/auth", authRoutes);
app.use("/api/school", schoolRoutes);
app.use("/api/dialogflow", dialogflowRoutes);
app.use("/api/reports", safetyReportRoutes);
app.use("/api/ratings", driverRatingRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/bus", busRoutes); // ⭐ ADD THIS


// ---------------- MongoDB ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// ---------------- Test Route ----------------
app.get("/", (req, res) => {
  res.send("TrustBus API Running");
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

const reviewRoutes = require("./routes/reviewroutes");
app.use("/api/reviews", reviewRoutes);
