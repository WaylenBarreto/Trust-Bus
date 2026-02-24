const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  busId: {
    type: String,
    required: true,
    unique: true,
  },

  location: {
    lat: {
      type: Number,
      default: 0,
    },
    lng: {
      type: Number,
      default: 0,
    },
  },

  speedKmph: {
    type: Number,
    default: 0,
  },

  passengerCount: {
    type: Number,
    default: 0,
  },

  rashDriving: {
    type: Boolean,
    default: false,
  },

  hardBrake: {
    type: Boolean,
    default: false,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bus", BusSchema);