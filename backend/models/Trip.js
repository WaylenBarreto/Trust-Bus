const mongoose = require("mongoose")

const tripSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true },
    schoolID: { type: String, required: true },
    busNumber: { type: String, required: true },
    driverName: { type: String, required: true },
    driverNumber: { type: String, required: true },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, required: true },
    durationMs: { type: Number, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Trip", tripSchema)

