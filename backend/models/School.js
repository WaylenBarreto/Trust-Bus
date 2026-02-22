const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  schoolName: { type: String, required: true },
  schoolEmail: { type: String, unique: true, required: true },
  schoolID: { type: String, unique: true, required: true },
  driverName: { type: String, required: true },
  driverNumber: { type: String, required: true },
  busNumber: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model('School', schoolSchema);