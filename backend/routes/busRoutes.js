const express = require("express");
const router = express.Router();
const Bus = require("../models/bus");

// ESP32 sends data here
router.post("/update", async (req, res) => {
  try {
    const {
      busId,
      latitude,
      longitude,
      speedKmph,
      passengerCount,
    } = req.body;

    if (!busId) {
      return res.status(400).json({ error: "busId required" });
    }

    await Bus.findOneAndUpdate(
      { busId },
      {
        busId,
        location: { lat: latitude, lng: longitude },
        speedKmph,
        passengerCount,
        updatedAt: Date.now(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Bus data updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// React dashboard fetches data here
router.get("/", async (req, res) => {
  const buses = await Bus.find();
  res.json(buses);
});

module.exports = router;
