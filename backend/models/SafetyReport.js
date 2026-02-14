const mongoose = require("mongoose")

const safetyReportSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  issueType: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    default: "",
  },

}, { timestamps: true })

module.exports = mongoose.model("SafetyReport", safetyReportSchema)
