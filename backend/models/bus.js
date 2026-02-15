const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  busId: {
    type: String,
    required: true,
    unique: true,
  },

  location: {
    lat: Number,
    lng: Number,
  },

  speedKmph: {
    type: Number,
    default: 0,
  },

  passengerCount: {
    type: Number,
    default: 0,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bus", BusSchema);
