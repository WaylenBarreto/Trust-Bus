const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phone: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"],
  },

  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be strong and at least 8 characters long"],
  },

  role: {
    type: String,
    enum: ["public", "parent"],
    default: "public",
  },

  childName: {
    type: String,
    default: "",
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  emailOTP: {
    type: String,
  },

  emailOTPExpires: {
    type: Date,
  },

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)
