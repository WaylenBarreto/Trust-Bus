const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true
  },
  rating: Number,
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Review", reviewSchema);