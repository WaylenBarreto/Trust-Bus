const express = require("express");
const router = express.Router();
const Bus = require("../models/bus");

// ESP32 sends data here
router.post("/update", async (req, res) => {
  try {
    const { busId, lat, lon, count, speed } = req.body;

    if (!busId || lat === undefined || lon === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updatedBus = await Bus.findOneAndUpdate(
      { busId },
      {
        busId,
        location: { lat, lng: lon },
        speedKmph: speed || 0,
        passengerCount: count || 0,
        updatedAt: Date.now(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Bus updated", updatedBus });

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
