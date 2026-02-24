const express = require("express");
const router = express.Router();
const Bus = require("../models/bus");

// ESP32 sends data here
router.post("/update", async (req, res) => {
  try {
    const { busId, lat, lon, count, speed, rashDriving, hardBrake } = req.body;

    if (!busId || lat === undefined || lon === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updatedBus = await Bus.findOneAndUpdate(
      { busId },
      {
        busId,
        location: {
          lat: Number(lat),
          lng: Number(lon),
        },
        speedKmph: Number(speed) || 0,
        passengerCount: Number(count) || 0,
        rashDriving: Boolean(rashDriving),
        hardBrake: Boolean(hardBrake),
        updatedAt: Date.now(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Bus updated successfully",
      updatedBus,
    });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// React dashboard fetches data here
router.get("/", async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;