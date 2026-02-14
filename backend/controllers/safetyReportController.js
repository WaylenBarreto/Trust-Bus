const SafetyReport = require("../models/SafetyReport")

// Create safety report
const createSafetyReport = async (req, res) => {
  try {
    const { username, email, issueType, description, location } = req.body

    const report = await SafetyReport.create({
      username,
      email,
      issueType,
      description,
      location,
    })

    res.status(201).json({ message: "Report submitted successfully", report })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createSafetyReport }
