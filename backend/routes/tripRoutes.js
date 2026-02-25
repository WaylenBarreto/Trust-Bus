const express = require("express")
const Trip = require("../models/Trip")

const router = express.Router()

// Create a trip record when driver ends trip
router.post("/", async (req, res) => {
  try {
    const {
      schoolName,
      schoolID,
      busNumber,
      driverName,
      driverNumber,
      startedAt,
      endedAt,
      durationMs,
    } = req.body

    if (
      !schoolName ||
      !schoolID ||
      !busNumber ||
      !driverName ||
      !driverNumber ||
      !startedAt ||
      !endedAt ||
      durationMs == null
    ) {
      return res.status(400).json({ message: "Missing required trip fields" })
    }

    const trip = await Trip.create({
      schoolName,
      schoolID,
      busNumber,
      driverName,
      driverNumber,
      startedAt: new Date(startedAt),
      endedAt: new Date(endedAt),
      durationMs,
    })

    res.status(201).json(trip)
  } catch (err) {
    console.error("Create trip error:", err)
    res.status(500).json({ message: "Failed to save trip" })
  }
})

// Optional: list trips for a school (latest first)
router.get("/", async (req, res) => {
  try {
    const { schoolID } = req.query
    const query = schoolID ? { schoolID } : {}
    const trips = await Trip.find(query).sort({ createdAt: -1 }).limit(100)
    res.json(trips)
  } catch (err) {
    console.error("List trips error:", err)
    res.status(500).json({ message: "Failed to fetch trips" })
  }
})

module.exports = router

