const mongoose = require("mongoose")

const driverRatingSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  ticketNumber: { type: String, required: true },
  rating: { type: Number, required: true },
  busRoute: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model("DriverRating", driverRatingSchema)
