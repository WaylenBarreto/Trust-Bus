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

  studentId: {
    type: String,
    default: "",
  },

  // ⭐ LINK TO SCHOOL
  schoolID: {
    type: String,
    default: "", // Parents will provide this to see school-specific bus info
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  emailOTP: String,
  emailOTPExpires: Date,

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)